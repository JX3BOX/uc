<template>
    <AppLayout>
        <div class="m-birthday" v-if="userdata">
            <div class="m-birthday-video">
                <video
                    class="u-video"
                    src="@/assets/img/author/birthday/birthbg.mp4"
                    type="video/mp4"
                    autoplay
                    loop
                    muted
                ></video>
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
                    <img class="u-circle" src="@/assets/img/author/birthday/bg.png" alt />
                    <img class="u-light" src="@/assets/img/author/birthday/light.png" alt />
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
            <Footer></Footer>
        </div>
    </AppLayout>
</template>

<script>
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { Base64 } from "js-base64";
import { getUserInfo } from "@/service/author/cms.js";
import AppLayout from "@/layouts/author/AppLayout.vue";
import User from "@jx3box/jx3box-common/js/user";
export default {
    name: "Birthday",
    props: [],
    data: function () {
        return {
            zip: "190929",
            age: 2,
            userdata: "",
            democode: "MjAxOTA5MjkwMg==", //Base64.encode('2019092902')
        };
    },
    computed: {
        uid: function () {
            return User.isLogin() ? User.getInfo()?.uid : 0;
        },
        params: function () {
            return new URLSearchParams(location.search);
        },
        avatar: function () {
            return showAvatar(this.userdata?.user_avatar, 140);
        },
        name: function () {
            return this.userdata?.display_name;
        },
    },
    methods: {
        buildCard: function () {
            let _code = this.params.get("code");
            let code = (_code && Base64.decode(_code)) || Base64.decode(this.democode);
            this.age = ~~code.slice(8) || 1;
            this.zip = code.slice(2, 8);
        },
        loadData: function () {
            if (!this.uid) return;
            return getUserInfo(this.uid).then((res) => {
                this.userdata = res.data.data;
            });
        },
    },
    mounted: function () {},
    created: function () {
        if (!isNaN(this.uid) && this.uid)
            this.loadData().then(() => {
                this.buildCard();
            });
    },
    components: { AppLayout },
};
</script>
