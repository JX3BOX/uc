<template>
    <div class="m-pictures">
        <el-image :src="resolveImagePath(img)" class="u-big" fit="contain">
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
        <div class="m-list">
            <img
                class="u-item"
                :src="resolveImagePath(item)"
                @click="change(item)"
                @mouseenter="change(item)"
                v-for="item in data"
                :key="item"
            />
        </div>
    </div>
</template>
<script>
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "GoodsDetailPictures",
    props: ["list"],
    data: function () {
        return {
            img: "",
        };
    },
    computed: {
        data() {
            return this.list && this.list.length ? this.list.slice(0, 6) : [];
        },
    },
    watch: {
        data: {
            immediate: true,
            handler: function (list) {
                if (list.length) this.img = list[0];
            },
        },
    },
    methods: {
        change(item) {
            this.img = item;
        },
        resolveImagePath,
    },
};
</script>
