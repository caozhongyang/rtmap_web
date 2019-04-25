<template>
  <div class="content1 index-content">
     <!--  {{this.peopleData}} -->
      <el-row class="margin-bottom-20">
        <el-col class="tit-cont">
          <div class="bg-tit-cont">
                <span class="bg-tit">{{buildName}}</span>
          </div>
          <div class="el-selec-cont selectAll">
              <el-select v-model="isDefault" @change="buildChange">
                <el-option
                  v-for='item in buildArry'
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <el-select v-model="criteria.floor" @change="floorChange">
                <el-option
                  v-for="item in floorArry"
                  :key="item.floorId"
                  :label="item.floorName"
                  :value="item.floorId">
                </el-option>
              </el-select>
              <el-select v-model="criteria.area" @change="areaChange" >
                <el-option
                  v-for="item in areaArry"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId">
                </el-option>
              </el-select>
        </div>
        </el-col>
        <el-col>
          <span class="people-total">今日到访<b>{{this.peopleData.today}}</b>人次</span>
        </el-col>
      </el-row>
      <el-row class="margin-bottom-20" type="flex" justify="space-between">
        <el-col :span="6" class="width-32">
          <div class="people-list list-a">
            <div class="list-div">
                <div class="list-name">本周到场人次</div>
                <div class="list-num"><b>{{this.peopleData.week}}</b>人次</div>
            </div>
            <img src="../../assets/images/peo-bg2.png">
          </div>
        </el-col>
        <el-col :span="6" class="width-32">
          <div class="people-list list-b">
            <div class="list-div">
                <div class="list-name">本月到场人次</div>
                <div class="list-num"><b>{{this.peopleData.month}}</b>人次</div>
            </div>
            <img src="../../assets/images/peo-bg3.png">
          </div>
        </el-col>
        <el-col :span="6" class="width-32">
          <div class="people-list list-c">
            <div class="list-div">
                <div class="list-name">年到场人次</div>
                <div class="list-num"><b>{{this.peopleData.total}}</b>人次</div>
            </div>
            <img src="../../assets/images/peo-bg1.png">
          </div>
        </el-col>
      </el-row>
      <div class="card-content wth-100 height-card card-btn">
          <el-row class="sel pading-10" style="text-align:left;">
              <el-select v-model="segmentModel" @change="showTypeChange" placeholder="全部楼层" style="margin-right:20px">
                <el-option
                  v-for="item in segmentSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span v-on:click="btnChangeHandler('0')" :class="{'btn-change':true,'btn-change-active':btnChange=='0'}" v-show="todayShow0">分时客流</span>
              <span v-on:click="btnChangeHandler('1')" :class="{'btn-change':true,'btn-change-active':btnChange=='1'}" v-show="todayShow1">首次到访</span>
          </el-row>
          <el-row>
              <el-col :span="8">
                <div class="grid-content bg-purple-dark">
                  <lineChart :data="reports.topPassengerFlow" :title="title1" :totalCount="todayPeopleCount" :Xvalue="reports.ToplineXvalue" ref="topLineChart"></lineChart>
                </div>
              </el-col>
              <el-col :span="8">
                  <div class="grid-content bg-purple-dark">
                    <nightingaleChart :data="reports.topCustomAge" title="顾客年龄" ref="topnightingaleChart" ></nightingaleChart>
                  </div>
              </el-col>
              <el-col :span="8">
                  <div class="grid-content bg-purple-dark">
                    <ringChart :data="reports.topCustomGender" title="顾客性别" ref="topringChart"></ringChart>
                  </div>
              </el-col>
          </el-row>
      </div>
      <div style="width:100%;height:15px;"></div>
      <scroll-picture ref="scroll_id"></scroll-picture>

      <el-row class="card-content  height-card" style="line-height:55px;text-align:left;">
        <el-col :span="21">
          <span v-on:click="tabClick('day')" :class="{'tab-btn':true,'tab-btn-active':btnActive=='day'}">昨日客流</span>
          <span v-on:click="tabClick('week')" :class="{'tab-btn':true,'tab-btn-active':btnActive=='week'}">上周客流</span>
          <span v-on:click="tabClick('month')" :class="{'tab-btn':true,'tab-btn-active':btnActive=='month'}">上月客流</span>
        </el-col>
        <el-col :span="3" style="text-align:center">
          <el-button type="primary" size="mini" @click="downLoadHandler" class="download-btn">导出报表</el-button>
        </el-col>
      </el-row>
      <div style="width:100%;height:15px;"></div>
      <el-row class="margin-bottom-20">
        <el-col :span="8">
          <div style="padding-right:15px;">
            <div class="card-content wth-100">
                <lineChart  :data="reports.lastPassengerFlow" :title="title2" :Xvalue="reports.BottomlineXvalue" :totalCount="yesterdayPeopleCount" ref="customLChart" ></lineChart>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <div class="card-content wth-100">
                <nightingaleChart :data="reports.lastCustomAge" title="顾客年龄"  ref="customNChart"></nightingaleChart>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="padding-left:15px;">
            <div class="card-content wth-100">
                <ringChart :data="reports.lastCustomGender" title="顾客性别" ref="customRChart"></ringChart>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="margin-bottom-20">
        <el-col :span="8" v-show="memberFlag">
          <div style="padding-right:15px;">
            <div class="card-content wth-100">
              <barChart ref='barChart' :type="barType" :data="reports.memberFreq"></barChart>
            </div>
          </div>
        </el-col>
        <el-col :span="8" v-show="customFlag">
          <div style="padding-right:15px;">
            <div class="card-content wth-100">
                <lineChart :data="reports.lastPassengerFlow2" :title="title3" :Xvalue="reports.BottomlineXvalue2" :totalCount="yesterdayPeopleCount2" ref="customLChart2" ></lineChart>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <div class="card-content wth-100">
                <nightingaleChart :data="reports.lastMemberAge" title="会员年龄"  ref="memberNChart"></nightingaleChart>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="padding-left:15px;">
            <div class="card-content wth-100">
                <ringChart :data="reports.lastMemberGender" title="会员性别" ref="memberRChart"></ringChart>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="width:100%;height:15px;"></div>
      <!-- 显示导出报表详情弹框 -->
      <el-dialog title="导出报表" :visible.sync="dialogVisible"
          width="30%" align="left" class="downloadForm">
            <el-form class="rt-form-item" ref="form" :model="form" :rules="rules"  label-width="100px" label-position="right">
              <el-form-item label="楼层：" prop="floorNum">
                <el-select v-model="floorSelect" @change="floorDownLoad" placeholder="请选择">
                <el-option
                  v-for="item in floorArry"
                  :key="item.floorId"
                  :label="item.floorName"
                  :value="item.floorId">
                </el-option>
              </el-select>
              </el-form-item>
              <el-form-item label="区域：" prop="areaId">
                <el-select v-model="areaSelect" @change="areaDownLoad" placeholder="请选择">
                <el-option
                  v-for="item in areaArry"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId">
                </el-option>
              </el-select>
              </el-form-item>
              <el-form-item label="时间：" prop="timeOption">
                <el-select v-model="timeOptionSelect" @change="dateChange" placeholder="全部">
                  <el-option label="全部" value="0"></el-option>
                  <el-option label="今日" value="1"></el-option>
                  <el-option label="本周" value="2"></el-option>
                  <el-option label="本月" value="3"></el-option>
                  <el-option label="昨日" value="4"></el-option>
                  <el-option label="上周" value="5"></el-option>
                  <el-option label="上月" value="6"></el-option>
                  <el-option label="自定义" value="7"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="" v-show="isDate">
                <el-date-picker
                  v-model="pickerValue"
                  type="daterange"
                  align="left"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="客群：" prop="isMember">
                <el-select v-model="memberSelect" @change="memberChange" placeholder="全部">
                  <el-option label="全部" value="2"></el-option>
                  <el-option label="会员" value="1"></el-option>
                  <el-option label="非会员" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="close-btn">取 消</el-button>
            <el-button type="primary" @click="modifyHandler" class="pri-btn">确定</el-button>
          </div>
        </el-dialog> 
  </div>
