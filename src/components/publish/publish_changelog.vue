<template>
    <div class="m-publish-extend">
        <el-form-item label="关联">
            <el-select v-model="selected" style="width: 400px" popper-class="m-changelog-pop" clearable>
                <el-option
                    v-for="item in data"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                >
                    <el-tag size="mini">{{ zlp_map[item.zlp] }}</el-tag>
                    <span class="m-zlp-title"><time>{{ item.date }}</time> / {{ item.title }}</span>
                </el-option>
            </el-select>
        </el-form-item>
    </div>
</template>

<script>
import { getPostMeta, setPostMeta, getChangelog } from "@/service/publish/cms";
import {all_map} from "@jx3box/jx3box-common/data/jx3_zlp.json";
export default {
    name: "publish_extend",
    props: {
        post: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    model: {
        prop: "post",
        event: "update",
    },
    data() {
        return {
            selected: "",
            data: []
        };
    },
    computed: {
        zlp_map() {
            return all_map.reduce((obj, item) => {
                obj[item.value] = item.label;
                return obj;
            }, {});
        },
        client() {
            return this.$store.state.client;
        }
    },
    watch: {
        post: {
            immediate: true,
            deep: true,
            handler(val) {
                if (!val) return;
            },
        },
    },
    mounted() {
        this.loadChangelog();
    },
    methods: {
        loadChangelog() {
            const params = {
                client: this.client,
                _no_page: 1
            }
            getChangelog(params).then(res => {
                this.data = res.data.data || [];

                this.loadPostMeta();
            })
        },
        loadPostMeta() {
            if (!this.post?.ID) return;
            getPostMeta(this.post?.ID, 'link_changelog').then(res => {
                this.selected = ~~res.data?.data?.val || "";
            })
        },
        setPostMeta(id) {
            setPostMeta(id, 'link_changelog', String(this.selected))
        },
        clearPostMeta(id) {
            setPostMeta(id, 'link_changelog', "")
        }
    }
}
</script>

<style lang="less">
.m-changelog-pop {
    .m-zlp-title {
        margin-left: 5px;
    }
}
</style>
