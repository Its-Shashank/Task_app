require('../src/db/mongoose')
const User = require('../src/models/user')

// 5d3dd7a994366009589d486c

// User.findByIdAndUpdate('5d3d9c3760209522684cdfbb', { age: 19 }).then((user) => {
//   console.log(user)
//   return User.countDocuments({ age: 19})
// }).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age })
  const count = await User.countDocuments({age})
  return count
}

updateAgeAndCount('5d3d9c3760209522684cdfbb', 20).then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})