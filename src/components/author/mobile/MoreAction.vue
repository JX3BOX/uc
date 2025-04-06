<template>
    <el-drawer
        :visible.sync="showValue"
        :show-close="false"
        :with-header="false"
        custom-class="simple-more-action-drawer"
        size="400"
        style="width: 100%"
        direction="btt"
        append-to-body
        @close="onClose"
    >
        <template #default>
            <div class="c-var m-simple">
                <div class="m-group">
                    <div v-for="(action, groupIndex) in actions" :key="groupIndex" class="m-list">
                        <template v-for="(item, itemIndex) in action.list">
                            <div
                                v-if="!item.type"
                                :key="itemIndex"
                                class="m-item"
                                :style="item?.color ? { color: item.color } : {}"
                                @click="onSelect(item)"
                            >
                                <el-icon v-if="item?.icon" :class="['u-icon']">
                                    <component :is="item.icon" />
                                </el-icon>
                                <div class="u-name">{{ item?.name }}</div>
                            </div>
                            <div
                                v-else
                                :key="itemIndex"
                                class="m-item"
                                :style="defaultTypeInfo[item.type]?.color ? { color: defaultTypeInfo[item.type]?.color } : {}"
                                @click="onSelect(defaultTypeInfo[item.type])"
                            >
                                <el-icon v-if="defaultTypeInfo[item.type]?.icon" :class="['u-icon']">
                                    <component :is="defaultTypeInfo[item.type].icon" />
                                </el-icon>
                                <div class="u-name">
                                    {{ defaultTypeInfo[item.type]?.name }}
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </el-drawer>
</template>

<script>

export default {
    name: "SimpleMoreAction",
    props: {
        show: {
            type: Boolean,
            default: false
        },
        actions: {
            type: Array,
            default: () => []
        },
        iconShow: {
            type: Boolean,
            default: false
        },
        sourceId: {
            type: [String, Number],
            default: ""
        },
        sourceType: {
            type: String,
            default: ""
        },
        isTime: {
            type: Boolean,
            default: false
        },
        favInfo: {
            type: Object,
            default: () => ({})
        },
        rssStatus: {
            type: Object,
            default: () => ({})
        },
        title: {
            type: String,
            default: ""
        }
    },
    emits: ['update:show', 'select', 'close'],
    computed:{
        showValue: {
            get() {
                return this.show;
            },
            set(value) {
                this.$emit("update:show", value);
            }
        }
    },
    data() {
        return {
            theme: "light",
            t:true,
            defaultTypeInfo: {
                report: {
                    name: "举报",
                    icon: "Warning",
                    method: "report"
                },
                edit: {
                    name: "编辑",
                    icon: "Edit",
                    method: "edit"
                },
                del: {
                    name: "删除",
                    icon: "Delete",
                    method: "del",
                    color: "#FF5959"
                },
                block: {
                    name: "屏蔽",
                    icon: "CircleClose",
                    method: "block"
                },
                share: {
                    name: "分享",
                    icon: "Share",
                    method: "share"
                }
            }
        };
    },
    methods: {
        onClose() {
            this.showValue = false;
        },
        onSelect(item) {
            this.$emit("select", item);
            this.onClose()
        },

    }
};
</script>

<style lang="less" >
.simple-more-action-drawer {

    border-radius: 20px 20px 0 0;
    .el-drawer__body {
        padding: 0;
    }

    .m-simple{
        max-width: 100%;
        padding: 20px 20px 30px;
        box-sizing: border-box;
        background: var(--primary-brand-4, #282828);

        .m-icon-tools{
            display: flex;
            padding: 8px 30px;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40rpx;

            .icon{
                width: 36px;
                height: 36px;
            }

            .m-item{
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                width: 70px;
                color: var(--primary-brand-2, #FEDAA3);


                &.active{
                    opacity: 50%;

                    .icon{
                    }
                }
            }
        }

        .m-group{
            display: flex;
            flex-direction: column;
            gap: 12px;

            .m-list{
                border-radius: 12px;
                overflow: hidden;
                .m-item{
                    box-sizing: border-box;
                    display: flex;
                    padding: 12px 20px;
                    gap: 8px;
                    width: 100%;
                    background: var(--black-5, rgba(28, 28, 28, 0.05));
                    align-items: center;
                    .u-icon{
                        width: 20px;
                        height: 20px;
                    }
                    color: var(--black-40, rgba(28, 28, 28, 0.40));

                    .u-name{

                        /* 14 Regular */
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 20px; /* 142.857% */
                    }
                }
            }
        }

    }

    @media (prefers-color-scheme: dark) {
        .m-simple {
            background-color: #303133;

            .m-icon-tools {
                .m-item {
                    .m-title {
                        color: #e0e0e0;
                    }

                    &.active {
                        .m-title {
                            color: #409eff;
                        }
                    }
                }
            }

            .m-group {
                .m-list {
                    border-top: 1px solid #3a3a3a;
                }
            }

            .m-cancel {
                color: #e0e0e0;
                border-top: 8px solid #222;
            }
        }
    }
}


</style>
