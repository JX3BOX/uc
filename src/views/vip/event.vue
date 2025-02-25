<template>
    <div id="app">
        <Header></Header>
        <!-- <Breadcrumb name="魔盒活动" slug="event" root="/vip/event" :publishEnable="false" :adminEnable="false" :feedbackEnable="true">
            <img slot="logo" svg-inline src="@/assets/img/vip/logo.svg" />
        </Breadcrumb> -->
        <Main class="m-vip-container" :withoutRight="true" :withoutLeft="true">
            <div class="m-vip-event">
                <simple-header title="魔盒活动" desc="Gift for U" />
                <router-view />
            </div>
        </Main>
        <Footer></Footer>
    </div>
</template>

<script>
import simple_header from "@/components/vip/simple_header.vue";
export default {
    name: "event",
    props: [],
    data: function() {
        return {};
    },
    methods: {},
    mounted: function() {},
    components: {
        "simple-header": simple_header,
    },
};
</script>
<style lang="less">
@import "~@/assets/css/vip/event.less";
</style>
