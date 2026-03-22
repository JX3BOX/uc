<template>
    <div class="m-exam">
        <div class="m-segmented">
            <el-segmented
                v-model="active"
                :options="types.map((item) => ({ label: item.label, value: item.value, icon: item.icon }))"
            >
                <template #default="scope">
                    <div class="flex items-center gap-1 p-2">
                        <i :class="scope.item.icon"></i>
                        <div>{{ scope.item.label }}</div>
                    </div>
                </template>
            </el-segmented>
        </div>
        <div class="m-primary">
            <component :is="currentComponent" v-if="activeType === active" />
        </div>
    </div>
</template>

<script>
import Pz from "@/components/author/Pz";
import Battle from "@/components/author/Battle";
import DBM from "@/components/author/DBM";
export default {
    name: "Data",
    components: {
        Pz,
        Battle,
        DBM,
    },
    data: function () {
        return {
            active: "Pz",
            types: [
                {
                    label: "配装",
                    value: "Pz",
                    component: Pz,
                    icon: "el-icon-sugar",
                },
                {
                    label: "插件",
                    value: "DBM",
                    component: DBM,
                    icon: "el-icon-cold-drink",
                },
                {
                    label: "战斗",
                    value: "Battle",
                    component: Battle,
                    icon: "el-icon-ice-cream",
                },
            ],
        };
    },
    computed: {
        currentComponent: function () {
            return this.types.find((item) => item.value === this.active).component;
        },
        activeType: function () {
            return this.types.find((item) => item.value === this.active).value;
        },
    },
};
</script>

<style lang="less">
.m-exam {
    .m-segmented, .el-segmented {
        .x;
    }
}
</style>
