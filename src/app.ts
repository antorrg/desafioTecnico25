import express, { type Request, type Response, type NextFunction } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import mainRouter from './routes.js'

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(mainRouter)

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})

app.use((err: Error & {status?:number}, req: Request, res: Response, next: NextFunction) => {//eslint unused variables
  const status = err.status || 500
  const message = err.message || 'Server error'
  // console.error(message)
  res.status(status).json(message)
})

export default app
