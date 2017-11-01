export default function TimerMixin(functionName,perMS){
  functionName=functionName||"timerFunc";
  let timerName=`timerFunc${functionName}${(new Date()).getTime()}`;
  return {
    data(){
      let obj={};
      obj[timerName]=null;
      return obj;
    },
    mounted(){
      this.$nextTick(()=>{
        let ms=perMS||1000;
        this[timerName]=setInterval(()=>{
          if (this[functionName]) {
              this[functionName]();
          }
        },ms);
      });
    },
    beforeDestroy(){
      clearInterval(this[timerName]);
    }
  }
}
