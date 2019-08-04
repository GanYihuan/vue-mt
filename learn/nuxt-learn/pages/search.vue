<template>
  <section class="container">Page is search
    <ul>
      <li v-for="(item, idx) in $store.state.navbar.app" :key="idx">{{item}}</li>
    </ul>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'search',
  data() {
    return {
      list: []
    }
  },
  /*
  asyncData: nuxt life circle, ssr
  1.The server sends the compiled content to you.,
  2.Asynchronously acquired data is also given to the browser
  fetch() => vuex
  asyncData() => data
  */
  async asyncData() {
    let { status, data: { list } } = await axios.get('http://127.0.0.1:3000/city/list')
    if (status === 200) {
      return {
        list
      }
    }
  }
}
</script>
