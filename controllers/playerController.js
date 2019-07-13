const Player = require('./../models/playerModel')

exports.getAllTours = async (req, res) => {
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
}