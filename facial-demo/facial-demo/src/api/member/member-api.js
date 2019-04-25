import axios from '@/public/api/axios';

axios.defaults.baseURL = process.env.APP_API_ROOT;

//会员管理
export const addNewMember = (criteria, success, error) =>
	axios.$post(app.api.member.addNewMember,criteria,success);
export const queryMemberInfoList = (criteria, success, error) =>
	axios.$post(app.api.member.queryMemberInfoList,criteria,success);
export const deleteMember = (criteria, success, error) =>
	axios.$post(app.api.member.deleteMember,criteria,success);
export const updateMember = (criteria, success, error) =>
	axios.$post(app.api.member.updateMember,criteria,success);

//会员记录
export const queryMemberList = (criteria, success, error) =>{
	axios.$post(app.api.member.queryMemberList,criteria,success);
}
export const queryMemberTrace = (criteria, success, error) =>
	axios.$post(app.api.member.queryMemberTrace,criteria,success);

//非会员记录
export const queryNonMemberVisitRecord = (criteria, success, error) =>
	axios.$post(app.api.member.queryNonMemberVisitRecord,criteria,success);

export const getSeasonCustomerVisitRecord = (criteria, success, error) =>
  axios.$post(app.api.member.getSeasonCustomerVisitRecord,criteria,success);

export const getSeasonCustomerTrace = (criteria, success, error) =>
  axios.$post(app.api.member.getSeasonCustomerTrace,criteria,success);

