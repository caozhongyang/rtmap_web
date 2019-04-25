<template>
    <div>
        
        <div class="card-content wth-100 height-card">
                <el-row>
                    <el-col :span="12" class="line-h pading-30" style="text-align:left;">
                      <span class="line-name">到场会员</span>
                    </el-col>
                    <el-col :span="12" class="line-h pading-30" style="text-align:right;">
                        <span v-on:click="goToMember" class="line-name e-cursor">查看全部<i class="el-icon-arrow-right"></i></span>
                      </el-col>
                </el-row>
                <el-row style="height:auto;overflow: hidden;">
                    <!-- <el-col :span="4">
                        <div class="scroll-list-a">
                            <span class="scroll-list-head"><i></i></span>
                            <span class="scroll-list-name">李雷</span>
                            <span class="scroll-list-six">男 26-35</span>
                            <ul class="scroll-list-num">
                              <li>
                                <i></i>
                                <span>17:35</span>
                             </li>
                             <li>
                                <i></i>
                                <span>2018/07/21</span>
                             </li>
                             <li>
                                <i></i>
                                <span>123</span>
                             </li>
                            </ul>
                        </div>
                    </el-col>
                     -->
                     <scroll ref="memberScroll" :data="memberData" :isMember="true"></scroll>
                </el-row>
            </div>
            <div style="width:100%;height:15px;"></div>
            <div class="card-content wth-100  height-card">
                <el-row>
                    <el-col :span="12" class="line-h pading-30" style="text-align:left;">
                      <span class="line-name">到场非会员</span>
                    </el-col>
                    <el-col :span="12" class="line-h pading-30" style="text-align:right;">
                        <span v-on:click="goToCustom" class="line-name e-cursor">查看全部<i class="el-icon-arrow-right"></i></span>
                      </el-col>
                </el-row>
                <el-row style="height:auto;overflow: hidden;">
                    <!-- <el-col :span="4" style="padding:10px 0;">
                        <div class="scroll-list-b">
                            <span class="scroll-list-head"><i></i></span>
                            <div class="scroll-list-div">
                              <span><b>李雷</b> 17:35</span>
                              <span>男 16-35</span>
                            </div>
                        </div>
                    </el-col> -->
                    <scroll ref="customScroll" :data="customData" :isMember="false"></scroll>
                </el-row>
            </div>
            <div style="width:100%;height:15px;"></div>
    </div>
</template>

