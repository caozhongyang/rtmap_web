export default {
    home: [{
      url: '/facial/platform/{0}',
      actions: {
        getVisitRecordTotal:'getVisitRecordTotal',//获取总人次
        getVisitRecordToay:'getVisitRecordToday',//获取当天人次
        getVisitRecordThisWeek:'getVisitRecordThisWeek',//获取当周人次
        getVisitRecordMonth:'getVisitRecordThisMonth',//获取当月人次
        getStaffRecordSegmentToday:'getStaffRecordSegmentToday',  //获取当天分时客流
        getStaffRecordSegmentYesterday:'getStaffRecordSegmentYesterday',//获取昨日分时客流
        getStaffRecordSegmentThisWeek:"getStaffRecordSegmentThisWeek",  //获取当周分时客流
        getStaffRecordSegmentLastWeek: "getStaffRecordSegmentLastWeek",   //获取上周分时客流
        getStaffRecordSegmentThisMonth: "getStaffRecordSegmentThisMonth", /*获取当月分时客流*/
        getStaffRecordSegmentLastMonth: "getStaffRecordSegmentLastMonth", /*获取上月分时客流*/
        getStaffRecordAgeToday: "getStaffRecordAgeToday",/*获取当天顾客年龄统计数*/
        getStaffRecordAgeYesterday:'getStaffRecordAgeYesterday',/*获取昨天顾客年龄统计数*/
        getStaffRecordAgeThisWeek: "getStaffRecordAgeThisWeek", /*获取当周顾客/会员年龄统计数*/
        getStaffRecordAgeLastWeek: "getStaffRecordAgeLastWeek", /*获取上周顾客/会员年龄统计数*/
        getStaffRecordAgeThisMonth: "getStaffRecordAgeThisMonth",/*获取当月顾客/会员年龄统计数*/
        getStaffRecordAgeLastMonth: "getStaffRecordAgeLastMonth", /*获取上月顾客/会员年龄统计数*/
        getStaffRecordGenderToday: "getStaffRecordGenderToday", /*获取当天顾客性别统计数*/
        getStaffRecordGenderYesterday:'getStaffRecordGenderYesterday',/*获取昨日顾客性别统计数*/
        getStaffRecordGenderThisWeek: "getStaffRecordGenderThisWeek", /*获取当周顾客/会员性别统计数*/
        getStaffRecordGenderLastWeek: "getStaffRecordGenderLastWeek",/*获取上周顾客/会员性别统计数*/
        getStaffRecordGenderThisMonth: "getStaffRecordGenderThisMonth", /*获取当月顾客/会员性别统计数*/
        getStaffRecordGenderLastMonth: "getStaffRecordGenderLastMonth", /*获取上月顾客/会员性别统计数*/
        getStaffRecordFreqLastWeek: "getStaffRecordFreqLastWeek", /*获取上周会员频次*/
        getStaffRecordFreqLastMonth: "getStaffRecordFreqLastMonth",/*获取上月会员频次*/

        getStaffRecordCountToday:"getStaffRecordCountToday",
        getStaffRecordCountYesterday:"getStaffRecordCountYesterday",
        getStaffRecordCountThisWeek:"getStaffRecordCountThisWeek",
        getStaffRecordCountLastWeek:"getStaffRecordCountLastWeek",
        getStaffRecordCountThisMonth:"getStaffRecordCountThisMonth",
        getStaffRecordCountLastMonth:"getStaffRecordCountLastMonth",

        exportStaffRecordToCsv:"exportStaffRecordToCsv",/*导出报表*/


      }
    }]
  }