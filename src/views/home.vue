
<template>
<div class="main"  v-on:mousedown="preX=$event.clientX;preY=$event.clientY;" v-on:mouseup="preX=preY=null"
v-on:mousemove="drag($event)">
  <h1>{{language.home.welcome}}</h1>
  <h6>{{language.home.welcome2}}</h6>
  <!-- <div v-html="clipstyle"></div> -->
  <div id="canvas" class="canvas">

    <div class="object3d" v-bind:style="{transform:'translate3d('+(ball.x-ball.clipwidthheight/2)+'px,'+(ball.y-ball.clipwidthheight/2)+'px,'+ball.z+'px) rotateX('+ball.rx+'deg) rotateY('+ball.ry+'deg) rotateZ('+ball.rz+'deg)'}">
      <div
      v-vue-tooltip="b.name"
      v-on:click="$playsong([Object.assign({}, b)])"
      v-on:mouseover="b.hanasu+=10;"
      v-on:mouseout="b.hanasu=0;"
      class="clip"
      v-for="(b,$index) in ball.clips"
      v-if="lines[$index]"
      style=""
      v-bind:style="{
         'background-image': `url(${b.pic}) !important`,
         'width':(ball.clipwidthheight-2)+'px',
         'height':(ball.clipwidthheight-2)+'px',
         'border-radius':((rotateYDeg($index,ball.clips.length)==90)||(rotateYDeg($index,ball.clips.length)==-90)?'100% !important':''),
         'transform':'rotateY('+rotateXDeg($index)+'deg) '+
            'rotateX('+rotateYDeg($index,ball.clips.length)+'deg) '+
            (rotateYDeg($index,ball.clips.length)>0?'rotateZ(180deg)':'')+
            ' translateZ('+(ballR+ball.hanasuR+b.hanasu*5)+'px)'+
            ' scale('+(b.hanasu/20+1)+')',
      }">

      <span class="clip_label" :class="{'labelshow':b.is}">{{'登入'}}</span>
      </div>

    </div>

  </div>

