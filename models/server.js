if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_Public_KEY

console.log(stripeSecretKey, stripePublicKey)

const express = require('express')
const app = express()
//this allows us to read different files
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
//where are all of our static files be? List within '' below
app.use(express.static(''))
app.use(express.static('public'))

//set up route
app.get('/store', function(req, res)){
    fs.readFile('items.json', function(error,data){
        if(error){
            res.status(500).end()
        }else{
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey
                items: JSON.parse(data)
            })
        }
    })
} 

app.post('/purchase', function(req, res)){
    fs.readFile('items.json', function(error,data){
        if(error){
            res.status(500).end()
        }else{
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.music.concat(itemsJson.merch)
            let total = 0
            req.body.items.array.forEach(item => {
                const itemJson = itemsArray.find(function(i){
                    return i.id == item.id
                })

                total = total + itemJson.price * item.quantity
            })
            stripe.charges.create({
                amount: total,
                source: request.body.stripeTokenId,
                currency: 'usd'
            }).then(function(){
                console.log('Charge Successful')
                res.json({message: "Successfully purchased items"})
            }).catch(function(){
                console.log('Charge Fail')
                res.status().end()
            })
            // console.log('purchase')
            }
        })
    }



app.listen(3001)