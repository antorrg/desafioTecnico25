import { describe, it, expect } from 'vitest'
import { Validator } from '../src/Middlewares/Valiator.js'
import { runMiddleware, ValidationError  } from './serverMock/runMiddleware.js'
import type { Request } from 'express'

interface MockRequest extends Partial<Request> {
  body: {
    x_capacity?: number | string;
    y_capacity?: number | string;
    z_amount_wanted?: number | string;
  };
}

describe('Validator check, static class middlewares', () => {
  describe('validateJug method', () => {
    it('should call next if validation passes', async () => {
      const req: MockRequest = { 
        body: { x_capacity: 3, y_capacity: 5, z_amount_wanted: 4 } 
      }
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
      const req: MockRequest = { 
        body: { x_capacity: '3', y_capacity: 5, z_amount_wanted: 4 } 
      }
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
      const req: MockRequest = { 
        body: { y_capacity: 5, z_amount_wanted: 4 } 
      }
      const res = {}
      const { error } = await runMiddleware(Validator.validateJug, req, res)
      expect(error).toBeInstanceOf(Error)
      const validationError = error as ValidationError
      expect(validationError.message).toBe('Missing parameter')
      expect(validationError.status).toBe(400)
    })

    it('should return 400 if x_capacity is not an integer', async () => {
      const req: MockRequest = { 
        body: { x_capacity: 3.5, y_capacity: 5, z_amount_wanted: 4 } 
      }
      const res = {}
      const { error } = await runMiddleware(Validator.validateJug, req, res)
      expect(error).toBeInstanceOf(Error)
      const validationError = error as ValidationError
      expect(validationError.message).toBe('x_capacity: Invalid parameter')
      expect(validationError.status).toBe(400)
    })
  })

  describe('checkFeasibility method', () => {
    it('should call next if z_amount_wanted is feasible', async () => {
      const req: MockRequest = { 
        body: { x_capacity: 3, y_capacity: 5, z_amount_wanted: 4 } 
      }
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
      const req: MockRequest = { 
        body: { x_capacity: 3, y_capacity: 5, z_amount_wanted: 11 } 
      }
      const res = {}
      const { error } = await runMiddleware(Validator.checkFeasibility, req, res)
      expect(error).toBeInstanceOf(Error)
      const validationError = error as ValidationError
      expect(validationError.message).toBe('No solution')
      expect(validationError.status).toBe(400)
    })
  })
})