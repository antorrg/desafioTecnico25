import createJugCases from '../services/jugService.js'

export default {

  createController: async(req, res, next) => {
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

}
