(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1528df63"],{"1a5f":function(t,e,n){"use strict";n.r(e);n("ac1f"),n("841c");var a=function(){var t=this,e=t._self._c;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"m-dashboard-work m-dashboard-cms"},[e("div",{staticClass:"m-dashboard-work-header"},[e("h2",{staticClass:"u-title"},[t._v("捏脸数据")]),e("a",{staticClass:"u-publish el-button el-button--primary el-button--small",attrs:{href:t.publishLink}},[e("i",{staticClass:"el-icon-document"}),t._v(" 发布数据 ")])]),e("el-input",{staticClass:"m-dashboard-work-search",attrs:{placeholder:"请输入搜索内容"},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}},[e("span",{attrs:{slot:"prepend"},slot:"prepend"},[t._v("关键词")]),e("el-button",{attrs:{slot:"append",icon:"el-icon-search"},slot:"append"})],1),e("div",{staticClass:"m-dashboard-box"},[t.data&&t.data.length?e("ul",{staticClass:"m-dashboard-box-list"},t._l(t.data,(function(n,a){return e("li",{key:a},[e("div",{staticClass:"u-header"},[1==n.status?e("i",{staticClass:"u-item-icon u-success-icon el-icon-success",attrs:{title:"上架中"}}):e("i",{staticClass:"u-item-icon u-remove-icon el-icon-remove",attrs:{title:"已下架"}}),e("a",{staticClass:"u-title",attrs:{target:"_blank",href:t.postLink(n.id)}},[t._v(t._s(n.title||"未命名"))])]),e("div",{staticClass:"u-desc"},[e("time",{staticClass:"u-desc-subitem"},[e("i",{staticClass:"el-icon-finished"}),t._v(" 发布 : "+t._s(n.created_at)+" ")]),e("time",{staticClass:"u-desc-subitem"},[e("i",{staticClass:"el-icon-refresh"}),t._v(" 更新 : "+t._s(n.updated_at)+" ")])]),e("el-button-group",{staticClass:"u-action"},[e("el-button",{attrs:{size:"mini",icon:"el-icon-edit",title:"编辑"},on:{click:function(e){return t.edit(n.id)}}}),1==n.status?e("el-button",{attrs:{size:"mini",icon:"el-icon-download",title:"下架"},on:{click:function(e){return t.handleOffline(n.id)}}}):e("el-button",{attrs:{size:"mini",icon:"el-icon-upload2",title:"上架"},on:{click:function(e){return t.handleOnline(n.id)}}})],1)],1)})),0):e("el-alert",{staticClass:"m-dashboard-box-null",attrs:{title:"没有找到相关条目",type:"info",center:"","show-icon":""}}),e("el-pagination",{staticClass:"m-dashboard-box-pages",attrs:{background:"","page-size":t.per,"hide-on-single-page":!0,"current-page":t.page,layout:"total, prev, pager, next, jumper",total:t.total},on:{"update:currentPage":function(e){t.page=e},"update:current-page":function(e){t.page=e}}})],1)],1)},i=[],c=n("5530"),s=(n("d3b7"),n("3bb22")),o={name:"face",props:[],data:function(){return{loading:!1,data:[],total:1,page:1,per:10,search:""}},computed:{params:function(){return{pageIndex:this.page,pageSize:this.per,title:this.search}},publishLink:function(){return"./#/face"}},watch:{params:{deep:!0,immediate:!0,handler:function(t){this.loadPosts()}}},methods:{loadPosts:function(){var t=this;this.loading=!0;var e=Object(c["a"])({},this.params);Object(s["g"])(e).then((function(e){t.data=e.data.data.list,t.total=e.data.data.page.total})).finally((function(){t.loading=!1}))},edit:function(t){location.href="./#/face/"+t},postLink:function(t){return"/face/"+t},handleOnline:function(t){var e=this;Object(s["d"])(t).then((function(t){e.$message.success("上架成功"),e.loadPosts()}))},handleOffline:function(t){var e=this;this.$confirm("此操作将下架该条数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(s["c"])(t).then((function(t){e.$message.success("下架成功"),e.loadPosts()}))}))},del:function(t){var e=this;this.$confirm("此操作将彻底删除该数据, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(s["b"])(t).then((function(t){e.$message.success("删除成功"),e.loadPosts()}))}))}}},r=o,u=(n("cff8"),n("2877")),l=Object(u["a"])(r,a,i,!1,null,"1e66405e",null);e["default"]=l.exports},"2a0e":function(t,e,n){},"3bb22":function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"i",(function(){return c})),n.d(e,"a",(function(){return s})),n.d(e,"f",(function(){return o})),n.d(e,"h",(function(){return r})),n.d(e,"g",(function(){return u})),n.d(e,"d",(function(){return l})),n.d(e,"c",(function(){return d})),n.d(e,"e",(function(){return f}));n("99af");var a=n("41cb");function i(t){return Object(a["$next"])().delete("/api/face/".concat(t))}function c(t){return Object(a["$next"])().post("/api/face/file-upload",t)}function s(t){return Object(a["$next"])().post("/api/face",t)}function o(t){return Object(a["$next"])().get("/api/face/".concat(t))}function r(t,e){return Object(a["$next"])().put("/api/face/".concat(t),e)}function u(t){return Object(a["$next"])().get("/api/face/my-list",{params:t})}function l(t){return Object(a["$next"])().put("/api/face/".concat(t,"/online"))}function d(t){return Object(a["$next"])().put("/api/face/".concat(t,"/offline"))}function f(t){return Object(a["$next"])().get("/api/charge_attachment/face/".concat(t,"/edit"))}},cff8:function(t,e,n){"use strict";n("2a0e")}}]);