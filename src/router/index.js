import Vue from 'vue'
import Router from 'vue-router'
import syslogin from '@/views/syslogin'
import home from '@/views/home'
import signin from '@/views/signin'
import login from '@/views/login'
import setting from '@/views/setting'
import {Message} from 'element-ui'
import cookie from '@/util/cookie'
import language from '../config/language'
Vue.use(Router)
let router = new Router({
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/syslogin',
      name: 'syslogin',
      component: syslogin
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/signin',
      name: 'signin',
      component: signin
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/setting',
      name: 'setting',
      component: setting
    },
  ]
})
router.beforeEach((to,from,next)=>{
  if (to.name=="signin") {
    if (cookie.getCookie("token")) {
      next();
    } else {
      if (from&&from.fullPath && from.fullPath!="/") {
        Message({showClose:true,message:language.syslogin.no_login,type:"warning"});
      }
      next({
        name:"syslogin",
        query:{
          redirect:to.fullPath
        }


      });
    }




  } else {
    next();
  }




})



export default router;
