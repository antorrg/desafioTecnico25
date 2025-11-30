import NodeCache from 'node-cache'
import { throwCustomError } from '../Configs/errorFunctions.js'

const myCache = new NodeCache({ stdTTL: 600 }) // TTL por defecto global

export type CacheOptions = { ttl?: number }

/**
 * Wrapper de caching para servicios.
 */
export const cacheService = async <
  TParams = Record<string, any>,
  TResult = any
>(
  service: (params: TParams) => Promise<TResult> | TResult,
  params: TParams,
  keys: string[] | string,
  keyBuilder: ((params: TParams) => string) | null = null,
  options: CacheOptions = {}
): Promise<{ solution: TResult; cached: boolean }> => {
  try {
    const { ttl } = options

    if (typeof service !== 'function') {
      throwCustomError('Service function is required', 400)
    }
    // 🔑 construir clave
    const cacheKey = keyBuilder
      ? keyBuilder(params)
      : Array.isArray(keys)
        ? (keys as string[]).map(k => (params as any)[k]).join('-')
        : (params as any)[keys as string]

    if (!cacheKey) throwCustomError('Invalid or empty cache key', 400)

    const cached = myCache.get<TResult>(cacheKey)
    if (cached) return { solution: cached, cached: true }

    const result = await Promise.resolve(service(params))

    if (ttl && typeof ttl === 'number') {
      myCache.set(cacheKey, result, ttl)
    } else {
      myCache.set(cacheKey, result)
    }

    return { solution: result as TResult, cached: false }
  } catch (error) {
    throw error
  }
}
