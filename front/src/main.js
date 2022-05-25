import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入公共样式
import './assets/assets.css'
//引入ViewUI
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
//引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入表格组件
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

// 引入插件
import plugins from "./plugins.js" 

Vue.use(ElementUI);
Vue.use(plugins)
Vue.use(VXETable)

Vue.config.productionTip = false

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vm