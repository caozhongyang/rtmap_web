import Vue from 'vue'
import Router from 'vue-router' 
import { CACHE_KEYS } from '@/public/constant';

Vue.use(Router)

export const loginRouter = {
  path: '/login',
  name: 'login',
  title: 'login',
  component: resolve => { require(['@/views/login/login.vue'], resolve); },
  children: [
  ]
};

export const cameraRouter = {
  path: '/camera',
  name: 'camera',
  title: 'camera management',
  component: resolve => { require(['@/views/camera/camera-management.vue'], resolve); },
  children: [
  ]
};

export const backRouter = {
  path: '/back',
  name: 'back',
  title: 'backmanagement',
  component: resolve => { require(['@/views/back/back.vue'], resolve); },
  children: [
  ]
};

export const memberRouter = {
  path: '/member',
  name: 'member',
  title: 'member management',
  component: resolve => { require(['@/views/member/member-management.vue'], resolve); },
  children: [
  ]
};

const customerRouter = {
  path: '/customer/MemberManage',
  name: 'customer',
  title: 'customer',
  component: {
      render(c){
        return c('router-view');
      }
  },
  children: [
    {
      path: '/customer/MemberManage',
      name: 'MemberManage',
      title: 'MemberManage',
      component: resolve => { require(['@/views/customer/MemberManage'], resolve); }
    },
    {
      path: '/customer/MemberRecord',
      name: 'customer',
      title: 'MemberRecord',
      component: resolve => { require(['@/views/customer/MemberRecord'], resolve); }
    },
    {
      path: '/customer/NonMember',
      name: 'customer',
      title: 'NonMember',
      component: resolve => { require(['@/views/customer/NonMember'], resolve); }
    },
    {
      path: '/customer/MarketingAnalysis',
      name: 'customer',
      title: 'MarketingAnalysis',
      component: resolve => { require(['@/views/customer/MarketingAnalysis'], resolve); }
    }
  ]
};

const manageRouter = {
  path: '',
  name: 'manage',
  title: 'manage',
  
  component: {
      render(c){
        return c('router-view');
      }
  },
  children: [
    {
      path: '/manage/AreaManage/',
      name: 'AreaManage',
      title: 'AreaManage',
      component: resolve => { require(['@/views/manage/AreaManage.vue'], resolve); }
    },
    {
      path: '/manage/UserManage/',
      name: 'UserManage',
      title: 'UserManage',
      component: resolve => { require(['@/views/manage/UserManage.vue'], resolve); }
    },
    {
      path: '/manage/RoleManage/',
      name: 'RoleManage',
      title: 'RoleManage',
      component: resolve => { require(['@/views/manage/RoleManage.vue'], resolve); }
    },
    {
      path: '/manage/CameraManage/',
      name: 'CameraManage',
      title: 'CameraManage',
      component: resolve => { require(['@/views/manage/CameraManage.vue'], resolve); }
    }
  ]
};


export const fullRouter = {
  path: '/',
  name: 'full',
  title: 'full',
  redirect:'/home',
  component: resolve => { require(['@/containter/full.vue'], resolve); },
  children: [
     {
      path: '/home',
      name: 'home',
      title: 'home',
      component: resolve => { require(['@/views/home/index.vue'], resolve);}
    },
    cameraRouter,
    memberRouter,
    manageRouter,
    customerRouter,
    backRouter
  ]
};
 
export const routers = [
  loginRouter,
  fullRouter
];

const router = new Router({
  routes: routers
})


//路由跳转之前
router.beforeEach(async (to, from, next) => { 
   
  //这里判断下是否存在token
  if(to.path=="/login"){
    next();
  }else{
    if(sessionStorage.getItem('token')){
      next();
    }else{
      next({
        path:"/login"
      })
    }
  }
});


export default router;
