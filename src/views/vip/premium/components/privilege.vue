<template>
    <div class="m-privilege">
        <img class="u-privilege-title" src="@/assets/img/vip/vip2/privilege.png" alt="会员特权" />
        <ul :class="`m-list-${l + 1}`" v-for="(list, l) in group" :key="l">
            <li v-for="(item, i) in list" :key="i">
                <img class="u-icon" :src="require(`@/assets/img/vip/vip2/icon-${item.index}.svg`)" svg-inline />
                <span>{{ item.text }}</span>
                <span v-if="item.tag" class="u-tag" :style="{ backgroundColor: item.color }">{{ item.tag }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "privilege",
    data: function () {
        return {
            group: [
                [
                    { text: "魔盒新功能提前体验", index: 1, tag: "Hot", color: "#E72525" },
                    { text: "团队应用高级功能", index: 2 },
                    { text: "个人战斗数据仓库（不限）", index: 3 },
                    { text: "魔盒助手高级功能（不限）", index: 4 },
                ],
                [
                    { text: "专属虚拟装扮", index: 5 },
                    { text: "亲友名单无上限", index: 6 },
                    { text: "专属昵称尾巴标识", index: 7 },
                    { text: "签到双倍积分", index: 8, tag: "New", color: "#11D41E" },
                    { text: "更多特权，敬请期待！", index: 9 },
                ],
            ],
        };
    },
};
</script>

<style lang="less" scope>
.m-privilege {
    user-select: none;
    color: #4d4d4d;
    max-width: 224px;
    .u-privilege-title {
        height: 28px;
    }
    ul {
        padding: 0 0 20px 0;
        li {
            display: flex;
            align-items: center;
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            margin-top: 12px;
            .u-icon {
                width: 16px;
                height: 16px;
                margin-right: 5px;
            }
            .u-tag {
                border-radius: 3px;
                margin-left: 5px;
                color: #fff;
                padding: 0 6px;
            }
        }
    }
}
</style>
