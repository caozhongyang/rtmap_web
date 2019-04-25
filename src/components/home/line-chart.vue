    <template>
        <div ref="linechart" style="width:100%;height:250px;">
            
        </div>
    </template>
    
    <script>
        var echarts = require('echarts');

        export default {
            name:'line-chart',
            props:{
                data:null,
                name:'',
                Xvalue:'',
                totalCount:{},
                title:''
            },
            data() {
                return {
                }
            },
            created(){
            },
            methods:{
                init(){
                    let _this=this;
                    
                    let myChart = echarts.init(this.$refs.linechart);
                    let xAxisData=[];
                    let customData=[];
                    let memberData=[];
                    let totalData=[];
                    let title=this.title;

                    let customTotal=this.totalCount.custom;
                    let memberTotal=this.totalCount.member;
                    let totalpeople=customTotal+memberTotal;
                    if(_this.data&&_this.data.length){
                        _this.data.map(function(item){
                            xAxisData.push(item.time);
                            customData.push(item.customerStaffCount);
                            memberData.push(item.memberStaffCount);
                            totalData.push(item.customerStaffCount+item.memberStaffCount);
                            // customTotal+=item.customerStaffCount;
                            // memberTotal+=item.memberStaffCount;
                        });
                    }else{
                        xAxisData=['1','2','3','4','5','6','7','8','9'];
                        customData=[0, 0, 0, 0, 0, 0, 0,0,0];
                        memberData=[0, 0, 0, 0, 0, 0, 0,0,0];
                    }

                    //到场总数
                    let lineColorTotal = '';
                    let colorTotal1 = '';
                    let colorTotal2 = '';
                    let colorTotal3 = '#d4e3fd';
                    //顾客数量
                    let lineColorCustom = '';
                    let colorCustom1 = '';
                    let colorCustom2 = '';
                    let colorCustom3 = '';
                    //会员数量
                    let lineColorMember = '';
                    let colorMember1 = '';
                    let colorMember2 = '';
                    let colorMember3 = '';

                    if(title == "分时客流"){
                        //到场总数
                        lineColorTotal = '#2573fb';//分时客流--到场总数线的颜色,line---代表线条颜色
                        colorTotal1 = '#85aef7';//分时客流--到场总数区域背景色渐变从上到下，colorTotal1--上；colorTotal2--中；colorTotal3--底部
                        colorTotal2 = '#bad4fe';
                        colorTotal3 = '#d4e3fd';
                        //顾客数量
                        lineColorCustom = '#26b0d2';
                        colorCustom1 = '#91d5f2';
                        colorCustom2 = '#BEDFFB';
                        colorCustom3 = '#d9edfd';
                        //会员数量
                        lineColorMember= '#70f1ff';
                        colorMember1 = '#d0f5f9';
                        colorMember2 = '#e1fcff';
                        colorMember3 = '#eafdff';
                    }
                    else if(title == "首次到访"){
                        //到场总数
                        lineColorTotal = '#da46a0';
                        colorTotal1 = '#ffb0b4';
                        colorTotal2 = '#ffd1cf';
                        colorTotal3 = '#fff5f3';
                        //顾客数量
                        lineColorCustom = '#ff7b7b';
                        colorCustom1 = '#fbc8b6';
                        colorCustom2 = '#fed8c4';
                        colorCustom3 = '#fff9f0';
                        //会员数量
                        lineColorMember= '#fbb225';
                        colorMember1 = '#feedc9';
                        colorMember2 = '#feefce';
                        colorMember3 = '#fef3df';
                    }

                    let AisXvalue=this.Xvalue=="day"?"日":"点";
                    let tip=this.Xvalue=="day"?"":"点";
                    let AxisName=this.Xvalue=="day"?"日期(日)":"时间(点)";
                    let option = {
                        title:{
                            text:title,
                            textStyle:{
                                color:'#65656E',
                                fontSize:'14',
                            },
                            x:'center',
                            y:'bottom',
                            textAlign:'left'
                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer: {
                                axis:'x',
                                type: 'line',
                                label: {
                                    formatter:'{value}'+tip,
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        toolbox: {
                            right:"4px",
                            top:"14px",
                            feature: {
                                saveAsImage: {
                                    show: true,
                                    title:' ',
                                    iconStyle: {
                                        borderColor: '#a6a5c9'
                                    },
                                    emphasis:{
                                        iconStyle: {
                                            borderColor: '#fc709a'
                                        },
                                    }
                                }
                            }
                        },
                        legend: {
                            selectedMode:true,
                            show:true,
                            orient:'horizontal',
                            top:'0px',
                            // right:'30px',
                            textStyle:{
                                color:'rgba(140,139,185,1)',
                                fontFamily:'PingFangSC-Thin',
                                fontWeight:'100',
                                fontSize:'12',
                            },
                            itemHeight  :12,//改变圆圈大小
                            formatter: function (name) {
                                if(name=="顾客数量"){
                                    return '非会员' + customTotal;
                                }else if(name=="会员数量"){
                                    return '会员 ' + memberTotal;
                                }else{
                                    return '到场总数 ' + totalpeople;
                                }
                            },
                            data:[{
                                name:'到场总数',
                                // icon:'circle',
                            },
                            {
                                name:'顾客数量',
                                // icon:'circle',//rect
                            },
                            {
                                name:'会员数量',
                                // icon:'circle',
                            }]
                        },
                        grid: {
                            top:'50px',
                            left: '30px',
                            right: '70px',
                            bottom: '30px',
                            containLabel: true
                        },
                        color:['#13CAF2','#FECF64'],
                        series : [
                        {
                                name:'到场总数',
                                type:'line',
                                // stack: '总量',
                                areaStyle: {normal: {}},
                                symbolSize:3,
                                smooth: true  ,//true 为平滑曲线，false为直线
                                lineStyle:{
                                    color:lineColorTotal
                                },
                                data:totalData,
                                itemStyle: { 
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                            offset: 0, color: colorTotal1 // 0% 处的颜色
                                        }, {
                                            offset: 0.5, color: colorTotal2 // 100% 处的颜色
                                        }, {
                                            offset: 1, color: colorTotal3 // 100% 处的颜色
                                        }]
                                    ),
                                    borderColor:lineColorTotal, 
                                },//线条样式  
                            },
                            {
                                name:'顾客数量',
                                type:'line',
                                // stack: '总量',
                                areaStyle: {normal: {}},
                                symbolSize:3,
                                smooth: true  ,//true 为平滑曲线，false为直线
                                lineStyle:{
                                    color:lineColorCustom
                                },
                                data:customData,
                                itemStyle: { 
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                            offset: 0, color: colorCustom1 // 0% 处的颜色
                                        }, {
                                            offset: 0.5, color: colorCustom2 // 100% 处的颜色
                                        }, {
                                            offset: 1, color: colorCustom3 // 100% 处的颜色
                                        }]
                                    ), 
                                    borderColor:lineColorCustom, 
                                },//线条样式  
                            },
                            {
                                name:'会员数量',
                                type:'line',
                                areaStyle: {normal: {}},
                                symbolSize:3,
                                smooth: true  ,//true 为平滑曲线，false为直线
                                lineStyle:{
                                    color:lineColorMember
                                },
                                areaStyle: {normal: {}},
                                itemStyle: {  
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                            offset: 0, color: colorMember1 // 0% 处的颜色
                                        }, {
                                            offset: 0.5, color: colorMember2 // 100% 处的颜色
                                        }, {
                                            offset: 1, color: colorMember3 // 100% 处的颜色
                                        }]
                                    ), 
                                    borderColor:lineColorMember,
                                },//线条样式  
                                data:memberData }
                        
                        ],
                        xAxis :[
                            {
                                name:AxisName,
                                type : 'category',
                                boundaryGap : false,
                                data : xAxisData,
                                splitLine: {
                                    show:false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLine : {    // 轴线
                                    show: false
                                }, 
                                axisLabel : {
                                    show:true,
                                    interval: 'auto',    // {number}
                                    margin: 3,
                                    formatter: function(v){
                                        if(AisXvalue=="点"){
                                            return v;
                                        }else{
                                            return new Date(v).getDate();
                                        }
                                       
                                    }
                                }
                            }
                        ],
                        yAxis:[{
                            type: 'value',
                            name:"人数(人)",
                            axisLine : {    // 轴线
                                show: false,
                                lineStyle:{
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show:true,
                                lineStyle:{
                                    color:'#F0F3F6'
                                },
                            },
                            minInterval:1,
                            axisLabel : {
                                color:'#2A2A2A',
                                show:true,
                                interval: 'auto',    // {number}
                                margin: 3,
                                formatter: '{value}',
                            }
                        }],
                        
                    };

                    myChart.setOption(option);
                }
            },
            watch:{
                data:'init'    
            },
            destroyed(){
            }
        }
    </script>