<template>
<div class="signin">
  <div class="leftpart">
    <video :src="videoUrl" width="400" height="300"></video>




    <el-form  label-width="100px" style="margin-top:10px;">
      <el-form-item :label="language.signin_ipcam.add_user">
        <el-input style="" :placeholder="language.signin_ipcam.please_input_new_name" @keydown.native.enter="addPerson()" icon="plus" v-model="new_person_name" :on-icon-click="addPerson">
        </el-input>
      </el-form-item>
      <el-form-item :label="language.signin.now_select_user">
        <el-select v-model="selectuser" filterable :placeholder="language.signin.please_select">
          <el-option v-for="(item,index) in userlist" :key="index" :label="item.name" :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="language.signin.learning">
        <el-switch v-model="islearning"  v-vue-tooltip="islearning?language.signin.close:language.signin.open" @change="changeLearning" on-text="" off-text="">
        </el-switch>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="showTSNE()">{{language.signin.chart}}</el-button>
        <el-button @click="cut()">测试</el-button>
      </el-form-item>
    </el-form>



  </div>
  <div class="imglist">
    <div v-if="u.new" class="imglist-user" v-for="(u,index) in userlist">
      <h6>{{u.name}}  ({{u.imgs.length}})<i v-vue-tooltip="u.expend?language.signin.collapse:language.signin.expend" @click="u.expend=!u.expend" class="expendicon el-icon-arrow-down" :class="{'el-icon-arrow-up':u.expend}"></i></h6>
      <div class="imgs"  v-show="u.expend">
        <div v-for="(m,idx) in u.imgs" class="img">
          <img :src="m.image" />
          <el-popover width="250" class="setting" v-vue-tooltip="language.signin.changepic">
            <div>
              <el-select v-model="editPersonStr" :placeholder="language.signin.please_select_user">
                <el-option v-if="iii!=index" v-for="(item,iii) in userlist" :key="iii" :label="item.name" :value="iii">
                </el-option>
              </el-select>
              <el-button type="text" icon="check" style="padding:0px;    margin-left: 5px;" size="large" @click="changePerson(editPersonStr);"></el-button>
            </div>
            <span slot="reference">
              <el-button type="text" icon="setting" style="padding:0px;" size="large" @click="currentImgInx=idx,currentUserInx=index,editPersonStr=''"></el-button>
            </span>
          </el-popover>
          <el-button v-vue-tooltip="language.signin.delete" type="text" icon="delete" class="delete" size="large" @click="removeImage(u.imgs,idx)"></el-button>
        </div>
      </div>
    </div>
    <div v-if="!u.new" class="imglist-user" v-for="(u,index) in userlist">
      <h6>{{u.name}}  ({{u.imgs.length}})<i v-vue-tooltip="u.expend?language.signin.collapse:language.signin.expend" @click="u.expend=!u.expend" class="expendicon el-icon-arrow-down" :class="{'el-icon-arrow-up':u.expend}"></i></h6>
      <div class="imgs"  v-show="u.expend">
        <div v-for="(m,idx) in u.imgs" class="img">
          <img :src="m.image" />
          <el-popover width="250" class="setting"  v-vue-tooltip="language.signin.changepic">
            <div>
              <el-select v-model="editPersonStr" filterable :placeholder="language.signin.please_select_user">
                <el-option v-if="iii!=index" v-for="(item,iii) in userlist" :key="iii" :label="item.name" :value="iii">
                </el-option>
              </el-select>
              <el-button type="text" icon="check" style="padding:0px;    margin-left: 5px;" size="large" @click="changePerson(editPersonStr);"></el-button>
            </div>
            <span slot="reference">
              <el-button type="text" icon="setting" style="padding:0px;" size="large" @click="currentImgInx=idx,currentUserInx=index,editPersonStr=''"></el-button>
            </span>
          </el-popover>
          <el-button  v-vue-tooltip="language.signin.delete" type="text" icon="delete" class="delete" size="large" @click="removeImage(u.imgs,idx)"></el-button>
        </div>
      </div>
    </div>
  </div>



  <el-dialog title="" :visible.sync="isshowtsne">
    <img :src="tsneData" style="width:100%"></img>
  </el-dialog>
