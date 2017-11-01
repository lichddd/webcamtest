<template>
<div class="login">
  <el-form class="form" label-width="100px">
    <el-form-item :label="language.setting.language" prop="user">
      <el-select v-model="selectLanguage">
        <el-option v-for="item in language.setting.languagelist" :key="item.value" :value="item.value" :label="item.label">
        </el-option>


      </el-select>
    </el-form-item>

  </el-form>

</div>
</template>

<script>
import cookie from '@/util/cookie'
import crypto from 'crypto'
export default {
  name: 'login',
  components: {},
  mounted() {



  },
  data() {
    return {
      selectLanguage: cookie.getCookie('language'),
    }
  },
  methods: {
  },
  beforeDestroy() {},
  watch: {
    selectLanguage() {
      cookie.setCookie('language', this.selectLanguage);
      window.location.reload();


    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form {
  width: 400px;
  margin: 12% auto;
}

.el-select {

  width: 100%;
}
</style>
