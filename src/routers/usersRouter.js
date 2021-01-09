const express = require ('express')
const User=require('../models/userModel')
const auth = require ('../middleware/auth')
const router = new express.Router()


router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post ('/users/signin' , async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/signout', auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/update-cart', auth, async (req,res)=>{
    try {
        req.user.cart=req.body.cart;
        console.log(req.body.cart)
        await req.user.save()

        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})


router.get('/users', async (req,res)=>{
    try {
        const users = await User.find({});        

        res.send(users)
    } catch (error) {
        res.status(400).send()
    }
})


module.exports = router;