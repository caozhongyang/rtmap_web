<template>
  <div class="content1 camera-content">
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
                <el-col :span="5" class="member">
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
        <el-table-column prop="del" :render-header="renderDelIcon" class="del-icon" width="170" align="center" v-if="editShow">
           <template slot-scope="scope">
            <el-button type="info" round size="small"  @click="clickEidt(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
    </el-table>
    <div class="page-block">
        <el-pagination v-show="pageData.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageData.currentPage" :page-size="pageData.pageSize" layout="total, prev, pager, next" :total="pageData.totalCount">
        </el-pagination>
    </div>
    <el-dialog title="添加摄像头" :visible.sync="dialogVisible" @close="initAddDeviceDialog" width="70%">
        <el-row :gutter="20">
          <el-col :span="20">
            <div class="look-sel">
                <el-col :span='6' class="pading-0">
                    <div class="demo-input-suffix member pading-0 camera">
                        楼层
                      <el-select v-model="addCamera.floor" @change="floorChange" style="width:80%;">
                          <el-option v-for="item in addSelectFloor" :key="item.floorId" :label="item.floorName" :value="item.floorId"></el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span='6' class="pading-0">
                    <div class="demo-input-suffix member pading-0 camera">
                        区域
                      <el-select v-model="addCamera.areaId" style="width:80%;">
                        <el-option v-for="item in addSelectArea" :key="item.areaId" :label="item.areaName" :value="item.areaId"></el-option>
                      </el-select>
                    </div>
                </el-col>
                <el-col :span='6' class="pading-0">
                    <div class="demo-input-suffix member pading-0 camera">
                        设备ID
                        <el-input v-model="addCamera.deviceId" class="input-width" style="width:80%;"></el-input>
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
          <el-col :span="4">
             <el-button type="primary" class="look-btn look-btn-add" @click="addDevice"><span>添加</span></el-button>
          </el-col>
        </el-row>
    </el-dialog>
  </div>
</template>

 <style lang="css">
    @import '../../assets/css/common.css';
</style>

<script>
import {addNewDevice,queryDevice} from '@/api/camera/camera-api'
import { getFloorsOfGroup,getAreasOfFloor } from '@/api/common/common-api'

  //错误验证码
  const ERROR_CODE='000000';

export default {
  data() {
    return {
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
   //table斑马线
    tableRowClassName({row, rowIndex}) {
      
      if (rowIndex%2 == 0) {
        return 'success-row';
      } else if (rowIndex%2 ==2) {
        return 'warning-row';
      }
      return '';
    },
    renderDelIcon(h, column){
      return (<div class='del-cell'></div>);
    },
    init(){
      this.getPagedDevice(1);
      this.initAddDeviceDialog();
    },
    getPagedDevice(page){
      let _this=this;
      this.queryCriteria.groupId=this.groupId;
      this.queryCriteria.pageNum=page;

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
      addNewDevice(this.addCamera,(data)=>{
        if(data.result&&data.result.error_code==ERROR_CODE){
          this.$message.success("添加成功");
          this.dialogVisible=false;
          this.getPagedDevice(1);
        }else{
          this.$message.error("添加会员失败，请重新操作");
        }
      });
    },
    initAddDeviceDialog(){
      this.addCamera.deviceId='';
      this.addCamera.ip='';
      this.addCamera.floor='';
      this.addCamera.areaId='';
      this.addCamera.groupId=this.groupId;
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
    //编辑
    clickEidt(row) {
      console.log(row);
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getPagedDevice(val);
    },
    //添加摄像头弹窗
    /*handleClose() {

      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }*/
  }
};
</script>