<template>
  <div class="app flex-row align-items-center ">
    <div class="wrap">
      <div  :class="loginBg">
        <div class="login-layer">
          <div class="logo_box">
            <div class="login_form">
                <h3 class="title login-title"><img src="../../assets/images/login-logo.png"></h3>
                <div class="topBorder"></div>
                <el-form class="login" :rules="rules" :model="users" ref="form">
                      <el-form-item prop="username">
                          <el-input :autofocus="true" tabindex="1" size="medium" type="text" auto-complete="off" placeholder="请输入用户名" v-model="users.username" @keyup.enter.native="loginSystem">
                              <template slot="prepend"><i style="width:18px;" class="fa fa-user fa-lg"></i></template>
                          </el-input>
                      </el-form-item>
                      <el-form-item prop="password">
                          <el-input tabindex="2" size="medium" type="password"  placeholder="请输入密码" v-model="users.password"  @keyup.enter.native="loginSystem">
                              <template slot="prepend"><i class="fa fa-key fa-lg"></i></template>
                          </el-input>
                      </el-form-item>
                      <el-form-item label="验证">
                        <drag-verify 
                           :width="width" 
                           :height="height" 
                           :text="text" 
                           :success-text="successText" 
                           :background="background" 
                           :progress-bar-bg="progressBarBg" 
                           :completed-bg="completedBg" 
                           :handler-bg="handlerBg" 
                           :handler-icon="handlerIcon" 
                           :text-size="textSize" 
                           :success-icon="successIcon"
                           ref="Verify"
                        >
                        </drag-verify>
                      </el-form-item>
                      <el-form-item style="margin-top:30px">
                          <el-button style="width:100%" size="medium" type="primary" @click.native.prevent="loginSystem" :loading="loading" class="sub-btn">登录</el-button>
                      </el-form-item>
                  </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rt-footer">
      <div>助力实体商业打造数字化经营平台</div>
      <div class="company">北京智慧图科技有限责任公司</div>
    </div> 
  </div>
  </div>
</template>

<script>
import dragVerify from 'vue-drag-verify'
import {loginOn} from '@/api/login/login-api'

//错误验证码
  const ERROR_CODE='000000';
