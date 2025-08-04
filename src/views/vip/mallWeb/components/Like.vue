<template>
    <div class="w-like2" v-if="ready">
        <div>{{ count ? count > 99 ? "99+" : count : "" }}点赞</div>
    </div>
</template>

<script>
import { postStat, getStat } from "@jx3box/jx3box-common/js/stat";
export default {
    name: "Like2",
    props: ["postType", "postId"],
    data: function () {
        return {
            status: true,
            count: 0,
        };
    },
    computed: {
        ready() {
            return this.postType && this.postId;
        },
    },
    methods: {
        init: function () {
            this.loadStat();
        },
        loadStat: function () {
            getStat(this.postType, this.postId).then((res) => {
                this.count = res.data.likes || 0;
            });
        },
        // 点赞
        addLike: function () {
            if (!this.ready) return;
            this.count++;
            if (this.status) {
                postStat(this.postType, this.postId, "likes");
            }
            this.status = false;
        },
    },
    watch: {
        postId: {
            handler: function (val) {
                val && this.init();
                this.status = true;
            },
            immediate: true,
        },
    },
};
</script>

<style lang="less" scoped></style>
