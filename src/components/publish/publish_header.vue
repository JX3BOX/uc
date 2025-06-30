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
    data: function () {
        return {};
    },
    computed: {},
    methods: {
        goBack: function () {
            // 使用router.go(-1)尝试后退，如果失败则通过导航守卫会自动处理
            this.$router.go(-1);

            // 设置超时，检查是否仍在同一页面
            const currentPath = this.$route.fullPath;
            setTimeout(() => {
                if (this.$route.fullPath === currentPath) {
                    // 如果路径没变，说明后退失败
                    this.$router.push("/");
                }
            }, 100);
        },
    },
    mounted: function () {},
    components: {},
};
</script>

<style lang="less">
.m-publish-header {
    .pr;
    .flex;
    justify-content: space-between;
    align-items: center;
}
</style>
