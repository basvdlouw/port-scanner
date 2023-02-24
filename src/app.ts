import express from 'express'
import path from 'path'

const app = express()
const port = 3000

app.use('/dist', express.static('dist'))

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, './static/index.html'))
})

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`)
})
