import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import noteRouter from './routes/notes.js'
import createRouter from './routes/createRoutes.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/userRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// cyclic mongoose
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

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

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})