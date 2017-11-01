let disksize={};
disksize.install= function(Vue){
  Vue.prototype.$disksize=(value)=>{
    var sizearr=["B","KB","MB","GB","TB","LB"]
    value=Number(value);
    function getSize(value,level=0)
    {
      if (value>=1024&&level<=5) {
        return getSize(value/1024,level+1);
      } else {
        return value.toFixed(2)+sizearr[level];
      }
      return "";
    }
    return getSize(value);


  };

}

export default disksize
