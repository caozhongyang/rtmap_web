<template>
  <div style="margin-top:24px">
    <el-container>

      <el-aside class="aside-list">
        <el-menu :default-openeds="['1']" class="menu-list">
          <el-menu-item index="1" @click="memberHandler" class="is-active"><span class="menu-icon"></span>会员管理</el-menu-item>
          <el-menu-item index="2" @click="recordHandler">会员记录</el-menu-item>
          <el-menu-item index="3" @click="nonmemberHandler">非会员记录</el-menu-item>
          <el-menu-item index="4" @click="marketingAnalysisHandler">顾客归档</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <div class="main-content member-content content-manage member-btn">
          <div class="look-content">
              <el-row :gutter="20">
                <el-col :span="16">
                  <div class="look-sel content-input">
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
                  </div>
                </el-col>
                <el-col :span="4">
                   <el-button type="primary" @click="getPagedMember(1)" class="look-btn" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
                   <i class="fa fa-search"></i><span>查询</span></el-button> 
                </el-col>
                <el-col :span="4">
                  <span class="look-camera-btn" @click="addMemberBtn" v-show="addBtnShow"></span>
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
            <el-table-column prop="name" label="会员名" align="center"></el-table-column>
            <el-table-column prop="userId" label="会员号" align="center"></el-table-column>
            <el-table-column prop="genderVal" label="性别" align="center"></el-table-column>
            <el-table-column prop="age" label="年龄" align="center"></el-table-column>
            <el-table-column prop="lastVisitTime" label="最近到访" align="center"></el-table-column>
            <el-table-column prop="dateOfBirth" label="出生日期" align="center"></el-table-column>
            <!-- <el-table-column prop="phoneNumber" label="手机号" align="center"> </el-table-column> -->
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <el-button type="info" round size="small"  @click="clickEidt(scope.row)" style="width:58px;">编辑</el-button>
                <el-button type="info" round size="small" @click="deleteHandler(scope.row)" style="width:58px;">删除</el-button> 
              </template>
            </el-table-column>
          </el-table>
          <div class="page-block">
              <el-pagination v-show="pageData.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.currentPage" :page-size="pageData.pageSize" layout="total, prev, pager, next" :total="pageData.totalCount">
              </el-pagination>
        </div>
        <el-dialog :title="dialogTitle" @close="closeDilog" :visible.sync="dialogMemVisible" width="30%">
            <div class="memDivCont">
              <div class="memDivTop">
                <span class="memSpanLeft">
                  <div class="del-div" v-show="img1.dialogVisible" @click="delImg(1)" >
                      <i class="el-icon-delete"></i>
                  </div>
                  <img class="showimg" v-show="img1.dialogVisible" :src="img1.dialogImageUrl" >
                  <input type="file" accept="image/*" id="file1" @change="handlePicture1" class="uploadInput" :disabled="disabledInput"/>
                  <i class="el-icon-plus"></i>
                </span>
                <div class="memSpanRight">
                  <span class="memSpanRt">
                    <div class="del-div" v-show="img2.dialogVisible" @click="delImg(2)" >
                        <i class="el-icon-delete"></i>
                    </div>
                    <img class="showimg" v-show="img2.dialogVisible" :src="img2.dialogImageUrl" >
                    <input type="file" accept="image/*" id="file2" @change="handlePicture2" class="uploadInput" :disabled="disabledInput" />
                    <i class="el-icon-plus"></i>
                  </span>
                  <span class="memSpanRb">
                    <div class="del-div" v-show="img3.dialogVisible" @click="delImg(3)" >
                        <i class="el-icon-delete"></i>
                    </div>
                    <img class="showimg" v-show="img3.dialogVisible" :src="img3.dialogImageUrl" >
                    <input type="file" accept="image/jpeg" id="file3" @change="handlePicture3" class="uploadInput" :disabled="disabledInput" />
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
                <el-input v-bind:class="{ 'require': required.ruserId }" v-model="addMember.userId" :placeholder="required.userId"></el-input>
                <span>*</span>
              </div>
              <div class="member-div">
                <el-input v-bind:class="{ 'require': required.rphoneNumber }" v-model="addMember.phoneNumber" :placeholder="required.phoneNumber" @blur="phoneReg"></el-input>
                <span>*</span>
              </div>
              <div class="member-div">
                <div style="padding-top: 10px;text-align: left;height: 20px;line-height: 20px">
                  <el-radio v-model="addMember.genderStr" label="1">男</el-radio>
                  <el-radio v-model="addMember.genderStr" label="2">女</el-radio>
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
  import {addNewMember,queryMemberInfoList,deleteMember,updateMember} from '@/api/member/member-api'
  import { getFloorsOfGroup,getAreasOfFloor } from '@/api/common/common-api'

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
        CurrentMemberId:'',
        addBtn:{
          loading:false
        }
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
        this.initAddMemberDialog();
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
        that.queryCriteria.gender = val;
      },
      dateOfBirthChange(val){
        var that = this;
        that.queryCriteria.dateOfBirth = val;
      },
      //img1
      handlePicture1(file) {
        console.log(file)
        this.readFile(file.target.files,1);
      },
      //img2
      handlePicture2(file) {
        this.readFile(file.target.files,2);
      },
      //img3
      handlePicture3(file) {
        this.readFile(file.target.files,3)
        // this.img3.file=file.target.files[0];
        // this.img3.dialogImageUrl = this.readFile(file.target.files);
        // this.img3.dialogVisible = true;
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
        if(this.queryCriteria.dateOfBirth){
            this.queryCriteria.dateOfBirth=this.queryCriteria.dateOfBirth.format("yyyy-MM-dd");
        }
        _this.queryCriteria.name= _this.queryCriteria.input;
        _this.queryCriteria.userId= _this.queryCriteria.input;
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
        queryMemberInfoList(this.queryCriteria,(data)=>{
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
      initAddMemberDialog(){
        this.dialogTitle = "添加会员";
        this.disabledInput = false;
        this.addMember.groupId=this.groupId;
        this.addMember.userId='';
        this.addMember.memberId= '';
        this.addMember.name='';
        this.addMember.age='0';
        this.addMember.gender=0
        this.addMember.phoneNumber='';
        this.addMember.dateOfBirth='';
        this.addMember.verifyCode='';
        this.addMember.file1=null;
        this.addMember.file2=null;
        this.addMember.file3=null;

        this.required={
          name:"会员名",
          userId:"会员号",
          phoneNumber:"手机号",
          dateOfBirth:"出生日期",
          rname:false,
          ruserId:false,
          rphoneNumber:false,
          rdateOfBirth:false,
        };

        var _this=this;
       
        _this.img1.file=null;
        _this.img1.dialogImageUrl = '';
        _this.img1.dialogVisible = false;

        _this.img2.file=null;
        _this.img2.dialogImageUrl = '';
        _this.img2.dialogVisible = false;
  
        _this.img3.file=null;
        _this.img3.dialogImageUrl = '';
        _this.img3.dialogVisible = false;
        
        if(document.getElementById('file1')) document.getElementById('file1').value='';
        if(document.getElementById('file2')) document.getElementById('file2').value='';
        if(document.getElementById('file3')) document.getElementById('file3').value='';
        
      },
      addMemberBtn(){
        this.initAddMemberDialog();
        this.dialogMemVisible=true;
      },
      //编辑
      clickEidt(row) {
        var that = this;
        that.dialogMemVisible = true;
        that.dialogTitle = "编辑会员";
        that.img1.dialogImageUrl = row.imageBase64Str;
        if(row.imageBase64Str){
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
        }
        
        that.img1.dialogVisible = true;
        that.addMember.name = row.name;
        that.addMember.userId=row.userId;
        that.addMember.memberId=row.memberId;
        that.addMember.age=row.age;
        that.addMember.gender=row.gender;
        that.addMember.genderStr = that.addMember.gender.toString();
        that.addMember.phoneNumber=row.phoneNumber;
        that.addMember.verifyCode='';
        that.addMember.dateOfBirth=row.dateOfBirth;
        that.addMember.groupId=this.groupId;
        that.disabledInput = true;
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
          if(!this.addMember.userId) {
            this.required.userId="请填写会员号";
            this.required.ruserId=true;
            return;
          }else{
            this.required.userId="会员号";
            this.required.ruserId=false;
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

          formData.append('userId', this.addMember.userId)
          formData.append('name', this.addMember.name)
          formData.append('dateOfBirth', this.addMember.dateOfBirth.format("yyyy-MM-dd"))
          formData.append('age', this.addMember.age)
          formData.append('gender', Number(this.addMember.genderStr))
          formData.append('phoneNumber', this.addMember.phoneNumber)
          formData.append('verifyCode', this.addMember.verifyCode)
          let config = {
              headers: {
                  'Content-Type': 'multipart/form-data'
              },
              isFormData:true
          }

          var that = this;
          if(that.addMember.memberId){
            //修改会员
            formData.append('memberId', this.addMember.memberId)
            axios.post(UPDATE_URL, formData,config).then( data => {
              if(data.result&&data.result.error_code==ERROR_CODE){
                this.$message.success("修改成功");
                this.getPagedMember(1);
              }else{
                this.$message.error(data.result.error_msg || "修改失败，请检查数据是否填写正确");
              }
              
            }).catch( res => {
              
            })
            _this.closeDilog();

            // updateMember(that.addMember,(data)=>{
            //   if(data.result&&data.result.error_code==ERROR_CODE){
            //     this.$message.success("修改成功");
            //     this.dialogMemVisible=false;
            //     this.getPagedMember(1);
            //   }else{
            //     this.$message.error("修改失败，请重新操作");
            //   }
            // });
            // _this.closeDilog();
          }
          else{
            //添加会员
            axios.post(UPLOAD_URL, formData,config).then( data => {
              if(data.result&&data.result.error_code==ERROR_CODE){
                this.$message.success("添加成功");
                this.getPagedMember(1);
              }else{
                this.$message.error(data.result.error_msg || "添加失败，请检查数据是否填写正确");
              }
              
            }).catch( res => {
              
            })
            _this.closeDilog();

          }
      },
      // 点击删除按钮
      deleteHandler: function(row) {
        this.delHandler(row);
      },
      //确定删除
      delHandler:function(row){
        var that=this;
          this.$confirm('会员名：'+ row.name, '确认是否删除？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            dangerouslyUseHTMLString: true
          }).then(() => {
            that.addMember.groupId=that.groupId;
            that.addMember.memberId=row.memberId;
              deleteMember(that.addMember,(data)=>{
                if(data.result&&data.result.error_code==ERROR_CODE){
                  this.$message.success("删除成功");
                  this.dialogVisible=false;
                  this.getPagedMember(1);
                }else{
                  this.$message.error("删除失败，请重新操作");
                }
              });
          }).catch(() => {
                       
          });
      },
      closeDilog(){
        this.initAddMemberDialog();
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
