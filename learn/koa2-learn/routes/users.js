const router = require('koa-router')()
const Person = require('../dbs/models/person')

// redis
const Redis = require('koa-redis')
const Store = new Redis().client

router.prefix('/users') // Route prefix

router.get('/', function(ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function(ctx, next) { // Targeting http://localhost:3000/users/bar routing
  ctx.body = 'this is a users/bar response' // Return interface result
})

// Increase data
router.post('/addPerson', async(ctx, next) => {
  const person = new Person({
    name: ctx.request.body.name, // ctx.request is ctx encapsulate request object
    age: ctx.request.body.age
  })
  let code
  try {
    await person.save() // save: Increase data
    code = 0
  } catch (error) {
    code = -1
  }
  ctx.body = {
    code: code
  }
})

// Query data
router.post('/getPerson', async(ctx, next) => {
  const result = await Person.findOne({ // findOne: Find a piece
    name: ctx.request.body.name
  })
  const results = await Person.find({ // find: Find out all
    name: ctx.request.body.name
  })
  ctx.body = {
    code: 0,
    result,
    results
  }
})

// change the data
router.post('/updatePerson', async function(ctx) {
  const result = await Person
    .where({ // where: Positioning data
      name: ctx.request.body.name
    })
    .update({ // update: change the data
      age: ctx.request.body.age
    })
  ctx.body = {
    code: 0,
    result
  }
})

// delete data
router.post('/removePerson', async function(ctx) {
  const result = await Person
    .where({
      name: ctx.request.body.name
    })
    .remove()
  ctx.body = {
    code: 0,
    result
  }
})

// hget fix name Without going through session Direct reading redis
router.get('/fix', async(ctx, next) => {
  const st = await Store.hset('fix', 'name', Math.random()) // key, k-v
  ctx.body = {
    code: 0,
    st
  }
})

module.exports = router
