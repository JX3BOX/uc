<template>
    <HeaderLessLayout>
        <div class="m-main m-index-popup">
            <component :is="event_component" :data="component_data" @close="close" />
        </div>
    </HeaderLessLayout>
</template>

<script>
import { some } from "lodash";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import cardType from "@/assets/data/author/card.json";
import { getHolidayCard } from "@/service/author/card";
import HeaderLessLayout from "@/layouts/author/HeaderLessLayout.vue";
import DefaultTemplate from "@/components/author/card/DefaultTemplate.vue";
import CardChildren from "@/components/author/card/CardChildren.vue";
import CardSpring from "@/components/author/card/CardSpring.vue";
import CardNewYear from "@/components/author/card/CardNewYear.vue";
import CardChristmas from "@/components/author/card/CardChristmas.vue";
import CardQixi from "@/components/author/card/CardQixi.vue";
import CardDragonBoat from "@/components/author/card/CardDragonBoat.vue";
import CardLantern from "@/components/author/card/CardLantern.vue";
import CardAutumn from "@/components/author/card/CardAutumn.vue";
import DoubleScreen from "@/components/author/card/DoubleScreen.vue";
import OneScreen from "@/components/author/card/OneScreen.vue";
import User from "@jx3box/jx3box-common/js/user";

export default {
    name: "holidayCard",
    components: {
        HeaderLessLayout,
        DefaultTemplate,
        CardChildren,
        CardSpring,
        CardNewYear,
        CardChristmas,
        CardQixi,
        CardDragonBoat,
        CardLantern,
        CardAutumn,
        DoubleScreen,
        OneScreen,
    },
    data: function () {
        return {
            cardType,
            list: [],
            data: {},
        };
    },
    computed: {
        // 用户id
        user_id() {
            return this.$route.params.uid;
        },
        // 打开的卡号id
        my_card_id() {
            return this.$route.query.id;
        },
        // 当前活动的信息
        active_event() {
            return this.list.find((item) => item.id == this.my_card_id);
        },
        // 当前卡号对应的活动id
        event_id() {
            return this.$route.params.event_id;
        },
        // 活动id对应的活动key
        event_key() {
            return this.cardType[this.event_id]?.key;
        },
        // 活动对应的图片地址
        imgLink() {
            return __cdn + `design/card/festival/${this.event_key}/`;
        },
        // 活动对应的图片列表
        imgList() {
            return this.cardType[this.event_id]?.imgList || [];
        },
        // 活动抽中的数量
        fontCount() {
            return this.active_event?.event_reward_count;
        },
        // 当前组件
        event_component() {
            return this.cardType[this.event_id]?.component;
        },
        // 组件数据
        component_data() {
            const _data = {
                default: this.default_data,
                children: this.children_data,
                spring: this.spring_data,
                newyear: this.newyear_data,
                christmas: this.christmas_data,
                qixi: this.qixi_data,
                dragon: this.dragon_data,
                lantern: this.newyear_data,
                autumn: this.newyear_data,
                double: this.double_data,
                one: this.one_data,
            };
            return _data[this.cardType[this.event_id]?.type];
        },
        // 默认数据
        default_data() {
            const bg = this.cardType[this.event_id]?.bg;
            const count = this.cardType[this.event_id]?.count;
            const countImgList = String(this.fontCount)
                .split("")
                .map((item) => `${this.imgLink}${item}.png`);
            const data = {
                imgList: this.imgList.map((item) => `${this.imgLink}${item}`),
                fontCount: this.fontCount,
                countImg: `${this.imgLink}${this.fontCount}.png`,
                countImgList,
                count,
            };
            if (bg) data.countBg = `${this.imgLink}${bg}`;
            return data;
        },
        // 儿童节
        children_data() {
            return {
                bgImg: `${this.imgLink}bg.png`,
                buttonImg: `${this.imgLink}button.png`,
                bg2Img: `${this.imgLink}bg2.png`,
                countImg: `${this.imgLink}${this.fontCount}.png`,
            };
        },
        // 春节
        spring_data() {
            const hasYear = this.cardType[this.event_id]?.year;
            const _default = {
                letter: `${this.imgLink}letter.png`,
                cover: `${this.imgLink}cover.png`,
                countImg: `${this.imgLink}${this.fontCount}.png`,
            };
            const _year = {
                year: true,
                bg: `${this.imgLink}BG.jpg`,
                cover: `${this.imgLink}cover.png`,
                button: `${this.imgLink}button.png`,
                countImg: `${this.imgLink}${this.fontCount}.png`,
            };
            return hasYear ? _year : _default;
        },
        // 元旦
        newyear_data() {
            return {
                fontCount: this.fontCount,
                imgList: this.imgList.map((item) => `${this.imgLink}${item}`),
            };
        },
        // 圣诞
        christmas_data() {
            return {
                countImg: `${this.imgLink}${this.fontCount}.png`,
                imgList: this.imgList.map((item) => `${this.imgLink}${item}`),
            };
        },
        // 七夕
        qixi_data() {
            return {
                fontCount: this.fontCount,
                countImg: `${this.imgLink}${this.fontCount}.png`,
                imgList: this.imgList.map((item) => `${this.imgLink}${item}`),
            };
        },
        // 端午
        dragon_data() {
            return {
                countImg: `${this.imgLink}${this.fontCount}.svg`,
                imgList: this.imgList.map((item) => `${this.imgLink}${item}`),
            };
        },
        double_data() {
            return {
                fontCount: this.fontCount,
                countImg: `${this.imgLink}${this.fontCount}.png`,
                imgList: this.imgList.map((item) => `${this.imgLink}${item}`),
                vImg: `${this.imgLink}/v${this.fontCount}.png`,
                bgImg: `${this.imgLink}bg.png`,
            };
        },
        one_data() {
            const key = this.event_key;
            const text = this.cardType[this.event_id]?.text;
            const data = {
                fontCount: this.fontCount,
                imgLink: __cdn + `design/card/festival/${key}.png`,
            };
            if (text) data.text = text;
            return data;
        },
    },
    watch: {
        my_card_id: {
            handler: function (id) {
                if (!id) return this.goBack();
                id && this.load();
            },
            immediate: true,
        },
    },
    methods: {
        close() {
            this.goBack();
            window.parent.postMessage("closeHolidayCard", "*");
        },
        goBack() {
            this.$router.push({ name: "index", params: { id: this.user_id } });
        },
        load() {
            if (!User.isLogin()) return;
            if (User.getInfo().uid != this.user_id) {
                this.goBack();
            }
            getHolidayCard({ _no_page: 1 }).then((res) => {
                this.list = res.data.data?.list || [];
                // 如果用户没有对应的卡号
                if (!this.checkMatch(this.list)) {
                    this.goBack();
                }
            });
        },
        checkMatch(list) {
            return some(list, { id: ~~this.my_card_id, event_id: ~~this.event_id });
        },
    },
};
</script>

<style lang="less">
.m-main {
    height: 100vh;
    background-color: #24292e;
}
@import "~@/assets/css/author/pop.less";
</style>
