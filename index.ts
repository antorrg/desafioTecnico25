import app from './src/app.js'
import dotenv from 'dotenv'
dotenv.config()

const Port = process.env.PORT || 3001

app.listen(Port, () => {
  console.log(`Server is listenning on port: ${Port}`)
})
