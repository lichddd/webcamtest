<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="100px">
      <el-form-item :label="language.syslogin.user" prop="user">
        <el-input v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item :label="language.syslogin.password" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="large" @click="$refs.form.resetFields()" :disabled="!(form.user||form.password)">{{language.syslogin.reset}}</el-button>
        <el-button size="large" type="primary" @click="login()">{{language.syslogin.login}}</el-button>



      </el-form-item>


    </el-form>


  </div>


</template>

<script>
import language from '../config/language'
import cookie from '@/util/cookie'
import crypto from 'crypto'
export default {
  name: 'login',
  components:{},
  mounted(){



  },
  data () {
    return {
      form:{
        user:"",
        password:"",
      }
      ,
      rules:{
        password:[
          { required: true, message: language.syslogin.passwordhint, trigger: 'blur' },
          {min:8,max:16,message:language.syslogin.user_length_warn,trigger:'blur'}
        ],
        user:[
          { required: true, message: language.syslogin.userhint, trigger: 'blur' },
          {min:8,max:16,message:language.syslogin.password_length_warn,trigger:'blur'}
        ],
      }
    }
  }
  ,
  methods:{
    login(){
      this.$refs.form.validate((valid)=>{

        if (valid) {
          // axios.post(`login`,{user:this.form.user,password:crypto.createHash('md5').update(this.form.password).digest('hex')}).then(m => {
          //
          //   this.$router.replace({path:(this.$route.query.redirect||"/")});
          //
          // });
          //

          if (this.form.user=="hikdataadmin"&&crypto.createHash('md5').update(this.form.password).digest('hex')==crypto.createHash('md5').update("123456789").digest('hex')) {
            cookie.setCookieOnlySession("token","1234");
            this.$router.replace({path:(this.$route.query.redirect||"/")});
          } else {
            this.$message({
              showClose: true,
              message: this.language.syslogin.login_error,
              type: "error"
            });
          }

        }


      });

    }
  },
  beforeDestroy(){
  }
  ,
  watch:{
    $route(){
      this.$refs.form.resetFields();

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form{
  width: 400px;
  margin:12% auto;
}

</style>
