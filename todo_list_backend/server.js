const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
})
  .then(con => console.log(`DB connection successful!!`))
  .catch(err => console.log(`ERR: ${err}`))

const port  = process.env.PORT || 7000

app.listen(port, () => {
	console.log(`server running on port: ${port}`)
})