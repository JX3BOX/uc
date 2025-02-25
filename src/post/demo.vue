<template>
    <div class="m-publish-box">
        <!-- 头部 -->
        <publish-header :name="name"></publish-header>

        <!-- 内容 -->
        <el-form label-position="left" label-width="80px">

            <!-- 标题 -->
            <publish-title v-model="form.title"></publish-title>

            <!-- 其它 -->
            <el-divider content-position="left">块标题</el-divider>
            <div>
                ...
            </div>

        </el-form>
    </div>
</template>

<script>
import publish_header from "@/components/publish/publish_header.vue";
import publish_title from "@/components/publish/publish_title.vue";
export default {
    name: "Demo",
    props: [],
    components: {
        "publish-header": publish_header,
        "publish-title": publish_title,
    },
    data: function () {
        return {
            name : 'Demo',
            form : {
                title : ''
            }
        };
    },
    computed: {},
    methods: {},
    filters: {},
    created: function () {},
    mounted: function () {},
};
</script>
