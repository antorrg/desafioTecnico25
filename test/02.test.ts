import {describe, it, expect } from 'vitest'
import createJugCases from '../src/Services/jugService.js'


describe('jugService', () => {
  it('should return the correct solution steps', async() => {
    const result = await createJugCases(2, 10, 4)
    expect(result.solution).toEqual({
      solution: [
        { step: 1, action: 'Fill bucket X', bucketX: 2, bucketY: 0 },
        { step: 2, action: 'Transfer from bucket X to Y', bucketX: 0, bucketY: 2 },
        { step: 3, action: 'Fill bucket X', bucketX: 2, bucketY: 2 },
        { step: 4, action: 'Transfer from bucket X to Y', bucketX: 0, bucketY: 4, status: 'Solved' }
      ]
    })
  })
  it('should throw if the desired amount is impossible', async() => {
    try {
      await createJugCases(2, 10, 11)
      throw new Error('Expect an error but nothing happened')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toMatchObject({message: 'No solution found', status: 404})
    }
  })
})
