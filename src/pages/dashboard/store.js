/*
 * @Author: iRuxu
 * @Date: 2022-06-11 22:14:43
 * @LastEditTime: 2022-06-11 22:15:10
 * @Description:
 */
import Vue from "vue";
import Vuex from "vuex";
import { isTeammate } from '@/service/dashboard/index'

Vue.use(Vuex);

let store = {
    state: {
        userdata: '',
        client: location.href.includes('origin') ? 'origin' : 'std',
        isTeammate: false,
    },
    mutations: {
        setIsTeammate(state, isTeammate) {
            state.isTeammate = isTeammate;
        }
    },
    getters: {
    },
    actions: {
        getIsTeammate({ commit }) {
            isTeammate().then(res => {
                commit('setIsTeammate', res.data.data);
            }).catch(err => {
                console.log(err);
            })
        }
    },
    modules: {}
};

export default new Vuex.Store(store);
