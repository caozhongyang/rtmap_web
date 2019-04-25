<template>
  <div style="margin-top:24px">
    <el-container>

      <el-aside class="aside-list">
        <el-menu :default-openeds="['3']" class="menu-list">
          <el-menu-item index="1" @click="areaHandler">区域管理</el-menu-item>
          <el-menu-item index="2" @click="userHandler">用户管理</el-menu-item>
          <el-menu-item index="3" @click="roleHandler" class="is-active">角色管理</el-menu-item>
          <el-menu-item index="4" @click="cameraHandler">摄像机管理</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <div class="main-content member-content content-manage">
          <div class="look-content">
              <el-row :gutter="20">
                <el-col :span="16">
                  <div class="look-sel">
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
                   <el-button type="primary" @click="getPagedMember(1)" class="look-btn"><i class="fa fa-search"></i><span>查询</span></el-button> 
                </el-col>
                <el-col :span="4">
                  <span class="look-camera-btn" @click="addUserBtn" v-show="addBtnShow"></span>
                </el-col>
              </el-row>
          </div>
          <el-table :data="tableData" :row-class-name="tableRowClassName" style="width: 100%">
            <el-table-column prop="sid" label="序号"  width="100" align="center"></el-table-column>
            </el-table-column>
            <el-table-column prop="name" label="角色名称" align="center"></el-table-column>
            <el-table-column prop="genderVal" label="角色默认权限" align="center"></el-table-column>
            <el-table-column prop="age" label="管理区域" align="center"></el-table-column>
            <el-table-column
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text">编辑</el-button>
                <el-button @click="deleteHandler(scope.row)" type="text">删除</el-button> 
              </template>
            </el-table-column>
          </el-table>
          <div class="page-block">
              <el-pagination v-show="pageData.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.currentPage" :page-size="pageData.pageSize" layout="total, prev, pager, next" :total="pageData.totalCount">
              </el-pagination>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"
          width="40%" align="left" class="addUserForm">
            <el-form class="addUser-form-item" ref="form" :model="form" :rules="rules"  label-width="100px" label-position="right">
              <el-form-item label="角色名称：">
                <el-input v-model="form.userName"></el-input>
              </el-form-item>
              <el-form-item label="选择权限：" prop="build">
                <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="close-btn">取 消</el-button>
            <el-button type="primary" @click="" class="pri-btn">确定</el-button>
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
  import {addNewMember,queryMemberList,queryMemberTrace} from '@/api/member/member-api'
  import { getFloorsOfGroup,getAreasOfFloor } from '@/api/common/common-api'

  import axios from 'axios';

  const UPLOAD_URL=process.env.APP_API_ROOT+app.api.member.addNewMember;
  //错误验证码
  const ERROR_CODE='000000';
  const cityOptions = ['添加管理员', '删除管理员', '查看会员照片', '添加角色', '删除角色', '删除区域', '添加角色', '删除角色', '删除区域', '添加会员', '删除会员', '添加区域'];
  export default {
    data() {
      return {
        dialogTitle:"添加用户",
        checkAll: false,
        checkedCities: [],
        cities: cityOptions,
        isIndeterminate: true,
        addBtnShow:false,
        searchHistoryShow:false,
        required:{
          name:"会员名",
          memberId:"会员号",
          phoneNumber:"手机号",
          dateOfBirth:"出生日期",
          rname:false,
          rmemberId:false,
          rphoneNumber:false,
          rdateOfBirth:false,
        },
        dialogVisible:false,
        groupId:sessionStorage.getItem('groupId'),
        form:{
          userName:'',
          pwd:'',
          roleSelect:'2',
          status:'1',
          build:''
        },
        rules: {
          
        },
        floorArry:[
        ],
        areaArry:[
        ],
        queryCriteria:{
          groupId:sessionStorage.getItem('groupId'),
          floor:'',
          areaId:'',
          startTime:'',
          endTime:'',
          pageNum:1,
          rowCount:10
        },
        input:'',
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
        CurrentMemberId:'',
        addBtn:{
          loading:false
        }
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
      areaHandler:function(){
       this.$router.push({path:"/manage/AreaManage"});
      },
      userHandler:function(){
        this.$router.push({path:"/manage/UserManage"});
      },
      roleHandler:function(){
        this.$router.push({path:"/manage/RoleManage"});
      },
      cameraHandler:function(){
         this.$router.push({path:"/manage/CameraManage"});
      },
      roleChange:function(val){
        var that = this;
      },
      pwdHandler:function(){

      },
      // 点击删除按钮
      deleteHandler: function(row) {
        this.delHandler(row);
      },
      //确定删除
      delHandler:function(row){
        var that=this;
        that.loading = false;
        var params = {
                "wifiMac": row.wifiMac
              };
          this.$confirm('aaaa', '确认是否删除？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true
          }).then(() => {
              
          }).catch(() => {
                       
          });
      },
      handleCheckAllChange(val) {
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
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
      getPagedMember(page){
        let _this=this;
        this.queryCriteria.pageNum=page;
        if(this.queryCriteria.startTimeValue){
            this.queryCriteria.startTime=this.queryCriteria.startTimeValue.format("yyyy-MM-dd hh:mm:ss");
        }
        if(this.queryCriteria.endTimeValue){
            this.queryCriteria.endTime=this.queryCriteria.endTimeValue.format("yyyy-MM-dd hh:mm:ss");
        }

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
      addUserBtn(){
        this.dialogVisible=true;
        this.dialogTitle = "添加角色";
      },
      handleClick(){
        this.dialogVisible=true;
        this.dialogTitle = "编辑角色";
      },
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
          this.getPagedMember(val);
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
      // console.log(new Date().format("yyyy-MM-dd hh:mm:ss"))
      this.getFloor();
      var that = this;
      that.accessArry = JSON.parse(sessionStorage.getItem('access'));
      that.accessArry.forEach(function(val){
        if(val == "access:member:add"){
          that.addBtnShow = true;
        }
        else if(val == "access:member:history"){
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
