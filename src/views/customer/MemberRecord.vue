<template>
  <div style="margin-top:24px">
    <el-container>

      <el-aside class="aside-list">
        <el-menu :default-openeds="['2']" class="menu-list">
          <el-menu-item index="1" @click="memberHandler">会员管理</el-menu-item>
          <el-menu-item index="2" @click="recordHandler" class="is-active"><span class="menu-icon"></span>会员记录</el-menu-item>
          <el-menu-item index="3" @click="nonmemberHandler">非会员记录</el-menu-item>
          <el-menu-item index="4" @click="marketingAnalysisHandler">顾客归档</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <div class="main-content member-content content-manage">
        	<div class="look-content">
              <el-row :gutter="20">
                <el-col :span="20">
                  <div class="look-sel content-input" style="height:86px;">
                    <el-col :span="9" class="member">
                        <el-input v-model="queryCriteria.input" placeholder="会员名" class="input-width"></el-input>
                    </el-col>
                    <el-col :span="6" class="member">
                      <div class="demo-input-suffix member pading-0 camera">
                        性别
                        <el-select v-model="queryCriteria.genderStr" @change="genderChange" placeholder="全部">
                          <el-option label="全部" value="0"></el-option>
                          <el-option label="男" value="1"></el-option>
                          <el-option label="女" value="2"></el-option>
                        </el-select>
                      </div>
                    </el-col>
                    <el-col :span="3" class="member">
                        <el-input v-model="queryCriteria.ageStr" placeholder="年龄" class="input-width" onkeyup="this.value=this.value.replace(/\D|^-1/g,'')"></el-input>
                    </el-col>
                    <el-col :span="6" class="member">
                      <el-date-picker
                        class="time"
                        v-model="queryCriteria.dateOfBirth"
                        type="date"
                        placeholder="出生日期"
                        @change="dateOfBirthChange"
                        >
                      </el-date-picker>
                    </el-col>
                    <el-col :span="5" class="member">
                        <el-select v-model="queryCriteria.floor" @change="floorChange">
                            <el-option v-for="item in floorArry" :key="item.floorId" :label="item.floorName" :value="item.floorId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5" class="member">
                        <el-select v-model="queryCriteria.areaId">
                          <el-option v-for="item in areaArry" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7" class="member">
                      <el-date-picker class="time"
                        v-model="queryCriteria.startTimeValue"
                        type="datetime"
                        placeholder="到店时间">
                      </el-date-picker>
                    </el-col>
                    <el-col :span="7" class="member">
                      <el-date-picker class="time"
                        v-model="queryCriteria.endTimeValue"
                        type="datetime"
                        placeholder="离店时间">
                      </el-date-picker>
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
                
              </el-table-column>
    	        <el-table-column prop="name" label="会员名" align="center"></el-table-column>
    	        <el-table-column prop="userId" label="会员号" align="center"></el-table-column>
    	        <el-table-column prop="genderVal" label="性别" align="center"></el-table-column>
    	        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
    	        <el-table-column prop="lastVisitTime" label="抓拍时间" width="150" align="center"></el-table-column>
              <el-table-column prop="visitCount" label="会员频次" align="center"> </el-table-column>
    		      <el-table-column prop="look" label="历史抓拍" width="170" align="center" v-if="searchHistoryShow">
    	           <template slot-scope="scope">
    	            <el-button type="info" round size="small"  @click="lookHistory(scope.row)">查看历史轨迹</el-button>
    	          </template>
    	        </el-table-column>
    	    </el-table>
    	    <div class="page-block">
    		    <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.currentPage" :page-size="pageData." layout="total, prev, pager, next" :total="1000"> -->
                <el-pagination v-show="pageData.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.currentPage" :page-size="pageData.pageSize" layout="total, prev, pager, next" :total="pageData.totalCount">
                </el-pagination>
          </div>
          <el-dialog title="历史轨迹" @close="initMemberHisDialog" :visible.sync="dialogHisVisible" width="60%">
              <el-table :data="tableHisData" :row-class-name="tableRowClassName" style="width: 100%" align="center">
                  <el-table-column prop="sid" label="序号"  width="120" align="center"></el-table-column>
                  <el-table-column prop="name" label="会员名" align="center"></el-table-column>
                  <el-table-column prop="floor" label="楼层" align="center"></el-table-column>
                  <el-table-column prop="area" label="区域" align="center"></el-table-column>
                  <el-table-column prop="deviceId" label="设备ID" width="170" align="center"></el-table-column>
                  <el-table-column prop="visitTimeValue" label="历史时间" width="170" align="center"></el-table-column>
              </el-table>
              <div class="page-block" style="float:none;">
                <el-pagination v-show="pageDataHis.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChangeHis" :current-page.sync="pageDataHis.currentPage" :page-size="pageDataHis.pageSize" layout="total, prev, pager, next" :total="pageDataHis.totalCount">
                </el-pagination>
              </div>
          </el-dialog>
        </div>
      </el-main>

    </el-container>
  </div>
