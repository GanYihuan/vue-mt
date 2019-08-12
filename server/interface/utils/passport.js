/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-04 03:35:31
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-12 11:27:50
 */
import passport from 'koa-passport' // Passport middleware for Koa
import LocalStrategy from 'passport-local' // Passport strategy for authenticating with a username and password
import UserModel from '../../dbs/models/users'

passport.use( // [Configure Strategy](https://www.npmjs.com/package/passport-local)
  new LocalStrategy(async function(username, password, done) {
    const result = await UserModel.findOne({ username })
    if (result !== null) {
      if (result.password === password) {
        return done(null, result)
      } else {
        return done(null, false, '密码错误')
      }
    } else {
      return done(null, false, '用户不存在')
    }
  })
)

passport.serializeUser(function(user, done) { // User information is retained in session, defulat
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  return done(null, user)
})

export default passport
