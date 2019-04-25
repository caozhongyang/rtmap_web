import axios from '@/public/api/axios';

axios.defaults.baseURL = process.env.APP_API_ROOT;

//区域管理
export const addAreasOfFloor = (criteria, success, error) =>
	axios.$post(app.api.camera.addAreasOfFloor,criteria,success);
export const updateAreasOfFloor = (criteria, success, error) =>
	axios.$post(app.api.camera.updateAreasOfFloor,criteria,success);
export const deleteAreasOfFloor = (criteria, success, error) =>
	axios.$post(app.api.camera.deleteAreasOfFloor,criteria,success);
export const queryAreaList = (criteria, success, error) =>
	axios.$post(app.api.camera.queryAreaList,criteria,success);

//摄像机管理
export const addNewDevice = (criteria, success, error) =>
	axios.$post(app.api.camera.addNewDevice,criteria,success);
export const updateDevice = (criteria, success, error) =>
	axios.$post(app.api.camera.updateDevice,criteria,success);
export const deleteDevice = (criteria, success, error) =>
	axios.$post(app.api.camera.deleteDevice,criteria,success);
export const queryDevice = (criteria, success, error) =>
	axios.$post(app.api.camera.queryDevice,criteria,success);