<template>
<div style="margin-top:24px">
  <el-container>

    <el-aside class="aside-list">
      <el-menu :default-openeds="['3']" class="menu-list">
        <el-menu-item index="1" @click="memberHandler">会员管理</el-menu-item>
        <el-menu-item index="2" @click="recordHandler">会员记录</el-menu-item>
        <el-menu-item index="3" @click="nonmemberHandler" class="is-active"><span class="menu-icon"></span>非会员记录</el-menu-item>
        <el-menu-item index="4" @click="marketingAnalysisHandler">顾客归档</el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
    <div class="main-content member-content content-manage">
    	<div class="look-content">
          <el-row :gutter="20">
    			  <el-col :span="20">
    			  	<div class="look-sel content-input" style="height:86px;">
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
                <el-col :span="6" class="member">
                  <div class="demo-input-suffix member pading-0 camera">
                    年龄段
                    <el-select v-model="queryCriteria.ageGroup" @change="ageChange" placeholder="全部">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="<18" value="<18"></el-option>
                      <el-option label="18-25" value="18-25"></el-option>
                      <el-option label="26-30" value="26-30"></el-option>
                      <el-option label="31-35" value="31-35"></el-option>
                      <el-option label="36-40" value="36-40"></el-option>
                      <el-option label=">=41" value=">=41"></el-option>
                    </el-select>
                  </div>
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
	        <!-- <el-table-column prop="customerId" label="非会员号" align="center"></el-table-column> -->
          <el-table-column prop="genderVal" label="性别" align="center"></el-table-column>
          <el-table-column prop="age" label="年龄" align="center"></el-table-column>
          <el-table-column prop="lastVisitTime" label="抓拍时间" width="150" align="center"></el-table-column>
          <el-table-column prop="floor" label="抓拍楼层" align="center"></el-table-column>
          <el-table-column prop="areaName" label="抓拍区域" align="center"></el-table-column>
		      <el-table-column prop="look" label="操作" width="170" align="center">
	           <template slot-scope="scope">
	            <el-button type="info" round size="small"  @click="addMemberBtn(scope.row)">注册会员</el-button>
	          </template>
	        </el-table-column>
	    </el-table>
	    <div class="page-block">
          <el-pagination v-show="pageData.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.currentPage" :page-size="pageData.pageSize" layout="total, prev, pager, next" :total="pageData.totalCount">
          </el-pagination>
      </div>
      <el-dialog title="注册会员" @close="closeDilog" :visible.sync="dialogMemVisible" width="30%">
            <div class="memDivCont">
              <div class="memDivTop">
                <span class="memSpanLeft">
                  <div class="del-div" v-show="img1.dialogVisible" @click="delImg(1)" >
                      <i class="el-icon-delete"></i>
                  </div>
                  <img class="showimg" v-show="img1.dialogVisible" :src="img1.dialogImageUrl" >
                  <input type="file" accept="image/*" id="file1" @change="handlePicture1" class="uploadInput" />
                  <i class="el-icon-plus"></i>
                </span>
                <div class="memSpanRight">
                  <span class="memSpanRt">
                    <div class="del-div" v-show="img2.dialogVisible" @click="delImg(2)" >
                        <i class="el-icon-delete"></i>
                    </div>
                    <img class="showimg" v-show="img2.dialogVisible" :src="img2.dialogImageUrl" >
                    <input type="file" accept="image/*" id="file2" @change="handlePicture2" class="uploadInput" />
                    <i class="el-icon-plus"></i>
                  </span>
                  <span class="memSpanRb">
                    <div class="del-div" v-show="img3.dialogVisible" @click="delImg(3)" >
                        <i class="el-icon-delete"></i>
                    </div>
                    <img class="showimg" v-show="img3.dialogVisible" :src="img3.dialogImageUrl" >
                    <input type="file" accept="image/jpeg" id="file3" @change="handlePicture3" class="uploadInput" />
                    <i class="el-icon-plus"></i>
                  </span>
                </div>
              </div>
              <div slot="tip" class="el-upload__tip">注：至少上传1张照片，且不超过1M</div>
              <div class="member-div">
                <el-input v-bind:class="{ 'require': required.rname}" v-model="addMember.name"  :placeholder="required.name"></el-input>
                <span>*</span>
              </div>
              <div class="member-div">
                <el-input v-bind:class="{ 'require': required.rmemberId }" v-model="addMember.memberId" :placeholder="required.memberId"></el-input>
                <span>*</span>
              </div>
              <div class="member-div">
                <el-input v-bind:class="{ 'require': required.rphoneNumber }" v-model="addMember.phoneNumber" :placeholder="required.phoneNumber" @blur="phoneReg"></el-input>
                <span>*</span>
              </div>
              <div class="member-div">
                <div style="padding-top: 10px;text-align: left;height: 20px;line-height: 20px">
                  <el-radio v-model="addMember.gender" label="1">男</el-radio>
                  <el-radio v-model="addMember.gender" label="2">女</el-radio>
                </div>
              </div>
              
              <div class="member-div">
                <el-date-picker
                 v-bind:class="{'member-time':true, 'require': required.rdateOfBirth }"
                v-model="addMember.dateOfBirth"
                type="date"
                :placeholder="required.dateOfBirth">
              </el-date-picker>
                <span>*</span>
              </div>
              <div class="member-div">
                <el-input v-model="addMember.verifyCode" placeholder="验证码"></el-input>
              </div>
              <el-button type="primary" @click="addMemberFun" :disabled="addBtn.loading" class="look-btn">确认</el-button>
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
  import {addNewMember,queryNonMemberVisitRecord} from '@/api/member/member-api'
  import { getFloorsOfGroup,getAreasOfFloor } from '@/api/common/common-api'

  import axios from 'axios';

  const UPLOAD_URL=process.env.APP_API_ROOT+app.api.member.addNewMember;
  //错误验证码
  const ERROR_CODE='000000';
  export default {
    data() {
      return {
        fullscreenLoading:true,
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
        floorArry:[
        ],
        areaArry:[
        ],
        addMember:{
          groupId:sessionStorage.getItem('groupId'),
          memberId:"",
          name:"",
          age:'',
          gender:0,
          phoneNumber:'',
          verifyCode:'',
          dateOfBirth:'',
          file1:null,
          file2:null,
          file3:null
        },
        queryCriteria:{
          groupId:sessionStorage.getItem('groupId'),
          genderStr:'0',
          gender:0,
          ageGroup:'',
          floor:'',
          areaId:'',
          startTime:'',
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
      ageChange(val){
        var that = this;
        that.queryCriteria.ageGroup = val;
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
      //img1
      handlePicture1(file) {
        this.readFile(file.target.files,1);
      },
      //img2
      handlePicture2(file) {
        this.readFile(file.target.files,2);
      },
      //img3
      handlePicture3(file) {
        this.readFile(file.target.files,3)
      },
      readFile(files,fileID) {
        var file = files[0];
        if(file.size>1024*1024*1)
        {
          this.$message.error('照片太大，请选择1M以下大小的照片');
          return ;
        }
        var _this=this;
        //判断是否是照片类型
        if (!/image\/\w+/.test(file.type)) {
            alert("只能选择照片");
            return false;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
          switch(fileID){
              case 1:
                _this.img1.file=file;
                _this.img1.dialogImageUrl = this.result;
                _this.img1.dialogVisible = true;
                break;
              case 2:
                _this.img2.file=file;
                _this.img2.dialogImageUrl = this.result;
                _this.img2.dialogVisible = true;
                break;
              default :
                _this.img3.file=file;
                _this.img3.dialogImageUrl = this.result;
                _this.img3.dialogVisible = true;
                break;
          }
        }
        reader.readAsDataURL(file);
      },
      delImg(imgID){
        var _this=this;
        var file;
        this.$confirm('确认删除？')
          .then(_ => {
            switch(imgID){
              case 1:
                file = document.getElementById('file1');
                _this.img1.file=null;
                _this.img1.dialogImageUrl = '';
                _this.img1.dialogVisible = false;
                break;
              case 2:
                file = document.getElementById('file2');
                _this.img2.file=null;
                _this.img2.dialogImageUrl = '';
                _this.img2.dialogVisible = false;
                break;
              default :
                file = document.getElementById('file3');
                _this.img3.file=null;
                _this.img3.dialogImageUrl = '';
                _this.img3.dialogVisible = false;
                break;
            }
            file.value = '';
            done();
          })
          .catch(_ => {});
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
        _this.queryCriteria.gender = Number(_this.queryCriteria.genderStr);
        _this.queryCriteria.genderStr = _this.queryCriteria.gender.toString();
        queryNonMemberVisitRecord(this.queryCriteria,(data)=>{
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
              if(item.visitTime){
                item.lastVisitTime=new Date(item.visitTime.substr(0,19).replace(/\-/g, "/")).format('yyyy-MM-dd hh:mm:ss');
              }

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
      addMemberBtn(row){
        
        this.dialogMemVisible=true;
        var that = this;
        that.img1.dialogImageUrl = row.imageBase64Str;
        //that.img1.file = row.imageBase64Str;
        let bytes = window.atob(row.imageBase64Str.split(';base64,')[1]);
        let ab = new ArrayBuffer(bytes.length);
        let ia = new Uint8Array(ab);
        for(let i = 0; i < bytes.length; i++){
         ia[i] = bytes.charCodeAt(i);
        }
        try{
         that.img1.file = new Blob([ia], {type : 'image/jpeg'});
        }catch(err){
         alert(err);
        }
        that.img1.dialogVisible = true;
        that.addMember.memberId='';
        that.addMember.name='';
        that.addMember.age='0';
        that.addMember.gender=0
        that.addMember.phoneNumber='';
        that.addMember.dateOfBirth='';
        that.addMember.verifyCode='';
        
      },
      addMemberFun(){
          var _this=this;
          var formData = new FormData();
          if(!this.img1.file) {
            this.$message.error('请选择照片');
            return;
          }
          formData.append('file1', this.img1.file)
          if(this.img2.file) formData.append('file2', this.img2.file)
          if(this.img3.file) formData.append('file3', this.img3.file)
          formData.append('groupId', this.addMember.groupId)
          if(!this.addMember.name) {
            this.required.name="请填写会员名";
            this.required.rname=true;
            return;
          }else{
            this.required.name="会员名";
            this.required.rname=false;
          }
          if(!this.addMember.memberId) {
            this.required.memberId="请填写会员号";
            this.required.rmemberId=true;
            return;
          }else{
            this.required.memberId="会员号";
            this.required.rmemberId=false;
          }
          
          if(!this.addMember.phoneNumber) {
            this.required.phoneNumber="请填写手机号";
            this.required.rphoneNumber=true;
            return;
          }else{
            this.required.phoneNumber="手机号";
            this.required.rphoneNumber=false;
          }

          if(!this.addMember.dateOfBirth) {
            this.required.dateOfBirth="请选择生日";
            this.required.rdateOfBirth=true;
            return;
          }else{
            this.required.dateOfBirth="生日";
            this.required.rdateOfBirth=false;
          }

          formData.append('userId', this.addMember.memberId)
          formData.append('name', this.addMember.name)
          formData.append('dateOfBirth', this.addMember.dateOfBirth.format("yyyy-MM-dd"))
          formData.append('age', this.addMember.age)
          formData.append('gender', this.addMember.gender)
          formData.append('phoneNumber', this.addMember.phoneNumber)
          formData.append('verifyCode', this.addMember.verifyCode)
          formData.append('file1Base64', this.addMember.file1Base64)
          let config = {
              headers: {
                  'Content-Type': 'multipart/form-data'
              },
              isFormData:true
          }
          //_this.addBtn.loading=true;
          axios.post(UPLOAD_URL, formData,config).then( data => {
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.$message.success("注册成功");
              this.getPagedMember(1);
            }else{
              this.$message.error(data.result.error_msg || "注册失败，请检查数据是否填写正确");
            }
            // _this.addBtn.loading=false;
          }).catch( res => {
            // _this.addBtn.loading=false;
          })
          _this.closeDilog();
      },
      closeDilog(){
        
        this.dialogMemVisible=false;
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
      // console.log(new Date().format("yyyy-MM-dd hh:mm:ss"))
      this.getFloor();
      var that = this;
      that.accessArry = JSON.parse(sessionStorage.getItem('access'));
      that.accessArry.forEach(function(val){
        // if(val == "access:member:add"){
        //   that.addBtnShow = true;
        // }
        // else if(val == "access:member:history"){
        //   that.searchHistoryShow = true;
        // }
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
