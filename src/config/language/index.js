import cookie from '../../util/cookie'
import Vue from 'vue'

function resetLanguage(lang)
{
  if (lang.match(/^zh-/)) {
    lang="zh-CN";
  }
  if (lang!="zh-CN"&&lang!="en") {
    lang="en";
  }
  return lang;
}


let language= {};
let lang="";
if (cookie.getCookie("language")&&cookie.getCookie("language").length>0) {
  lang=cookie.getCookie("language");
} else {
  lang=window.navigator.language||window.navigator.browserLanguage;
  lang=resetLanguage(lang);
  cookie.setCookie("language",lang);
}
language = require("./"+lang+"/index.js");
export default{
  getLanguage(code,params){
    let tempstr=code;
    if (params&&params.length>0) {
      for (var i = 0; i < params.length; i++) {
        tempstr = tempstr.replace(new RegExp("@\{p"+i+"}","gi"),params[i]);
      }
    }
    return tempstr;
  },
  ...language.default
}
