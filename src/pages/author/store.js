import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let store = {
    state: {
        userdata: "",
        client: location.href.includes("origin") ? "origin" : "std",
    },
    mutations: {},
    getters: {},
    actions: {},
    modules: {},
    decoration_me: null,
};

export default new Vuex.Store(store);
