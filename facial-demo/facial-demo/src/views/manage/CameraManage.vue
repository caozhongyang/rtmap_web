<template>
<div style="margin-top:24px">
    <el-container>

      <el-aside class="aside-list">
        <el-menu :default-openeds="['4']" class="menu-list">
          <el-menu-item index="1" @click="areaHandler">区域管理</el-menu-item>
          <!-- <el-menu-item index="2" @click="userHandler">用户管理</el-menu-item>
          <el-menu-item index="3" @click="roleHandler">角色管理</el-menu-item> -->
          <el-menu-item index="4" @click="cameraHandler" class="is-active">摄像机管理</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
  <div class="main-content camera-content content-manage">
    <div class="look-content">
        <el-row >
          <el-col :span="16">
            <div class="look-sel">
                <el-col :span="5" class="member ">
                    <el-select v-model="queryCriteria.floor" @change="floorChange" placeholder="全部楼层">
                      <el-option v-for="item in floorArry" :key="item.floorId" :label="item.floorName" :value="item.floorId"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" class="member">
                    <el-select v-model="queryCriteria.areaId" @change="areaChange" placeholder="全部区域">
                      <el-option v-for="item in areaArry" :key="item.areaId"  :label="item.areaName" :value="item.areaId"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6" class="member">
                    <el-input v-model="queryCriteria.deviceId" placeholder="设备ID(DeviceId)" class="input-width"></el-input>
                </el-col>
                <el-col :span="5" class="member">
                    <el-input v-model="queryCriteria.ip" placeholder="摄像头IP" class="input-width"></el-input>
                </el-col>
            </div>
          </el-col>
          <el-col :span="4">
             <el-button @click="getPagedDevice(1)" type="primary" class="look-btn"><i class="fa fa-search"></i><span>查询</span></el-button>
          </el-col>
          <el-col :span="4">
            <span class="look-camera-btn" @click="dialogVisible = true" v-show="addBtnShow"></span>
          </el-col>
        </el-row>
    </div>
    <el-table :data="tableData" :row-class-name="tableRowClassName" style="width: 100%">
        <el-table-column prop="deviceNum" label="编号"  width="170" align="center"></el-table-column>
        <el-table-column prop="floorNum" label="楼层" width="170" align="center"></el-table-column>
        <el-table-column prop="areaName" label="区域" align="center"></el-table-column>
        <el-table-column prop="ip" label="IP" align="center"></el-table-column>
        <!-- <el-table-column prop="createTimeDesc" width="170" label="创建时间"></el-table-column> -->
        <!-- <el-table-column prop="del" :render-header="renderDelIcon" class="del-icon" width="170" align="center" v-if="editShow">
           <template slot-scope="scope">
            <el-button type="info" round size="small"  @click="clickEidt(scope.row)">编辑</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="260" align="center" v-if="editShow">
          <template slot-scope="scope">
            <el-button type="info" round size="small"  @click="clickEidt(scope.row)">编辑</el-button>
            <el-button type="info" round size="small" @click="deleteHandler(scope.row)">删除</el-button> 
          </template>
        </el-table-column>
    </el-table>
    <div class="page-block">
        <el-pagination v-show="pageData.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.currentPage" :page-size="pageData.pageSize" layout="total, prev, pager, next" :total="pageData.totalCount">
        </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="initAddDeviceDialog" width="75%">
        <el-row :gutter="20">
          <el-col :span="22">
            <div class="look-sel">
                <el-col :span='6' class="pading-0">
                    <div class="demo-input-suffix member pading-0 camera">
                        楼层
                      <el-select v-model="addCamera.floor" @change="floorChangeHandle" style="width:80%;">
                          <el-option v-for="item in addSelectFloor" :key="item.floorId" :label="item.floorName" :value="item.floorId"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='6' class="pading-0">
                    <div class="demo-input-suffix member pading-0 camera">
                        区域
                      <el-select v-model="addCamera.areaId" @change="areaChangeHandle" style="width:80%;">
                        <el-option v-for="item in addSelectArea" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
                      </el-select>
                    </div>
                </el-col>
                <el-col :span='6' class="pading-0">
                    <div class="demo-input-suffix member pading-0 camera">
                        设备ID
                        <el-input v-model="addCamera.deviceId" class="input-width" style="width:80%;" :disabled="disabledInput"></el-input>
                    </div>
                </el-col>
                <el-col :span='6' class="pading-0">
                    <div class="demo-input-suffix member pading-0 camera">
                        IP
                        <el-input v-model="addCamera.ip" class="input-width" style="width:80%;"></el-input>
                    </div>
                </el-col>
              </div>
          </el-col>
          <!-- <el-col :span="4">
             <el-button type="primary" class="look-btn look-btn-add" @click="addDevice"><span>添加</span></el-button>
          </el-col> -->
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="close-btn">取 消</el-button>
          <el-button type="primary" class="look-btn look-btn-add" @click="addDevice">确定</el-button>
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
import {addNewDevice,updateDevice,deleteDevice,queryDevice} from '@/api/camera/camera-api'
import { getFloorsOfGroup,getAreasOfFloor } from '@/api/common/common-api'

  //错误验证码
  const ERROR_CODE='000000';

