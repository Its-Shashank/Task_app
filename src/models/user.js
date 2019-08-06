const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if(value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

// Not actually data stored in database but a relationship b/w two entities.

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

// For hiding / deleting some information.

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

// To call generateAuthToken for generating the tokens.

userSchema.methods.generateAuthToken = async function() {
  const user = this
  // define a payload which is _id
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

// Schema for Login

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }) // Short hand syntax.

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

// Middlewares:- We have 2--
// Pre- before saving data , Post- After saving data

// Here i wanna do something before user data is saved.
userSchema.pre('save', async function (next) {
  const user =  this
// if we want to save the user we need to do after execution of all code, so when we call next ,
// then this tells us that we have executed all code.


  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  // after updating we saw that that some mongoose operations bypass middlewares. When we update username, message does not prints.
  // In order to change this we need to change something in user update route.
  next()
})

const User = mongoose.model('User', userSchema)


module.exports = User