</template>

<style lang="css">
    @import '../../assets/css/common.css';
</style>

<script>
  import {queryMemberList,queryMemberTrace} from '@/api/member/member-api'
  import { getFloorsOfGroup,getAreasOfFloor } from '@/api/common/common-api'

  import axios from 'axios';

  //错误验证码
  const ERROR_CODE='000000';
  export default {
    data() {
      return {
        fullscreenLoading:true,
        searchHistoryShow:false,
        dialogHisVisible:false,
        groupId:sessionStorage.getItem('groupId'),
        floorArry:[
        ],
        areaArry:[
        ],
        queryCriteria:{
          groupId:sessionStorage.getItem('groupId'),
          input:'',
          name:'',
          userId:'',
          memberId:'',
          phoneNumber:'',
          dateOfBirth:'',
          ageStr:'-1',
          age:-1,
          genderStr:'0',
          gender:0,
          floor:'',
          areaId:'',
          startTime:'',
          endTime:'',
          pageNum:1,
          rowCount:10
        },
        queryTraceCriteria:{
          groupId:sessionStorage.getItem('groupId'),
          floor:'',
          areaId:'',
          startTimeValue:'',
          startTime:'',
          endTimeValue:'',
          endTime:'',
          pageNum:1,
          rowCount:10
        },
        tableData: [],
        tableHisData:[],
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
        CurrentMemberId:''
      }
    },
    computed:{
      addSelectFloor:function(){
        let arr=[];
        this.floorArry.map((floor)=>{
          if(!floor.floorId){
            floor.floorName="请选择楼层";
          }
          arr.push(floor);
        });
        return arr;
      },
      addSelectArea:function(){
        let arr=[];
        this.areaArry.map((area)=>{
          if(!area.areaId){
            area.areaName="请选择区域";
          }
          arr.push(area);
        });
        return arr;
      }
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
      genderChange:function(val){
        var that = this;
        that.queryCriteria.gender = val;
      },
      dateOfBirthChange(val){
        var that = this;
        that.queryCriteria.dateOfBirth = val;
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
      getPagedMemberHis(page){
        this.queryTraceCriteria.memberId=this.CurrentMemberId;
        this.queryTraceCriteria.pageNum=page;
        let _this=this;
        queryMemberTrace(this.queryTraceCriteria,(data)=>{
          if(data.data.resultList&&data.data.resultList.length){
             _this.tableHisData=data.data.resultList;
            _this.tableHisData.map(function(item,index){
              item.sid=index+1;
              item.visitTimeValue=new Date(item.visitTime.substr(0,19).replace(/\-/g, "/")).format("yyyy-MM-dd hh:mm:ss");
            })
            _this.pageDataHis.totalCount=data.data.totalRecord;
          }else{
            _this.tableHisData=[];
            _this.pageDataHis.totalCount=0;
          }
        })
      },
      getPagedMember(page){
        let _this=this;
        this.queryCriteria.pageNum=page;
        _this.pageData.currentPage = page;
        if(this.queryCriteria.startTimeValue){
            this.queryCriteria.startTime=this.queryCriteria.startTimeValue.format("yyyy-MM-dd hh:mm:ss");
        }
        if(this.queryCriteria.endTimeValue){
            this.queryCriteria.endTime=this.queryCriteria.endTimeValue.format("yyyy-MM-dd hh:mm:ss");
        }
        if(this.queryCriteria.dateOfBirth){
            this.queryCriteria.dateOfBirth=this.queryCriteria.dateOfBirth.format("yyyy-MM-dd");
        }
        _this.queryCriteria.name= _this.queryCriteria.input;
        _this.queryCriteria.userId = _this.queryCriteria.input;
        _this.queryCriteria.phoneNumber= _this.queryCriteria.input;
        if(_this.queryCriteria.ageStr == "-1"){
          _this.queryCriteria.ageStr = "";
        }
        if(_this.queryCriteria.ageStr == ""){
          _this.queryCriteria.age = -1;
        }
        else{
          _this.queryCriteria.age = Number(_this.queryCriteria.ageStr);
          _this.queryCriteria.ageStr = _this.queryCriteria.age.toString();
        }
        _this.queryCriteria.gender = Number(_this.queryCriteria.genderStr);
        _this.queryCriteria.genderStr = _this.queryCriteria.gender.toString();
        queryMemberList(this.queryCriteria,(data)=>{
          if(data.data.resultList&&data.data.resultList.length){
            _this.tableData=data.data.resultList;
            _this.tableData.map(function(item,index){
              item.sid=index+1;
              switch(item.gender){
                case 1:
                  item.genderVal="男";
                  break;
                case 2:
                  item.genderVal="女";
                  break;
                default :
                  item.genderVal="未知";
                  break;
              }
              if(!item.age) item.age="未知";
              item.imageBase64Str=item.imgBase64?"data:image/jpeg;base64,"+item.imgBase64:"";
              item.lastVisitTime=new Date(item.visitTime.substr(0,19).replace(/\-/g, "/")).format('yyyy-MM-dd hh:mm:ss');

            })
            _this.pageData.totalCount=data.data.totalRecord;
            _this.fullscreenLoading = false;
          }else{
            _this.tableData=[];
            _this.pageData.totalCount=0;
          }
        })
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
      initMemberHisDialog(){
        this.CurrentMemberId='';
      },
      //查看历史轨迹
      lookHistory(row) {
        this.dialogHisVisible = true;
        this.CurrentMemberId=row.memberId;
        this.pageDataHis.currentPage = 1;
        this.tableHisData=[];
        this.pageDataHis.totalCount = [];
        this.getPagedMemberHis(1);
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
          this.getPagedMember(val);
      },
      handleCurrentChangeHis(val) {
          this.getPagedMemberHis(val);
      },
      getFloor(){
        var criteria={
          groupId:this.groupId
        };
        var _this=this;
        getFloorsOfGroup(criteria,(data)=>{
          if(data.result&&data.result.error_code==ERROR_CODE){
            var arr=[{floorId:"",floorName:"全部楼层"}];
            data.FloorInfo.map((f)=>{
              f.floorName=f.floorId;
              arr.push(f);
            });
            _this.floorArry=arr;
            if(data.FloorInfo&&data.FloorInfo.length) _this.getArea("");
          }
        });
      },
      getArea(floor){
        var _this=this;
        getAreasOfFloor({"groupId":this.groupId,"floorId":floor},(data)=>{
          if(data.result&&data.result.error_code==ERROR_CODE){
            var arr=[{areaId:'',areaName:'全部区域'}];
            data.AreaInfo.map((f)=>{
              arr.push(f);
            });
            _this.areaArry=arr;
          }
        });
      }
    },
    mounted(){
      this.init();
    },
    created(){
      
      if(this.queryCriteria.ageStr == "-1"){
        this.queryCriteria.ageStr = "";
      };
      this.getFloor();
      var that = this;
      that.accessArry = JSON.parse(sessionStorage.getItem('access'));
      that.accessArry.forEach(function(val){
        if(val == "access:member:history"){
          that.searchHistoryShow = true;
        }
      })
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
