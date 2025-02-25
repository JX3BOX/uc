<template>
    <div class="m-publish-authors">
        <el-form-item label="@圈一下">
            <div class="u-list">
                <div class="u-item" v-for="(item,i) in list" :key="i">
                    <img class="u-avatar" :src="item.user_avatar | showAvatar" />
                    <span class="u-name">
                        {{item.display_name}}
                    </span>
                    <el-tooltip class="item" effect="dark" content="移除" placement="top">
                        <i class="u-delete el-icon-delete" @click="remove(item,i)"></i>
                    </el-tooltip>
                </div>
            </div>
        </el-form-item>
    </div>
</template>

<script>
import { getUserInfoByIds } from "@/service/publish/user.js";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
export default {
    name: 'publish_at_authors',
    data() {
        return {
            authorIds: [],
            list: [],
        }
    },
    mounted() {
        window.addEventListener('setItemEvent', this.handleSession)
    },
    beforeDestroy() {
        window.removeEventListener('setItemEvent', this.handleSession)
    },
    watch: {
        authorIds: {
            deep: true,
            handler(val, oVal) {
                if (val.length > oVal.length) {
                    this.loadUsers();
                }
            }
        }
    },
    methods: {
        handleSession (e) {
            if (e.key !== 'atAuthor') return
            try {
                const newVal = JSON.parse(e.newVal);
                this.authorIds = newVal;
            } catch(e) {
                console.log(e)
                this.authorIds = [];
            }
        },
        loadUsers() {
            getUserInfoByIds(this.authorIds).then(res => {
                this.list = res.data.data;
            })
        },
        remove(item, i) {
            const _ids = this.authorIds.split(',')
            _ids.splice(i, 1);
            this.list.splice(i, 1);
            _ids.length ? sessionStorage.setItem('atAuthor', JSON.stringify(_ids.join(','))) : sessionStorage.removeItem('atAuthor');
        }
    },
    filters: {
        showAvatar: function (val) {
            return showAvatar(val);
        },
    },
}
</script>

<style lang="less" scoped>
.m-publish-authors {
    .el-form-item__content {
        .fz(14px,16px) !important;
    }

    .u-list {
        padding: 6px 0;
        // display: flex;
        .clearfix;
        .el-button,.u-item{
            .fl;
        }
        .u-item {
            display: flex;
            align-items: center;
            border: 1px solid #dcdfe6;
            padding: 2px 8px;
            // background-color: #f5f7fa;
            .r(3px);
            .mr(10px);
            // flex-shrink: 0;
            .mb(10px);
            .h(32px);
            box-sizing: border-box;
        }
        .u-avatar {
            .size(24px);
            .y;
            .mr(5px);
            .r(100%);
        }
        .u-name {
            .mr(5px);
            .bold;
        }
        .u-delete,
        .u-edit {
            // .ml(10px);
            color: #888;
            .pointer;
            padding: 5px 4px;
        }
        .u-delete:hover {
            color: #f00;
        }
    }
}
</style>
