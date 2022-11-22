/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

import Prism from "prismjs";

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  Vue.use(BootstrapVue)
  Vue.use(IconsPlugin)
  router.afterEach(() => {
    setTimeout(() => {
      Prism.highlightAll();
    }, 1000);
  });
  // ...apply enhancements for the site.
}
