<template>
  <div class="mt-1 mb-2 row">
    <div class="col-lg-12">

      <prism class="line-numbers" language="sql">{{codeCronoSQL}}</prism>

      <b-button class="float-right btn" size="sm" @click="dialog = true">Ver SQL compilado</b-button>

      <b-modal v-model="dialog" size="lg" title="Ver SQL compilado" :hide-footer="true">
        <prism class="line-numbers" language="sql">{{codeSQL}}</prism>
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
import axios from "axios";
export default {
  props: ["fileName"],
  components: {
    Prism,
  },
  data() {
    return {
      dialog: false,
      codeCronoSQL: "",
      codeSQL: ""
    };
  },
  watch: {
    dialog(val){
      if (val) {
        this.codeHtml = this.$refs.code.innerHTML;
      }
    }
  },
  mounted(){
    axios.get(`/code/${this.fileName}.csql`).then((response)=>{ this.codeCronoSQL=response.data})
    axios.get(`/code/${this.fileName}.sql`).then((response)=>{ this.codeSQL=response.data})
  }
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