import { createStore } from "vuex";

import mallStore from "./mall";
import mallNewStore from "./mallNew";

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

export default createStore(store);
