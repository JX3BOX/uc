<template>
    <el-checkbox class="u-collapse" v-model="collection_collapse" :true-label="1" :false-label="0">默认展开</el-checkbox>
</template>

<script>
export default {
   name : 'PublishCollectionCollpase',
   props:["data"],
   components : {},
   data : function(){
       return {
           collection_collapse: false,
       }
   },
   model: {
        prop: "data", //向上同步数据
        event: "update",
    },
   watch: {
        data: {
            immediate: true,
            handler(newval) {
                this.collection_collapse = newval;
            },
        },
        collection_collapse: {
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
   methods:{},
   filters:{},
   created:function(){},
   mounted:function(){},
}
</script>
