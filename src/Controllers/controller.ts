import  { type Request, type Response, type NextFunction } from 'express'
import createJugCases from '../Services/jugService.js'

export const controller = async(req:Request, res:Response, next:NextFunction) => {
  const { x_capacity, y_capacity, z_amount_wanted } = req.body
  try {
    const response = await createJugCases(x_capacity, y_capacity, z_amount_wanted)
    if (response.cached === true) {
      res.status(203).json(response.solution)
    } else {
      res.status(201).json(response.solution)
    }
  } catch (error) {
    next(error)
  }
}