</template>

<script>
  import scrollPicture from '@/components/home/scroll-picture'
  import lineChart from '@/components/home/line-chart'
  import nightingaleChart from '@/components/home/nightingale-chart'
  import ringChart from '@/components/home/ring-chart'
  import barChart from '@/components/home/bar-chart'
  //import api
  import {
          getVisitRecordTotal,
          getVisitRecordToay,
          getVisitRecordThisWeek,
          getVisitRecordMonth,
          //分时客流
          getStaffRecordSegmentToday,
          getStaffRecordSegmentYesterday,
          getStaffRecordSegmentThisWeek,
          getStaffRecordSegmentThisMonth,
          getStaffRecordSegmentLastWeek,
          getStaffRecordSegmentLastMonth,
          //会员年龄
          getStaffRecordAgeToday,
          getStaffRecordAgeYesterday,
          getStaffRecordAgeThisWeek,
          getStaffRecordAgeThisMonth,
          getStaffRecordAgeLastWeek,
          getStaffRecordAgeLastMonth,
          //男女性别
          getStaffRecordGenderToday,
          getStaffRecordGenderYesterday,
          getStaffRecordGenderThisWeek,
          getStaffRecordGenderThisMonth,
          getStaffRecordGenderLastWeek,
          getStaffRecordGenderLastMonth,
          //会员频次
          getStaffRecordFreqLastWeek,
          getStaffRecordFreqLastMonth,

          //人数
          getStaffRecordCountToday,
          getStaffRecordCountYesterday,
          getStaffRecordCountThisWeek,
          getStaffRecordCountLastWeek,
          getStaffRecordCountThisMonth,
          getStaffRecordCountLastMonth,

          //导出报表
          exportStaffRecordToCsv,
          
          } from '@/api/home/home-api'

  import { getFloorsOfGroup,getAreasOfFloor } from '@/api/common/common-api'

  //是否是会员
  const ISMEMBER={
    YES:1,
    NO:2
  }
  //错误验证码
  const ERROR_CODE='000000';

  export default {
    name:'index',
    components:{
      scrollPicture,
      lineChart,
      nightingaleChart,
      ringChart,
      barChart,
    },
    data() {
      var that=this;
      return {
        title1:'分时客流',
        title2:'分时客流',
        title3:'首次到访',
        memberFlag:true,
        customFlag:true,
        todayShow0:true,
        todayShow1:true,
        btnChange:'0',
        radio2:"0",
        buildName:"人脸客群洞察平台",
        btnActive:'day',
        todayStr:'day',
        yesterdayStr:'day',
        peopleData:{
          total:0,
          today:0,
          week:0,
          month:0
        },
        criteria:{
          groupId:'',
          floor:'',
          area:'',
          isFirstAppear:0 //首次到访= 1；分时客流=0
        },
        buildDefault:'',
        buildArry:[],
        floorArry:[
        ],
        areaArry:[
        ],
        segmentModel:'day',
        segmentSelect:[{label:'今日客流（人数）',value:'day'},{label:'本周客流（人数）',value:'thisweek'},{label:'本月客流（人数）',value:'thismonth'}],
        load:{
          topFirstLoad:true,
          bottomFirstLoad:true
        },
        reports:{
          ToplineXvalue:'',
          BottomlineXvalue:'',
          topPassengerFlow:null,//当天当周当月客流
          topCustomAge:null,//当天当周当月顾客年龄
          topCustomGender:null,//当天当周当月顾客性别

          lastPassengerFlow:null,//昨天上周上月客流
          lastPassengerFlow2:null,//昨天上周上月客流
          lastCustomAge:null,//昨天上周上月顾客年龄
          lastMemberAge:null,//昨天上周上月会员年龄
          lastCustomGender:null,//昨天上周上月顾客性别
          lastMemberGender:null,//昨天上周上月会员性别

          memberFreq:null,//会员频次
        },
        barType:"",
        loaded:false,
        todayPeopleCount:{
          member:0,
          custom:0,
        },
        yesterdayPeopleCount:{
          member:0,
          custom:0,
        },
        yesterdayPeopleCount2:{
          member:0,
          custom:0,
        },
        accessArry:[],
        isDefault:'',
        dialogVisible:false,
        form:{},//导出报表表格默认为空
        rules: {
          floorNum: [
            { required: true, message: '请输入', trigger: 'blur'},
            { min: 0, max: 100, message: '', trigger: 'blur' }
          ],
          areaId: [
            { required: true, message: '请输入', trigger: 'blur'},
            { min: 0, max: 100, message: '', trigger: 'blur' }
          ],
          timeOption: [
            { required: true, message: '请输入', trigger: 'blur'},
            { min: 0, max: 100, message: '', trigger: 'blur' }
          ],
          isMember: [
            { required: true, message: '请输入', trigger: 'blur'},
            { min: 0, max: 100, message: '', trigger: 'blur' }
          ],
          isMember: [
            { required: true, message: '请输入', trigger: 'blur'},
            { min: 0, max: 100, message: '', trigger: 'blur' }
          ]
        },
        floorSelect:'',
        areaSelect:'',
        timeOptionSelect:'0',
        memberSelect:"2",
        isDate:false,
        startDate:"",
        endDate:"",
        pickerOptions: {
          disabledDate(time){
            return time.getTime() >  Date.now()  - 8.64e7;
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
            that.endDate = that.getDateStr(-1);
            that.startDate = that.getDateStr(-7);
            picker.$emit('pick', [that.startDate, that.endDate]);
            that.searchData();
          }},
          {
          text: '最近一个月',
            onClick(picker) {
            that.endDate = that.getDateStr(-1);
            that.startDate = that.getDateStr(-30);
            picker.$emit('pick', [that.startDate, that.endDate]);
            that.searchData();
          }}
        ]
      },
      pickerValue: [],
      }
    },
    computed:{
      isMemberCriteria:function(){
        return Object.assign({isMember:ISMEMBER.YES},this.criteria);
      },
      noMemberCriteria:function(){
        return Object.assign({isMember:ISMEMBER.NO},this.criteria);
      },
      _pickerValue: {
        set: function(value) {
          this.pickerValue = value;
        },
        get: function() {
          return  [this.startDate,this.endDate];
        }
      }
    },
    methods:{
        buildChange(val){
          var _this = this;
          _this.criteria.groupId = val;
          sessionStorage.setItem('groupId',_this.criteria.groupId);
          // _this.criteria.floor = "";
          // _this.criteria.area = "";
          // _this.getFloor();
          // _this.getArea("");
          // _this.initData(true);
          this.$router.push({name:'back'});
          // _this.$refs.scroll_id.websock.close();
          // _this.$refs.scroll_id.initWebSocket(val); 
          // _this.$refs.scroll_id.getMember();
          // _this.$refs.scroll_id.getCustomer();
          // _this.$refs.scroll_id.refresh();
        },
        floorChange(floorId){
          if(!floorId){
            this.criteria.area='';
          }
          this.getArea(floorId);
          this.initData(true);
        },
        areaChange(){
          this.initData(true);
        },
        searchData:function(){
          var that=this;
          that.endDate = new Date(this.pickerValue[1]).Format('yyyy-MM-dd');
          that.startDate = new Date(this.pickerValue[0]).Format('yyyy-MM-dd');
          that.$emit('pick', [that.startDate, that.endDate]);
          // console.log(that.startDate+"."+that.endDate);
        },
        //获取日期
        getDateStr:function(AddDayCount) {
          var dd = new Date();
          dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
          var y = dd.getFullYear();
          var m = dd.getMonth() + 1;//获取当前月份的日期
          var d = dd.getDate();//
          // 给一位数数据前面加 “0”
          if (m >= 1 && m <= 9) {
            m = "0" + m;
          }
          if (d >= 0 && d <= 9) {
            d = "0" + d;
          }
          var date = y + "-" + m + "-" + d;
          return date;
        },
        //点击导出报表--按钮
        downLoadHandler:function(){
          var that =this;
          that.dialogVisible = true;
          that.form = {};
          that.floorSelect = '';
          that.areaSelect = '';
          that.timeOptionSelect = '0';
          that.isDate = false;
          that.memberSelect = '2';
        },
        floorDownLoad(val){
          var that = this;
          if(!val){
            that.floorSelect='';
          }
          that.floorSelect = val;
          that.getArea(val);
        },
        areaDownLoad(val){
          var that = this;
          that.areaSelect = val;
        },
       //时间---切换
        dateChange:function(val){
          var that = this;
          that.timeOptionSelect = val;
          if(val == 7){
            that.isDate = true;
          }
          else{
            that.isDate = false;
          }
        },
        memberChange:function(val){
          var that = this;
          that.memberSelect = val;
        },
        //导出报表--确认
        modifyHandler:function(){
          var that = this;
          that.dialogVisible = false;
          // var params = {
          //   "groupId":that.criteria.groupId,
          //   "floorNum":that.floorSelect,
          //   "areaId":that.areaSelect,
          //   "isMember":Number(that.memberSelect),
          //   "timeOption":Number(that.timeOptionSelect),
          //   "timeBegin":that.startDate,
          //   "timeEnd":that.endDate
          // };
          // exportStaffRecordToCsv(params,(data)=>{
          //   if(data.result&&data.result.error_code==ERROR_CODE){
          //     this.$message.success("下载成功");
          //     this.dialogVisible=false;
          //   }else{
          //     this.$message.error(data.result.error_msg || "下载失败，请重新操作");
          //   }
          // });

          const UPLOAD_URL=process.env.APP_API_ROOT+app.api.home.exportStaffRecordToCsv;
          var url = UPLOAD_URL +  
                 "?groupId=" + that.criteria.groupId + "&floorNum=" +
                 that.floorSelect + "&areaId=" + that.areaSelect +
                 "&isMember=" + Number(that.memberSelect) + "&timeOption=" +Number(that.timeOptionSelect)+ "&timeBegin" + that.startDate + "&timeEnd=" +that.endDate;
                 window.location.href = url;


                 
        },
        tabClick(val){
          if(this.btnActive!=val){
            this.tabSwitch(val)
            this.btnActive=val;
          }
        },
        btnChangeHandler(val){
          var that = this;
          if(val == 0){
            that.title1 = "分时客流";
            that.btnChange = val;
            // that.refreshSegment();
            // that.renderDay();
          }
          else if(val == 1){
            that.title1 = "首次到访";
            that.btnChange = val;
            // that.refreshSegment();
            // that.renderDay();
          }
        },
        refreshRecord(){
          let _this=this;
          
          getVisitRecordToay(_this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              let perCount; //每次刷新时增加的数量

              if(_this.loaded) {
                _this.peopleData.today=data.VisitStatToday;
              }
              let newAddPeople=data.VisitStatToday-_this.peopleData.today;
              
              // newAddPeople=33;
              let timeout=10;
              let remainder=0;//余数

              if(parseInt(newAddPeople/10)){
                if(newAddPeople%10){
                  remainder=newAddPeople%10;
                }
                perCount=parseInt(newAddPeople/10);
              }
              else if(newAddPeople>0){
                timeout=newAddPeople;
                perCount=1;
              }else{
                timeout=0;
              }

              for(var i=0;i<timeout;i++){
                let timeSec=(i+1)*1000;
                setTimeout(()=>{
                  if(!_this.loaded){
                     _this.updateCountOnScreen(perCount+(remainder-->0?1:0));
                  }
                },timeSec);
              }
            }
          });
          //10s之后开始下一次请求数据
          setTimeout(function(){
            _this.refreshRecord();
            _this.refreshToday();
          },11000);
        },
        updateCountOnScreen(percount){
          this.peopleData.total+=percount;
          this.peopleData.today+=percount;
          this.peopleData.week+=percount;
          this.peopleData.month+=percount;
        },
        initData(refresh){
          var _this=this;
          if(refresh) {
            this.loaded=true;
            setTimeout(function(){
              _this.loaded=false;
            },1000);
          }

          getVisitRecordTotal(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              _this.peopleData.total=data.VisitStatTotal;
              if(!refresh){
                setTimeout(function(){
                  _this.refreshRecord()
                },10000);
              }
            }
          });
          
          getVisitRecordToay(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.peopleData.today=data.VisitStatToday;
            }
          });
          getVisitRecordThisWeek(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.peopleData.week=data.VisitStatThisWeek;
            }
          });
          getVisitRecordMonth(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.peopleData.month=data.VisitStatThisMonth;
            }
          });
          if(refresh){
            this.showTypeChange(this.todayStr);
            this.tabSwitch(this.yesterdayStr);
          }
        },
        //昨日客流tab切换event
        tabSwitch(tab){
          this.yesterdayStr=tab;
          switch(tab){
              case 'day':
              this.renderYesterday();
              this.memberFlag = false;
              this.customFlag = true;
              break;
              case 'week':
              this.renderLastWeek();
              this.memberFlag = true;
              this.customFlag = false;
              break;
              case 'month':
              this.renderLastMonth();
              this.memberFlag = true;
              this.customFlag = false;
              break;
              default:
              break;
            }
        },
        //今日客流下拉框变化event
        showTypeChange(type){
            var _this = this;
            _this.todayStr=type;
            switch(type){
              case 'day':
              _this.todayShow0 = true;
              _this.todayShow1 = true;
              _this.btnChange = "0";
              _this.title1 = "分时客流"; 
              _this.renderDay();
              break;
              case 'thisweek':
              _this.btnChange = "0";
              _this.title1 = "分时客流"; 
              _this.renderThisWeek();
              _this.todayShow0 = false;
              _this.todayShow1 = false;
              break;
              case 'thismonth':
              _this.btnChange = "0";
              _this.title1 = "分时客流"; 
              _this.renderThisMonth();
              _this.todayShow0 = false;
              _this.todayShow1 = false;
              break;
              default:
              break;
            }
        },
        //当天，当周，当月的展示顾客用noMemberCriteria请求
        renderDay(){
          var _this=this;
            this.reports.ToplineXvalue='time';
           getStaffRecordCountToday(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              _this.todayPeopleCount.member=data.StaffRecordCountToday.memberCount;
              _this.todayPeopleCount.custom=data.StaffRecordCountToday.customerCount;
              getStaffRecordSegmentToday(this.criteria,(data)=>{
                if(data.result&&data.result.error_code==ERROR_CODE){
                  this.reports.topPassengerFlow=data.StaffRecordSegmentToday;
                  if(_this.load.topFirstLoad){
                    new Promise((resolve,reject) => {
                      resolve(); 
                    }).then((res) => {
                      _this.$refs.topLineChart.init();
                    })
                  }
                }
              });
            }
          });

          getStaffRecordAgeToday(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.topCustomAge=data.StaffRecordAgeToday;
              if(_this.load.topFirstLoad){
                new Promise((resolve,reject) => {
                  resolve(); 
                }).then((res) => {
                  _this.$refs.topnightingaleChart.init();
                })
              }
            }
          });
          getStaffRecordGenderToday(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.topCustomGender=data.StaffRecordGenderToday;
              if(_this.load.topFirstLoad){
                new Promise((resolve,reject) => {
                  resolve(); 
                }).then((res) => {
                  _this.$refs.topringChart.init(); 
                })
              }
            }
          });
          
          if(_this.load.topFirstLoad){
            _this.load.topFirstLoad=false;
          }
        },
        renderThisWeek(){
          var _this=this;
          this.reports.ToplineXvalue='day';
          getStaffRecordCountThisWeek(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
                _this.todayPeopleCount.member=data.StaffRecordCountThisWeek.memberCount;
                _this.todayPeopleCount.custom=data.StaffRecordCountThisWeek.customerCount;
                  getStaffRecordSegmentThisWeek(this.criteria,(data)=>{
                    if(data.result&&data.result.error_code==ERROR_CODE){
                      this.reports.topPassengerFlow=data.StaffRecordSegmentThisWeek;
                    }
                  });
            }
          });
         
          getStaffRecordAgeThisWeek(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.topCustomAge=data.StaffRecordAgeThisWeek;
            }
          });
          getStaffRecordGenderThisWeek(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.topCustomGender=data.StaffRecordGenderThisWeek;
            }
          });
        },
        renderThisMonth(){
          var _this=this;
          this.reports.ToplineXvalue='day';
          getStaffRecordCountThisMonth(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
                _this.todayPeopleCount.member=data.StaffRecordCountThisMonth.memberCount;
                _this.todayPeopleCount.custom=data.StaffRecordCountThisMonth.customerCount;
                getStaffRecordSegmentThisMonth(this.criteria,(data)=>{
                  if(data.result&&data.result.error_code==ERROR_CODE){
                    this.reports.topPassengerFlow=data.StaffRecordSegmentThisMonth;
                  }
                });
            }
          });
          
          getStaffRecordAgeThisMonth(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.topCustomAge=data.StaffRecordAgeThisMonth;
            }
          });
          getStaffRecordGenderThisMonth(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.topCustomGender=data.StaffRecordGenderThisMonth;
            }
          });
        },
        renderYesterday(){
          var _this=this;
          this.reports.BottomlineXvalue='time';
          this.reports.BottomlineXvalue2='time';
          this.barType="day";
          getStaffRecordCountYesterday(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              var obj={};
              // obj[new Date(new Date()-24*60*60*1000).getDate()]=_this.todayPeopleCount.member+_this.todayPeopleCount.custom;
              obj[1]=data.StaffRecordCountYesterday.memberCount;
              //_this.reports.memberFreq=obj;
            }
          });
          
          //会员部分
          getStaffRecordCountYesterday(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
                _this.yesterdayPeopleCount.member=data.StaffRecordCountYesterday.memberCount;
                _this.yesterdayPeopleCount.custom=data.StaffRecordCountYesterday.customerCount;
                _this.criteria.isFirstAppear = 0;
                getStaffRecordSegmentYesterday(this.criteria,(data)=>{
                  if(data.result&&data.result.error_code==ERROR_CODE){
                    _this.reports.lastPassengerFlow=data.StaffRecordSegmentYesterday;
                    if(_this.load.bottomFirstLoad){
                      new Promise((resolve,reject) => {
                        resolve(); 
                      }).then((res) => {
                        _this.$refs.customLChart.init();

                      })
                    }
                  }
                });
            }
          });
             
          getStaffRecordCountYesterday(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
                _this.yesterdayPeopleCount2.member=data.StaffRecordCountYesterday.memberCount;
                _this.yesterdayPeopleCount2.custom=data.StaffRecordCountYesterday.customerCount;
                _this.criteria.isFirstAppear = 1;
                getStaffRecordSegmentYesterday(this.criteria,(data)=>{
                  if(data.result&&data.result.error_code==ERROR_CODE){
                    _this.reports.lastPassengerFlow2=data.StaffRecordSegmentYesterday;
                    _this.memberFlag = false;
                    if(_this.load.bottomFirstLoad){
                      new Promise((resolve,reject) => {
                        resolve(); 
                      }).then((res) => {
                        _this.$refs.customLChart2.init();
                         _this.memberFlag = false;
                      })
                    }
                  }
                });
            }
          });
          
          getStaffRecordAgeYesterday(this.isMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              _this.reports.lastMemberAge=data.StaffRecordAgeYesterday;
              if(_this.load.bottomFirstLoad){
                new Promise((resolve,reject) => {
                  resolve(); 
                }).then((res) => {
                  _this.$refs.memberNChart.init();
                })
              }
            }
          });
          getStaffRecordGenderYesterday(this.isMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              _this.reports.lastMemberGender=data.StaffRecordGenderYesterday;
              if(_this.load.bottomFirstLoad){
                new Promise((resolve,reject) => {
                  resolve(); 
                }).then((res) => {
                  _this.$refs.memberRChart.init();
                })
              }
            }
          });
          //顾客部分
          getStaffRecordAgeYesterday(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              _this.reports.lastCustomAge=data.StaffRecordAgeYesterday;
              if(_this.load.bottomFirstLoad){
                new Promise((resolve,reject) => {
                  resolve(); 
                }).then((res) => {
                  _this.$refs.customNChart.init();
                })
              }
            }
          });
          getStaffRecordGenderYesterday(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              _this.reports.lastCustomGender=data.StaffRecordGenderYesterday;
              if(_this.load.bottomFirstLoad){
                new Promise((resolve,reject) => {
                  resolve(); 
                }).then((res) => {
                  _this.$refs.customRChart.init();
                })
              }
            }
          });

          // this.reports.memberFreq={'1':0};
          this.reports.memberFreq={};

          if(_this.load.bottomFirstLoad){
            new Promise((resolve,reject) => {
              resolve(this.reports.memberFreq); 
            }).then((res) => {
              _this.$refs.barChart.init();
            })
            _this.load.bottomFirstLoad=false;
          }
          
        },
        renderLastWeek(){
          var _this=this;
          this.reports.BottomlineXvalue='day';
          this.barType="week";
          //上周会员
          getStaffRecordCountLastWeek(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
                _this.yesterdayPeopleCount.member=data.StaffRecordCountLastWeek.memberCount;
                _this.yesterdayPeopleCount.custom=data.StaffRecordCountLastWeek.customerCount;
                getStaffRecordSegmentLastWeek(_this.criteria,(data)=>{
                  if(data.result&&data.result.error_code==ERROR_CODE){
                    _this.reports.lastPassengerFlow=data.StaffRecordSegmentLastWeek;
                  }
                });
            }
          });
          
          getStaffRecordAgeLastWeek(this.isMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.lastMemberAge=data.StaffRecordAgeLastWeek;
            }
          });
          getStaffRecordGenderLastWeek(this.isMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.lastMemberGender=data.StaffRecordGenderLastWeek;
            }
          });
          //上周顾客
          getStaffRecordAgeLastWeek(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.lastCustomAge=data.StaffRecordAgeLastWeek;
            }
          });
          getStaffRecordGenderLastWeek(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.lastCustomGender=data.StaffRecordGenderLastWeek;
            }
          });

          //上周会员频次
          getStaffRecordFreqLastWeek(this.isMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.memberFreq=data.StaffRecordFreqLastWeek;
            }
          });
        },
        renderLastMonth(){
          var _this=this;
          this.reports.BottomlineXvalue='day';
          this.barType="month";
          //上月会员
          getStaffRecordCountLastMonth(this.criteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
                _this.yesterdayPeopleCount.member=data.StaffRecordCountLastMonth.memberCount;
                _this.yesterdayPeopleCount.custom=data.StaffRecordCountLastMonth.customerCount;
                getStaffRecordSegmentLastMonth(_this.criteria,(data)=>{
                  if(data.result&&data.result.error_code==ERROR_CODE){
                    _this.reports.lastPassengerFlow=data.StaffRecordSegmentLastMonth;
                  }
                });
            }
          });
          
          getStaffRecordAgeLastMonth(this.isMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.lastMemberAge=data.StaffRecordAgeLastMonth;
            }
          });
          getStaffRecordGenderLastMonth(this.isMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.lastMemberGender=data.StaffRecordGenderLastMonth;
            }
          });
          //上月顾客
          getStaffRecordAgeLastMonth(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.lastCustomAge=data.StaffRecordAgeLastMonth;
            }
          });
          getStaffRecordGenderLastMonth(this.noMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.lastCustomGender=data.StaffRecordGenderLastMonth;
            }
          });

          //上月会员频次
          getStaffRecordFreqLastMonth(this.isMemberCriteria,(data)=>{
            if(data.result&&data.result.error_code==ERROR_CODE){
              this.reports.memberFreq=data.StaffRecordFreqLastMonth;
            }
          });
        },
        refreshToday(){
          var _this=this;
          if(_this.todayStr=="day"){
            getStaffRecordAgeToday(this.noMemberCriteria,(data)=>{
              if(data.result&&data.result.error_code==ERROR_CODE){
                this.reports.topCustomAge=data.StaffRecordAgeToday;
              }
            });
            getStaffRecordGenderToday(this.noMemberCriteria,(data)=>{
              if(data.result&&data.result.error_code==ERROR_CODE){
                this.reports.topCustomGender=data.StaffRecordGenderToday;
              }
            });
          }
        },
        refreshSegment(){
          let m=new Date().getMinutes();
          let s=new Date().getMilliseconds();
          let timeout=1000;
          var _this=this;

          
          setTimeout(function(){
            if(_this.todayStr=="day"){
              getStaffRecordCountToday(_this.criteria,(data)=>{
                if(data.result&&data.result.error_code==ERROR_CODE){
                  _this.todayPeopleCount.member=data.StaffRecordCountToday.memberCount;
                  _this.todayPeopleCount.custom=data.StaffRecordCountToday.customerCount;
                  _this.criteria.isFirstAppear = _this.btnChange;
                  getStaffRecordSegmentToday(_this.criteria,(data)=>{
                    if(data.result&&data.result.error_code==ERROR_CODE){
                      _this.reports.topPassengerFlow=data.StaffRecordSegmentToday;
                      if(_this.load.topFirstLoad){
                        new Promise((resolve,reject) => {
                          resolve(); 
                        }).then((res) => {
                          _this.$refs.topLineChart.init();
                        })
                      }
                    }
                  });
                }
              });

              getStaffRecordAgeToday(_this.noMemberCriteria,(data)=>{
                if(data.result&&data.result.error_code==ERROR_CODE){
                  _this.reports.topCustomAge=data.StaffRecordAgeToday;
                  if(_this.load.topFirstLoad){
                    new Promise((resolve,reject) => {
                      resolve(); 
                    }).then((res) => {
                      _this.$refs.topnightingaleChart.init();
                    })
                  }
                }
              });
              getStaffRecordGenderToday(_this.noMemberCriteria,(data)=>{
                if(data.result&&data.result.error_code==ERROR_CODE){
                  _this.reports.topCustomGender=data.StaffRecordGenderToday;
                  if(_this.load.topFirstLoad){
                    new Promise((resolve,reject) => {
                      resolve(); 
                    }).then((res) => {
                      _this.$refs.topringChart.init(); 
                    })
                  }
                }
              });
            }
            _this.refreshSegment()
          },timeout);
        },
        getFloor(){
        var criteria={
          groupId:this.criteria.groupId
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
        getAreasOfFloor({"groupId":this.criteria.groupId,"floorId":floor},(data)=>{
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
    created(){
      this.accessArry = JSON.parse(sessionStorage.getItem('access'));
      this.buildArry = JSON.parse(sessionStorage.getItem('buildGroup'));
      var _this=this;
      this.buildArry.map((f)=>{
        if(sessionStorage.getItem('groupId')){
          _this.isDefault = sessionStorage.getItem('groupId');
          _this.criteria.groupId = sessionStorage.getItem('groupId');
        }
        else{
          if(f.isDefault == '1'){
            _this.isDefault = f.id ;
            _this.criteria.groupId = f.id;
            sessionStorage.setItem('groupId',this.criteria.groupId);
          }
        }
      });
      this.getFloor();
      this.initData();
      this.refreshSegment();
    },
    mounted(){
      this.renderDay();
      this.renderYesterday();
      console.log(this.reports);
      var that=this;
      that.endDate = "";
      that.startDate = "";
      that.pickerValue = [that.startDate, that.endDate];

    }
  };
</script>