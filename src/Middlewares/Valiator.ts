import { type Request, type Response, type NextFunction } from 'express'

export class Validator {
  static #errorHandler = (msg: string, status: number) => {
    const error = new Error(msg) as Error & {status?:number}
    error.status = status
    return error
  }

  static validateJug = (req:Request, res:Response, next:NextFunction) => {
    const { x_capacity, y_capacity, z_amount_wanted } = req.body

    if (!x_capacity) {
      return next(Validator.#errorHandler('Missing parameter', 400))
    }

    const xCapacity = this.#parsedInfo(x_capacity)
    if (!xCapacity) {
      return next(Validator.#errorHandler('x_capacity: Invalid parameter', 400))
    }

    if (!y_capacity) {
      return next(Validator.#errorHandler('Missing parameter', 400))
    }

    const yCapacity = this.#parsedInfo(y_capacity)
    if (!yCapacity) {
      return next(Validator.#errorHandler('y_capacity: Invalid parameter', 400))
    }

    if (!z_amount_wanted) {
      return next(Validator.#errorHandler('Missing parameter', 400))
    }

    const zamount = this.#parsedInfo(z_amount_wanted)
    if (!zamount) {
      return next(Validator.#errorHandler('z_amount_wanted: Invalid parameter', 400))
    }

    // Update req.body with the validated values

    req.body.x_capacity = (xCapacity)
    req.body.y_capacity = yCapacity
    req.body.z_amount_wanted = zamount

    next()
  }

  static checkFeasibility = (req:Request, res:Response, next:NextFunction) => {
    const { x_capacity, y_capacity, z_amount_wanted } = req.body

    const x = x_capacity
    const y = y_capacity
    const z = z_amount_wanted

    // Calculate the GCF of X and Y -- Calcular el MCD de X e Y
    const mcd = this.#gcd(x, y)
    // Check if Z is a multiple of the MCD and if Z is less than or equal to the maximum capacity of the jars
    // Verificar si Z es múltiplo del MCD y si Z es menor o igual a la capacidad máxima de las jarras
    if (z % mcd !== 0 || z > Math.max(x, y)) {
      return next(Validator.#errorHandler('No solution', 400))
    }

    // If feasible, continue.
    next()
  }

  static #parsedInfo(info: any):number | boolean {
    // First, check if the input is a string containing only digits via regex.
    const isNumeric = /^[0-9]+$/.test(info)

    // If it is not a numeric string or is negative or has more than 6 digits, returns false.
    if (!isNumeric || parseInt(info, 10) < 0 || info.length > 6) {
      return false
    }

    const infoP = parseInt(info, 10)
    return infoP
  }

  static #gcd(a:number, b:number):number { // This function implements Euclid's algorithm to find the GCD
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }
}
