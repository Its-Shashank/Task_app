const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

// ROute for adding tasks to database.

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
}) 


// Route for reading all the tasks 
router.get('/tasks', async (req, res) => {

  try {
    const task = await Task.find({})
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

// Route for reading individual tasks.
router.get('/tasks/:id', async (req, res) => {

  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).send(task)
    }
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

// Route for updating tasks.
router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' })
  }
  
  try {
    const task = await Task.findById(req.params.id)
     updates.forEach((update) => task[update] = req.body[update])

     await task.save()
    
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
    
    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Route to delete tasks by id.

router.delete('/tasks/:id', async(req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router