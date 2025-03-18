<template>
    <ul>
        <li v-for="(item, i) in list" :key="i">
            <i class="u-icon">
                <img v-if="item.status > 0" svg-inline src="@/assets/img/publish/works/repo.svg" />
                <img v-else svg-inline src="@/assets/img/publish/works/draft.svg" />
            </i>
            <a
                class="u-title"
                target="_blank"
                :href="postLink(item.id)"
            >[{{ item.type | typeFormat }}] {{ item.title || "无标题" }}</a>
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
                            fail: item.status < 0,
                        }"
                    >{{ statusmap[item.status] }}</b>
                </span>
                <time class="u-time u-desc-subitem">提交于: {{ item.createTime | dateFormat }}</time>
            </div>
            <el-button-group class="u-action">
                <el-button size="mini" icon="el-icon-edit" title="编辑" @click="edit(item.id)"></el-button>
                <el-button size="mini" icon="el-icon-delete" title="删除" @click="del(item.id,i)"></el-button>
            </el-button-group>
        </li>
    </ul>
</template>

<script>
import { types } from "@/assets/data/publish/exam.json";
import dateFormat from "@/utils/dateFormat";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import { deleteQuestion } from "@/service/publish/exam.js";
const statusmap = {
    "-2": "已删除",
    "-1": "未通过审核",
    "0": "待审核",
    "1": "已入库",
};
export default {
    name: "question",
    props: ["data"],
    data: function () {
        return {
            statusmap,
            list : this.data || []
        };
    },
    watch : {
        data : function (val){
            this.list = val || []
        }
    },
    methods: {
        edit: function (id) {
            location.href = "/publish/#/question/" + id;
        },
        postLink: function (id) {
            return getLink("question", id);
        },
        del: function (id,i) {
            this.$alert("确定删除吗？", "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        deleteQuestion(id).then((res) => {
                            this.$message({
                                message: "删除成功",
                                type: "success",
                            });
                            this.list.splice(i,1);
                        });
                    }
                },
            });
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val * 1000));
        },
        typeFormat: function (type) {
            return types[type];
        },
    },
    mounted: function () {},
    components: {},
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
</style>
