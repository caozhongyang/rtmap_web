<template>
        <div ref="ringchart" style="width:100%;height:250px;">
            
        </div>
    </template>
    
    <script>
        var echarts = require('echarts');

        export default {
            name:'ring-chart',
            props:{
                data:null,
                title:'',
            },
            data() {
                return {
                    initFlag:false
                }
            },
            created(){
            },
            methods:{
                init(){
                    let _this=this;
                    let myChart = echarts.init(this.$refs.ringchart);
                    let manCount=_this.data.manStaffCount;
                    let womanCount=_this.data.womanStaffCount;
                    let title=this.title;
                    let manName="男性顾客";
                    let womanName="女性顾客";
                    if(title=="会员性别"){
                        manName="男性会员";
                        womanName="女性会员";
                    }
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
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c} ({d}%)"
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
                                selectedMode:false,
                                orient:'',
                                right:'2%',
                                top:'60px',
                                textStyle:{
                                    color:'rgba(140,139,185,1)',
                                    fontFamily:'PingFangSC-Thin',
                                    fontWeight:'100',
                                    fontSize:'16',
                                },
                            },
                            series: [
                                {
                                    name:title,
                                    type:'pie',
                                    radius: ['40%', '60%'],
                                    avoidLabelOverlap: false,
                                    hoverAnimation:false,
                                    legendHoverLink:false,
                                    startAngle:20,
                                    // silent:true,
                                    label: {
                                        show: true,
                                        position: 'center',
                                        formatter:(p)=>{
                                            return ''
                                        },
                                    },
                                    emphasis:{
                                        label: {
                                            show: true,
                                            position: 'center',
                                            fontSize: '16',
                                            fontWeight: 'bold',
                                            color:'#8D4DE8',
                                            formatter:(p)=>{
                                                if(p.name=='女性顾客'||p.name=='女性会员'){
                                                    return p.percent+'%\n女性'
                                                }else{
                                                    return p.percent+'%\n男性'
                                                }   
                                            },
                                        },
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data:[
                                        {value:womanCount, name:womanName,itemStyle:{
                                            color: {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 1,
                                                y2: 1,
                                                colorStops: [{
                                                    offset: 0, color: '#A943C8' // 0% 处的颜色
                                                },{
                                                    offset: 0.49, color: '#C737A5' // 0% 处的颜色
                                                }, {
                                                    offset: 0.5, color: '#CF359C' // 0% 处的颜色
                                                },{
                                                    offset: 1, color: '#C837A4' // 100% 处的颜色
                                                }],
                                                globalCoord: false // 缺省为 false
                                            },
                                        }},
                                        {value:manCount, name:manName,
                                            itemStyle:{
                                                color: {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 1,
                                                y2: 1,
                                                colorStops: [{
                                                    offset: 0, color: '#dec9f6' // 0% 处的颜色
                                                },{
                                                    offset: 0.49, color: '#dec9f6' // 0% 处的颜色
                                                }, {
                                                    offset: 0.5, color: '#dec9f6' // 0% 处的颜色
                                                },{
                                                    offset: 1, color: '#dec9f6' // 100% 处的颜色
                                                }],
                                                globalCoord: false // 缺省为 false
                                            },
                                            }
                                        },
                                    ]
                                }
                            ]
                        };
                    myChart.setOption(option);
                    if(_this.initFlag == false){
                        myChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0});
                    }
                    
                    myChart.on('mouseover',(v) => {
                        _this.initFlag=true;
                        if(_this.initFlag && v.dataIndex != 0){
                            myChart.dispatchAction({
                                type: 'downplay',
                                seriesIndex: 0,
                                dataIndex: 0
                            });
                        }
                    });

                    myChart.on('mouseout',(v) => {
                        if(_this.initFlag){
                            myChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0});
                        }
                    });
                }
            },
            mounted(){
                
                
            },
            watch:{
                data:'init'    
            },
            destroyed(){
            }
        }
    </script>