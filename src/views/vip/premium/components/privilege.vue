<template>
    <div class="m-privilege">
        <div class="m-privilege-head">
            <h3 class="u-privilege-title">{{ $t("vip.premium.privileges") }}</h3>
            <span>{{ $t("vip.premium.privilegesHint") }}</span>
        </div>
        <ul>
            <li v-for="(item, i) in list" :key="i">
                <el-icon class="u-icon"><component :is="item.icon" /></el-icon>
                <span class="u-text">{{ item.text }}</span>
                <span v-if="item.tag" class="u-tag" :class="`is-${item.tag.toLowerCase()}`">{{ item.tag }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { getMenu } from "@jx3box/jx3box-common/js/system";
import {
    Brush,
    Coin,
    CollectionTag,
    MagicStick,
    Medal,
    MoreFilled,
} from "@element-plus/icons-vue";

const DEFAULT_LIST = [
    { key: "earlyAccess", icon: "Medal" },
    { key: "doublePoints", icon: "Coin" },
    { key: "exclusiveDecorations", icon: "Brush" },
    { key: "nicknameBadge", icon: "CollectionTag" },
    { key: "unlimitedFriends", icon: "MagicStick" },
    { key: "moreComing", icon: "MoreFilled" },
];
const ICONS = ["Brush", "Coin", "CollectionTag", "MagicStick", "Medal", "MoreFilled"];

export default {
    name: "privilege",
    components: {
        Brush,
        Coin,
        CollectionTag,
        MagicStick,
        Medal,
        MoreFilled,
    },
    data: function () {
        return {
            list: [],
        };
    },
    computed: {
        defaultList() {
            return DEFAULT_LIST.map((item) => ({
                ...item,
                text: this.$t(`vip.premium.defaultPrivileges.${item.key}`),
            }));
        },
    },
    mounted() {
        this.list = this.defaultList;
        this.loadPrivileges();
    },
    methods: {
        loadPrivileges() {
            getMenu("vip_privileges")
                .then((res) => {
                    const list = (res || []).map(this.normalizePrivilege).filter((item) => item.text);
                    if (list.length) {
                        this.list = list;
                    }
                })
                .catch(() => {
                    this.list = this.defaultList;
                });
        },
        normalizePrivilege(item = {}, index) {
            const icon = item.icon || item.extend?.icon || item.meta?.icon || this.defaultList[index]?.icon || "MoreFilled";
            return {
                text: item.text || item.label || item.name || item.title || "",
                icon: ICONS.includes(icon) ? icon : "MoreFilled",
                tag: item.tag || item.extend?.tag || item.meta?.tag || "",
            };
        },
    },
};
</script>

<style lang="less" scope>
.m-privilege {
    user-select: none;
    color: #24292e;
    width: 100%;
    .r(8px);
    box-sizing: border-box;
    padding: 20px 22px 22px;
    border: 1px solid #e5e7eb;
    background: #fff;

    .m-privilege-head {
        .flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
        .mb(14px);

        span {
            .fz(13px, 20px);
            color: #6b7280;
        }
    }

    .u-privilege-title {
        .fz(18px, 26px);
        font-weight: 700;
        margin: 0;
        color: #24292e;
    }

    ul {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        padding: 0;
        margin: 0;

        li {
            display: flex;
            align-items: center;
            min-height: 48px;
            box-sizing: border-box;
            padding: 9px 14px;
            border-radius: 8px;
            background: #f8fafc;
            color: #4b5563;
            font-size: 13px;
            line-height: 20px;

            .u-icon {
                .size(28px);
                .r(8px);
                margin-right: 12px;
                flex-shrink: 0;
                color: @v4primary;
                background: fade(@v4primary, 8%);

                svg {
                    .size(15px);
                }
            }

            .u-text {
                min-width: 0;
                font-weight: 400;
                word-break: break-word;
                flex: 0 1 auto;
            }

            .u-tag {
                border-radius: 3px;
                margin-left: 6px;
                color: #fff;
                background: #ef4444;
                padding: 0 6px;
                flex-shrink: 0;
                font-weight: 700;
                .fz(12px, 20px);
            }

            .u-tag.is-new {
                background: #22c55e;
            }
        }
    }
}

@media screen and (max-width: @phone) {
    .m-privilege {
        padding: 18px;

        .m-privilege-head {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
        }

        ul {
            grid-template-columns: 1fr;
        }
    }
}
</style>
