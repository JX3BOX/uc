<template>
    <div class="m-info">
        <div class="u-stat"></div>
        <div class="u-home">
            <a class="el-button el-button--default is-plain" :href="home"
                ><img
                    class="u-home-icon"
                    svg-inline
                    src="@/assets/img/dashboard/home.svg"
                />个人主页</a
            >
        </div>
    </div>
</template>

<script>
import { authorLink } from "@jx3box/jx3box-common/js/utils";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Info",
    props: [],
    data: function() {
        return {
            uid: User.getInfo().uid,
        };
    },
    computed: {
        home: function() {
            return authorLink(this.uid);
        },
    },
    methods: {},
    mounted: function() {},
};
</script>

<style lang="less">
.c-breadcrumb {
    .u-channel-logo {
        box-sizing: border-box;
        padding: 5px;
        position: relative;
        top: -2px;
        .mr(3px);
    }
    .u-desc {
        .fz(12px);
        border: 1px solid #eee;
        .r(3px);
        .ml(10px);
        padding: 2px 10px;
    }
    .u-home {
        .fr;
        margin-right: 10px;
        a {
            .r(3px);
            padding: 5px 10px;
            .fz(14px);
            .db;

            &:hover {
                .u-home-icon {
                    fill: @primary;
                }
            }
        }
        .u-home-icon {
            .size(14px);
            .y(-2px);
            .mr(5px);
            fill: #666;
        }
    }
}
@media screen and (max-width: @phone) {
    .c-breadcrumb {
        .u-desc {
            .none;
        }
    }
}
</style>
