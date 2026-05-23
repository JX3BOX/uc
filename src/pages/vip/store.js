import { createStore } from "vuex";

import mallNewStore from "./mallNew";

let store = {
    state: {
        client : location.href.includes('std') ? 'std' : 'origin',
    },
    mutations: {},
    getters: {},
    actions: {},
    modules: {
        mallNew: mallNewStore,
    },
};

export default createStore(store);
