if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_Public_KEY

console.log(stripeSecretKey)

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
//where are all of our static files be? List within '' below
app.use(express.static(''))

app.listen(3001)