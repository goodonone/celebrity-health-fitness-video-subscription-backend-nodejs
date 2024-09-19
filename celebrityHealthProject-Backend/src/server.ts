
// import dotenv from 'dotenv';
import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();
///SIMPLIFY

if (process.env.NODE_ENV !== 'production') {
    //dotenv.config();
  }

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

if (!stripeSecretKey) {
  console.error('Stripe secret key is not provided.');
  process.exit(1);
}
if (!stripePublicKey) {
    console.error('Stripe public key is not provided.');
    process.exit(1);
}

console.log(stripeSecretKey);

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//const PORT: number = 3000;

//app.listen(PORT, () => {
//  console.log(`Server is listening on port ${PORT}`);
//});










//JS

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// console.log(stripeSecretKey)
// const express = require('express')
// const app = express()

// app.set('view engine', 'ejs')
// app.use(express.static('public'))
// app.listen(3000) //3000 needs to be changed
 