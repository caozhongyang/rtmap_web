<template>
    <div ref="barchart" style="width:100%;height:250px;">
        
    </div>
</template>

<script>
    var echarts = require('echarts');

    export default {
        name:'bar-chart',
        props:{
            data:null,
            type:"",
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
                let myChart = echarts.init(this.$refs.barchart);

                var dataAxis = Object.getOwnPropertyNames(this.data).filter((item)=>{
                    if(item!='__ob__'&&item!='length')  return item;
                });
                //['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
                var data = [];
                var isday="次";
                dataAxis.map(function(prop){
                    data.push(_this.data[prop]);
                });
                //alert(data+","+dataAxis)
                var yMax = 500;
                var dataShadow = [];

                for (var i = 0; i < data.length; i++) {
                    dataShadow.push(yMax);
                }

                var option = {
                    title:{
                        text:'会员频次',
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
                                formatter:function(a){
                                    return a.value+isday;
                                },
                                backgroundColor: '#6a7985'
                            }
                        },
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
                    xAxis: {
                        name:'次',
                        data: dataAxis,
                        axisLabel: {
                            // inside: true,
                            // textStyle: {
                            //     color: '#fff'
                            // }
                            formatter: function(v){
                                    return v;
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        z: 10
                    },
                    yAxis: {
                        type: 'value',
                        name:"人数(人)",
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show:true,
                            lineStyle:{
                                color:'#F0F3F6',
                                type:'solid'
                            },
                        },
                        axisLabel: {
                            color:'#2A2A2A',
                            formatter:function(value,index){
                                if(parseInt(value)!=value){
                                    return '';
                                }
                                return parseInt(value);
                            }
                        }
                    },
                    series: [
                        {
                            name:'会员人数',
                            type: 'bar',
                            barMaxWidth:"50px",
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            {offset: 0, color: '#52E4D3'},
                                            {offset: 1, color: '#139ED0'}
                                        ]
                                    ),
                                    barBorderRadius: [15,15, 0, 0]
                                },
                            },
                            data: data
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
