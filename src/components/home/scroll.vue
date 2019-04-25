<template>
    <div class="wrapper" ref="wrapper">
        <div v-if="isMember" class="content" style="float:right;min-height:226px;" ref="content">
            <!-- 会员 -->
            <span  class="scroll-span" style="padding:10px 0;float:right;" :key="item.index" v-for="item in data">
                    <div class="scroll-list-a">
                        <span class="scroll-list-head">
                            <i></i>
                            <img :src="item.imageBase64Str" alt="头像" style="width:100%;height:100%;border-radius: 50%;" >
                        </span>
                        <span class="scroll-list-name">{{item.name}}</span>
                        <span class="scroll-list-six">{{item.gender}} {{item.age}}</span>
                        <ul class="scroll-list-num">
                            <li>
                            <i></i>
                            <span>{{item.time}}</span>
                            </li>
                            <li>
                            <i></i>
                            <span>{{item.date}}</span>
                            </li>
                            <li>
                            <i></i>
                            <span>{{item.visitCount}}</span>
                            </li>
                        </ul>
                    </div>
            </span>
        </div>
        <div v-if="!isMember" class="content" style="float:right;height:80px;" ref="content">
            <!--  顾客-->
            <span style="padding:10px 0;float:right;" :key="item.index" v-for="item in data">
                <div class="scroll-list-b">
                    <span class="scroll-list-head">
                        <img :src="item.imageBase64Str" alt="头像" style="width:100%;height:100%;">
                    </span>
                    <div class="scroll-list-div">
                        <span><b>{{item.name}}</b> {{item.time}}</span>
                        <!-- <span>{{item.gender}}  {{item.age}}</span> -->
                    </div>
                </div>
            </span>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    
    export default {
        name:'scroll',
        data() {
            return {
                scroll: null,
                showCount:8,
                count:0,
                scrollSwitch:true
            }
        },
        props:{
            data: {
                type: Array,
                default: function () {
                return []
                }
            },
            isMember:true,
            click: {
                type: Boolean,
                default: true
            },
            startX: {
                type: Number,
                default: 0
            }, 
            startY: {
                type: Number,
                default: 0
            },
            refreshDelay: {
                type: Number,
                default: 20
            },
        },
        methods: {
            initScroll() {
                if (!this.$refs.wrapper) {
                    return
                }
                this.updateHtml()
                let options = {
                    click: this.click,
                    scrollY: false,
                    scrollX: true,
                    startX: this.startX,
                    startY: this.startY,
                    bounce:false,
                    disableMouse:true,
                    disableTouch:true,
                }


                this.scroll = new BScroll(this.$refs.wrapper, options)
                var _this=this;
                // setTimeout(()=>{
                //     _this.scroll.scrollBy(_this.computeWidth().spanWidth*(_this.data.length-_this.count),0,0)
                // },1000);
                
            },
            computeWidth(){
                
                let wrapperWidth=this.$refs.wrapper.clientWidth;
                let spanWidth=wrapperWidth/this.showCount;

                // 获取元素宽度  获取客户端宽度 获取展示数量

                let contentWidth=this.data.length>this.showCount?(spanWidth*(this.data.length+2))+'px':'2000px';

                if(contentWidth<2000) contentWidth=2000;
                
                return {
                    wrapperWidth:wrapperWidth,
                    spanWidth:spanWidth,
                    contentWidth:contentWidth
                };
            },
            updateHtml(){
                
                let widthObj=this.computeWidth();
                this.$refs.content.style.width=widthObj.contentWidth;
                this.$refs.content.style.paddingRight=widthObj.wrapperWidth+'px';
                HTMLCollection.prototype.toArray=function(){
                        return [].slice.call(this);
                };
                this.$refs.content.children.toArray().forEach(element => {
                    element.style.width=widthObj.spanWidth+'px';
                });
                return widthObj;
            },
            forceUpdate(){
                if(this.count==0){
                    this.scroll.scrollBy(this.computeWidth().spanWidth*(this.data.length-1),0,0);
                    this.count++; 
                }
                let widthObj = this.updateHtml();             
                this.scroll.refresh();
                this.scroll.scrollBy(widthObj.spanWidth,0,1000)
            },
            refresh(){
                this.scrollSwitch=false;
                this.$forceUpdate();
                this.initScroll();
                this.scroll.scrollBy(this.computeWidth().spanWidth*(this.data.length-1),0,0)
                this.scrollSwitch=true;
            }
        },
        watch: {
            data() {
                setTimeout(() => {
                    if(this.scrollSwitch){
                        this.forceUpdate()
                    }
                }, this.refreshDelay)
            }
        },
        created(){
             
        },
        mounted() {
            let wrapperWidth=this.$refs.wrapper.clientWidth;

            if(this.isMember) {
                this.showCount=parseInt(wrapperWidth/230);
            }else{
                this.showCount=8;
            };
            //页面渲染完之后再初始化better-scroll
            setTimeout(() => {
                this.initScroll()
            }, this.refreshDelay)
            this.$refs.wrapper.style.height=this.$refs.wrapper.clientHeight+"px";
            this.$refs.content.style.height=this.$refs.content.clientHeight+"px";
        },
        beforeDestroy(){
            if(this.scroll) this.scroll.destroy();   
        }
    }
</script>
<style>
.wrapper{
    height: auto;
    width: 100%;
    overflow: hidden;
    position: relative;
}
.content{
    min-width: 100%;
    min-height: 100px;
    height: auto;
    float: right;
    position: relative;
}
.content>span{
    position: relative;
    width: 200px;
    height: auto;
    float: right;
    width:80px;
    margin: 0 auto;
}
</style>
