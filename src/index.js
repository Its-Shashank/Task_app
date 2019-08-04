const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('GET requests are disabled!')
//   } else {
//     next()
//   }
// })

// app.use((req, res, next) => {
//   res.status(503).send('The site is under maintainance!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

// 
// Without express middleware: new request -> run route handler
// 
// With express middleware:    new request -> do something -> run route handler
// 

app.listen(port, () => {
  console.log('Server is up on port '+ port)
})

const jwt = require('jsonwebtoken')

const myFunction = async () => {
  // return value from sign is the required authentication token
  const token = jwt.sign({ _id: 'abac123' }, 'thisismynewcourse', { expiresIn: '7 days' })
  console.log(token)

  const data = jwt.verify(token, 'thisismynewcourse')
  console.log(data)
}

myFunction()