// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/common.css';
import '@/assets/css/font-awesome.min.css';
import 'babel-polyfill';

import router from './router'

import { CACHE_KEYS } from '@/public/constant';

import './public/lib/m2';
import './api';
import './public/util'; 


Vue.use(ElementUI)

Vue.config.devtools = true
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
