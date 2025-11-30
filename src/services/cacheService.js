import NodeCache from 'node-cache'
import { throwCustomError } from '../errors.js'

const myCache = new NodeCache({ stdTTL: 600 }) // TTL por defecto global

/**
 * Wrapper de caching para servicios.
 * @param {Function} service - función a ejecutar (sync o async)
 * @param {Object} params - parámetros de entrada
 * @param {string[]|string} keys - campo(s) de params que forman la clave
 * @param {Function} [keyBuilder] - función opcional para generar una clave personalizada
 * @param {Object} [options] - opciones adicionales, ej: { ttl: 300 }
 */
export const cacheService = async (service, params, keys, keyBuilder=null, options = {}) => {
  try {
    const { ttl } = options

    if (typeof service !== 'function') {
      throwCustomError('Service function is required', 400)
    }
    // 🔑 construir clave
    const cacheKey = keyBuilder
      ? keyBuilder(params)
      : Array.isArray(keys)
        ? keys.map(k => params[k]).join('-')
        : params[keys]

    if (!cacheKey) throwCustomError('Invalid or empty cache key', 400)

    const cached = myCache.get(cacheKey)
    if (cached) return { solution: cached, cached: true }

    const result = await Promise.resolve(service(params))

    if (ttl && typeof ttl === 'number') {
      myCache.set(cacheKey, result, ttl)
    } else {
      myCache.set(cacheKey, result)
    }

    return { solution: result, cached: false }
  } catch (error) {
    throw error
  }
}
