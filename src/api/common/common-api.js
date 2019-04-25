import axios from '@/public/api/axios';

axios.defaults.baseURL = process.env.APP_API_ROOT;

//首页人次
export const getFloorsOfGroup = (criteria, success, error) =>
	axios.$post(app.api.common.getFloorsOfGroup,criteria,success);
export const getAreasOfFloor = (criteria, success, error) =>
	axios.$post(app.api.common.getAreasOfFloor,criteria,success);
export const getLatestMemberList = (criteria, success, error) =>
	axios.$post(app.api.common.getLatestMemberList,criteria,success);
export const getLatestCustomerList = (criteria, success, error) =>
	axios.$post(app.api.common.getLatestCustomerList,criteria,success);
export const getZoneInfoByGroupId = (criteria, success, error) =>
  axios.$post(app.api.common.getZoneInfoByGroupId,criteria,success);
