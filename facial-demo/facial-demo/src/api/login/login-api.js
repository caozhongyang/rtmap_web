import axios from '@/public/api/axios';

axios.defaults.baseURL = process.env.APP_API_ROOT;
//登录
export const loginOn = (criteria, success, error) =>
	axios.$postForm(app.api.login.loginOn,criteria,success);
//注销	
export const loginOff = (criteria, success, error) =>
	axios.$post(app.api.login.loginOff,criteria,success);
