<template>
<div class="login">
  <div class="leftpart">
    <video :src="videoUrl" width="400" height="300"></video>
  </div>
  <div class="rightpart">
    <img :src="imgUrl" width="400" height="300"></img>
  </div>
  <div class="bottompart">
    {{language.login.lasttime}}:{{lastDate?lastDate.Format('YYYY-MM-DD hh:mm:ss'):language.login.no_lasttime}}</br>
    {{language.login.target}}:{{this.targets.length>0?this.targets.join(','):language.login.no_target}}</br>
  </div>
  <el-button @click="cut()">测试</el-button>

</div>
</template>

<script>
import cam from '../util/cam'
import socket from '../util/socket'
import conf from '../config/conf'
export default {
  name: 'login',

  components: {},
  async mounted() {

        this.videodom = this.$el.getElementsByTagName("video")[0];
        this.ondestory=await cam.createCamlink(
          this.videodom,
        ()=>{
          this.videoready=true;
        },
        (error)=>{

        });
        this.socket=socket.createSocket(
          conf.ws_url,
          this.onmessage,
          ()=>{
            this.sentTimes = [];
            this.receivedTimes = [];
            this.tok = this.defaultTok;
            this.numNulls = 0

            this.socket.send(JSON.stringify({
              'type': 'NULL'
            }));
            this.sentTimes.push(new Date());
          },
          ()=>{}
        );
  },
  data() {
    return {
      videoUrl: "",
      videodom: null,
      videoready:false,
      msg: 'Welcome to Your Vue.js App',
      ondestory: null,
      socket: null,
      receivedTimes: [],
      sentTimes: [],
      numNulls: 0,
      defaultTok: 1,
      tok: 0,
      defaultNumNulls: 20,

      selectuser: 0,
      new_person_name: "",
      islearning:false,
      currentImgInx:-1,
      currentUserInx:-1,

      editPersonStr:"",

      isshowtsne:false,
      tsneData:null,





      imgUrl:null,
      lastDate:null,
      targets:[],


    }
  },
  methods: {
    cut() {
      var canvas = document.createElement('canvas');
      canvas.width = this.videodom.width;
      canvas.height = this.videodom.height;
      var cc = canvas.getContext('2d');
      cc.drawImage(this.videodom, 0, 0, this.videodom.width, this.videodom.height);
      var apx = cc.getImageData(0, 0, this.videodom.width, this.videodom.height);

      this.imgUrl = canvas.toDataURL('image/jpeg', 0.6);

      this.lastDate=new Date();
      this.targets=[];
      let temparr=[];
      let ii=Math.ceil(Math.random()*10);
      for (var i = 0; i < ii; i++) {
        temparr.push(i);
      }
      for (var i = 0; i < temparr.length; i++) {
        this.targets.push((this.userlist[temparr[i]]&&this.userlist[temparr[i]].name)||this.language.login.unknown);
      }

    },
    sendFrameLoop() {
        if (this.socket == null || this.socket.readyState != this.socket.OPEN ||
            !this.videoready || this.numNulls != this.defaultNumNulls) {
            return;
        }

        if (this.tok > 0) {
          var canvas = document.createElement('canvas');
          canvas.width = this.videodom.width;
          canvas.height = this.videodom.height;
          var cc = canvas.getContext('2d');
          cc.drawImage(this.videodom, 0, 0, this.videodom.width, this.videodom.height);
          var apx = cc.getImageData(0, 0, this.videodom.width, this.videodom.height);

          var dataURL = canvas.toDataURL('image/jpeg', 0.6);


            var msg = {
                'type': 'FRAME',
                'dataURL': dataURL,
                'identity': this.selectuser
            };
            if (this.socket) {
              this.socket.send(JSON.stringify(msg));
              this.tok--;
            }

        }
        setTimeout(()=>{this.sendFrameLoop()}, 100);
    },

    sendState() {
        let arr=[];
        let arr2=[];
        for (var i = 0; i < this.userlist.length; i++) {
          arr=arr.concat(this.userlist[i].imgs);
          arr2.push(this.userlist[i].name);
        }


        var msg = {
            'type': 'ALL_STATE',
            'images': arr,
            'people': arr2,
            'training': this.islearning
        };
        if (this.socket) {
          this.socket.send(JSON.stringify(msg));
        }

    }
    ,

    onmessage(e) {
        let j = JSON.parse(e.data)
        if (j.type == "NULL") {
          this.receivedTimes.push(new Date());
          this.numNulls++;
          if (this.numNulls == this.defaultNumNulls) {
            // updateRTT();
            this.sendState();
            this.sendFrameLoop();
          } else {
            this.socket.send(JSON.stringify({
              'type': 'NULL'
            }));
            this.sentTimes.push(new Date());
          }
        } else if (j.type == "PROCESSED") {
          this.tok++;
        } else if (j.type == "NEW_IMAGE") {
          // this.userlist[j.identity].imgs.push({
          //   hash: j.hash,
          //   identity: j.identity,
          //   image: this.getDataURLFromRGB(j.content),
          //   representation: j.representation
          // });
          //
          // this.userlist[j.identity].new=true;
          // this.userlist[j.identity].expend=true;
        }
        else if (j.type == "IDENTITIES") {
        //
        //   this.lastDate=new Date();
        //   this.targets=[];
        //   for (var i = 0; i < j.identities.length; i++) {
        //     this.targets.push((this.userlist[j.identities[i]]&&this.userlist[j.identities[i]].name)||this.language.login.unknown);
        //   }
        //
        }
        else if (j.type == "REC") {

          this.lastDate=new Date();
          this.targets=[];
          this.targets.push(j.personname);
          // for (var i = 0; i < j.identities.length; i++) {
          //   this.targets.push((this.userlist[j.identities[i]]&&this.userlist[j.identities[i]].name)||this.language.login.unknown);
          // }

        } else if (j.type == "ANNOTATED") {
          // $("#detectedFaces").html(
          //   "<img src='" + j['content'] + "' width='430px'></img>"
          // )
          //
          this.imgUrl=j['content'];
        } else if (j.type == "TSNE_DATA") {
          // this.tsneData=j['content'];
          // this.isshowtsne=true;
        } else {
          this.$message({
            showClose: true,
            message: this.language.error.socket_error.unknown_message_type + j.type,
            type: "error"
          });
        }

    }
  },
  beforeDestroy() {
    if (this.ondestory) {
      this.ondestory();
    }
    if (this.socket) {
      this.socket.close();
      this.socket.closebyme=true;
      this.socket=null;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login
{
  height: 100%
}
.leftpart {
  width: 410px;
  display: inline-block;
  vertical-align: top;


  padding: 5px;
  border: 1px solid #d1dbe5;
  border-radius:4px;
  background-color:#ffffff;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12),0 0 6px 0 rgba(0,0,0,0.04);
}

.rightpart {
  width: 410px;
  display: inline-block;
  vertical-align: top;


    padding: 5px;
    border: 1px solid #d1dbe5;
    border-radius:4px;
    background-color:#ffffff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12),0 0 6px 0 rgba(0,0,0,0.04);

}
.bottompart {
  margin-top: 10px;
  text-align: left;
  width: 665px;
  display: inline-block;
  /*vertical-align: top;*/


    padding: 5px;
    border: 1px solid #d1dbe5;
    border-radius:4px;
    background-color:#ffffff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12),0 0 6px 0 rgba(0,0,0,0.04);

}

video {

  transform: scaleX(-1);
}
</style>
