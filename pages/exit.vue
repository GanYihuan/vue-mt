<!--
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-04 03:35:31
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-13 03:25:59
 -->
<template>
  <div class/>
</template>

<script>
export default {
  layout: 'blank',
  middleware: async ctx => { // Middleware execution, Arrival page auto-execution
    const { status, data } = await ctx.$axios.get('/users/exit')
    if (status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>
