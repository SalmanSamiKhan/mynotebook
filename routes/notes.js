import express, { Router } from 'express'
import { body, validationResult } from 'express-validator'
import getuser from '../middleware/getuser.js'
import Note from '../models/noteModel.js'

const noteRouter = express.Router()

// ********** Get Notes *******
//* api/notes/getnotes
noteRouter.get('/getnotes', getuser, async (req, res) => {
    const notes = await Note.find({ user: req.user.id }) // user in note model: req.user.id
    res.json(notes)
})

// express validator conditions array
const addnoteConditions = [
    body('title', 'Please enter a valid title').isLength({ min: 3 }),
    body('description', 'Please enter a valid description').isLength({ min: 5 })
]

// ********** Add Note *******
//* api/notes/addnote
noteRouter.post('/addnote', addnoteConditions, getuser, async (req, res) => {
    const errors = validationResult(req) // validation result using express validator
    // if there are errors, if conditions are not fulfilled
    if (!errors.isEmpty()) {
        // sending errors object in json which contains an array returned form validationResult
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        // creating note
        const { title, description, tag } = req.body
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Inernal Server Error')
    }
})

// ********** Update Note *******
//* api/notes/updatenote
noteRouter.put('/updatenote/:id', getuser, async (req, res) => {
    const { title, description, tag } = req.body // from req body deconst title,desc,tag
    try {
        // Create new note
        const newNote = {}
        if (title) { newNote.title = title } // if title is updated set newNote title to new title
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        // Find the note that is to update and update it
        let note = await Note.findById(req.params.id) // find by /:id
        // if the note does not exist at all
        if (!note) { return res.status(404).send('Not Found') }
        // if note exist but user tries to update anoter user's note
        /** (1)
         * LHS -> note.user = user id in note model who is the owner of the note
         * RHS -> req.user.id = this user coming from getuser middleware.
         *        By using auth token we get to know logged in users user id
         * LHS==RHS means note owner is trying to edit his note
         * LHS!=RHS means you are trying to edit some other user's note!
         */
        if (note.user.toString() != req.user.id) { // ---- (1)
            return res.status(401).send('Not Allowed')
        }

        // Now if an authentic user is trying to edit his own note let him do it
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }) // mongodb syntax
        res.json(note)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Inernal Server Error')
    }
})


// ********** Delete Note *******
//* api/notes/deletenote
noteRouter.delete('/deletenote/:id', getuser, async (req, res) => {
    try {
        // Find the note that is to delete and delete it
        let note = await Note.findById(req.params.id) // find by /:id
        // if the note does not exist at all
        if (!note) { return res.status(404).send('Not Found') }
        // if note exist but user tries to delete anoter user's note
        /** (1)
         * LHS -> note.user = user id in note model who is the owner of the note
         * RHS -> req.user.id = this user coming from getuser middleware.
         *        By using auth token we get to know logged in users user id
         * LHS==RHS means note owner is trying to delete his note
         * LHS!=RHS means you are trying to delete some other user's note!
         */
        if (note.user.toString() != req.user.id) { // ---- (1)
            return res.status(401).send('Not Allowed')
        }

        // Now if an authentic user is trying to delete his own note let him do it
        // note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true}) // mongodb syntax
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ 'success': 'Note has been deleted', note: note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Inernal Server Error')
    }
})
export default noteRouter