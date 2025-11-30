import { Validator } from '../src/middlewares/Validator.js'
import { runMiddleware } from './serverMock/runMiddleware.js'

describe('Validator check, static class middlewares', () => {
  describe('validateJug method', () => {
    it('should call next if validation passes', async () => {
      const req = { body: { x_capacity: 3, y_capacity: 5, z_amount_wanted: 4 } }
      const res = {}
      const { error } = await runMiddleware(Validator.validateJug, req, res)
      expect(error).toBeNull()
      expect(req.body).toEqual({
        x_capacity: 3,
        y_capacity: 5,
        z_amount_wanted: 4
      })
    })
    it('should convert to a number and call next if x_capacity were a number string', async () => {
      const req = { body: { x_capacity: '3', y_capacity: 5, z_amount_wanted: 4 } }
      const res = {}
      const { error } = await runMiddleware(Validator.validateJug, req, res)
      expect(error).toBeNull()
      expect(req.body).toEqual({
        x_capacity: 3,
        y_capacity: 5,
        z_amount_wanted: 4
      })
    })

    it('should return 400 if x_capacity is missing', async () => {
      const req = { body: { y_capacity: 5, z_amount_wanted: 4 } }
      const res = {}
      const { error } = await runMiddleware(Validator.validateJug, req, res)
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Missing parameter')
      expect(error.status).toBe(400)
    })
    it('should return 400 if x_capacity is not an integer', async () => {
      const req = { body: { x_capacity: 3.5, y_capacity: 5, z_amount_wanted: 4 } }
      const res = {}
      const { error } = await runMiddleware(Validator.validateJug, req, res)
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('x_capacity: Invalid parameter')
      expect(error.status).toBe(400)
    })
  })
  describe('checkFeasibility method', () => {
    it('should call next if z_amount_wanted is feasible', async () => {
      const req = { body: { x_capacity: 3, y_capacity: 5, z_amount_wanted: 4 } }
      const res = {}
      const { error } = await runMiddleware(Validator.checkFeasibility, req, res)
      expect(error).toBeNull()
      expect(req.body).toEqual({
        x_capacity: 3,
        y_capacity: 5,
        z_amount_wanted: 4
      })
    })

    it('should return 400 if z_amount_wanted is not feasible', async () => {
      const req = { body: { x_capacity: 3, y_capacity: 5, z_amount_wanted: 11 } }
      const res = {}
      const { error } = await runMiddleware(Validator.checkFeasibility, req, res)
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('No solution')
      expect(error.status).toBe(400)
    })
  })
})
