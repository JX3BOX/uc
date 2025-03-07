<template>
    <header class="m-header">
        <a :href="homepage"
            ><img class="u-logo" svg-inline src="@/assets/img/account/logo.svg"
        /></a>
        <el-divider class="u-title">JX3BOX</el-divider>
    </header>
</template>

<script>
import {__Root} from '@jx3box/jx3box-common/data/jx3box.json'
export default {
    name: "CardHeader",
    data: function() {
        return {
            homepage: __Root,
        };
    },
};
</script>