export default {
    name: 'app',
    components:{
      dragVerify
    },
    data() {
        return {
            handlerIcon: "fa fa-angle-double-right",
            successIcon: "fa fa-check",
            background: "#efefef",
            progressBarBg: "#4b0",
            completedBg: "#66cc66",
            handlerBg: "#fff",
            text: "请将滑块拖动到右侧",
            successText: "验证成功",
            width: 320,
            height: 36,
            textSize: "14px",
            isCircle:'false',
            loginBg:'loginbg',
            loading: false,
            key:'',
            checked: true,
            users: {
                username: '',
                password: ''
            },
            rules: {
                username: [{
                    required: true,
                    message: '用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '密码',
                    trigger: 'blur'
                }]
            }
        }
    },
    created: function() {

    },
    mounted: function() {
        this.loginBg = 'loginbg';
    },
    methods: {
        // 登录系统
        loginSystem: function() {
            this.loading = true;
            var that = this;
            // console.log(this.$refs.Verify.isMoving)
            // console.log(this.$refs.Verify.isPassing)
            // console.log(this.$refs.Verify.handlerIconClass)
            this.$refs.form.validate((valid) =>{
                if (valid) {
                    this.loading = true;
                    var formData = new FormData();
                    formData.append('loginName', this.users.username);
                    formData.append('pwd', this.users.password);
                    loginOn(formData,(data)=>{
                        if (data.status == ERROR_CODE) {
                            sessionStorage.setItem('userName', that.users.username);
                            sessionStorage.setItem('token', data.data.token);
                            var buildGroup = [];
                            var access = [];
                            buildGroup = data.data.group;
                            access = data.data.access;
                            sessionStorage.setItem('buildGroup', JSON.stringify(buildGroup));
                            sessionStorage.setItem('access', JSON.stringify(access));
                            if(that.$refs.Verify.isPassing == true){
                                that.$router.push({ path: "/home" });
                                that.loading = false;
                            }
                            else{
                                that.$message.error({
                                    showClose: true,
                                    message:'请验证',
                                    duration: 2000
                                });
                                that.loading = false;
                            }
                            
                        } else {
                            that.$message.error({
                                showClose: true,
                                message:'用户名或密码错误',
                                duration: 2000
                            });
                            that.loading = false;
                        }
                    },
                    function(err) {
                        that.loading = false;
                        that.$message.error({
                            showClose: true,
                            message: err.toString(),
                            duration: 2000
                        });
                    }).
                    catch(function(error) {
                        console.log(error);
                        that.loading = false;
                        that.$message.error({
                            showClose: true,
                            message: '请求出现异常',
                            duration: 2000
                        });
                    }
                    );
                }else{
                     this.loading = false;
                }
            });
        }
    }
}
</script>
<style>
.wrap {
    width: 100%;
}
.login-layer {
    height: 100%;
    width:100%;
}
.logo_box {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
.logo_box {
    display: -webkit-box;
    display: flex;
    width: 450px;
    height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    border-radius: 10px;
    overflow: hidden;
}
.login_form {
    padding: 10px 40px;
    width: 450px;
    height: 90%;
    background-color: transparent;
    color:#B1B4BF;
}
.login_form .login-title {
    margin-bottom: 20px;
    width: 100%;
    text-align: center;
    font-size: 20px;
}
.login-title img{
  width: 300px;
}
.topBorder{
  height: 6px;
  /*background: linear-gradient(to right, #2573fb, #5d24d3);*/
  background: linear-gradient(to right, #8d4de8, #f9256d);
}
.login_form .login{
  padding: 20px 30px;
  border:1px solid #fff;
  box-shadow:0px 0px 1px 1px rgba(53,53,53,0.4);
  border-radius:4px;
}
.login .el-input__inner, .login .el-input-group__prepend{
    background:rgba(255,255,255,1);
    opacity:0.8;
    border-radius:0px;
    border:none;
    border-bottom: 1px solid #ddd;
    /*box-shadow:8px 6px 20px rgba(110,135,242,0.06);*/
}
.login .el-input__inner{
    /*border-top-right-radius:6px;
    border-bottom-right-radius:6px;*/
}
.login .el-input-group__prepend{
    padding: 0px 0px 0px 15px;
    /*border-top-left-radius:6px;
    border-bottom-left-radius:6px;*/
}
.login .el-input__inner:hover{
    border-color: #ddd;
}
.login .el-form-item.is-error .el-input__inner, .login .el-form-item.is-error .el-input__inner:focus, .login .el-message-box__input input.invalid, .login .el-message-box__input input.invalid:focus {
    border-color: #ddd;
    color:rgba(102,102,102,1);
}
.login .el-form-item.is-success .el-input__inner, .login .el-form-item.is-success .el-input__inner:focus, .login .el-form-item.is-success .el-textarea__inner, .login .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #ddd;
}
.login .el-input__inner::-webkit-input-placeholder{
    color:rgba(102,102,102,1);
}
.login .el-input__inner::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:rgba(102,102,102,1);
}
.login .el-input__inner:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:rgba(102,102,102,1);
}
.login .el-input__inner:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
    color:rgba(102,102,102,1);
}
.login .el-button--primary{
    width:100%;
    background: linear-gradient(to right, #ff8564, #fe6d9d);
    border:none;
}

.rt-footer {
    width: 100%;
    position: fixed;
    bottom: 30px;
    left: 0;
    right: 0;
    color: #BCB8FF;
    line-height: 25px;
    height: 55px;
    text-align: center;
    z-index: 9999;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;  
    font-size: 18px; 
}
.rt-footer a {color:#BCB8FF;}
.rt-footer a:hover {color:#BCB8FF;}
.company{
  font-size: 14px;
}
.drag_verify .dv_text{
  color:#fff!important;
}
.drag_verify .dv_handler{
  border: 1px solid #efefef!important;
}
.drag_verify .dv_handler i{
  color: #66cc66!important;
}
</style>
