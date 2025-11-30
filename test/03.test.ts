import {describe, it, expect } from 'vitest'
import session from 'supertest'
import app from '../src/app.js'
const agent = session(app)

// Integration test:
describe('API Integration Tests', () => {
  it('Should create a solution', async () => {
    const response = await agent
      .post('/api/jugs/create')
      .send({ x_capacity: 5, y_capacity: 3, z_amount_wanted: 4 })
      .expect('Content-Type', /json/)
      .expect(201)

    expect(response.body).toEqual({
      solution: [
        { step: 1, action: 'Fill bucket X', bucketX: 5, bucketY: 0 },
        { step: 2, action: 'Transfer from bucket X to Y', bucketX: 2, bucketY: 3 },
        { step: 3, action: 'Empty bucket Y', bucketX: 2, bucketY: 0 },
        { step: 4, action: 'Transfer from bucket X to Y', bucketX: 0, bucketY: 2 },
        { step: 5, action: 'Fill bucket X', bucketX: 5, bucketY: 2 },
        { step: 6, action: 'Transfer from bucket X to Y', bucketX: 4, bucketY: 3, status: 'Solved' }
      ]
    })
  })
  it('Should respond a created solution (cached solution)', async () => {
    const response = await agent
      .post('/api/jugs/create')
      .send({ x_capacity: 5, y_capacity: 3, z_amount_wanted: 4 })
      .expect('Content-Type', /json/)
      .expect(203)

    expect(response.body).toEqual({
      solution: [
        { step: 1, action: 'Fill bucket X', bucketX: 5, bucketY: 0 },
        { step: 2, action: 'Transfer from bucket X to Y', bucketX: 2, bucketY: 3 },
        { step: 3, action: 'Empty bucket Y', bucketX: 2, bucketY: 0 },
        { step: 4, action: 'Transfer from bucket X to Y', bucketX: 0, bucketY: 2 },
        { step: 5, action: 'Fill bucket X', bucketX: 5, bucketY: 2 },
        { step: 6, action: 'Transfer from bucket X to Y', bucketX: 4, bucketY: 3, status: 'Solved' }
      ]
    })
  })
  it('Should return 404 if an error occurs in the route', async () => {
    const response = await agent
      .post('/api/jugs/pppp')
      .expect('Content-Type', /json/)
      .expect(404)

    expect(response.body).toEqual({
      error: 'Not Found'
    })
  })

  it('should handle data errors', async () => {
    const response = await agent
      .post('/api/jugs/create')
      .send({ x_capacity: 4, y_capacity: 3, z_amount_wanted: 18 })
      .expect('Content-Type', /json/)
      .expect(400)

    // Verifica que el middleware maneje correctamente el error devolviendo un mensaje adecuado
    expect(response.body).toEqual('No solution')
  })
})
