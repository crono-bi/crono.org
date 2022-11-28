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
import { title } from "process";
export default {
  data() {
    return {
      Path: null,
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
      this.Path=document.location.pathname
      let jsonDic=response.data
      let titles=Object.values(jsonDic).flatMap(x=>x)
      let item=this.findTitle(titles,this.Path)
      if(item && item.children) this.Items= item.children
    })
  }
};
</script>
