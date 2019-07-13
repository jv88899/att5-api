const express = require('express')
// const playerRouter = require('./routes/playerRoutes')
const Player = require('./models/playerModel')
const app = express()

const getAllPlayers = async (req, res) => {
  // try {
  //   const players = await Player.find()

  //   res.status(200).json({
  //     status: 'success',
  //     results: players.length,
  //     data: {
  //       players
  //     }
  //   })
  // } catch(err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err
  //   })
  // }
}

app.get('/api/v1/players', async (req, res) => {
  try {
    const players = await Player.find()

    res.status(200).json({
      status: 'success',
      results: players.length,
      data: {
        players
      }
    })
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
})

module.exports = app