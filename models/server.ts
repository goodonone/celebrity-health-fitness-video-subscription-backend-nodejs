import express from 'express';
import fs from 'fs';
import stripe from 'stripe';


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

const stripeSecretKey = 'YOUR_STRIPE_SECRET_KEY'; // Replace with your actual Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_Public_KEY

const stripeClient = new stripe(stripeSecretKey);

console.log(stripeSecretKey, stripePublicKey)

const express = require('express')
const app = express();
//this allows us to read different files
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
//where are all of our static files be? List within '' below
app.use(express.json())
app.use(express.static('public'))

//set up route
app.get('/store', function(req, res){
    fs.readFile('items.json', function(error, data){
        if(error){
            res.status(500).end()
        }else{
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
}) 








app.post('/purchase', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if (error) {
            res.status(500).end();
        } else {
            const itemsJson = JSON.parse(data.toString());
            const itemsArray = itemsJson.music.concat(itemsJson.merch);
            let total = 0;

            req.body.items.forEach((item: { id: string; quantity: number }) => {
                const itemJson = itemsArray.find((i) => i.id === item.id);

                if (itemJson) {
                    total += itemJson.price * item.quantity;
                }
            });

            stripeClient.charges.create(
                {
                    amount: total,
                    source: req.body.stripeTokenId,
                    currency: 'usd',
                },
                (err) => {
                    if (err) {
                        console.log('Charge Fail', err);
                        res.status(500).end();
                    } else {
                        console.log('Charge Successful');
                        res.json({ message: 'Successfully purchased items' });
                    }
                }
            );
        }
    });
});

const PORT = 3001; // Replace with your desired port number
app.listen(PORT, () => {
    console.log(`Server is running on port ${3001}`);
});



//JS Below
// app.post('/purchase', function(req, res)){
//     fs.readFile('items.json', function(error,data){
//         if(error){
//             res.status(500).end()
//         }else{
//             const itemsJson = JSON.parse(data)
//             const itemsArray = itemsJson.music.concat(itemsJson.merch)
//             let total = 0
//             req.body.items.array.forEach(item => {
//                 const itemJson = itemsArray.find(function(i){
//                     return i.id == item.id
//                 })

//                 total = total + itemJson.price * item.quantity
//             })
//             stripe.charges.create({
//                 amount: total,
//                 source: request.body.stripeTokenId,
//                 currency: 'usd'
//             }).then(function(){
//                 console.log('Charge Successful')
//                 res.json({message: "Successfully purchased items"})
//             }).catch(function(){
//                 console.log('Charge Fail')
//                 res.status().end()
//             })
//             // console.log('purchase')
//             }
//         })
//     }



