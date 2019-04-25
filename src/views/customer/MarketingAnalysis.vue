<template>
  <div style="margin-top:24px">
    <el-container>

      <el-aside class="aside-list">
        <el-menu :default-openeds="['4']" class="menu-list">
          <el-menu-item index="1" @click="memberHandler">会员管理</el-menu-item>
          <el-menu-item index="2" @click="recordHandler">会员记录</el-menu-item>
          <el-menu-item index="3" @click="nonmemberHandler">非会员记录</el-menu-item>
          <el-menu-item index="4" @click="marketingAnalysisHandler"class="is-active"><span class="menu-icon"></span>顾客归档</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <div class="main-content member-content content-manage member-btn">
          <div class="look-content">
              <el-row :gutter="24">
                <el-col :span="20">
                  <div class="look-sel content-input" style="height: 86px;">
                    <el-col :span="6" class="member">
                      <div class="demo-input-suffix member pading-0 camera">
                        时间
                        <el-select v-model="defaultTime" @change="timeListChange">
                          <el-option v-for="item in timeList" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </el-col>

                    <el-col :span="6" class="member">
                      <div class="demo-input-suffix member pading-0 camera">
                        身份
                        <el-select v-model="memberType" @change="memberTypeChange" placeholder="全部">
                          <el-option label="全部" value="2"></el-option>
                          <el-option label="会员" value="1"></el-option>
                          <el-option label="非会员" value="0"></el-option>
                        </el-select>
                      </div>
                    </el-col>

                    <el-col :span="6" class="member">
                      <div class="demo-input-suffix member pading-0 camera">
                        性别
                        <el-select v-model="genderType" @change="genderChange" placeholder="全部">
                          <el-option label="全部" value="3"></el-option>
                          <el-option label="男" value="1"></el-option>
                          <el-option label="女" value="2"></el-option>
                        </el-select>
                      </div>
                    </el-col>

                    <el-col :span="6" class="member">
                      <div class="demo-input-suffix member pading-0 camera">
                        年龄段
                        <el-select v-model="ageStage" @change="ageStageChange" placeholder="全部">
                          <el-option v-for="item in ageStageList" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </el-col>

                    <el-col :span="6" class="member">
                      <div class="demo-input-suffix member pading-0 camera">
                        区域
                        <el-select v-model="regionType" @change="regionTypeChange" placeholder="全部">
                          <el-option v-for="item in regionList" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </el-col>

                    <el-col :span="6" class="member">
                      <div class="demo-input-suffix member pading-0 camera">
                        频次
                        <el-select v-model="visitTimes" @change="visitTimeChange" placeholder="全部">
                          <el-option v-for="item in visitTimeList" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </div>
                    </el-col>
                  </div>
                </el-col>
                <el-col :span="4">
                   <el-button type="primary" @click="getPagedMember(1)" class="look-btn" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
                   <i class="fa fa-search"></i><span>查询</span></el-button> 
                </el-col>
              </el-row>

          </div>
          <el-table :data="tableData" :row-class-name="tableRowClassName" style="width: 100%">
            <el-table-column prop="sid" label="序号"  width="100" align="center"></el-table-column>
            <el-table-column label="照片" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.imageBase64Str" style="width:60px;height:60px;">
                </template>
            </el-table-column>
            <el-table-column prop="customerIdSeason" label="ID" align="center"></el-table-column>
            <el-table-column prop="typeName" label="身份" align="center"></el-table-column>
            <el-table-column prop="genderTypeName" label="性别" align="center"></el-table-column>
            <el-table-column prop="age" label="年龄" align="center"></el-table-column>
            <el-table-column prop="freq" label="频次" align="center"></el-table-column>
            <el-table-column label="历史记录" width="160" align="center">
              <template slot-scope="scope">
                <el-button type="info" round size="small"  @click="lookHistory(scope.row)" style="width:116px;">查看历史轨迹</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-block">
            <el-pagination v-show="pageData.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.currentPage" :page-size="pageData.pageSize" layout="total, prev, pager, next" :total="pageData.totalCount">
            </el-pagination>
          </div>
      </div>

      <el-dialog title="历史轨迹" @close="initMemberHisDialog" :visible.sync="dialogHisVisible" width="60%">
        <el-table :data="tableHisData" :row-class-name="tableRowClassName" style="width: 100%" align="center">
          <el-table-column prop="sid" label="序号"  width="120" align="center"></el-table-column>
          <el-table-column prop="floor" label="楼层" align="center"></el-table-column>
          <el-table-column prop="area" label="区域" align="center"></el-table-column>
          <el-table-column prop="deviceId" label="设备ID" width="170" align="center"></el-table-column>
          <el-table-column prop="visitTime" label="历史时间" width="170" align="center"></el-table-column>
        </el-table>
        <div class="page-block" style="float:none;">
          <el-pagination v-show="pageDataHis.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChangeHis" :current-page.sync="pageDataHis.currentPage" :page-size="pageDataHis.pageSize" layout="total, prev, pager, next" :total="pageDataHis.totalCount">
          </el-pagination>
        </div>
      </el-dialog>

    </el-main>

    </el-container>
  </div>
