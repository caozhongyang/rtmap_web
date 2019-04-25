import axios from 'axios';
import { AXIOS_TEXT } from '@/public/constant';

axios.defaults.baseURL = process.env.APP_API_ROOT;

// 请求之前
axios.interceptors.request.use(function(config) {
	return app.util.ajax.getRequestConfig(config);
}, function(error) {
	return Promise.reject(error);
});

// 请求回来数据之后
// axios.interceptors.response.use(function(response) {
// 	app.util.ajax.parseResponseData(response);
// 	return response.data;
// }, function(error) {
// 	// if(error.response.status == 401) {
// 	// 	if(error.response.data) {
// 	// 		$vue.$router.push({
// 	// 			name: "home"
// 	// 		});
// 	// 	} else {
// 	// 		window.illegalUser = true;
// 	// 		$vue.$router.push({
// 	// 			name: "login"
// 	// 		});
// 	// 	}
// 	// } else {
// 	// 	// const response = error.response.data;
// 	// 	// const errorMessage = app.config.isDebugMode ? response.stackTrace : response.description;
// 	// }
//
// 	return Promise.reject("出错了");
// });

// 请求回来数据之后
axios.interceptors.response.use(
response => {
	app.util.ajax.parseResponseData(response);
	return response.data;
},error => {
  //todo caozy 域名替换
  alert("登陆超时");
  window.location.href="http://192.144.176.135:8000/#/login";
  // window.location.reload();
}
);

const handleCallback = (promise, callbacks) => {
	let handler = {};
	if(m2.type.isFunction(callbacks)) {
		handler.success = callbacks;
	}
	if(m2.type.isObject(callbacks)) {
		handler = callbacks;
	}
	promise.then((res) => {
		if(!res || res.errCode == undefined || (res.errCode != undefined && !res.errCode)) {
			m2.type.isFunction(handler.success) && handler.success(res);
		} else {
			m2.type.isFunction(handler.failure) && handler.failure(res);
		}
	}, (error) => {
		m2.type.isFunction(handler.error) && handler.error(error);
	});
};

axios.$post = async(url, criteria, callbacks) => {
	const promise = axios.post(url, criteria);
	handleCallback(promise, callbacks);
};

axios.$saveFile = async(criteria, callbacks) => {
	const promise = axios(criteria);
	handleCallback(promise, callbacks);
};

axios.$postForm = async(url, formData, callbacks) => {
	let config = {
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		isFormData:true
	}
	const promise = axios.post(url, formData,config);
	handleCallback(promise, callbacks);
};

axios.$get = async(url, criteria, callbacks) => {
	const promise = axios.get(url, {
		params: criteria
	});
	handleCallback(promise, callbacks);
};

export default axios;
