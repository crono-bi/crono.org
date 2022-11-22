<template>
  <div class="mt-1 mb-2 row">
    <div class="col-lg-12">
      <pre class="language-sql line-numbers" :data-src="`/code/${fileName}.csql`"></pre>

			<pre class="language-sql line-numbers" :data-src="`/code/${fileName}.sql`" ref="code" v-show="false"></pre>

      <b-button class="float-right btn" size="sm" @click="dialog = true">Ver SQL compilado</b-button>

      <b-modal v-model="dialog" size="lg" title="Ver SQL compilado" :hide-footer="true">
        <pre class="language-sql line-numbers" v-html="codeHtml"></pre>
      </b-modal>
    </div>
  </div>
</template>
 
<script>
import Prism from "vue-prism-component";
import "../public/libraries/crono-sql.js";
//Para cambiar el tema solo hay que descomentar esta línea.
// https://atelierbram.github.io/syntax-highlighting/prism/
//import "prismjs/themes/prism-solarizedlight.css";
//import "prismjs/themes/prism-twilight.css";
import "../styles/theme-twilight-dark.scss";

import "prismjs/plugins/line-numbers/prism-line-numbers.min";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

export default {
  props: ["fileName"],
  components: {
    Prism,
  },
  data() {
    return {
      dialog: false,
      codeCronoSQL: "",
      codeSQL: "",
      codeHtml: "",
    };
  },
  watch: {
    dialog(val){
      if (val) {
        this.codeHtml = this.$refs.code.innerHTML
      }
    }
  },
};
</script>

<style lang="css" scoped>
.btn {
  background-color: #3eaf7c;
}
.language-sql {
  background-color: #282c34 !important;
}
</style>