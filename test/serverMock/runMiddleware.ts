import type { Request, Response, NextFunction, RequestHandler } from "express"

/**
 * Ejecuta un middleware Express y devuelve una Promise que resuelve
 * cuando el middleware llama a `next()` (con o sin error).
 *
 * ✅ Compatible con middlewares síncronos y asíncronos.
 * ✅ Preserva los tipos de Request/Response.
 *
 * @param middleware Middleware Express a ejecutar.
 * @param req Objeto Request (mock o real).
 * @param res Objeto Response (mock o real).
 * @returns Promise con el posible error (si `next(error)` fue llamado).
 */
export interface CustomError extends Error {
  status?: number;
}

export interface ValidationError extends CustomError {
  status: 400;
  type: 'ValidationError';
}

export interface NotFoundError extends CustomError {
  status: 404;
  type: 'NotFoundError';
}


export async function runMiddleware<
  TReq extends Partial<Request> = Request,
  TRes extends Partial<Response> = Response
>(
  middleware: RequestHandler,
  req?: TReq,
  res?: TRes
): Promise<{ error: CustomError | null }> {
  return new Promise((resolve) => {
    const next: NextFunction = (err?: any) => resolve({ error: err || null })

    try {
      // Ejecuta el middleware
      const result = middleware(req as Request, res as Response, next)
      // Si devuelve una Promesa (async), espera su resolución
      if (result && typeof (result as Promise<void>).then === "function") {
        ;(result as Promise<void>).catch((err) => next(err))
      }
    } catch (err) {
      next(err)
    }
  })
}
/*
ejemplo de uso:
import { runMiddleware } from "../utils/runMiddleware"
import { Validator } from "../../src/middlewares/Validator"

describe("Validator.validateJug (unit)", () => {
  it("✅ should pass when all parameters are valid", async () => {
    const req = {
      body: { x_capacity: 3, y_capacity: 5, z_amount_wanted: 4 },
    } as any
    const res = {} as any

    const { error } = await runMiddleware(Validator.validateJug, req, res)
    expect(error).toBeNull()
    expect(req.body).toEqual({
      x_capacity: 3,
      y_capacity: 5,
      z_amount_wanted: 4,
    })
  })

  it("❌ should return error when x_capacity is missing", async () => {
    const req = { body: { y_capacity: 5, z_amount_wanted: 4 } } as any
    const { error } = await runMiddleware(Validator.validateJug, req)
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe("Missing parameter")
    expect(error?.status).toBe(400)
  })
})
*/