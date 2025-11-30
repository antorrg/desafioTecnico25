export function throwCustomError (msg, status) {
  const error = new Error(msg)
  error.status = status
  throw error
}
