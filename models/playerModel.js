const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    playerFirstName: {
        type: String,
        required: true
    },
    playerLastName: {
        type: String,
        required: true
    },
    playerFullName: {
        type: String,
        required: true
    },
    position: {
        type: Array,
        required: true
    },
    primaryPosition: {
        type: String,
        required: true
    },
    secondaryPosition: {
        type: String,
        required: true
    },
    pointsPerGame: {
        type: Number,
        required: true
    },
    reboundsPerGame: {
        type: Number,
        required: true
    },
    assistsPerGame: {
        type: Number,
        required: true
    },
    stealsPerGame: {
        type: Number,
        required: true
    },
    blocksPerGame: {
        type: Number,
        required: true
    },
    careerPER: {
        type: Number,
        required: true
    },
    allNBAFirst: {
        type: Number,
        required: true
    },
    allNBASecond: {
        type: Number,
        required: true
    },
    allNBAThird: {
        type: Number,
        required: true
    },
    mvp: {
        type: Number,
        required: true
    },
    dpoy: {
        type: Number,
        required: true
    },
    championships: {
        type: Number,
        required: true
    },
    finalsMVP: {
        type: Number,
        required: true
    },
    imgURL: {
        type: String,
        required: true
    }
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player