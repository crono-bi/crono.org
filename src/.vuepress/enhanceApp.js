/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */


import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Importar componentes
import Countdown from './components/Countdown.vue'
import MaintenancePage from './components/MaintenancePage.vue'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  Vue.use(BootstrapVue)
  Vue.use(IconsPlugin)
  
  // Registrar componentes globales
  Vue.component('Countdown', Countdown)
  Vue.component('MaintenancePage', MaintenancePage)

  // Redirigir todas las rutas a / (modo mantenimiento)
  router.beforeEach((to, from, next) => {
    if (to.path === '/') {
      next()
    } else {
      next('/')
    }
  })
}
