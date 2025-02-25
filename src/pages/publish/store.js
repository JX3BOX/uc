import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

// 默认仓储
let store = {
    state: {
        client : location.href.includes('origin') ? 'origin' : 'std',
        db: '',
        user_conf : {
            editor_mode : 'tinymce'
        },
        profile: {}
    },
    mutations: {
        switchClient : function (state,val){
            state.client = val || 'std'
        },
        SET_DB: (state, val) => {
            state.db = val
        },
        setUserConf : (state,val) => {
            state.user_conf = val || {
                editor_mode : 'tinymce'
            }
        },
        setProfile : (state,val) => {
            state.profile = val || {}
        }
    },
    getters: {},
    actions: {},
    modules: {},
};

export default new Vuex.Store(store);
