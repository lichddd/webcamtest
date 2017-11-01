import {Message} from 'element-ui'
import language from '../config/language'

export default {
  initCam(){
    window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
    navigator.getUserMedia = ((navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ?
        function(c, os, oe) {
          navigator.mediaDevices.getUserMedia(c).then(os, oe);
        } : null) || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia;
  }
  ,
  async createCamlink(el,success,error)
  {
    return new Promise((resolve,reject)=>{

      if (navigator.getUserMedia) {
        let videoSelector = {
          video: true
        };
        navigator.getUserMedia(videoSelector, (stream) => {
          if (el.mozCaptureStream) {
            el.mozSrcObject = stream;
          } else {
            el.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
          }
          el.play();
          Message({showClose:true,message:language.error.cam_error.success,type:"success"});
          if (success) {
            success();
          }
          resolve(() => {
            let arr = stream.getTracks();
            arr.forEach(l => {
              l.stop();
            });
            window.URL.revokeObjectURL(stream);
          });
          // this.videoready=true;
          // this.sendFrameLoop();
        }, function() {
          if (error) {
            error("Error fetching video from webcam");
          }
          Message({showClose:true,message:language.error.cam_error.can_not_link_cam,type:"error"});
          console.error("Error fetching video from webcam");
          resolve(null);
        });
      } else {
        if (error) {
          error("No webcam detected.");
        }
        Message({showClose:true,message:language.error.cam_error.no_cam,type:"error"});
        console.error("No webcam detected.");
        resolve(null);
      }

    });



  }


}
