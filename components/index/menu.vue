<!--
 * @Description:
 * @version:
 * @Author: GanEhank
 * @Date: 2019-08-04 03:35:31
 * @LastEditors: GanEhank
 * @LastEditTime: 2019-08-13 16:08:56
 -->
<template>
  <div class="m-menu">
    <dl
      class="nav"
      @mouseleave="navLeave"
    >
      <dt>全部分类</dt>
      <dd
        v-for="(item, index) in $store.state.home.menu"
        :key="index"
        @mouseenter="navEnter"
      >
        <i :class="item.type"/>{{ item.name }}<span class="arrow"/>
      </dd>
    </dl>
    <div
      v-if="kind"
      class="detail"
      @mouseenter="detailEnter"
      @mouseleave="detailLeave"
    >
      <template v-for="(item, index) in curdetail.child">
        <h4 :key="index">{{ item.title }}</h4>
        <span
          v-for="v in item.child"
          :key="v"
        >{{ v }}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      kind: '' // record mouse hover state
      // menu: [
      //   {
      //     type: 'food',
      //     name: '美食',
      //     child: [
      //       {
      //         title: '美食',
      //         child: ['代金券', '甜点饮品', '火锅', '自助餐', '小吃快餐']
      //       }
      //     ]
      //   },
      // ]
    }
  },
  computed: {
    curdetail() {
      // console.log(this.menu.filter((item)=>{ // result is an array, to get the content
      //   return item.type === this.kind
      // })[0])
      return this.$store.state.home.menu.filter(item => {
        return item.type === this.kind
      })[0]
    }
  },
  methods: {
    navEnter(e) {
      this.kind = e.target.querySelector('i').className // e.target: Current element, querySelector: get <i></i>
    },
    navLeave() {
      this._timer = setTimeout(() => {
        this.kind = ''
      }, 150)
    },
    detailEnter() {
      clearTimeout(this._timer)
    },
    detailLeave() {
      this.kind = ''
    }
  }
}
</script>

<style lang="scss">
</style>
