<template>
    <div class="m-publish-header">
        <el-page-header @back="goBack" :content="name"></el-page-header>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "publish_header",
    props: ["name"],
    data: function() {
        return {
        };
    },
    computed: {},
    methods: {
        goBack: function() {
            if(window.history.length){
                this.$router.go(-1);
            }else{
                this.$router.push('/')
            }
        },
    },
    mounted: function() {},
    components: {
    },
};
</script>

<style lang="less">
.m-publish-header{
    .pr;
    .flex;
    justify-content: space-between;
    align-items: center;
}

</style>
