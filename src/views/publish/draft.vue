<template>
    <div class="m-publish m-draft">
        <div class="m-draft-header">
            <h1 class="m-title">
                <i class="el-icon-receiving"></i> 草稿箱
                <el-tooltip class="item" effect="dark" placement="top" popper-class="m-draft-help-tip">
                    <div slot="content">以下草稿是编辑器在当前浏览器下产生的临时本地草稿HTML源码，<br />并不存在于服务器中，仅用于断网或窗口异常关闭时恢复。</div>
                    <span class="u-help"><i class="el-icon-question"></i> <span>使用帮助</span></span>
                </el-tooltip>
            </h1>
            <div class="u-op">
                <el-button plain icon="el-icon-delete" size="small" @click="clean" :disabled="!isNotNull">清空</el-button>
                <el-dropdown class="u-dropdown" trigger="click" @command="handleCommand">
                    <el-button size="small" type="primary" :disabled="!canBatchOperate">
                        批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="batchDel">批量删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <template v-if="isSupported">
            <div class="m-draft-list" v-if="isNotNull">
                <ul class="u-list">
                    <li class="u-item" v-for="(item, i) in data" :key="i">
                        <div class="u-label" :class="{ on: !!item.active }">
                            <el-checkbox class="u-checkbox" label="" v-model="item.checked"></el-checkbox>
                            <!-- <i class="u-item-icon" :class="!!item.active ? 'el-icon-folder-opened' : 'el-icon-folder'"></i> -->
                            <i class="u-item-icon el-icon-document"></i>
                            <span class="u-item-key">{{ item | itemName }} <em class="u-item-time" v-if="item.data.cache_time">( {{ item | formatDate }} )</em></span>
                            <div class="u-op">
                                <el-button type="primary" plain icon="el-icon-view" size="mini" class="u-delete" @click.stop="preview(item)">预览</el-button>
                                <el-popconfirm title="确定删除吗？" @confirm="del(item, i)">
                                    <el-button slot="reference" plain icon="el-icon-delete" size="mini" class="u-delete" @click.stop>删除</el-button>
                                </el-popconfirm>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="m-draft-null" v-else><i class="el-icon-warning-outline"></i> 暂无任何内容</div>
        </template>
        <template v-else>
            <el-alert title="您的浏览器太旧了，不支持本功能。" type="error" show-icon></el-alert>
        </template>
    </div>
</template>

<script>
// TINYMCE AUTOSAVE
const DRAFT_PREFIX = "tinymce-autosave-";
import { showRecently } from "@jx3box/jx3box-common/js/moment";
export default {
    name: "draft",
    props: [],
    components: {},
    data: function() {
        return {
            data: [],
        };
    },
    computed: {
        isSupported: function() {
            return !!window.localStorage;
        },
        isNotNull: function() {
            return !!this.data && !!this.data.length;
        },
        isWeb({ activeName }) {
            return activeName === "web";
        },
        db() {
            return this.$store.state.db;
        },
        canBatchOperate() {
            return this.data.some((item) => item.checked);
        },
    },
    methods: {
        // 加载
        loadDrafts: async function() {
            let len = await this.db.length();
            const data = [];
            for (let i = 0; i < len; i++) {
                let key = await this.db.key(i);
                // if (key.startsWith(DRAFT_PREFIX)) {
                data.push({
                    key,
                    data: await this.db.getItem(key),
                    checked: false,
                });
                // }
            }

            this.$set(this, "data", data);
        },
        // 清空
        clean: function() {
            this.$alert("此操作不可逆！请谨慎操作！", "警告", {
                confirmButtonText: "确定清空",
                callback: (action) => {
                    // 清空localstorage
                    this.db.clear();
                    // 清空缓存数据
                    this.data = [];
                    // 通知
                    this.$notify({
                        title: "清空成功",
                        type: "success",
                        message: `本地草稿清空成功`,
                    });
                },
            });
        },
        // 预览
        preview: function(item) {
            this.$router.push(`/${item.data.post_type}/${item.data.ID}?mode=draft&key=${item.key}`);
        },
        // 删除
        del: function(item, i) {
            this.db.removeItem(item.key).then(() => {
                this.data.splice(i, 1);
            });
        },
        // 复制
        onCopy: function(val) {
            this.$notify({
                title: "复制成功",
                message: "草稿源码复制成功",
                type: "success",
            });
        },
        onError: function() {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },

        handleCommand: function(command) {
            switch (command) {
                case "batchDel":
                    this.$confirm("此操作不可逆！请谨慎操作！", "警告", {
                        confirmButtonText: "确定删除",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(() => {
                        let delList = this.data.filter((item) => item.checked);
                        delList.forEach((item) => {
                            this.db.removeItem(item.key);
                        });
                        this.data = this.data.filter((item) => !item.checked);
                        this.$notify({
                            title: "删除成功",
                            type: "success",
                            message: `成功删除${delList.length}个草稿`,
                        });
                    });
                    break;
                default:
                    break;
            }
        },
    },
    filters: {
        itemName(item) {
            return item?.data?.post_title || `${item.key}`;
        },
        formatDate(item) {
            let time = item?.data?.cache_time
            return time ? showRecently(new Date(time)) : '';
        },
    },
    created: function() {
        this.loadDrafts();
    },
    mounted: function() {},
};
</script>

<style lang="less">
@import "~@/assets/css/publish/draft.less";
</style>
