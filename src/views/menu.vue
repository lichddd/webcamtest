<template>
    <el-menu @select="(index,indexPath)=>{index='';}" :default-active="defaultactive" class="menu" theme="light" :unique-opened="true">
      <template v-for="li in menu">
        <template v-if="li.children">
          <el-submenu :index="li.code">
            <template slot="title">
              {{li.title}}
            </template>
            <template v-for="cc in li.children">
              <el-menu-item :index="cc.target||cc.code" @click="cc.target?go(cc.target):''">{{cc.title}}</el-menu-item>

            </template>


          </el-submenu>

        </template>
        <template v-if="!li.children">

              <el-menu-item :index="li.target||li.code" @click="li.target?go(li.target):''">{{li.title}}</el-menu-item>

        </template>


      </template>

    </el-menu>
</template>

<script>
import menu from '@/config/menu'
export default {
  name: 'menu',
  data () {
    return {
      menu:menu,
      defaultactive:null,
    }
  },
  mounted(){
    this.defaultactive = this.$route.matched[0].name;
  },
  methods:{
    go(target)
    {

      this.$router.push({name:target});
    }

  },
  watch:{
    $route(){


        this.defaultactive = this.$route.matched[0].name;



    }


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .menu
  {
    text-align: left;
    height: 100%
  }
</style>
