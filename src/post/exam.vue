<template>
    <div class="m-publish m-index">
        <div class="u-nav">
        <el-col :span="4">
            <router-link to="/question">
                <i class="el-icon-s-opportunity"></i>
                <span>剑三题目</span>
            </router-link>
        </el-col>
        <el-col :span="4">
            <router-link to="/paper">
                <img svg-inline src="@/assets/img/publish/channel/100.svg" />
                <span>剑三试卷</span>
            </router-link>
        </el-col>
        </div>
    </div>
</template>

<script>
export default {
   name : 'Exam',
   props:[],
   components : {},
   data : function(){
       return {

       }
   },
   computed:{},
   watch:{},
   methods:{},
   filters:{},
   created:function(){},
   mounted:function(){},
}
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/index.less";
</style>
