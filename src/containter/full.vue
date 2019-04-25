<template>
 <div class="bgk-cls">
    <el-container>
      <el-header>
          <img src="../assets/images/home-logo.png" class="header-img"/>
          <div class="header-nav">
              <el-menu :default-active="activeIndexTop" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                  <router-link :to="{name:'home'}" v-show="homeMenu">
                    <el-menu-item index="home" >数据中心</el-menu-item>
                  </router-link>
                  <!-- <router-link :to="{name:'member'}" v-show="memberMenu">
                    <el-menu-item index="member">会员信息</el-menu-item>
                  </router-link> 
                  <router-link :to="{name:'camera'}" v-show="cameraMenu">
                    <el-menu-item index="camera">摄像机管理</el-menu-item>
                  </router-link>  -->
                  <router-link to="/customer/MemberManage" v-show="customerMenu">
                    <el-menu-item index="customer">顾客信息</el-menu-item>
                  </router-link> 
                  <router-link to="/manage/AreaManage/" v-show="manageMenu">
                    <el-menu-item index="manage">平台管理</el-menu-item>
                  </router-link> 
              </el-menu>
              <div class="user-message">
                <span class="user-name">您好,{{userName}}</span>
                <span class="login-off" @click="loginOff">退出</span>
              </div>
              <!-- <img src="../assets/images/center-icon.png" class="header-icon"/> -->
          </div>
      </el-header>
      <el-main>
          <router-view/>
      </el-main>
    </el-container>
    </div>
</template>

<script>
  import {loginOff} from '@/api/login/login-api'
  import '../public/lib/m2';
  import '../api';
  import '../public/util'; 
  import Bus from '../bus.js';
  const ERROR_CODE='000000';
  export default {
    name: 'App',
    data() {
      return {
        activeIndexTop: 'home',
        userName:sessionStorage.getItem('userName'),
        homeMenu:false,
        memberMenu:false,
        cameraMenu:false,
        customerMenu:true,
        manageMenu:true,
        accessArry:[]
      };
    },
    watch: {
          // 如果路由有变化，会再次执行该方法
          "$route": 'routerChange'
    },
    created(){
      var that = this;
      that.accessArry = JSON.parse(sessionStorage.getItem('access'));
      that.accessArry.forEach(function(val){
        if(val == "access:datacenter:view"){
          that.homeMenu = true;
        }
        else if(val == "access:member:view"){
          that.memberMenu = true;
        }
        else if(val == "access:camera:view"){
          that.cameraMenu = true;
        }
      });
    },
    mounted:function(){
      var that = this;
      if(sessionStorage.getItem('menuType')){ 
        that.activeIndexTop = sessionStorage.getItem('menuType');
      }else{
        that.activeIndexTop = "home";
      }
      Bus.$off('menuColorEvent');
      Bus.$on('menuColorEvent', function(val){
          if(val == "1"){
             sessionStorage.setItem('menuType','home');
             that.activeIndexTop = "home";
          }else if(val == "2"){
             that.activeIndexTop = "customer";
          }
          else if(val == "3"){
             that.activeIndexTop = "manage";
          }
      });
    },
    methods: {
      handleSelect(key, keyPath) {
        this.activeIndexTop = key;
        sessionStorage.setItem('menuType',key);
      },
      routerChange(router){
        var that = this;
        that.activeIndexTop=router.name;
      },
      loginOff(){
        var that = this;
        var params = {
          'loginName' : that.userName
        }
        loginOff(params,(data)=>{
          console.log(data)
            if (data.status == ERROR_CODE) {
                sessionStorage.removeItem('userName');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('buildGroup');
                sessionStorage.removeItem('access');
                sessionStorage.removeItem('groupId');
                that.$router.push({ path: "/login" });
            } else {
                that.$message.error({
                    showClose: true,
                    message:data.message || '注销失败',
                    duration: 2000
                });
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
      }
    },
    computed: {
        defaultActive() {
            return '/' + this.$route.path.split('/').reverse()[0];
        }
    }

  }
</script>
<style>
.bgk-cls{
    background: url(../assets/images/bg.jpg) #f8fafc top center no-repeat!important;
    height: 100%;
    /*min-width: 1300px;*/
    overflow: hidden;
}

.header-nav .el-menu-item.is-active{
    color: #fff !important;
    background:url(../assets/images/nav-btn.png) no-repeat;
}
.header-nav .el-menu-item:focus,.header-nav .el-menu-item:hover{
    color: #fff!important;
    background:url(../assets/images/nav-btn.png) no-repeat!important;
}
.user-message{
  margin-top:-24px;
  float:left;
  color: #fff;
}
.login-off{
  cursor: pointer;
  padding-left: 10px;
}

</style>
