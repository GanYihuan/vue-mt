/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-04 03:35:31
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-12 20:21:47
 */
import Koa from 'koa'
import bodyParser from 'koa-bodyparser' // A body parser for koa
import session from 'koa-generic-session' // custom stores such as redis or mongo
import Redis from 'koa-redis' // works with koa-generic-session (a generic session middleware for koa)
import json from 'koa-json' // JSON pretty-printed response middleware
import consola from 'consola' // Elegant Console Logger for Node.js and Browser
import mongoose from 'mongoose' // Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment

import dbConfig from './dbs/config'
import passport from './interface/utils/passport'

import users from './interface/users'
import geo from './interface/geo'
import search from './interface/search'
import category from './interface/category'
import cart from './interface/cart'
import order from './interface/order'

const { Nuxt, Builder } = require('nuxt')
const app = new Koa()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.proxy = true
// koa-bodyparser
app.use( // post handle
  bodyParser({
    extendTypes: ['json', 'form', 'text']
  })
)
// koa-generic-session
app.keys = ['mt', 'keyskeys']
app.use(
  session({
    key: 'mt',
    prefix: 'mt:uid',
    store: new Redis()
  })
)
// koa-passport
app.use(passport.initialize())
app.use(passport.session())

// koa-json
app.use(json()) // data pretty

// mongoose
mongoose.connect( // Connect database
  dbConfig.dbs,
  {
    useNewUrlParser: true
  }
)

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  const nuxt = new Nuxt(config) // Instantiate nuxt.js
  if (config.dev) { // Build in development
    const builder = new Builder(nuxt)
    await builder.build()
  }
  // Introducing routing
  app.use(users.routes()).use(users.allowedMethods())
  app.use(geo.routes()).use(geo.allowedMethods())
  app.use(search.routes()).use(search.allowedMethods())
  app.use(category.routes()).use(category.allowedMethods())
  app.use(cart.routes()).use(cart.allowedMethods())
  app.use(order.routes()).use(order.allowedMethods())
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    // message: `Server listening on http://localhost:8044`,
    badge: true
  })
}

start()
