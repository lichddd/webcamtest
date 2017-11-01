<template>
  <div id="app" @click="stylenum++">
  <!-- <link rel="stylesheet" :href="`static/index${stylenum}.css`" /> -->
  <div class="left-continer">

    <menupart></menupart>

  </div>

  <div class="main-continer"  v-on:scroll="onScroll($event)">
    <router-view></router-view>
  </div>

</div>
</template>

<script>
import menupart from '@/views/menu'
export default {
  name: 'app',
  components: {
    menupart
  },
  data(){
    return {

      stylenum:1,

    }
  }
}
</script>

<style>



#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  position: absolute;
  /*min-width: 1000px;*/
  font-size: 16px;
}

.main-continer {
  left: 100px;
  height: 100%;
  width: calc(100% - 100px);
  position: absolute;
  overflow: auto;
  background-color: #ffffff;
  padding: 10px;

}



.left-continer {
  background-color: #f1f1f1;
  position: absolute;
  left: 0px;
  height: 100%;
  width: 100px;
  /*width: 0px;*/
  border-right: solid 1px #dcdcdc;
}



.tab-title-badge
{

}
.tab-title-badge .el-badge__content
{
      top: 10px;
}
.el-tabs-margin-right .el-tabs__header
{
  margin-right: 40px;
}
</style>
