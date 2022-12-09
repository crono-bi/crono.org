<template>
  <div class="mt-1 mb-2 row">
    <div class="col-lg-12">
      <ul>
        <li v-for="(item,index) in Items" >
          <a :href="item.path">{{item.title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
 
<script>
import axios from "axios";
export default {
  props: ["src"],
  data() {
    return {
      Items: null
    };
  },
  methods: {
    findTitle(titles, path){
      let found=null
      titles.forEach(item=>{
        if(item.path==path) found=item
        if(!found && item.children) found=this.findTitle(item.children,path)
        if(found) return
      })
      return found
    }
  },
  mounted(){
    axios.get("/sidebar.json").then((response)=>{ 
      var path = this.src
      if(!path) path=document.location.pathname.split("#")[0]
      let jsonDic=response.data
      console.warn(path)
      var item
      if(jsonDic[path]){
        console.warn(jsonDic[path])
        item= jsonDic[path][0]
      } else {
        var titles=Object.values(jsonDic).flatMap(x=>x)
        item= this.findTitle(titles,path)
      }
     
      if(item && item.children) this.Items= item.children
    })
  }
};
</script>
