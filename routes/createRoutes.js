import express, { Router } from 'express'
import User from '../models/userModel.js'

const createRouter = express.Router()

createRouter.post('/', (req,res) => {
    const user = User(req.body)
    user.save()
    // console.log(req.body)
    res.send(req.body)
})

export default createRouter