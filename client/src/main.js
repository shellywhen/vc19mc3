// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import AsyncComputed from 'vue-async-computed'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import Vuex from 'vuex'
import * as $ from 'jQuery'
import * as d3 from 'd3'
Vue.config.productionTip = false
window.d3 = d3
window.$ = $

Vue.use(ElementUI, { locale })
Vue.use(AsyncComputed)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  components: { App },
  router,
  store,
  template: '<App/>'
})
