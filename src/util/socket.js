import {Message} from 'element-ui'
import language from '../config/language'

export default {
  createSocket(address,onmessage,success,error)
  {
    let socket = new WebSocket(address);
    socket.binaryType = "arraybuffer";


    socket.onopen = () => {
      Message({
        showClose: true,
        message: language.error.socket_error.success,
        type: "success"
      });
      if (success) {
        success();
      }
    }
    socket.onmessage = (e) => {
      if (onmessage) {
        onmessage(e);
      }
    };
    socket.onerror = (e) => {
      Message({
        showClose: true,
        message:language.error.socket_error.error,
        type: "error"
      });
      if (error) {
        error();
      }
    };
    socket.onclose = (e) => {
      if (e.target == socket && !socket.closebyme) {
        Message({
          showClose: true,
          message: language.error.socket_error.close,
          type: "error"
        });
        socket=null;
      }
    };

    return socket;
  }


}
