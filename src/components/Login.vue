<template>
    <div class="login_container">
      <!--中间登陆块-->
      <div class="login_box">
        <!--头像-->
        <div class="avatar_box">
          <img src="../assets/logo.png">
        </div>
        <!--登陆表单-->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
          <el-form-item label=" 用户名:" prop="name">
            <el-input v-model="loginForm.name" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item label=" 密码:" prop="password">
            <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
          </el-form-item>
          <el-form-item class="buttons">
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        name: '',
        password: ''
      },
      loginFormRules: {
        // 验证用户名是否合法
        name: [
          { required: true, message: '请输入登录名称', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('http://localhost:8080/account/login', this.loginForm)
        console.log(res)
        console.log(res.code)
        if (res.code !== 200) return this.$message.error('登录失败！用户名或密码错误')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.token)
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #ffffff;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: rgba(179, 227, 238, 0.85);
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(238, 238, 238, 0.7);
      }
    }
  }
  .login_form{
    position: absolute;
    bottom: -20px;
    width: 100%;
    padding: 0px 30px;
    box-sizing: border-box;
  }
  .buttons{
    display: flex;
    justify-content: flex-end;
  }
</style>
