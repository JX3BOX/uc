<template>
    <el-popover ref="publish_mark" trigger="manual" v-model="visible" popper-class="m-publish-mark_popover">
        <div class="m-publish-marks">
            <div v-for="star in stars" class="m-publish-mark" :key="star" @click="onStarClick(star)">
                <img :src="imgPath(star)" alt="" svg-inline>
            </div>
            <i class="u-remove el-icon-remove-outline" title="移除标记" @click="onRemove"></i>
        </div>
        <div slot="reference" class="m-mark-content" @click="onVisibleChange">
            <img v-if="star" :src="imgPath(star)" class="u-mark-img" alt="" svg-inline>
            <span v-else class="u-mark-empty">/</span>
        </div>
    </el-popover>
</template>

<script>
const stars = ["star", "star_red", "star_green", "star_blue"];
import { onClickOutside } from '@vueuse/core'
export default {
    name: 'publish_mark',
    props: {
        value: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            visible: false,

            stars: stars,

            star: ""
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.star = val;
            }
        }
    },
    mounted() {
        onClickOutside(this.$refs.publish_mark.$el, () => {
            this.visible = false;
        })
    },
    methods: {
        handleVisibleChange(visible) {
            this.visible = visible;
        },
        imgPath(star) {
            return require(`@/assets/img/publish/macro/${star}.svg`);
        },
        onStarClick(star) {
            this.star = star;
            this.visible = false;
            this.$emit("change", this.star);
        },
        onRemove() {
            this.star = "";
            this.$emit("change", this.star);
        },
        onVisibleChange() {
            this.visible = !this.visible;
        }
    }
}
</script>

<style lang="less">
.m-publish-mark_popover {
    .m-publish-marks {
        .flex;
        align-items: center;
        // justify-content: center;
        gap: 10px;
    }
    .m-publish-mark {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        img {
            width: 20px;
            height: 20px;
        }
    }

    .u-remove {
        .pointer;
        font-size: 18px;

        color: #F56C6C;

        // 45度旋转
        transform: rotate(-45deg);
    }
}
.m-mark-content {
    height: 40px;
    width: 40px;
    .flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dcdfe6;
    background-color: #f5f7fa;
    border-radius: 4px;
    box-sizing: border-box;
    margin-right: 10px;
    .pointer;
    .u-mark-img {
        width: 20px;
        height: 20px;
    }
    .u-mark-empty {
        color: #c0c4cc;
    }

    &:hover {
        background-color: #e6f7ff;
    }
}
</style>
