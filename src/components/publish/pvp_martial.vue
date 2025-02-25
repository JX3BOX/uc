<template>
    <div class="m-pvp-martial">
        <div class="m-martial-skill" v-for="(kungfu, index) in kungfu_skills" :key="index">
            <div class="u-title">
                <span class="u-title-name">{{ kungfu[0].kungfu_name }}</span>
                <img src="@/assets/img/publish/skillset.png" class="u-title-img" alt="" />
            </div>
            <div class="m-skills">
                <div class="m-skill" v-for="(panel_item, i) in kungfu" :key="i" @click="selectSkill(panel_item.skill)">
                    <div class="u-skill" v-if="panel_item.skill && panel_item.skill.IconID">
                        <img
                            :class="{ 'is-wujie': panel_item.skill.IconID > 100000 }"
                            class="u-skill-icon"
                            :src="iconLink(panel_item.skill.IconID)"
                            :alt="panel_item.skill.IconID"
                        />
                        <span class="u-name" :title="panel_item.skill.Name">{{ panel_item.skill.Name }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 奇穴技能 -->
        <div class="m-martial-skill" v-if="talentSkills && talentSkills.length && platform == 'std'">
            <div class="u-title">
                <span class="u-title-name">奇穴技能</span>
                <img src="@/assets/img/publish/skillset.png" class="u-title-img" alt="" />
            </div>
            <div class="m-skills">
                <div class="m-skill" v-for="(skill, index) in talentSkills" :key="index" @click="selectSkill(skill)">
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img class="u-skill-icon" :src="iconLink(skill.IconID)" :alt="skill.IconID" />
                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 江湖轻功 -->
        <div class="m-martial-skill" v-if="platform == 'std'">
            <div class="u-title">
                <span class="u-title-name">江湖轻功</span>
                <img src="@/assets/img/publish/skillset.png" class="u-title-img" alt="" />
            </div>
            <div class="m-skills">
                <div class="m-skill" v-for="(skill, index) in commonSkills" :key="index" @click="selectSkill(skill)">
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img class="u-skill-icon" :src="iconLink(skill.IconID)" :alt="skill.IconID" />
                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { getSkills, getTalents } from "@/service/publish/raw";
import { getKungfuPanel } from "@/service/publish/node.js";
import { flattenDeep, uniqBy, groupBy } from "lodash";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "pvp_martial",
    props: {
        subtype: {
            type: String,
            default: "通用",
        },
        platform: {
            type: String,
            default: "std",
        },
    },
    emits: [],
    data() {
        return {
            talents: [],
            data: [],
            loading: false,

            kungfu_skills: {},
            talent_skills: {},
        };
    },
    computed: {
        mountId() {
            return xfmap[this.subtype]?.id;
        },
        client() {
            return this.$store.state.client;
        },
        params() {
            return {
                ids: [...this.talentSkillIds, ...this.commonIds].join(","),
                client: this.client,
            };
        },
        // 奇穴id std
        talentSkillIds() {
            return flattenDeep(this.mountId && this.talents?.[this.mountId]) || [];
        },
        // 手动写死
        commonIds() {
            // 后撤、蹑云逐月、扶摇直上、凌霄揽胜、瑶台枕鹤、迎风回浪
            return [9007, 9003, 9002, 9005, 9006, 9004];
        },
        talentSkills() {
            return this.talentSkillIds
                .map((SkillID) => {
                    const currentSkill = this.data.find((d) => d.SkillID == SkillID);
                    return currentSkill;
                })
                .filter((item) => item && item.IsPassiveSkill == 0)
                .map((item) => {
                    return {
                        ...item,
                        Name: item.Name.replace(/·悟$/, ""),
                    };
                });
        },
        commonSkills() {
            return this.commonIds
                .map((SkillID) => {
                    const currentSkill = this.data.find((d) => d.SkillID == SkillID);
                    return currentSkill;
                })
                .filter(Boolean);
        },
        reloadTrigger() {
            return [this.platform, this.mountId];
        },
    },
    watch: {
        reloadTrigger: {
            handler() {
                getTalents(this.platform).then((res) => {
                    this.talents = res;
                    this.loadSkills();
                });
                this.loadMountKungfuPanel();
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        iconLink,
        async loadSkills() {
            this.loading = true;
            return getSkills(this.params)
                .then((res) => {
                    this.data = uniqBy(res.data, "Name");
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        selectSkill(skill) {
            this.$emit("selectSkill", skill);
        },
        async loadMountKungfuPanel() {
            let mount_id = this.mountId;
            if (this.platform == "wujie" && mount_id == 10144) {
                mount_id = 100725;
            }
            let client = this.client;
            if (this.platform == "wujie") {
                client = "wujie";
            }
            getKungfuPanel({ client, mount_id }).then((res) => {
                this.kungfu_skills = {};
                const list = res.data.data;
                const kungfu_skills = groupBy(
                    list
                        .filter((item) => item.column >= 0 && !item.belong)
                        .sort((a, b) => a.column - b.column)
                        .map((item) => {
                            item.skill.Name = item.skill.Name.replace(/·悟$/, "");
                            return item;
                        }),
                    "kungfu_id"
                );
                // 无界端删除多余技能
                if (this.platform == "wujie") {
                    delete kungfu_skills["-1"];
                    delete kungfu_skills["0"];
                    delete kungfu_skills["5"];

                    let seenNames = [];
                    for (const key in kungfu_skills) {
                        kungfu_skills[key] = kungfu_skills[key].filter((item) => {
                            if (seenNames.indexOf(item.skill.Name) == -1 && item.skill.IconID !== null) {
                                seenNames.push(item.skill.Name);
                                return true;
                            }
                            return false;
                        });
                        if (kungfu_skills[key].length == 0) {
                            delete kungfu_skills[key];
                        }
                    }
                }
                this.kungfu_skills = kungfu_skills;
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/publish/pvp.less";
.m-pvp-martial .m-martial-skill .u-skill-icon.is-wujie {
    border: 2px solid #2a9998;
    border-radius: 50%;
    width: 52px;
    height: 52px;
}
</style>
