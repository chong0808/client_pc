import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import IPC from './../../ipcCfg'
import ElementUI from 'element-ui'
import lodash from 'lodash'
import 'element-ui/lib/theme-chalk/index.css'
// import './../../../node_modules/element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
Vue.use(ElementUI)
// require('./../mock.js')
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http = Vue.prototype.$http = axios

Vue.config.productionTip = false
// 引入通讯
Vue.prototype.$_IPC = IPC.INDEXIPC
Vue.prototype.$_ = lodash
Vue.prototype.$moment = moment
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
