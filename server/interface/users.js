/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-04 03:35:31
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-12 11:41:13
 */
import Router from 'koa-router'
import Redis from 'koa-redis' // works with koa-generic-session (a generic session middleware for koa)
import nodeMailer from 'nodemailer' // Send e-mails from Node.js – easy as cake

import axios from './utils/axios'
import Passport from './utils/passport'

import User from '../dbs/models/users'
import Email from '../dbs/config'

const router = new Router({ // Direct access to the ioredis client object
  prefix: '/users'
})
const Store = new Redis().client // get redis client

router.post('/signup', async ctx => {
  const {
    username,
    email,
    code,
    password
  } = ctx.request.body // get user upload data (register.vue pass parameter)
  if (code) {
    const saveCode = await Store.hget(`nodemail:${username}`, 'code') // redis hget() verifycode, '/verify' Store.hmset
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
  const user = await User.find({ username }) // username has been register
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '用户名已被注册'
    }
    return
  }
  const nuser = await User.create({ // write into database
    username,
    password,
    email
  })
  if (nuser) { // register success
    const res = await axios.post('/users/signin', {
      username,
      password
    })
    if (res.data && res.data.code === 0) {
      ctx.body = {
        code: 0,
        msg: '注册成功',
        user: res.data.user
      }
    } else {
      ctx.body = {
        code: -1,
        msg: 'error'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})

router.post('/signin', async(ctx, next) => {
  return Passport.authenticate('local', function(err, user, info, status) { // authenticate(): invoked passport-local Strategy (register.vue pass parameter)
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      } else {
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx, next)
})

// router.get('/fix', async ctx => {
//   // Store.hset(`test`, "name", "111");
//   ctx.session.name = 'nidie'
//   ctx.body = {
//     code: 0
//   }
// })

router.post('/verify', async(ctx, next) => {
  const { username } = ctx.request.body // register.vue pass parameter
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }
    return false
  }
  const transporter = nodeMailer.createTransport({ // send email config
    host: Email.smtp.host,
    port: 587,
    secure: false, // false: Listen to other ports
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  const ko = { // What information been sent by nodemailer
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email,
    user: ctx.request.body.username
  }
  const mailOptions = { // email msg
    from: `认证邮件<${Email.smtp.user}>`,
    to: ko.email,
    subject: '《慕课网高仿美团网全栈实战》注册码',
    html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的邀请码是${ko.code}`
  }
  await transporter.sendMail(mailOptions, (err, info) => { // send email
    if (err) {
      return console.log(err)
    } else {
      Store.hmset( // redis save user info
        `nodemail:${ko.user}`,
        'code',
        ko.code,
        'expire',
        ko.expire,
        'email',
        ko.email
      )
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已经发送，可能会有延时，有效期1分钟'
  }
})

router.get('/exit', async(ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) { // isAuthenticated: Determine whether to authenticate (Check if it is currently logged in)
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

router.get('/getUser', async ctx => {
  if (ctx.isAuthenticated()) {
    const { username, email } = ctx.session.passport.user // ctx.session.passport.user: get passport-koa user name and password
    ctx.body = {
      user: username,
      email
    }
  } else {
    ctx.body = {
      user: '',
      email: ''
    }
  }
})

export default router