<script>
    import Bus from '../../bus.js';
    import scroll from './scroll'
    import { getLatestMemberList,getLatestCustomerList } from '@/api/common/common-api'

    
    export default {
        name:'scroll-picture',
        data() {
            return {
                activeIndex: 'customer',
                websock: null,
                heartCheck:null,    //心跳检查
                merchantId:sessionStorage.getItem('groupId'),    //商户id
                lockReconnect:false,
                reConnected:false,
                memberData:[],
                customData:[],
                socketDataCache:[],
                socketFlag:true
            }
        },
        components:{
            scroll
        },
        methods: {
            
            goToMember(){
                if(sessionStorage.getItem('menuType')){
                    sessionStorage.setItem('menuType',this.activeIndex);
                }
                // 改变顶部菜单颜色
                Bus.$emit('menuColorEvent','2');
                this.$router.push({path: '/customer/MemberRecord'});
                
            },
            goToCustom(){
                if(sessionStorage.getItem('menuType')){
                    sessionStorage.setItem('menuType',this.activeIndex);
                }
                // 改变顶部菜单颜色
                Bus.$emit('menuColorEvent','2');
                this.$router.push({path: '/customer/NonMember'});
                
            },
            goToCamera(){

            },
            initWebSocket(buildId){ //初始化weosocket
                //ws地址
                // const wsuri = 'ws://123.57.74.38:9102/facial/webSocket/' + sessionStorage.getItem('groupId');
                const wsuri = 'ws://192.144.176.135:9102/facial/webSocket/' + sessionStorage.getItem('groupId');
                // const wsuri = 'ws://127.0.0.1:9103/facial/webSocket/' + sessionStorage.getItem('groupId');
                // const wsuri = 'ws://192.144.176.135:9102/facial/webSocket/rtmap_lbs';
                var _this=this;
                _this.socketFlag = true;

                if ('WebSocket' in window) {
                    this.websock = new WebSocket(wsuri);
                } else if ('MozWebSocket' in window) {
                    this.websock = new MozWebSocket(wsuri);
                } else {
                    alert("您的浏览器不支持websocket")
                }

                if(!this.websock) return;

                this.websock.onopen=this.websocketonopen;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onclose = this.websocketclose;
                this.websock.onerror = this.websocketonerror;

                //心跳检测,每10s心跳一次
                this.heartCheck = {
                    timeout: 10000,
                    timeoutObj: null,
                    serverTimeoutObj: null,
                    reset: function(){
                        clearTimeout(this.timeoutObj);
                        clearTimeout(this.serverTimeoutObj);
                        return this;
                    },
                    start: function(){

                        var self = this;
                        this.timeoutObj = setTimeout(function(){
                            if(!_this.websock) return;
                            //这里发送一个心跳，后端收到后，返回一个心跳消息，
                            //onmessage拿到返回的心跳就说明连接正常
                            let HeartBeat= {
                                "merchantId": sessionStorage.getItem('groupId'),  //商户id
                                "msgType": "heartbeat", // "  消息类型:  remind 到店提醒  heartbeat:心跳
                                "timestamp":new Date().format("yyyy-MM-dd hh:mm:ss")  //心跳时间
                            }
                            _this.websocketsend(JSON.stringify(HeartBeat));
                            // console.info("客户端发送心跳：" + new Date().format("yyyy-MM-dd hh:mm:ss"));
                            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                                if (!_this.websock.readyState === _this.websock.OPEN) {
                                    _this.websock.close();
                                }
                                //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                            }, self.timeout)
                        }, self.timeout)
                    }
                }
            },
            websocketonopen(e){
                if(this.heartCheck) this.heartCheck.reset().start();
            },
            websocketonmessage(e){ //数据接收
        
                if(this.IsJsonString(e.data)){
                    var item=JSON.parse(e.data);
                    console.log(item);
                    if(item.msgType&&item.msgType=='remind'){
                        item.imageBase64Str="data:image/jpeg;base64,"+item.imageBase64Str;
                        item.date=new Date(item.currentVisitTime.replace(/\-/g, "/")).format('yyyy-MM-dd');
                        item.time=new Date(item.currentVisitTime.replace(/\-/g, "/")).format('hh:mm');
                        this.socketDataCache.push(item);
                    }
                }else{
                    console.log('%c'+e.data,'color:green');
                }
                // console.log(redata.value);
                if(this.heartCheck) this.heartCheck.reset().start();
            },
            websocketsend(agentData){//数据发送
                this.websock.send(agentData);
            },
            websocketclose(e){  //关闭
                console.log("connection closed (" + e.code + ")");
                this.reconnect();
            },
            websocketonerror(e){
                console.log('websocket连接异常了');
            },
            reconnect() {
                //只重连一次
                // if(this.reConnected) {
                //     return;
                // };
                // this.reConnected = true;
                // this.initWebSocket();
                var buildId = sessionStorage.getItem('groupId');
                var _this = this;
                _this.socketFlag = false;
                if(_this.socketFlag == false){
                    if(_this.reConnected) {
                        return;
                    };
                }else{
                    _this.reConnected = true;
                    _this.initWebSocket(buildId);
                    _this.socketFlag = true;
                }

            },
            IsJsonString(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            },
            pushData(){
                var _this=this;
                if(_this.socketDataCache.length){
                    setTimeout(() => {
                        var socketdata=_this.socketDataCache.shift()
                        if(!socketdata) return;

                        socketdata.dataTime=Date.now();
                        if(socketdata.isMember){
                            _this.memberData.push(socketdata);
                            // if(_this.memberData.length>10){
                            //     _this.memberData = _this.memberData.slice(-10);
                            // }
                        }else{
                            _this.customData.push(socketdata);
                            // if(_this.customData.length>10){
                            //     _this.customData = _this.customData.slice(-10);
                            // }
                        }
                    }, 1200)
                }

                setTimeout(() => {
                    _this.pushData();
                }, 1000)
            },
            pushFakeData(){
                var _this=this;
                setTimeout(() => {
                    _this.memberData.push(Math.random());
                    _this.customData.push(Math.random());
                    _this.pushFakeData();
                }, 2000)
            },
            getMember(){
                var that = this;
                getLatestMemberList({groupId:sessionStorage.getItem('groupId'),rowCount:'10'},(data)=>{
                    if(data.result&&data.result.error_code=="000000"){
                        data.latestMemberList.map((item)=>{
                            item.imageBase64Str="data:image/jpeg;base64,"+item.imgBase64;
                            item.date=new Date(item.visitTime.substr(0,19).replace(/\-/g, "/")).format('yyyy-MM-dd');
                            item.time=new Date(item.visitTime.substr(0,19).replace(/\-/g, "/")).format('hh:mm');
                            switch(item.gender){
                                case 1:
                                item.gender="男";
                                break;
                                case 2:
                                item.gender="女";
                                break;
                                default :
                                item.gender="未知";
                                break;
                            }
                        });
                        that.memberData = [];
                        // that.memberData=data.latestMemberList;
                        that.memberData=data.latestMemberList.reverse();
                        that.memberData = that.memberData.splice(3);
                    }
                });
            },
            getCustomer(){
                var that = this;
                getLatestCustomerList({groupId:sessionStorage.getItem('groupId'),rowCount:'10'},(data)=>{
                    if(data.result&&data.result.error_code=="000000"){
                        data.latestCustomerList.map((item)=>{
                            item.imageBase64Str="data:image/jpeg;base64,"+item.imgBase64;
                            item.date=new Date(item.visitTime.substr(0,19).replace(/\-/g, "/")).format('yyyy-MM-dd');
                            item.time=new Date(item.visitTime.substr(0,19).replace(/\-/g, "/")).format('hh:mm');
                            switch(item.gender){
                                case 1:
                                item.gender="男";
                                break;
                                case 2:
                                item.gender="女";
                                break;
                                default :
                                item.gender="未知";
                                break;
                            }
                        });
                        that.customData = [];
                        // that.customData=data.latestCustomerList;
                        that.customData=data.latestCustomerList.reverse();
                    }
                });
            },
            refresh(){
                this.$forceUpdate();
                this.$refs.memberScroll.refresh();
                this.$refs.customScroll.refresh();
            }
        },
        created(){
            var buildId = sessionStorage.getItem('groupId');
            this.pushData();
            this.getMember();
            this.getCustomer();
            setTimeout(()=>{
                this.initWebSocket(buildId); 
            },1000);
        },
        mounted(){
            //模拟新增数据
            //  this.pushFakeData();
        },
        destroyed(){
            this.websock.close();
            this.websock=null;
            this.heartCheck=null;
        }
    }
</script>