</template>

 <style lang="css">
    @import '../../assets/css/common.css';
</style>

<script>
  import { getSeasonCustomerVisitRecord,getSeasonCustomerTrace } from '@/api/member/member-api'
  import { getZoneInfoByGroupId } from '@/api/common/common-api'

  import axios from 'axios';

  const UPLOAD_URL=process.env.APP_API_ROOT+app.api.member.addNewMember;
  const UPDATE_URL=process.env.APP_API_ROOT+app.api.member.updateMember;
  //错误验证码
  const ERROR_CODE='000000';
  export default {
    data() {
      return {
        fullscreenLoading:true,
        disabledInput:false,
        dialogTitle:'添加会员',
        addBtnShow:false,
        searchHistoryShow:false,
        required:{
          name:"会员名",
          userId:"会员号",
          phoneNumber:"手机号",
          dateOfBirth:"出生日期",
          rname:false,
          ruserId:false,
          rphoneNumber:false,
          rdateOfBirth:false,
        },
        img1:{
          dialogImageUrl: '',
          dialogVisible: false,
          file:null
        },
        img2:{
          dialogImageUrl: '',
          dialogVisible: false,
          file:null
        },
        img3:{
          dialogImageUrl: '',
          dialogVisible: false,
          file:null
        },
        dialogMemVisible:false,
        groupId:sessionStorage.getItem('groupId'),
        addMember:{
          groupId:sessionStorage.getItem('groupId'),
          userId:"",
          name:"",
          age:'',
          gender:0,
          genderStr:'0',
          phoneNumber:'',
          verifyCode:'',
          dateOfBirth:'',
          // picPath:'./picture/zhangsan'
          file1:null,
          file2:null,
          file3:null,
        },
        queryCriteria:{
          groupId:sessionStorage.getItem('groupId'),
          pageNum:1,
          rowCount:10,
          input:'',
          name:'',
          userId:'',
          phoneNumber:'',
          dateOfBirth:'',
          ageStr:'-1',
          age:-1,
          genderStr:'0',
          gender:0,
        },
        tableData: [],
        pageData:{
          pageSize:10,
          currentPage:1,
          totalCount:0
        },
        pageDataHis:{
          pageSize:10,
          currentPage:1,
          totalCount:0
        },
        CurrentMemberId:'',
        addBtn:{
          loading:false
        },
        timeList:[
          {label:'近7天',value:'1'},
          {label:'近30天',value:'2'},
          {label:'近90天',value:'3'}
        ],
        defaultTime: '1',
        memberType:'2',
        regionType:'',
        genderType:'3',
        ageStage:'6',
        visitTimes:'6',
        regionList:[],
        ageStageList:[{label:'全部',value:'6'},{label:'<18',value:'0'},{label:'18-25',value:'1'},
          {label:'26-30',value:'2'},{label:'31-35',value:'3'},{label:'36-40',value:'4'},
          {label:'>40',value:'5'}],
        visitTimeList:[{label:'全部',value:'6'},{label:'1次',value:'0'},{label:'2~3次',value:'1'},
          {label:'4~6次',value:'2'},{label:'8~10次',value:'3'},{label:'11~15次',value:'4'},{label:'15次以上',value:'5'}],
        hisTotalCount:'',
        hisCurrentPage:'',
        hisPageSize:'',
        dialogHisVisible:false,
        tableHisData:[],
        record:{}
      }
    },
    computed:{
      
    },
    methods: {
      memberHandler:function(){
         // this.$router.push({name:'MemberManage'});
         this.$router.push({path:"/customer/MemberManage"});
      },
      recordHandler:function(){
         this.$router.push({path:"/customer/MemberRecord"});
         // this.$router.push({name:'MemberRecord'});
      },
      nonmemberHandler:function(){
         this.$router.push({path:"/customer/NonMember"});
      },
      marketingAnalysisHandler: function(){
        this.$router.push({path:"/customer/MarketingAnalysis"});
      },
      init(){
        this.getPagedMember(1);
      },
      floorChange(floorId){
        if(!floorId){
          this.criteria.area='';
        }
        this.getArea(floorId);
      },
      areaChange(){
        this.getPagedDevice(1);
      },
      genderChange:function(val){
        var that = this;
        that.genderType = val;
      },
      timeListChange: function(val){
        var that = this;
        that.defaultTime = val;
      },
      memberTypeChange: function(val){
        var that = this;
        that.memberType = val;
      },
      regionTypeChange: function(val){
        var that = this;
        that.regionType = val;
      },
      ageStageChange: function(val){
        var that = this;
        that.ageStage = val;
      },
      visitTimeChange: function(val){
        var that = this;
        that.visitTimes = val;
      },
      dateOfBirthChange(val){
        var that = this;
        that.queryCriteria.dateOfBirth = val;
      },
      getPagedMember(page){
        var _this=this;
        _this.tableData = [];
        var criteria = {
          'groupId' : this.groupId,
          'areaId' : this.regionType,
          'identityId':this.memberType,
          'gender':this.genderType,
          'ageGroupId':this.ageStage,
          'freqGroupId':this.visitTimes,
          'statPeriod':this.defaultTime,
          'pageNum': page,
          'rowCount' : 10
        };

        getSeasonCustomerVisitRecord(criteria,(data)=>{
          _this.fullscreenLoading = true;
          var i = 1;
          data.data.resultList.forEach(item => {
            item.sid = i++;
            item.genderTypeName = item.gender == '1' ? '男' : '女';
            item.typeName = item.isMember == '0' ? '非会员' : '会员';
            item.imageBase64Str=item.picBase64?"data:image/jpeg;base64,"+item.picBase64:"";
            _this.tableData.push(item);
          });
          console.log(_this.tableData);
          _this.pageData.totalCount = data.data.totalRecord
          _this.fullscreenLoading = false;
        });
      },

      //查看历史轨迹
      lookHistory(row) {
        this.dialogHisVisible = true;
        var record = {};
        record.groupId = this.groupId;
        record.areaId = this.regionType;
        record.rowCount = 10;
        record.statPeriod = this.defaultTime;
        record.seasonCustomerId = row.customerIdSeason;
        this.record = record;
        this.getPagedMemberHis(1,record);
      },

      //获取弹窗数据
      getPagedMemberHis(page,record){
        console.log('弹窗页码' + page);
        var me = this;
        record.pageNum = page;
        getSeasonCustomerTrace(record,(data)=>{
          me.fullscreenLoading = true;
          me.tableHisData = data.data.resultList;
          var i = 1;
          me.tableHisData.forEach(item => {
            item.sid = i++;
          });
          console.log(me.tableHisData);
          me.fullscreenLoading = false;
          me.pageDataHis.totalCount = data.data.totalRecord;
        })
      },

      initMemberHisDialog(){
        this.CurrentMemberId='';
      },

      handleCurrentChangeHis(val) {
        this.getPagedMemberHis(val,this.record);
      },

     //table斑马线
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 == 0) {
          return 'success-row cell-member';
        } else if (rowIndex%2 ==2) {
          return 'warning-row cell-member';
        }
        return 'cell-member';
      },

      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
          this.getPagedMember(val);
      },

      phoneReg(){
        var that = this;
        if(that.addMember.phoneNumber == ""){
          that.required.phoneNumber="请填写手机号";
          that.required.rphoneNumber=true;
          return;
        }
        let regExp =  /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (regExp.test(that.addMember.phoneNumber) === false) {
             that.$message.error('手机号码格式不正确');
             that.addMember.phoneNumber = "";
          }
      }
      
    },
    mounted(){
      this.init();
    },
    created(){
      var criteria={
        groupId:this.groupId
      };
      var _this=this;
      getZoneInfoByGroupId(criteria,(data)=>{
        var head = [{label : '全部',value : ''}];
        var tail = [];
        data.zones.forEach(item => {
          var x = {};
          x.label = item.areaName;
          x.value = item.areaId;
          tail.push(x);
        });
        _this.regionList = tail.length == 0 ? head : [...head, ...tail];
      });
    }
  };
