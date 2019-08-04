function pv(ctx) {
  ctx.session.count++ // redis, session: How many times does the user visit?
  global.console.log('pv', ctx.path) // ctx.path: path
}

module.exports = function() {
  return async(ctx, next) => { // ctx: Context
    pv(ctx)
    await next() // next(): Next middleware
  }
}
