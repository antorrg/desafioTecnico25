const formatSolution = (steps) => {
  if (steps.length > 0) {
    const lastStep = steps.pop()
    if (lastStep.status === 'Solved') {
      steps[steps.length - 1].status = 'Solved'
    }
  }
  return { solution: steps }
}
export default formatSolution
