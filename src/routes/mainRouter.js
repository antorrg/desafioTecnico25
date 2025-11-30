import express from 'express'
import jugRouter from './jugRouter.js'

const mainRouter = express.Router()

mainRouter.use('/api', jugRouter)

export default mainRouter
