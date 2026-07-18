<template>
    <div v-if="medals.length" class="c-author-medals">
        <div class="u-label">
            <img svg-inline src="@jx3box/jx3box-ui/assets/img/leftsidebar/medal.svg" />
            <span>{{ $jx3boxT("jx3boxUi.authorMedals.title", "作者荣誉") }}</span>
        </div>
        <div class="u-medals">
            <el-tooltip
                v-for="item in medals"
                :key="item.id || item.medal"
                effect="dark"
                :content="item.medal_desc || item.remark || item.medal"
                placement="top"
            >
                <a :href="getMedalLink(item)" target="_blank" class="u-medal">
                    <img class="u-medal-img" :src="showIcon(item.medal)" :alt="item.medal_desc || item.medal" />
                </a>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
import * as utilModule from "@jx3box/jx3box-common/js/utils";
import { __Root, __cdn } from "@/utils/config";

const { getMedalLink: getCommonMedalLink } = utilModule;

export default {
    name: "AuthorSkinMedals",
    props: {
        medals: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        showIcon(medal) {
            return `${__cdn}design/medals/user/${medal}.webp`;
        },
        getMedalLink(item) {
            if (item.medal_url) return `${__Root}${item.medal_url}`;
            if (!item.rank_id) return "javascript:;";
            return getCommonMedalLink(item.rank_id, item.medal_type || "rank");
        },
    },
};
</script>

<style lang="less">
.c-author-medals {
    .u-medals {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
    }

    .u-medal {
        cursor: pointer;
    }

    .u-medal-img {
        width: 20px;
        height: 20px;
    }
}
</style>
