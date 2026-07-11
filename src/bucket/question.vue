<template>
    <ul class="m-publish__question-list">
        <li v-for="(item, i) in list" :key="i">
            <a class="u-title" target="_blank" :href="postLink(item.id)">
                <el-tag v-if="isPrivate(item)" class="u-private-tag" size="small" effect="plain">
                    {{ $t("publish.visibility.privateShort") }}
                </el-tag>
                {{ item.title || $t("publish.common.untitled") }}
            </a>
            <div class="u-desc">
                <span class="u-desc-subitem">
                    {{ $t("publish.common.id") }} :
                    <b>{{ item.id }}</b>
                </span>
                <span class="u-status u-desc-subitem">
                    {{ $t("publish.common.status") }} :
                    <b
                        :class="{
                            pass: item.status > 0,
                            pending: item.status == 0,
                            fail: item.status < 0,
                        }"
                        >{{ statusFormat(item) }}</b
                    >
                </span>
                <span class="u-type u-desc-subitem">
                    {{ $t("publish.exam.questionType") }} : {{ typeFormat(item.type) }}
                </span>
                <time class="u-time u-desc-subitem">{{ $t("publish.common.submittedAt") }}: {{ dateFormat(item.createTime) }}</time>
            </div>
            <el-button-group class="u-action">
                <el-button icon="Edit" :title="$t('publish.common.edit')" @click="edit(item.id)"></el-button>
                <el-button icon="Delete" :title="$t('publish.common.delete')" @click="del(item.id, i)"></el-button>
            </el-button-group>
        </li>
    </ul>
</template>

<script>
import examData from "@/assets/data/publish/exam.json";
import dateFormat from "@/utils/dateFormat";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { deleteQuestion } from "@/service/publish/exam.js";
const { types } = examData;
export default {
    name: "question",
    props: ["data"],
    data: function () {
        return {
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
            location.href = "/publish/#/question/" + id;
        },
        postLink: function (id) {
            return getLink("question", id);
        },
        del: function (id, i) {
            this.$alert(this.$t("publish.confirm.delete"), this.$t("publish.common.message"), {
                confirmButtonText: this.$t("publish.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        deleteQuestion(id).then((res) => {
                            this.$message({
                                message: this.$t("publish.message.deleteSucceeded"),
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
            return this.$t(`publish.exam.types.${type}`);
        },
        isPrivate: function (item) {
            return item.is_public === 0;
        },
        statusFormat: function (item) {
            const key = {
                "-2": "deleted",
                "-1": "rejected",
                0: "pendingReview",
                1: "accepted",
            }[item.status];
            return this.$t(`publish.status.${key || "unknown"}`);
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
.m-publish__question-list{
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
