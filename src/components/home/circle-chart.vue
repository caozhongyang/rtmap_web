<template>
        <div ref="circlechart" style="width:100%;height:250px;">
            
        </div>
    </template>
    
    <script>
        var echarts = require('echarts');
    
        export default {
            name:'bar-chart',
            props:{
                data:null,
            },
            data() {
                return {
                }
            },
            created(){
                
            },
            methods: {
                init(a,b,c){
                    var _this=this;
                    let myChart = echarts.init(this.$refs.circlechart);
                    let manCount=_this.data.manStaffCount;
                    let womanCount=_this.data.womanStaffCount;
                    let title=this.title;
    
                    womanCount=330;
                    manCount=50;
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
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        toolbox: {
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
                        series : [
                            {
                                name: title,
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                silent:true,
                                hoverAnimation:false,
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show : true ,  //隐藏标示文字
                                            fontFamily:'PingFangSC-Thin',
                                            fontWeight:'100',
                                            color:'rgba(140,139,185,1)',
                                            fontSize:'16',
                                        },
                                        labelLine : {
                                            show : true ,  //隐藏标示线
                                            fontFamily:'PingFangSC-Thin',
                                            fontWeight:'100',
                                            color:'rgba(140,139,185,1)',
                                            fontSize:'16',
                                        }
                                    }
                                },
                                data:[
                                    {
                                        value:womanCount, 
                                        name:'女性顾客',
                                        itemStyle:{
                                            color: {
                                                type: 'radial',
                                                x: 0,
                                                y: 1,
                                                r: 2,
                                                colorStops: [
                                                    {
                                                        offset: 0, color: '#E12E88' // 0% 处的颜色
                                                    }, {
                                                        offset: 1, color: '#A245D0' // 100% 处的颜色
                                                    }
                                                ],
                                                globalCoord: false // 缺省为 false
                                            },
                                        }},
                                    {
                                        value:manCount, 
                                        name:'男性顾客',
                                        itemStyle:{
                                            color: {
                                                type: 'radial',
                                                x: 0,
                                                y: 1,
                                                r: 2,
                                                colorStops: [{
                                                        offset: 0, color: '#DEC9F6' // 0% 处的颜色
                                                    }, {
                                                        offset: 1, color: '#DEC9F6' // 100% 处的颜色
                                                    }],
                                                globalCoord: false // 缺省为 false
                                            },
                                        }},
                                ],
                                // itemStyle: {
                                //     emphasis: {
                                //         shadowBlur: 10,
                                //         shadowOffsetX: 0,
                                //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                                //     }
                                // }
                            }
                        ]
                    };
                    
                    myChart.setOption(option);
                }
            },
            watch:{
                data:'init'    
            },
            mounted(){
                
            },
            beforeDestroy(){
            }
        }
    </script>
    