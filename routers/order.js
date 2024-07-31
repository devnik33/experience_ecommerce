const express = require("express")
const Order = require("../models/order")
const Cart = require("../models/cart")
const User = require("../models/user")
const Auth = require("../middleware/auth")


const router = new express.Router()

router.get('/orders', Auth, async (req, res) => {
    const owner = req.user._id;
    try {
        const order = await Order.find({ owner: owner }).sort({ date: -1 });
        if(order) {
            return res.status(200).send(order)
        }
        res.status(404).send('No orders found')
    } catch (error) {
        res.status(500).send()
    }
})

//checkout

router.post('/order/checkout', Auth, async(req, res) => {
    try {
        const owner = req.user._id;
        let payload = req.body
        

        //find cart and user 
        let cart = await Cart.findOne({owner})
        let user = req.user
        if(cart) {
            
        payload = {...payload, amount: cart.bill, email: user.email}
           // console.log(response)
            if(payload) {
               let callValidate='success';
              
             
                if(callValidate == 'success') {
                    const order = await Order.create({
                        owner,
                        items: cart.items,
                        bill: cart.bill
                    })
                    //delete cart
                    const data = await Cart.findByIdAndDelete({_id: cart.id})
                    return res.status(201).send({status: 'Payment successful', order})
                } else {
                    res.status(400).send('payment failed')
                }
            }
         

           // console.log(response)

        } else {
            res.status(400).send('No cart found')
        }
    } catch (error) {
        console.log(error)
        res.status(400).send('invalid request')
    }
})

module.exports = router