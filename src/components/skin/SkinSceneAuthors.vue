<template>
    <span class="m-skin-scene-authors" v-if="normalizedAuthors.length">
        <span class="u-label">作者：</span>
        <template v-for="(author, index) in normalizedAuthors" :key="author.id || index">
            <a :href="`/author/${author.id}`" target="_blank" rel="noopener noreferrer">
                <img v-if="author.avatar" :src="author.avatar" alt="" />
                <em>{{ author.display_name }}</em>
            </a>
            <i v-if="index < normalizedAuthors.length - 1" :key="`split-${index}`">、</i>
        </template>
    </span>
</template>

<script>
import { normalizeSkinAuthors } from "./scene";

export default {
    name: "SkinSceneAuthors",
    props: {
        authors: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        normalizedAuthors() {
            return normalizeSkinAuthors(this.authors);
        },
    },
};
</script>

<style lang="less" scoped>
.m-skin-scene-authors {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    min-width: 0;
    margin-left: 12px;
    color: #64748b;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    vertical-align: middle;

    .u-label {
        color: #64748b;
        font-weight: 400;
    }

    a {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        color: #64748b;
        text-decoration: none;
        transition: color 0.15s ease;

        &:hover {
            color: #3f51ff;
        }
    }

    img {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        border-radius: 50%;
        object-fit: cover;
        background: #e5e7eb;
    }

    em,
    i {
        font-style: normal;
    }
}
</style>
