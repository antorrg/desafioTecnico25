import express from 'express'
import jug from '../controllers/jugController.js'
import { Validator } from '../middlewares/Validator.js' //

const jugRouter = express.Router()

jugRouter.post('/jugs/create', Validator.validateJug, Validator.checkFeasibility, jug.createController)

export default jugRouter
