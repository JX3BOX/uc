<template>
    <div class="m-role-card">
        <div class="m-role-box">
            <div :class="['u-item', first.mount!=null?`mount-${first.mount}-var`:'', total > 1 ? 'has-num' : '']">
                <div class="u-title">
                    TA的角色
                </div>
                <div class="m-info">
                    <div :class="['u-name', first.name && first.name.length <= 7 ? 'is-big' : '']">
                        {{ first.name || '暂未绑定角色' }}
                    </div>
                    <div class="m-ext">
                        <div class="u-item">{{ first.server || '暂无' }}</div>
                        <div v-if="mount_name" class="u-item">{{ mount_name }}</div>
                    </div>
                </div>
                <img
                    v-if="mount_name "
                    :src="`/static/icons/mounts/${mount_name}.svg`"
                    class="u-mount-icon"
                />
                <img v-if="mount_avatar" class="u-mount-avatar" :src="mount_avatar" />
            </div>
            <div v-if="total > 1" class="u-num">
                + {{ total - 1 }}
            </div>
        </div>
    </div>
</template>

<script>


import User from "@jx3box/jx3box-common/js/user";
import school_map from "@jx3box/jx3box-data/data/xf/schoolid.json";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "RoleCard",
    data() {
        return {
            list: [],
            total: 0,
            first: {},
            mounts: school_map
        };
    },
    mounted() {
        this.loadData();
    },
    computed:{
        mount_avatar(){
            if (!this.first.id){
                return  ''
            }

            return this.getMountAvatar(this.first.mount, this.first.body_type, 368);
        },
        mount_name(){
            if (!this.first.id){
                return  ''
            }
            return school_map[this.first.mount] || "江湖";
        }
    },
    methods: {
        loadData() {
            if (!User.isLogin()) return;

            getMyGameRoles({ per: 2 }).then(({ data }) => {
                this.list = data?.data?.list || [];
                this.first = this.formatFirst(data?.data?.list?.[0] || {});
                this.total = data?.data?.page?.total || 0;
            });
        },
        getMountAvatar(mount, body, size, replace) {
            return getThumbnail(`https://cdn.jx3box.com/design/avatar/mini/${mount}-${body}.png`, size, replace);
        }
    }
};
</script>

<style lang="less">
@import "~@/assets/css/author/mobile/mount-id.less";

.m-role-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;

    .m-role-box {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        align-self: stretch;

        .u-item {
            display: flex;
            flex-direction: column;
            flex: 1 0 0;
            padding: 12px;
            border-radius: 12px;
            background: linear-gradient(77deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.20) 100%), var(--mount-color,#8C4D96);
            position: relative;
            overflow: hidden;

            .u-title {
                color: #fff;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 16px;
                margin-bottom: 12px;
                z-index: 1;
            }

            .m-info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                flex: 1;
                min-height: 76px;
                z-index: 1;

                .u-name {
                    color: #FFF;
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 125%;
                    max-height: 56px;
                    max-width: 12ch;
                    word-wrap: break-word;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    margin-bottom: 4px;
                    &.is-big {
                        font-size: 20px;
                        margin-bottom: 8px;
                    }
                }

                .m-ext {
                    gap: 4px;
                    .u-item {
                        display: inline-flex;
                        padding: 0.5px 8px 0;
                        align-items: center;
                        gap: 0px;
                        border-radius: 8px;
                        background: var(--black-20);
                        color: #fff;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 18px;
                        margin-right: 4px;

                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }
            }

            .u-mount-icon {
                display: flex;
                position: absolute;
                right: -60px;
                bottom: -112px;
                width: 355px;
                height: 355px;
                opacity: 0.1;
                filter: brightness(0) invert(1);
                justify-content: center;
                align-items: center;
            }

            .u-mount-avatar {
                position: absolute;
                right: 0;
                top: -26px;
                width: 184px;
                height: 184px;
                border: none;
                background: none;
            }

            &.has-num {
                .u-mount-icon {
                    right: -90px;
                }
                .u-mount-avatar {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 132px;
                    height: 132px;
                    flex-shrink: 0;
                }
            }
        }

        .u-num {
            display: flex;
            width: 41px;
            padding: 0 21px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-self: stretch;
            border-radius: 12px;
            background: var(--black-10);
            color: var(--black-80, rgba(255, 255, 255, 0.80));
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 20px;
        }
    }
}
</style>
