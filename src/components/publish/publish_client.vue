<template>
    <div class="m-publish-client">
        <el-form-item label="版本">
            <el-radio-group v-model="client" @change="handleChange">
                <el-radio label="std">剑三</el-radio>
                <el-radio label="origin">缘起</el-radio>
                <!-- <el-radio label="wujie" v-if="showMobile">无界</el-radio> -->
                <el-radio label="all" v-if="!forbidAll">全端</el-radio>
            </el-radio-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
import Bus from '@/utils/bus.js'
export default {
    name: "publish_client",
    props: ["data",'forbidAll','showMobile'],
    data: function () {
        return {
            client: this.data,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.client = newval;
        },
        client: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
    computed: {},
    methods: {
        handleChange : function (){
            Bus.$emit('changeClient',this.client)
        }
    },
    mounted: function () {},
    components: {},
};
</script>


