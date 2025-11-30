/**
 * Ejecuta un middleware Express y devuelve una Promise que resuelve
 * cuando el middleware llama a `next()`.
 *
 * @param {Function} middleware - Middleware Express (req, res, next)
 * @param {Object} req - Request mock
 * @param {Object} res - Response mock
 * @returns {Promise<{ error: Error | null }>}
 */
export function runMiddleware (middleware, req = {}, res = {}) {
  return new Promise((resolve) => {
    const next = (err) => resolve({ error: err || null })
    middleware(req, res, next)
  })
}
