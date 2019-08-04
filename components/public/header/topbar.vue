<template>
  <!-- gutter: Grid spacing -->
  <el-row
    :gutter="0"
    class="m-header"
  >
    <!-- span: The number of columns occupied by the grid (all 24) -->
    <el-col :span="5">
      <geo/>
    </el-col>
    <el-col :span="5">
      <user/>
    </el-col>
    <el-col :span="14">
      <navbar/>
    </el-col>
  </el-row>
</template>

<script>
import Geo from './geo'
import User from './user'
import Navbar from './nav'

export default {
  components: {
    Geo,
    User,
    Navbar
  }
}
</script>

<style lang="scss">
@import '@/assets/css/public/layout.scss';
@import '@/assets/css/public/header/index.scss';
</style>
