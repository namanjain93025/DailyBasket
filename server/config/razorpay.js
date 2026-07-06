import dotenv, { configDotenv } from 'dotenv'

const  instance = new Razorpay({
  key_id: '<your_partner_key>',
  key_secret: '<your_partner_secret>',
  headers: {
    "X-Razorpay-Account": "<merchant_account_id>"
  }
});

instance.orders.all().then(console.log).catch(console.error);