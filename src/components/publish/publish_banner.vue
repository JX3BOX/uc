<template>
    <div class="m-publish-banner">
        <el-divider content-position="left">海报</el-divider>
        <uploadImage v-model="banner" :info="info" :max-size="30" :size="bannerSize"></uploadImage>
    </div>
</template>

<script>
import uploadImage from '@jx3box/jx3box-common-ui/src/upload/upload_banner.vue'

export default {
    name: "post_banner",
    components: {
        uploadImage,
    },
    props: {
        data: {
            type: String,
            default: "",
        },
        size: {
            type: [Array, Number],
            default: 148,
        },
        info: {
            type: String,
            default: "非必选，最大30M。",
        },
        isCms: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            banner: this.data,
        };
    },
    model: {
        prop: "data",
        event: "update",
    },
    watch: {
        data : function (newval){
            this.banner = newval
        },
        banner: function(newval) {
            this.$emit("update", newval);
        },
    },
    computed: {
        bannerSize() {
            return this.isCms ? this.size?.map((item) => item * 2) : this.size
        },
    }
};
</script>

<style lang="less">
.m-publish-banner {
    .u-tip{
        padding:5px 15px;
    }
    // img {
    //     max-width: 180px;
    // }
    .avatar-uploader{
        .mt(10px);
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 180px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .u-remove{
        background-color: #c2c2c2;
        border-color:#c2c2c2;
        &:hover{
            background-color: #fc3c3c;
            border-color:#fc3c3c;
        }
    }
}
</style>
