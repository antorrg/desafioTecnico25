// ...existing code...
import type { Step } from './helpers/parser.js'
import parser from './helpers/parser.js'
import { Queuets } from './helpers/Queuets.js'
import { throwCustomError } from '../Configs/errorFunctions.js'
import { cacheService } from './cacheService.js'

type JugParams = {
  xCapacity: number
  yCapacity: number
  zAmountWanted: number
}

export const jugLogic = ({ xCapacity, yCapacity, zAmountWanted }: JugParams): { solution: Step[] } => {
  const queue = new Queuets<{ x: number; y: number; steps: Step[] }>()
  const visited = new Set<string>()
  queue.enqueue({ x: 0, y: 0, steps: [] })
  visited.add('0,0')

  while (!queue.isEmpty()) {
    const current = queue.dequeue()
    if (!current) break
    const { x, y, steps } = current

    if (x === zAmountWanted || y === zAmountWanted) {
      return parser([...steps, { status: 'Solved' }])
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
            } as Step
          ]
        })
      }
    }
  }

  throwCustomError('No solution found', 404)
}

export const createJugCases = async(xCapacity: number, yCapacity: number, zAmountWanted: number) =>
  cacheService(
    jugLogic,
    { xCapacity, yCapacity, zAmountWanted },
    ['xCapacity', 'yCapacity', 'zAmountWanted'],
    null
  )

export default createJugCases
