import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(Vuex)
Vue.use(axios, VueAxios)
export default new Vuex.Store({
  state: {
    detail: [],
    sheet: [],
    tags: [],
    keyword: '',
    matrixStat: []
  },
  mutations: {
    init (state, payload) {
      state[payload.field] = payload.data
    },
    set (state, payload) {
      state[payload.field] = payload.data
      console.log('state change!', payload.field)
    }
  },
  actions: {
    async init ({commit}) {
      await Vue.axios.get('http://localhost:1111/data').then(res => {
        console.log('hello raw function')
        let payload = {
          'field': 'sheet',
          'data': res.data
        }
        commit('init', payload)
      })
    }
  }
})