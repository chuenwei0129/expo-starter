import Vue from 'vue'
import App from './App'
import mockAPP from '@/pages/index/api/mockAPP'
// main.js

import uView from 'uview-ui'

Vue.use(uView)

Vue.config.productionTip = false

Vue.prototype.$dsBridge = mockAPP

App.mpType = 'app'

const app = new Vue({
  ...App,
})

app.$mount()
