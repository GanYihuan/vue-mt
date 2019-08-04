const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// Redis
const Redis = require('koa-redis')
// session
const session = require('koa-generic-session')

// route
const index = require('./routes/index')
const users = require('./routes/users')

// middlewares
const pv = require('./middleware/koa-pv')
const m1 = require('./middleware/m1')
const m2 = require('./middleware/m2')

// mongoose
const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')

// error handler
onerror(app)

// redis connection
app.keys = ['keys', 'keyskeys']
app.use(
  session({
    key: 'mt', // Cookies: mt.sig
    prefix: 'mtpr', // session Stored key value
    store: new Redis()
  })
)

// middlewares
app.use(pv())
app.use(m1())
app.use(m2())
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())
app.use(logger())
// app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(`${__dirname}/public`))
app.use(
  // views(__dirname + '/views', {
  //   extension: 'ejs'
  // })
  views(`${__dirname}/views`, {
    extension: 'ejs'
  })
)

// logger
app.use(async(ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes use
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// Connect to the database
mongoose.connect(
  dbConfig.dbs,
  {
    useNewUrlParser: true
  }
)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
