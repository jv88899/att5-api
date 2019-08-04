const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

dotenv.config({
    path: './config.env'
})

const app = require('./app')



const DB = process.env.DATABASE.replace(
    `<PASSWORD>`,
    process.env.DATABASE_PASSWORD
)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then( (con) => {
    // console.log(con.connection)
    // console.log(`DB Connection successful`)
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`)
})