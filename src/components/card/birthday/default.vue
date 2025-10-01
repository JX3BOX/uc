<template>
    <div class="m-birthday" v-if="userdata">
        <div class="m-birthday-video">
            <video class="u-video" :src="`${imgPath}birthbg.mp4`" type="video/mp4" autoplay loop muted></video>
            <i class="u-mask"></i>
        </div>
        <div class="m-letter">
            <div class="u-head">
                <div class="u-zip">{{ zip }}</div>
                <div class="u-atv">
                    <img class="i-atv" :src="avatar" />
                    <span class="i-stamp"></span>
                </div>
            </div>
            <div class="u-cont">
                <img class="u-circle" :src="`${imgPath}bg.png`" alt />
                <img class="u-light" :src="`${imgPath}light.png`" alt />
                <div class="u-title">
                    祝
                    <b>{{ name }}</b
                    >侠士
                </div>
                <div class="u-age">
                    <span>{{ age }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import dayjs from "dayjs";
import { getUserInfo } from "@/service/author/cms.js";
import User from "@jx3box/jx3box-common/js/user";
import { getBirthdayDetail } from "@/service/author/birthday";
import { __cdn } from "@/utils/config";
export default {
    name: "Birthday",
    props: [],
    data: function () {
        return {
            zip: "190929",
            age: 2,
            userdata: "",
            imgPath: __cdn + "design/card/birthday/default/",
        };
    },
    computed: {
        avatar: function () {
            return showAvatar(this.userdata?.user_avatar, 140);
        },
        name: function () {
            return this.userdata?.display_name;
        },
        id: function () {
            return this.$route.query.id;
        },
        uid: function () {
            return this.$route.params.uid;
        },
        isMine: function () {
            return this.uid == User.getInfo().uid;
        },
    },
    methods: {
        loadData: async function () {
            if (!this.uid) return;
            if (!this.isMine) return;
            getUserInfo(this.uid).then((res) => {
                this.userdata = res.data.data;
            });
            getBirthdayDetail(this.id).then((res) => {
                this.zip = dayjs(res.data.data.birthday).format("YYMMDD");
                this.age = res.data.data.age;
            });
        },
    },
    mounted: function () {
        this.loadData();
    },
};
</script>

<style lang="less" scope>
@import "~@/assets/css/author/birthday.less";
</style>
