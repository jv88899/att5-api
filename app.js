const express = require('express')
const bodyParser = require('body-parser')
const Player = require('./models/playerModel')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 

const selectAllTimeStartingFive = players => {
  let allTimeStartingFive = []
  let pgScore = 0
  let sgScore = 0
  let sfScore = 0
  let pfScore = 0
  let cScore = 0
  let topPG = ''
  let topSG = ''
  let topSF = ''
  let topPF = ''
  let topC = ''

  for (let i = 0; i < players.length; i++) {
    if (players[i].primaryPosition === 'PG') {
      if (players[i].score > pgScore) {
        pgScore = players[i].score
        topPG = players[i]
      }
    } else if (players[i].primaryPosition === 'SG') {
      if (players[i].score > sgScore) {
        sgScore = players[i].score
        topSG = players[i]
      }
    } else if (players[i].primaryPosition === 'SF') {
      if (players[i].score > sfScore) {
        sfScore = players[i].score
        topSF = players[i]
      }
    } else if (players[i].primaryPosition === 'PF') {
      if (players[i].score > pfScore) {
        pfScore = players[i].score
        topPF = players[i]
      }
    } else if (players[i].primaryPosition === 'C') {
      if (players[i].score > cScore) {
        cScore = players[i].score
        topC = players[i]
      }
    }
  }

  allTimeStartingFive.push(topPG)
  allTimeStartingFive.push(topSG)
  allTimeStartingFive.push(topSF)
  allTimeStartingFive.push(topPF)
  allTimeStartingFive.push(topC)
  console.log(allTimeStartingFive)

  return allTimeStartingFive
}

const defaultCriteria = {
  ppg: 1,
  per: 1,
  championships: 1,
  allNBA: 1,
  mvp: 1
}

const calculateScore = (player, criteria) => {
  const { ppg, per, championships, allNBA, mvp } = criteria
  let tier1 = ( (0.5 * player.reboundsPerGame) + (0.5 * player.stealsPerGame) + (0.5 * player.blocksPerGame) )
  let tier2 = ( (ppg * player.pointsPerGame) + (1.0 * player.assistsPerGame) + (1.0 * player.allNBAThird) )
  let tier3 = ( (per * player.careerPER) + (1.5 * player.allNBASecond) )
  let tier4 = ( (championships * player.championships) + (allNBA * player.allNBAFirst) + (mvp * player.mvp) + (2.0 * player.dpoy) )
  let tier5 = ( (2.5 * player.finalsMVP) )
  let totalScore = tier1 + tier2 + tier3 + tier4 + tier5
  
  return totalScore.toFixed(2)
}

app.get('/api/v3/players/:id', async (req, res) => {
  try {
    let players = await Player.find()

    players.forEach( player => {
      let newScore = calculateScore(player, defaultCriteria)
      player.score = newScore
    })

    if (req.params.id !== 'all-time') {
      players = players.filter( player => req.params.id === 'All' || player.primaryPosition === req.params.id )
        .sort( (a, b) => a.score < b.score ? 1 : -1 )

      res.status(200).json({
        status: 'success',
        results: players.length,
        data: {
          players
        }
      })
    } else if (req.params.id === 'all-time') {
      res.status(200).json({
        status: 'success',
        results: selectAllTimeStartingFive(players).length,
        data: {
         players: selectAllTimeStartingFive(players)
        }
      })
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
})

app.post('/api/v3/players/', async (req, res) => {
  try {
    let players = await Player.find()
    let criteria = await req.body.criteria
    let selectedPosition = await req.body.selectedPosition
    let position = await req.body.position

    players.forEach( player => {
      let newScore = calculateScore(player, criteria)
      player.score = newScore
    })

    if (selectedPosition === 'all-time') {
      let allPlayers = selectAllTimeStartingFive(players);
      res.status(200).json({
        players: allPlayers,
        criteria,
        selectedPosition
      })
    } else {
      players = players.filter( player => selectedPosition === 'all' || selectedPosition === 'All' || selectedPosition === player.primaryPosition )
        .sort( (a, b) => a.score < b.score ? 1 : -1 )

      res.status(200).json({
        players,
        criteria,
        selectedPosition
      })
    }

  } catch (err) {
    console.log(err)
  }
})

module.exports = app