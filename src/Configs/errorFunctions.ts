
export function throwCustomError(message: string, status?:number):never {
  const error = new Error(message)as Error & {status?:number}
  error.status = status
  throw error
}

