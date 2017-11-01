// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import {Message} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'
import cookie from '@/util/cookie'
import filter from './filter'
import directive from './directive'
import vue$methods from './vue$methods'
import plugin from './plugin'
import cam from './util/cam'

import language from '@/config/language'

if(process.env.NODE_ENV=="development")
{

}



window.axios=axios;

axios.interceptors.request.use((config)=>{
  progress.progressing.push({});
  return config;
},(error)=>{
  progress.progressing.shift();
  if (error.toString()!="Cancel") {
    Message({showClose:true,message:language.error.ajax_error.net,type:"error"});

  }
  return Promise.reject(error);
});
axios.interceptors.response.use((response)=>{
  progress.progressing.shift({});
  if (response.status!=200) {
    Message({showClose:true,message:language.error.ajax_error.server,type:"error"});
    return Promise.reject(response.statusText);
  }
  else if (!(response.data&&response.data.code!=null)) {
    Message({showClose:true,message:language.error.ajax_error.server,type:"error"});
    return Promise.reject(response.data);
  }
  else if (response.data.code!=0) {
    Message({showClose:true,message:response.data.desc,type:"error"});
    if (response.data.code==9999) {
      cookie.delCookie("token");
      router.replace({
        name:"login",
        query:{
          redirect:router.currentRoute.path
        }


      });
    }

    return Promise.reject(response.data);
  }
  return response;
},(error)=>{
  progress.progressing.shift();
  if (error.toString()!="Cancel") {
    let response=error.response;
    if (response.status!=200) {
      Message({showClose:true,message:language.error.ajax_error.server,type:"error"});
      return Promise.reject(response.statusText);
    }
    else if (!(response.data&&response.data.code!=null)) {
      Message({showClose:true,message:language.error.ajax_error.server,type:"error"});
      return Promise.reject(response.data);
    }
    else if (response.data.code!=0) {
      Message({showClose:true,message:response.data.desc,type:"error"});
      return Promise.reject(response.data);
    }
    Message({showClose:true,message:language.error.ajax_error.net,type:"error"});

  }
  return Promise.reject(error);
});


let progress={
  progressing:[],
};
let eventer={
  emit:null,
  on:null,
  off:null,
  _events:Object.create(null),
  _hasHookEvent:false
};
let userlist=[{
  name: "默认用户",
  imgs: [],
  expend:true,
  new: true
}];
Vue.mixin({
  data(){
    return {'userlist':userlist,'progress':progress,'eventer':eventer,'language':language};
  }
});
Vue.config.productionTip = false;
Vue.use(ElementUI, {locale:language.local});

try {
document.getElementsByTagName("title")[0].text=language.common.title;
} catch (e) {

} finally {

}


Vue.use(filter);
Vue.use(directive);
Vue.use(vue$methods);
/* eslint-disable no-new */
let vm=new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
eventer.emit=vm.$emit;
eventer.on=vm.$on;
eventer.off=vm.$off;


cam.initCam();
