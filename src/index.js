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

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
  // 
  //   const task = await Task.findById('5d4746619f4c5c2950f8e189')

  // The line below is gonna find the user whose associated with this task & task.owner will now a profile instead of just being th id.
  // Using populate we can know which creates which task or which task a user owns.

  //   await task.populate('owner').execPopulate()
  //   console.log(task.owner)
  // 

  const user = await User.findById('5d48d653b6062e1498d2dedd')
  await user.populate('tasks').execPopulate()
  console.log(user.tasks)
}

main()