<template>
    <div class="w-like2" v-if="ready">
        <div>{{ count ? count > 99 ? "99+" : count : "" }}点赞</div>
    </div>
</template>

<script>
import { postStat, getStat } from "@jx3box/jx3box-common/js/stat";
import { getMallStat, postMallLike } from "@/service/vip/mall";
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
            const request = this.postType === "mall" ? getMallStat(this.postId) : getStat(this.postType, this.postId);
            request
                .then((res) => {
                    this.count = res.data.likes || 0;
                })
                .catch(() => {
                    this.count = 0;
                });
        },
        // 点赞
        addLike: function () {
            if (!this.ready || !this.status) return;
            this.status = false;
            this.count++;
            const request = this.postType === "mall" ? postMallLike(this.postId) : postStat(this.postType, this.postId, "likes");
            request.catch(() => {
                this.count = Math.max(0, this.count - 1);
                this.status = true;
            });
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