</script>
<style>
.memSpanLeft{
  position: relative;
}
.memSpanRt{
  position: relative;
}
.memSpanRb{
  position: relative;
}
.uploadInput{
  position: absolute;
  width:100%;
  height: 100%;
  z-index: 99;
  left:0;
  top:0;
  opacity: 0;
}
.showimg{
  position: relative;
  z-index: 98;
  left:0;
  top:0;
  width:100%;
  height: 100%;
  border:1px solid #ddd;
  border-radius:5px;
}
.member-time>.el-input__prefix{
  margin-top: 10px;
  height: 30px;
  line-height: 30px;
}
.member-time>.el-input__suffix{
  margin-top: 10px;
  height: 30px;
  line-height: 30px;
}
.del-div{
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  font-size: 20px;
  text-align: center;
  z-index: 100;
  width: 100%;
  transition: opacity .3s;
  border-radius:5px;
  border: 1px solid;
  height: 100%;
  background-color: rgba(0,0,0,.5);
}
.del-div:hover{
  opacity: 1;
}
.cell-member>td{
  padding:0px;
}
.cell-member>td>.cell{
  padding:3.5px 0;
  line-height: normal; 
}
.require>input{
  border: 1px red solid
}
.member-div{
  float: left;
  width: 100%;
  position: relative;
}
.member-div>span{
  right: -20px;
  top:12px;
  height: 30px;
  position: absolute;
  color: red;
  padding: 0 5px;
  line-height: 30px;
  font-size: 14px;
}
.el-upload__tip{
  text-align: left;
}

</style>
