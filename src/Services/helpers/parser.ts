// ...existing code...
export type Step = {
  step?: number
  action?: string
  bucketX?: number
  bucketY?: number
  status?: string
}

/**
 * Asegura que el estado "Solved" quede en el paso anterior al final
 * y devuelve { solution: Step[] } con el array final de pasos.
 */
const parser = (steps: Step[]): { solution: Step[] } => {
  if (steps.length > 0) {
    const lastStep = steps.pop()
    if (lastStep && lastStep.status === 'Solved' && steps.length > 0) {
      steps[steps.length - 1].status = 'Solved'
    }
  }
  return { solution: steps }
}
export default parser