import dotenv from 'dotenv'

const CONFIG_ENV = {
  production: '.env.production',
  development: '.env.development',
  test: '.env.test'
}as const
type Environment = keyof typeof CONFIG_ENV
const envFile= (process.env.NODE_ENV as Environment ) ?? 'production'
dotenv.config({ path: CONFIG_ENV[envFile] })

const getNumberEnv = (value: string, defaultValue: number| string):number => {
  return Number(process.env[value ?? defaultValue])
}

const getStringEnv = (key: string, defaultValue: string):string => {
  const value = process.env[key]
  return value !== undefined ? String(value) : defaultValue
}

const envConfig = {
  Port: getNumberEnv('PORT', '3001'),
  Status: envFile

}
export default envConfig