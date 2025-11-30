import express from 'express'
import { controller } from './Controllers/controller.js'
import { Validator } from './Middlewares/Valiator.js'

const mainRouter = express.Router()

mainRouter.post('/api/jugs/create', Validator.validateJug, Validator.checkFeasibility, controller)

export default mainRouter