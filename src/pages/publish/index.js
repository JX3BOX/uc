Vue.config.productionTip = false;

// 第三方UI组件
import Vue from "vue";
import ElementUI from "element-ui";
Vue.use(ElementUI);

// 通用UI模块
import JX3BOX_UI from '@jx3box/jx3box-common-ui'
import "@jx3box/jx3box-common/css/element.css";
import "@jx3box/jx3box-common/css/normalize.css";
Vue.use(JX3BOX_UI);

// 快速复制
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import reporter from "@jx3box/jx3box-common/js/reporter";
reporter.install(Vue);

import PublishDesignTask from "@/components/publish/publish_design_task.vue";
Vue.component(PublishDesignTask.name, PublishDesignTask)
import CmsBanner from "@/components/publish/cms_banner.vue";
Vue.component(CmsBanner.name, CmsBanner)

// 监听 sessionStorage 变化
import handleSessionStorage from '@/utils/handleSessionStorage.js'
Vue.use(handleSessionStorage)

handleSessionStorage();

import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);

// 数据与路由
import router from "./router";
import store from "./store";

import App from "./publish.vue";
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount("#app");

