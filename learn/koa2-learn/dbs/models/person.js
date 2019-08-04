const mongoose = require('mongoose')
const personSchema = new mongoose.Schema({ // Building a table
  name: String,
  age: Number
})

module.exports = mongoose.model('Person', personSchema) // Model
