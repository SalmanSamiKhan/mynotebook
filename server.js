import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectToMongo from './database.js'
import noteRouter from './routes/notes.js'
import createRouter from './routes/createRoutes.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/userRoutes.js'

const app = express()
connectToMongo() // importing connectToMongo function from db.js
app.use(cors())

app.use(express.json()) // for using json
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/create', createRouter)
app.use('/api/notes', noteRouter)

// Deployment setup
const _dirname = path.resolve()
app.use(express.static(path.join(_dirname, '/frontend/build')))
app.get('*', (req,res)=>
    res.sendFile(path.join(_dirname, '/frontend/build/index.html'))
)

const localPort = 5000
app.listen(localPort || process.env.PORT, () => {
    console.log(`server running on http://localhost:${localPort}`)
})