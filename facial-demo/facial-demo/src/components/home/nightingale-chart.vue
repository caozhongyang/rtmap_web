<template>
        <div ref="nightingalechart" style="width:100%;height:250px;">
            
        </div>
    </template>
    
    <script>
        var echarts = require('echarts');

        export default {
            name:'nightingale-chart',
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
                    let myChart = echarts.init(this.$refs.nightingalechart);
                    let NightingaleData=[];
                    let MaxPercent=0;
                    let MaxIndex=0;
                    let total=0;
                    let title=this.title;
                    let colorStops=[
                                        [
                                            {
                                                offset: 0, color: '#FEB040' // 0% 处的颜色
                                            }, {
                                                offset: 1, color: '#F7F861' // 100% 处的颜色
                                            }
                                        ],
                                        [
                                            {
                                                offset: 0, color: '#FF9B6C' // 0% 处的颜色
                                            },{
                                                offset: 1, color: '#FE7395' // 100% 处的颜色
                                            }
                                        ],
                                        [
                                            {
                                                offset: 0, color: '#914CE4' // 0% 处的颜色
                                            }, {
                                                offset: 1, color: '#FB246B' // 100% 处的颜色
                                            }
                                        ],
                                        [
                                            {
                                                offset: 0, color: '#B522B4' // 0% 处的颜色
                                            },{
                                                offset: 1, color: '#612E8C' // 100% 处的颜色
                                            }
                                        ],
                                        [
                                            {
                                                offset: 0, color: '#3CD6FF' // 0% 处的颜色
                                            },{
                                                offset: 1, color: '#7967DA' // 100% 处的颜色
                                            }
                                        ],
                                        ,
                                        [
                                            {
                                                offset: 0, color: '#17C0D9' // 0% 处的颜色
                                            },{
                                                offset: 1, color: '#36FCC4' // 100% 处的颜色
                                            }
                                        ]
                                    ];

                   
                    Object.getOwnPropertyNames(_this.data).filter((item)=>{
                            if(item!='__ob__'&&item!='length')  return item;
                        })
                        .map(function(props,index){
                            if(MaxPercent<_this.data[props]){
                                MaxPercent=_this.data[props];
                                MaxIndex=index;
                            }
                            total+=_this.data[props];
                            NightingaleData.push({
                                value:_this.data[props], name:props,
                                itemStyle:{
                                    color: {
                                        type: 'radial',
                                        x: 0,
                                        y: 1,
                                        r: 2,
                                        colorStops: colorStops[index],
                                        globalCoord: false // 缺省为 false
                                    },
                                },
                            });
                        });
                    if(!NightingaleData.length){
                        NightingaleData=[
                            {value:5, name:'<18'},
                            {value:5, name:'18-25'},
                            {value:5, name:'26-30'},
                            {value:5, name:'31-35'},
                            {value:5, name:'36-40'},
                            {value:5, name:'>=41'},
                        ];
                        NightingaleData.map((data,index)=>{
                            data.itemStyle={
                                    color: {
                                        type: 'radial',
                                        x: 0,
                                        y: 1,
                                        r: 2,
                                        colorStops: colorStops[index],
                                        globalCoord: true // 缺省为 false
                                    },
                                };
                        });
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
                        legend: {
                            selectedMode:false,
                            orient:'',
                            right:'5px',
                            bottom:'20px',
                            itemHeight  :12,//改变圆圈大小
                            itemWidth  :12,//改变圆圈大小
                            textStyle:{
                                color:'rgba(140,139,185,1)',
                                fontFamily:'PingFangSC-Thin',
                                fontWeight:'normal',
                                fontSize:'12',
                            }
                        },
                        roseType:'radius',
                        tooltip: {},
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
                        graphic:{            //echarts饼图中间放字                
                            type:'text',                
                            left:'center',                
                            top:'45%',                
                            z:2,			//  zlevel:10,                
                            style:{                   
                                text:'',                    
                                textAlign:'center',         
                                textVerticalAlign:'middle',           
                                fill:' #8D4DE8',                    
                                font:'16px PingFangSC-Thin ',
                                lineWidth:'70px'                
                            },            
                        },
                        series: [{
                            name:title,
                            type:'pie',
                            startAngle:90,
                            radius: ['30%', '50%'],
                            center : ['50%', '50%'],
                            hoverAnimation:false,
                            silent:true,
                            label: {
                                    show: true,
                                    position: 'center',
                                    normal : {
                                    label : {
                                        show : true ,  //隐藏标示文字
                                        fontFamily:'PingFangSC-Thin',
                                        fontWeight:'100',
                                        color:'rgba(140,139,185,1)',
                                        fontSize:'14',
                                    },
                                    labelLine : {
                                        show : true ,  //隐藏标示线
                                        fontFamily:'PingFangSC-Thin',
                                        fontWeight:'100',
                                        color:'rgba(140,139,185,1)',
                                        fontSize:'14',
                                    }
                                }
                            },
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : true ,  //隐藏标示文字
                                        fontFamily:'PingFangSC-Thin',
                                        fontWeight:'100',
                                        color:'rgba(140,139,185,1)',
                                        fontSize:'14',
                                        align:'center',
                                        formatter:function(v){
                                            return v.name+'\n'+v.percent+'%'
                                        }
                                    },
                                    labelLine : {
                                        show : true ,  //隐藏标示线
                                        fontFamily:'PingFangSC-Thin',
                                        fontWeight:'100',
                                        color:'rgba(140,139,185,1)',
                                        fontSize:'14',
                                    }
                                }
                            },
                            roseType : 'radius',
                            data:NightingaleData
                        },
                        // {
                        //     name:title,
                        //     type:'pie',
                        //     startAngle:30,
                        //     radius: ['30%', '50%'],
                        //     center : ['43%', '50%'],
                        //     hoverAnimation:false,
                        //     label: {
                        //         normal: {
                        //             show: true,
                        //             position: 'center',
                        //             formatter:(p)=>{
                        //                 return ''
                        //             },
                        //         },
                        //     },
                        //     emphasis: {
                        //         label:{
                        //             show: false,
                        //             position: 'center',
                        //             textStyle: {
                        //                 fontSize: '14',
                        //                 fontWeight: 'bold',
                        //                 color:'#8D4DE8'
                        //             },
                        //             formatter:(p)=>{
                        //                 return p.name+'\n'+p.percent+'%';
                        //             },
                        //         }
                        //     },
                        //     labelLine: {
                        //         normal: {
                        //             show: false
                        //         }
                        //     },
                        //     roseType : 'radius',
                        //     data:NightingaleData
                        // }
                        ]
                    };
 
                    if(total) {
                        let p=((NightingaleData[MaxIndex].value/total)*100).toFixed(2);
                        option.graphic.style.text=p+"% \n "+NightingaleData[MaxIndex].name;
                    }
                    myChart.setOption(option)

                    _this.initFlag=true;
                    // myChart.dispatchAction({type: 'highlight',seriesIndex: 1,dataIndex: MaxIndex});
                    myChart.on('mouseover',(v) => {
                        
                        if(_this.initFlag && v.dataIndex != MaxIndex&&v.name){

                            option.graphic.style.text=v.percent+"% \n "+v.name;
                            myChart.setOption(option)

                            // myChart.dispatchAction({
                            //     type: 'downplay',
                            //     seriesIndex: 1,
                            //     dataIndex: MaxIndex
                            // });
                        }
                    });

                    myChart.on('mouseout',(v) => {
                        if(_this.initFlag&&total){
                            // myChart.dispatchAction({type: 'highlight',seriesIndex: 1,dataIndex: MaxIndex});
                            if(total) {
                                let p=((NightingaleData[MaxIndex].value/total)*100).toFixed(2);
                                option.graphic.style.text=p+"% \n "+NightingaleData[MaxIndex].name;
                            }
                            myChart.setOption(option)
                        }
                    });
                }
            },
            watch:{
                data:'init'
            },
            mounted(){
                
            },
            destroyed(){
            }
        }
    </script>