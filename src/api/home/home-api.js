import axios from '@/public/api/axios';

axios.defaults.baseURL = process.env.APP_API_ROOT;

//首页人次
export const getVisitRecordTotal = (criteria, success, error) =>
	axios.$post(app.api.home.getVisitRecordTotal,criteria,success);
export const getVisitRecordToay = (criteria, success, error) =>
	axios.$post(app.api.home.getVisitRecordToay,criteria,success);
export const getVisitRecordThisWeek = (criteria, success, error) =>
	axios.$post(app.api.home.getVisitRecordThisWeek,criteria,success);
export const getVisitRecordMonth = (criteria, success, error) =>
	axios.$post(app.api.home.getVisitRecordMonth,criteria,success);

//分时客流
export const getStaffRecordSegmentToday = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordSegmentToday,criteria,success);
export const getStaffRecordSegmentYesterday = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordSegmentYesterday,criteria,success);
export const getStaffRecordSegmentThisWeek = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordSegmentThisWeek,criteria,success);
export const getStaffRecordSegmentThisMonth = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordSegmentThisMonth,criteria,success);
export const getStaffRecordSegmentLastWeek = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordSegmentLastWeek,criteria,success);
export const getStaffRecordSegmentLastMonth = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordSegmentLastMonth,criteria,success);
//会员年龄
export const getStaffRecordAgeToday = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordAgeToday,criteria,success);
export const getStaffRecordAgeYesterday = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordAgeYesterday,criteria,success);	
export const getStaffRecordAgeThisWeek = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordAgeThisWeek,criteria,success);
export const getStaffRecordAgeThisMonth = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordAgeThisMonth,criteria,success);
export const getStaffRecordAgeLastWeek = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordAgeLastWeek,criteria,success);
export const getStaffRecordAgeLastMonth = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordAgeLastMonth,criteria,success);
//男女性别
export const getStaffRecordGenderToday = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordGenderToday,criteria,success);
export const getStaffRecordGenderYesterday = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordGenderYesterday,criteria,success);
export const getStaffRecordGenderThisWeek = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordGenderThisWeek,criteria,success);
export const getStaffRecordGenderThisMonth = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordGenderThisMonth,criteria,success);
export const getStaffRecordGenderLastWeek = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordGenderLastWeek,criteria,success);
export const getStaffRecordGenderLastMonth = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordGenderLastMonth,criteria,success);
//会员频次
export const getStaffRecordFreqLastWeek = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordFreqLastWeek,criteria,success);
export const getStaffRecordFreqLastMonth = (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordFreqLastMonth,criteria,success);


export const getStaffRecordCountToday= (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordCountToday,criteria,success);

export const getStaffRecordCountYesterday= (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordCountYesterday,criteria,success);

export const getStaffRecordCountThisWeek= (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordCountThisWeek,criteria,success);

export const getStaffRecordCountLastWeek= (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordCountLastWeek,criteria,success);

export const getStaffRecordCountThisMonth= (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordCountThisMonth,criteria,success);

export const getStaffRecordCountLastMonth= (criteria, success, error) =>
	axios.$post(app.api.home.getStaffRecordCountLastMonth,criteria,success);

//导出报表
export const exportStaffRecordToCsv= (criteria, success, error) =>
	{
		criteria.url = app.api.home.exportStaffRecordToCsv;
		axios.$saveFile(criteria);
	}

	//axios.$post(app.api.home.exportStaffRecordToCsv,criteria,success);
		












