import Vue from "vue";
import Vuex from "vuex";

import mallStore from "./mall";
import mallNewStore from "./mallNew";

Vue.use(Vuex);

let store = {
    state: {
        client : location.href.includes('std') ? 'std' : 'origin',
    },
    mutations: {},
    getters: {},
    actions: {},
    modules: {
        mall: mallStore,
        mallNew: mallNewStore,
    },
};

export default new Vuex.Store(store);
