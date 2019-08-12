/*
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-04 03:35:31
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-12 12:02:11
 */
import Router from 'koa-router'
import md5 from 'crypto-js/md5' // 加密

import Order from '../dbs/models/order'
import Cart from '../dbs/models/cart'

const router = new Router({
  prefix: '/order'
})

// 创建购物车分类栏
router.post('/createOrder', async(ctx) => {
  const { id, price, count } = ctx.request.body
  const time = Date()
  const orderID = md5(Math.random() * 1000 + time).toString()
  if (!ctx.isAuthenticated()) { // isAuthenticated 是否登录
    ctx.body = {
      code: -1,
      msg: '请先登录!'
    }
  } else {
    const findCart = await Cart.findOne({ cartNo: id })
    const order = new Order({
      id: orderID,
      count,
      total: price * count,
      time,
      user: ctx.session.passport.user,
      name: findCart.detail[0].name,
      imsg: findCart.detail[0].imgs,
      status: 0
    })
    try {
      const result = await order.save()
      if (result) {
        await findCart.remove()
        ctx.body = {
          code: 0,
          id: orderID
        }
      } else {
        ctx.body = {
          code: -1
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1
      }
    }
  }
})

// 获取购物车分类栏
router.post('/getOrders', async ctx => {
  if (!ctx.isAuthenticated()) { // isAuthenticated 是否登录
    ctx.body = {
      code: -1,
      list: [],
      msg: 'please login'
    }
  } else {
    try {
      const result = await Order.find() // find 查询所有
      if (result) {
        ctx.body = {
          code: 0,
          list: result
        }
      } else {
        ctx.body = {
          code: -1
        }
      }
    } catch (e) {
      ctx.body = {
        code: -1,
        list: []
      }
    }
  }
})

export default router
