// 第三方UI组件
import Vue from "vue";
Vue.config.productionTip = false;
import ElementUI from "element-ui";
Vue.use(ElementUI);

// 通用UI模块
import "@jx3box/jx3box-common/css/element.css";
import "@jx3box/jx3box-common/css/normalize.css";

import Bottom from "@jx3box/jx3box-common-ui/src/Bottom.vue"
Vue.component('Bottom',Bottom)

import Email_Verify from "./Email_Verify.vue";

new Vue({
    // router,
    // store,
    render: (h) => h(Email_Verify),
}).$mount("#app");
