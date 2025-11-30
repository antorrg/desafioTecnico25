import formatSolution from './helpers/jugServHelper.js'
import { Queuejs } from './helpers/Queuejs.js'
import { throwCustomError } from '../errors.js'
import { cacheService } from './cacheService.js'

export const jugLogic = ( {xCapacity, yCapacity, zAmountWanted }) => {
  const queue = new Queuejs()
  const visited = new Set()
  queue.enqueue({ x: 0, y: 0, steps: [] })
  visited.add('0,0')

  while (!queue.isEmpty()) {
    const { x, y, steps } = queue.dequeue()

    if (x === zAmountWanted || y === zAmountWanted) {
      return formatSolution([...steps, { status: 'Solved' }])
    }

    const nextStates = [
      { x: xCapacity, y, action: 'Fill bucket X' },
      { x, y: yCapacity, action: 'Fill bucket Y' },
      { x: 0, y, action: 'Empty bucket X' },
      { x, y: 0, action: 'Empty bucket Y' },
      {
        x: Math.max(0, x - (yCapacity - y)),
        y: Math.min(yCapacity, y + x),
        action: 'Transfer from bucket X to Y'
      },
      {
        x: Math.min(xCapacity, x + y),
        y: Math.max(0, y - (xCapacity - x)),
        action: 'Transfer from bucket Y to X'
      }
    ]

    for (const ns of nextStates) {
      const key = `${ns.x},${ns.y}`
      if (!visited.has(key)) {
        visited.add(key)
        queue.enqueue({
          x: ns.x,
          y: ns.y,
          steps: [
            ...steps,
            {
              step: steps.length + 1,
              action: ns.action,
              bucketX: ns.x,
              bucketY: ns.y
            }
          ]
        })
      }
    }
  }

  throwCustomError('No solution found', 404)
}

 const createJugCases = async (xCapacity, yCapacity, zAmountWanted) =>
    cacheService(
      jugLogic,
      { xCapacity, yCapacity, zAmountWanted },
      ['xCapacity', 'yCapacity', 'zAmountWanted'],
      null,
    )
export default createJugCases
