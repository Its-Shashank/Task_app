require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5d3e0feffd7b1d25d8bc355e').then((task) => {
//   console.log(task)
//   return Task.countDocuments()
// }).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })


const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({completed: false})
  return count
}
deleteTaskAndCount('5d3faaab857d6341c4f0f392').then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})