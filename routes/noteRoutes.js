import express from 'express'
import bcrypt from 'bcryptjs'
import expressAsyncHandler from 'express-async-handler'
import Note from '../models/noteModel.js'

const noteRouter = express.Router()

// * Create. url: api/notes/create

noteRouter.post('/addnote', async (req,res) => {
    // res.send(req.body)
    const {title, description, tag} = req.body
    const note = new Note({
        title, description, tag, user: req.user.ObjectId
    })
    const savedNote = await note.save()
    res.json(savedNote)
})

export default noteRouter