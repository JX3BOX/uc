<template>
    <ul class="m-publish__paper-list">
        <li v-for="(item, i) in list" :key="i">
            <a class="u-title" target="_blank" :href="postLink(item.id)">
                <!-- [{{ item.type | typeFormat }}]  -->
                <el-tag v-if="isPrivate(item)" class="u-private-tag" size="small" effect="plain">
                    {{ publicmap[0] }}
                </el-tag>
                {{ item.title || "无标题" }}
            </a>
            <div class="u-desc">
                <span class="u-desc-subitem">
                    编号 :
                    <b>{{ item.id }}</b>
                </span>
                <span class="u-status u-desc-subitem">
                    状态:
                    <b
                        :class="{
                            pass: item.status > 0,
                            pending: item.status == 0,
                            fail: item.status < 0 || item.status > 1,
                        }"
                        >{{ statusFormat(item) }}</b
                    >
                </span>
                <time class="u-time u-desc-subitem">提交于: {{ dateFormat(item.createTime) }}</time>
            </div>
            <el-button-group class="u-action">
                <el-button icon="Edit" title="编辑" @click="edit(item.id)"></el-button>
                <el-button icon="Delete" title="删除" @click="del(item.id, i)"></el-button>
            </el-button-group>
        </li>
    </ul>
</template>

<script>
import examData from "@/assets/data/publish/exam.json";
import dateFormat from "@/utils/dateFormat";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { deletePaper } from "@/service/publish/exam.js";
const { types, statusmap, publicmap } = examData;
export default {
    name: "paper",
    props: ["data"],
    data: function () {
        return {
            statusmap,
            publicmap,
            list: this.data || [],
        };
    },
    watch: {
        data: function (val) {
            this.list = val || [];
        },
    },
    methods: {
        edit: function (id) {
            location.href = "/publish/#/paper/" + id;
        },
        postLink: function (id) {
            return getLink("paper", id);
        },
        del: function (id, i) {
            this.$alert("确定删除吗？", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        deletePaper(id).then((res) => {
                            this.$message({
                                message: "删除成功",
                                type: "success",
                            });
                            this.list.splice(i, 1);
                        });
                    }
                },
            });
        },
        dateFormat: function (val) {
            return dateFormat(new Date(val * 1000));
        },
        typeFormat: function (type) {
            return types[type];
        },
        isPrivate: function (item) {
            return item.is_public === 0;
        },
        statusFormat: function (item) {
            return statusmap[item.status];
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
.m-dashboard-box-list .u-status {
    .pass {
        color: #49c10f;
    }
    .pending {
        color: #fba524;
    }
    .fail {
        color: #fc3c3c;
    }
}
.m-publish__paper-list{
    .u-title{
        padding:4px 0;
        gap: 4px;
    }
    .u-private-tag {
        --el-tag-bg-color: fade(@v4primary, 8%);
        --el-tag-border-color: fade(@v4primary, 35%);
        --el-tag-text-color: @v4primary;
        height: 18px;
        padding: 0 5px;
        font-size: 11px;
        line-height: 16px;
        vertical-align: 1px;
    }
}
</style>