</div>
</template>

<script>
import cam from '../util/cam'
import socket from '../util/socket'
import conf from '../config/conf'
export default {
  name: 'hello',

  components: {},
  async mounted() {

    this.videodom = this.$el.getElementsByTagName("video")[0];
    this.ondestory=await cam.createCamlink(
      this.videodom,
    ()=>{
      this.videoready=true;this.sendFrameLoop();
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
    // this.createSocket("wss:" + window.location.hostname + ":9000", "Local");
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

      var dataURL = canvas.toDataURL('image/jpeg', 0.6);


      this.userlist.forEach((l) => {
        l.new = false;
      });
      this.userlist[this.selectuser].imgs.push({

        hash: '',
        identity: this.selectuser,
        // image: getDataURLFromRGB(j.content),
        image: dataURL,
        representation: ''

      });
      this.userlist[this.selectuser].new = true;
      this.userlist[this.selectuser].expend = true;
    },
    sendFrameLoop() {
        if (this.socket == null || this.socket.readyState != this.socket.OPEN ||
            !this.videoready || this.numNulls != this.defaultNumNulls) {
            return;
        }
        // if (this.islearning) {
        if (this.islearning&&this.tok > 0) {
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
    addPerson() {
      if (!this.new_person_name) {
        return;
      }
      for (var i = 0; i < this.userlist.length; i++) {
        if (this.userlist[i].name == this.new_person_name) {

          this.$message({
            showClose: true,
            message: this.language.signin.user_exist,
            type: "error"
          });
          return;
        }
      }
      this.userlist.forEach((l) => {
        l.new = false;
      });
      this.userlist.push({
        name: this.new_person_name,
        imgs: [],
        expend:true,
        new: true
      });
      this.selectuser = this.userlist.length - 1;

      if (this.socket != null) {
        var msg = {
          'type': 'ADD_PERSON',
          'val': this.new_person_name
        };
        this.socket.send(JSON.stringify(msg));

      }
      this.new_person_name = "";
    },
    changePerson(inx){
      document.getElementsByTagName('body')[0].click();
      if (!(inx>=0)||inx==="") {
        return ;
      }

      if (this.currentUserInx>=0&&this.currentImgInx>=0) {

        this.userlist[this.currentUserInx].imgs[this.currentImgInx].identity=inx;
        let msg = {
            'type': 'UPDATE_IDENTITY',
            'hash': this.userlist[this.currentUserInx].imgs[this.currentImgInx].hash,
            'idx': inx
        };
        this.userlist[inx].imgs.push(this.userlist[this.currentUserInx].imgs[this.currentImgInx]);
        this.userlist[this.currentUserInx].imgs.splice(this.currentImgInx, 1);
        this.currentUserInx=-1;
        this.currentImgInx=-1;
        if (this.socket) {

          this.socket.send(JSON.stringify(msg));
        }


      }



    },
    removeImage(imglist,inx) {

        if (inx >= 0&&imglist[inx]) {
            let msg = {
                'type': 'REMOVE_IMAGE',
                'hash': imglist[inx].hash
            };
            imglist.splice(inx, 1);
            if (this.socket) {
              this.socket.send(JSON.stringify(msg));
            }

        }
    },
    getDataURLFromRGB(rgb) {
        let rgbLen = rgb.length;

        let canvas = document.createElement('canvas');
        canvas.width = 96;
        canvas.height = 96;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(96, 96);
        let data=imageData.data;
        let dLen = data.length;
        let i = 0, t = 0;

        for (; i < dLen; i +=4) {
            data[i] = rgb[t+2];
            data[i+1] = rgb[t+1];
            data[i+2] = rgb[t];
            data[i+3] = 255;
            t += 3;
        }
        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL("image/png");
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
    changeLearning() {
        if(!this.islearning)
        {
          if(this.userlist.length>3)
          {
            this.userlist.splice(0,this.userlist.length);
            this.userlist.push({
              name: "Unknown",
              imgs: [],
              expend:true,
              new: true
            });
            this.selectuser=0;
          }
        }
        if (this.socket != null) {
            var msg = {
                'type': 'TRAINING',
                'val': this.islearning,
                'name':this.userlist[this.selectuser].name,
            };
            this.socket.send(JSON.stringify(msg));
        }
    }
    ,
    showTSNE() {
        if (this.socket != null) {
            let arr=[];
            for (var i = 0; i < this.userlist.length; i++) {
              arr.push(this.userlist[i].name);
            }
            var msg = {
                'type': 'REQ_TSNE',
                'people':arr
            };
            this.socket.send(JSON.stringify(msg));
        }

    }
    ,
    onmessage(e){



        console.log(e);
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
          this.userlist[j.identity].imgs.push({
            hash: j.hash,
            identity: j.identity,
            image: this.getDataURLFromRGB(j.content),
            representation: j.representation
          });

          this.userlist[j.identity].new=true;
          this.userlist[j.identity].expend=true;
        } else if (j.type == "IDENTITIES") {
          // var h = "Last updated: " + (new Date()).toTimeString();
          // h += "<ul>";
          // var len = j.identities.length
          // if (len > 0) {
          //   for (var i = 0; i < len; i++) {
          //     var identity = "Unknown";
          //     var idIdx = j.identities[i];
          //     if (idIdx != -1) {
          //       identity = people[idIdx];
          //     }
          //     h += "<li>" + identity + "</li>";
          //   }
          // } else {
          //   h += "<li>Nobody detected.</li>";
          // }
          // h += "</ul>"
          // $("#peopleInVideo").html(h);
        } else if (j.type == "ANNOTATED") {
          // $("#detectedFaces").html(
          //   "<img src='" + j['content'] + "' width='430px'></img>"
          // )
        } else if (j.type == "TSNE_DATA") {
          this.tsneData=j['content'];
          this.isshowtsne=true;
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
.signin
{
  height: 100%
}
.leftpart {
  text-align: left;
  width: 410px;
  display: inline-block;
  vertical-align: top;


  padding: 5px;
  border: 1px solid #d1dbe5;
  border-radius:4px;
  background-color:#ffffff;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12),0 0 6px 0 rgba(0,0,0,0.04);
}

.imglist {
  width: 600px;
  display: inline-block;
  vertical-align: top;
  text-align: left;
  height: 100%;
  overflow: scroll;
  /*padding: 2px;*/

}
.imglist .imglist-user
{
  border: 1px solid #d1dbe5;
  border-radius:4px;
  background-color:#ffffff;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.12),0 0 6px 0 rgba(0,0,0,0.04);
  margin-bottom: 5px;
}
.imglist h6 {
  margin:5px 5px 0px 5px ;
  font-weight: 400;
border-bottom: solid 1px #d1dbe5;
}
.imglist h6 .expendicon{
  margin:0px 5px 0px 5px ;
  cursor: pointer;
}

.imgs .img {
  width: 96px;
  height: 96px;
  margin: 5px;
  display: inline-block;
  position: relative;
}
.imgs .img .setting{
  position: absolute;
  top: 0px;
  right: 20px;
  padding: 0px;
  display: none;
}
.imgs .img:hover .setting{

  display: block;
}
.imgs .img .delete{
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 0px;
  display: none;
}
.imgs .img:hover .delete{

  display: block;
}
.imgs img {
  width: 100%;
  height: 100%;
}

video {

  transform: scaleX(-1);
}
</style>
