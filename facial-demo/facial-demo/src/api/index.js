import injectApp from '@/public/app';

import login from './login/login-api.config';
import home from './home/home-api.config';
import member from './member/member-api.config';
import camera from './camera/camera-api.config';
import common from './common/common-api.config';

const API_CONFIG = {
  ...login,  
  ...home,
  ...member,
  ...camera,
  ...common,
};
window.app = injectApp(API_CONFIG);