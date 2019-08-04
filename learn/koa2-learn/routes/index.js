const router = require('koa-router')()

router.get('/', async(ctx, next) => {
  global.console.log('index2')
  ctx.cookies.set('pvid', Math.random()) // write into cookies
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async(ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async(ctx, next) => {
  ctx.body = {
    title: 'koa2 json',
    cookie: ctx.cookies.get('pvid') // read cookies
  }
})

// await Followed by promise object(If not, convert to Promise), await Waiting for results(resolve)Execute the following code, Enable code to execute sequent
router.get('/testAsync', async ctx => {
  global.console.log('start', new Date().getTime())
  const a = await new Promise((resolve, reject) => {
    setTimeout(() => {
      global.console.log('async a', new Date().getTime())
      resolve('ab')
    }, 1000)
  })
  const b = await 123
  ctx.body = { // Return interface result
    a,
    b
  }
})

module.exports = router
