const express = require('express')
const bodyParser = require('body-parser')
const Player = require('./models/playerModel')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 

const selectAllTimeStartingFive = players => {
  let allTimeStartingFive = []
  let pgPER = 0
  let sgPER = 0
  let sfPER = 0
  let pfPER = 0
  let cPER = 0
  let topPG = ''
  let topSG = ''
  let topSF = ''
  let topPF = ''
  let topC = ''

  for (let i = 0; i < players.length; i++) {
    if (players[i].primaryPosition === 'PG') {
      if (players[i].careerPER > pgPER) {
        pgPER = players[i].careerPER
        topPG = players[i]
      }
    } else if (players[i].primaryPosition === 'SG') {
      if (players[i].careerPER > sgPER) {
        sgPER = players[i].careerPER
        topSG = players[i]
      }
    } else if (players[i].primaryPosition === 'SF') {
      if (players[i].careerPER > sfPER) {
        sfPER = players[i].careerPER
        topSF = players[i]
      }
    } else if (players[i].primaryPosition === 'PF') {
      if (players[i].careerPER > pfPER) {
        pfPER = players[i].careerPER
        topPF = players[i]
      }
    } else if (players[i].primaryPosition === 'C') {
      if (players[i].careerPER > cPER) {
        cPER = players[i].careerPER
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

const criteria = {
  newCriteria: {
    ppg: 1,
    per: 1,
    championships: 1,
    allNBA: 1,
    mvp: 1
  }
}

const calculateScore = (player, criteria) => {
  const { ppg, per, championships, allNBA, mvp } = criteria.newCriteria
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
      let newScore = calculateScore(player, criteria)
      player.score = newScore
      console.log(`player is ${player.playerFullName} and score is ${player.score}`)
    })

    if (req.params.id !== 'all-time') {
      players = players.filter( player => req.params.id === 'All' || player.primaryPosition === req.params.id )

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
    let criteria = req.body

    players.forEach( player => {
      let playerScore = calculateScore(player, criteria)
      player.score = playerScore
    })

    players = players.sort( (a, b) => a.score < b.score ? 1 : -1)

    console.log('players', players)

    res.status(200).json({
      players
    })

  } catch (err) {
    //
  }
})

module.exports = app