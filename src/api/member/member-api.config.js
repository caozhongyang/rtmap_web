export default {
    member: [{
      url: '/facial/platform/{0}',
      actions: {
        addNewMember:'addNewMember',/*会员管理--添加会员 post*/
        queryMemberInfoList:'queryMemberInfoList',/*会员管理--会员列表 post*/
        deleteMember:'deleteMember',/*会员管理--删除会员 post*/
        updateMember:'updateMember',/*会员管理--更新会员 post*/
        queryMemberList:"queryMemberList",/*会员记录--查询会员列表 post*/
        queryMemberTrace: "queryMemberTrace", /*会员记录--查询会员轨迹 post*/
        queryNonMemberVisitRecord:"queryNonMemberVisitRecord",/*非会员记录--列表 post*/
        getSeasonCustomerVisitRecord:"getSeasonCustomerVisitRecord",/*顾客归档查询--列表*/
        getSeasonCustomerTrace:"getSeasonCustomerTrace",/*顾客归档--查看历史轨迹*/
      }
    }]
  }