export default {
  data() {
    return {
      dialogTitle:"添加摄像头",
      disabledInput:false,
      addBtnShow:false,
      editShow:false,
      dialogVisible:false,
      groupId:sessionStorage.getItem('groupId'),
      floorArry:[
      ],
      areaArry:[
      ],
      tableData: [],
      currentPage: 5,
      floorArry:[
      ],
      areaArry:[
      ],
      addCamera:{
        deviceId:'',
        ip:'',
        groupId:'',
        floor:'',
        areaId:''
      },
      queryCriteria:{
        deviceId:'',
        ip:'',
        groupId:'',
        floor:'',
        areaId:'',
        pageNum:1,
        rowCount:10
      },
      pageData:{
        pageSize:10,
        currentPage:1,
        totalCount:0
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
  created(){
    this.getFloor();
    this.init();
    var that = this;
    that.accessArry = JSON.parse(sessionStorage.getItem('access'));
    that.accessArry.forEach(function(val){
      if(val == "access:camera:add"){
        that.addBtnShow = true;
      }
      else if(val == "access:camera:edit"){
        that.editShow = true;
      }
    })
  },
  methods: {
    areaHandler:function(){
       this.$router.push({path:"/manage/AreaManage"});
    },
    // userHandler:function(){
    //   this.$router.push({path:"/manage/UserManage"});
    // },
    // roleHandler:function(){
    //   this.$router.push({path:"/manage/RoleManage"});
    // },
    cameraHandler:function(){
       this.$router.push({path:"/manage/CameraManage"});
    },
   //table斑马线
    tableRowClassName({row, rowIndex}) {
      
      if (rowIndex%2 == 0) {
        return 'success-row';
      } else if (rowIndex%2 ==2) {
        return 'warning-row';
      }
      return '';
    },
    // renderDelIcon(h, column){
    //   return (<div class='del-cell'></div>);
    // },
    init(){
      this.getPagedDevice(1);
      this.initAddDeviceDialog();
    },
    getPagedDevice(page){
      let _this=this;
      this.queryCriteria.groupId=this.groupId;
      this.queryCriteria.pageNum=page;
      _this.pageData.currentPage = page;
      queryDevice(this.queryCriteria,(data)=>{
        if(data.data.resultList&&data.data){
          _this.tableData=data.data.resultList;
          _this.pageData.totalCount=data.data.totalRecord;
        }else{
          _this.tableData=[];
          _this.pageData.totalCount=0;
        }
      });
    },
    //编辑
    clickEidt(row) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑摄像头";
      this.addCamera.id = row.id;
      this.addCamera.deviceId=row.deviceNum;
      this.addCamera.ip=row.ip;
      this.addCamera.floor=row.floorNum;
      this.addCamera.areaName=row.areaName;
      this.addCamera.areaId=row.areaId;
      this.addCamera.groupId=this.groupId;
      this.disabledInput = true;
      this.getArea(this.addCamera.floor);
    },
    addDevice(){
      if(!this.addCamera.floor){
        this.$message.error('请选择楼层');
        return
      }
      if(!this.addCamera.areaId){
        this.$message.error('请选择区域');
        return
      }
      if(!this.addCamera.deviceId){
        this.$message.error('请填写设备ID');
        return
      }
      if(!this.addCamera.ip){
        this.$message.error('请填写IP地址');
        return
      }
      this.addDevice.groupId=this.groupId;
      // this.addCamera.floor='F1';
      // this.addCamera.areaId='';
      // this.addCamera.ip='127.0.0.1';
      // this.addCamera.deviceId=Math.floor(Math.random() * 999999);
      var that = this;
      if(that.addCamera.id){
        updateDevice(this.addCamera,(data)=>{
          if(data.result&&data.result.error_code==ERROR_CODE){
            this.$message.success("修改成功");
            this.dialogVisible=false;
            this.getPagedDevice(1);
          }else{
            this.$message.error("修改失败，请重新操作");
          }
        });
      }
      else{
        addNewDevice(this.addCamera,(data)=>{
          if(data.result&&data.result.error_code==ERROR_CODE){
            this.$message.success("添加成功");
            this.dialogVisible=false;
            this.getPagedDevice(1);
          }else{
            this.$message.error("添加失败，请重新操作");
          }
        });
      }
    },
    // 点击删除按钮
    deleteHandler: function(row) {
      this.delHandler(row);
    },
    //确定删除
    delHandler:function(row){
      var that=this;
        this.$confirm('设备ID：'+ row.deviceNum, '确认是否删除？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
            var that = this;
            that.addCamera.deviceId=row.deviceNum;
            deleteDevice(this.addCamera,(data)=>{
              if(data.result&&data.result.error_code==ERROR_CODE){
                this.$message.success("删除成功");
                this.dialogVisible=false;
                this.getPagedDevice(1);
                that.addCamera.deviceId="";
              }else{
                this.$message.error("删除失败，请重新操作");
              }
            });
        }).catch(() => {
                     
        });
    },
    initAddDeviceDialog(){
      this.dialogTitle = "添加摄像头";
      this.addCamera.id = '';
      this.addCamera.deviceId='';
      this.addCamera.ip='';
      this.addCamera.floor='';
      this.addCamera.areaId='';
      this.addCamera.areaName='';
      this.addCamera.groupId=this.groupId;
      this.disabledInput = false;
    },
    floorChange(floorId){
      if(!floorId){
        this.criteria.area='';
      }
      this.getArea(floorId);
    },
    areaChange(areaId){
      this.getPagedDevice(1);
    },
    floorChangeHandle(floorId){
      if(!floorId){
        this.criteria.area='';
      }
      this.getArea(floorId);
    },
    areaChangeHandle(areaId){
      var that = this;
      that.addCamera.areaId = areaId;
    },
    getFloor(){
      var _this=this;
      var criteria={
        groupId:_this.groupId
      };
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
      getAreasOfFloor({"groupId":_this.groupId,"floorId":floor},(data)=>{
        if(data.result&&data.result.error_code==ERROR_CODE){
          var arr=[{areaId:'',areaName:'全部区域'}];
          data.AreaInfo.map((f)=>{
            arr.push(f);
          });
          _this.areaArry=arr;
        }
      });
    },

    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getPagedDevice(val);
    }
  }
};
</script>