</div>
</template>
<script>
import qs from "qs"
import timermixin from '../mixin/TimerMixin'
export default {
  name: 'rank',
  mixins:[timermixin('runBall',50),timermixin('runClips',200)],
  mounted() {
    window.addEventListener("resize",this.resize);
    this.search();
    setTimeout(()=>{
      this.isball=true;
    },1000);
  },
  data() {
    return {
      searchString: "",
      msg: 'Welcome to Your Vue.js App',
      source: axios.CancelToken.source(),
      ball: {
        x: 0,
        y: 0,
        z: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        clipwidthheight: 50,
        hanasuR: 0,
        clips: []
      },
      isball:false,
      whRate:8,
      preX:null,
      preY:null,
      nowimgindex:0,
      imglist:[],
    }
  },
  methods: {
    resize()
    {
        this.ball.clipwidthheight=(this.$el.getElementsByClassName("canvas")[0].offsetWidth>this.$el.getElementsByClassName("canvas")[0].offsetHeight?this.$el.getElementsByClassName("canvas")[0].offsetHeight:this.$el.getElementsByClassName("canvas")[0].offsetWidth)/10;
    },
    rotateYDeg($index, len) {




      if ($index == 0 || $index >= (len - 1)) {
        return (Math.floor($index / (len - 1)) - 90);
      } else {


        return this.lines[$index].y;
      }

    },
    rotateXDeg($index) {

      return this.lines[$index].x;
    },

    search() {



        this.imglist=[];
        this.userlist.forEach((l)=>{
          l.imgs.forEach((ll)=>{
            this.imglist.push({name:l.name,image:ll.image});
          })
        });
        for (var i = 1; i < 5; i++) {
          this.imglist.push({name:this.language.home.user+(i),image:(i%5?`static/img/${i%5}.jpeg`:``)});
        }
        for (var i = 0; i < 210; i++) {
          this.ball.clips.push({
            hanasu:0,
            name:this.imglist[i%this.imglist.length].name,
            pic:this.imglist[i%this.imglist.length].image,
            is:false,
          });
        }
        this.$nextTick(()=>{
        this.$nextTick(()=>{


                this.ball.clipwidthheight=(this.$el.getElementsByClassName("canvas")[0].offsetWidth>this.$el.getElementsByClassName("canvas")[0].offsetHeight?this.$el.getElementsByClassName("canvas")[0].offsetHeight:this.$el.getElementsByClassName("canvas")[0].offsetWidth)/10;

        });
        });





    },
    runBall()
    {
      if ((this.preX&&this.preY)) {
        return ;
      }
      this.ball.ry-=0.5;
    }
    ,
    runClips()
    {
        let randomN=Math.floor(Math.random()*this.ball.clips.length);
        let randomL=Math.ceil(Math.random()*20);
        this.ball.clips[randomN].hanasu=randomL;
        this.ball.clips[randomN].is=true;
        setTimeout(()=>{
          this.ball.clips[randomN].hanasu=0;
          this.ball.clips[randomN].is=false;
        },5000);
    }
    ,
    changeImg()
    {
      if (this.nowimgindex>=this.imglist.length) {
        this.nowimgindex=0;
        return;
      }
      this.nowimgindex+=1;
    },
    drag($event){


              if (this.preX&&this.preY) {
                this.ball.ry+=($event.clientX-this.preX)/10;
        				this.ball.rx-=($event.clientY-this.preY)/10;
        				this.preX=$event.clientX;
        				this.preY=$event.clientY;
              }
    }
  },
  computed: {
    clipstyle: {
      get: function() {
        return this.imglist[this.nowimgindex]?`<style>
                  .clip{
                    background-image: url(${this.imglist[this.nowimgindex].image}) !important;

                  }

                </style>`:``;

      },
      set: function(newValue) {

      }
    },
    ballR: {
      get: function() {

        return Math.sqrt(this.ball.clips.length * this.ball.clipwidthheight * this.ball.clipwidthheight / 4 / Math.PI)

      },
      set: function(newValue) {

      }
    },
    lines: {
      get: function() {

        var lineCount = Math.floor(0.5 * Math.PI * this.ballR / this.ball.clipwidthheight);
        var lines = []
        var inx = 0;
        for (var i = 0; i <= lineCount; i++) {
          var count = Math.floor((2 * Math.PI * i / lineCount) * Math.floor(this.ballR / this.ball.clipwidthheight)) + Math.ceil(Math.sin(i / lineCount * Math.PI) * lineCount + 1);

          for (var j = 0; j < count; j++) {
            lines[inx] = {
              x: j * 360 / count,
              y: i / lineCount * 90 - 90
            };
            inx += 1;
          }

        }
        for (var i = 0; i <= (lineCount - 1); i++) {
          var count = Math.floor((2 * Math.PI * i / lineCount) * Math.floor(this.ballR / this.ball.clipwidthheight)) + Math.ceil(Math.sin(i / lineCount * Math.PI) * lineCount + 1);

          for (var j = 0; j < count; j++) {
            lines[inx] = {
              x: j * 360 / count,
              y: i / lineCount * 90 + 90
            };
            inx += 1;
          }

        }
        return lines;


      },
      set: function(newValue) {

      }
    }





  },
  components: {

  },
  beforeDestroy() {

    window.removeEventListener("resize",this.resize);

  },
  watch: {
    $route() {
    },





  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1
{
  margin: 0px;
  font-size: 36px;
  font-weight: 300;
}
h6
{
  margin: 0px;
  font-size: 16px;
  font-weight: 300;
}
#canvas {
  width: 100%;
  height: calc(100% - 70px);
  overflow: hidden;
  position: relative;


  transform-style: preserve-3d;
  perspective: 5000px;
  -webkit-transform-style: preserve-3d;
  -webkit-perspective: 5000px;
  -moz-transform-style: preserve-3d;
  -moz-perspective: 5000px;
  -ms-transform-style: preserve-3d;
  -ms-perspective: 5000px;
}

#canvas>* {
  transform-style: preserve-3d;
  perspective: 5000px;
  -webkit-transform-style: preserve-3d;
  -webkit-perspective: 5000px;
  -moz-transform-style: preserve-3d;
  -moz-perspective: 5000px;
  -ms-transform-style: preserve-3d;
  -ms-perspective: 5000px;
}

.object3d {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0px;
  height: 0px;
  transform-origin: center;
}
.clip {
  transform-origin: center;

  width: 18px;
  height: 18px;
  top: -10px;
  left: -10px;
  /*background: rgba(79, 192, 141, 0.5);*/
  background: rgba(225, 225, 225, 0.8);
  border: inset 1px rgba(200, 200, 200, 0.5);
  position: absolute;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  transition: transform 0.5s;
  cursor: pointer;
  background-image: url(../assets/user.png);
  display: flex;
  align-items: center;
}
.clip .clip_label
{
  font-size: 21px;
  font-weight: 900;
  user-select: none;
  opacity: 0;
  transition: opacity 0.5s;
  text-align: center;
  width: 100%;

}
.clip .clip_label.labelshow
{
  opacity: 1;
  animation: clip_label 1s infinite ease-in-out;
}
@keyframes clip_label {
  0% , 100%{
    color: #22b2ef;
  }
  50%{
    color: #ffffff;
  }
}
.main
{
  position: relative;
  width: 100%;
  height: 100%;
  margin-top: 0px;
}

@media screen and (max-width: 750px){
  .main
  {
    width: 100%;
  }
}
</style>
