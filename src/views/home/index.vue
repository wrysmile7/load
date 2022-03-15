<!-- home -->
<template>
  <div class="home">
    <HeaderComponent />
    <!-- home -->
    <div class="content scroll-none">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '../header/index'

export default {
  name: 'home',
  components: {
    HeaderComponent
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: url('../../assets/images/bg.jpg') no-repeat;
  .content {
    width: calc(100% - 160px);
    height: calc(100% - 150px);
    overflow-y: auto;
    margin: 0 auto;
  }
}
</style>
