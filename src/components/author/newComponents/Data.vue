<template>
    <div class="m-exam">
        <el-tabs class="m-tabs" v-model="active" type="card">
            <el-tab-pane v-for="item in types" :key="item.value" :label="item.label" :name="item.value" :lazy="true">
                <span slot="label">
                    <i :class="item.icon"></i>
                    {{ item.label }}
                </span>
            </el-tab-pane>
        </el-tabs>
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
                    label: "战斗",
                    value: "Battle",
                    component: Battle,
                    icon: "el-icon-ice-cream",
                },
                {
                    label: "插件",
                    value: "DBM",
                    component: DBM,
                    icon: "el-icon-cold-drink",
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
