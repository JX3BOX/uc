(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3fa4ce5c"],{"25dc":function(t,e,s){"use strict";s("3dd3")},"3dd3":function(t,e,s){},"500d":function(t,e,s){"use strict";s.d(e,"a",(function(){return o}));var i=s("41cb");const n=(t,e)=>Object(i["$node"])().get("/pet/"+t,{params:e}),a=location.href.includes("origin")?"origin":"std",o={latest({type:t},e){return Object(i["$cms"])().get("/api/cms/wiki/post/latest",{params:{client:a,...e,type:t}})},mine(t){return Object(i["$cms"])().get("/api/cms/wiki/post/mine",{params:t})},counter({type:t},e){return Object(i["$cms"])().get("/api/cms/wiki/post/counter",{params:{client:a,...e,type:t}})},achievements(t){return Object(i["$node"])().get("/achievement/list",{params:{client:a,...t}})},get({type:t,id:e},s){return Object(i["$cms"])().get(`/api/cms/wiki/post/type/${t}/source/${e}`,{params:{client:a,...s}})},getById(t){return Object(i["$cms"])().get("/api/cms/wiki/post/id/"+t)},post(t){return Object(i["$cms"])().post("/api/cms/wiki/post",t)},update(t,e){return Object(i["$cms"])().put("/api/cms/wiki/post/"+t,e)},remove(t){return Object(i["$cms"])().delete("/api/cms/wiki/post/"+t)},versions({type:t,id:e},s){return Object(i["$cms"])().get(`/api/cms/wiki/post/type/${t}/source/${e}/versions`,{params:{client:a,...s}})},async handleMix(t,e,s,i){let n="",a="",o=!0,r=!1,c=[];if("std"===s){const l=await this.get({type:t,id:e},{client:s,...i});return n=l.data.data.post,a=l.data.data.source,c=l.data.data.users,n&&(o=!1),console.log("获取旗舰攻略"),{post:n,source:a,isEmpty:o,compatible:r,type:t,source_id:e,users:c}}{const l=await this.get({type:t,id:e},{client:s,...i});a=l.data.data.source,n=l.data.data.post,c=l.data.data.users,n&&(o=!1),console.log("获取缘起攻略");const u=!!l.data.data.post;return u?{post:n,source:a,isEmpty:o,compatible:r,type:t,source_id:e,users:c}:(console.log("兼容：获取旗舰攻略"),this.get({type:t,id:e},{client:"std",...i}).then(s=>(n=s.data.data.post,a||(a=s.data.data.source),n&&(o=!1),c=s.data.data.users,r=!0,{post:n,source:a,isEmpty:o,compatible:r,type:t,source_id:e,users:c})))}},async mix({type:t,id:e,client:s},i){let a="",o="";if(a="cj"===t?"achievement":"pet"===t?"item":t||"achievement",e){if(o=e,"pet"===t){const t=await n(e,{client:s});let o=t.data,r=o.ItemTabType+"_"+o.ItemTabIndex;return this.handleMix(a,r,s,i)}return this.handleMix(a,o,s,i)}}}},d7d8:function(t,e,s){"use strict";s.r(e);s("a434"),s("b0c0");var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-publish-box"},[e("publish-header",{attrs:{name:"通识百科"}},[t._t("header")],2),e("el-form",{staticClass:"m-publish-post"},[e("div",{staticClass:"m-publish-source"},[e("el-divider",{attrs:{"content-position":"left"}},[t._v("选择通识 *")]),e("el-radio-group",{staticClass:"m-publish-action",model:{value:t.action,callback:function(e){t.action=e},expression:"action"}},[e("el-radio-button",{attrs:{label:"new",disabled:t.isEditMode}},[t._v("新建词条")]),e("el-radio-button",{attrs:{label:"update"}},[t._v("维护已有词条")])],1),t.isEditMode?e("el-input",{staticClass:"u-current-source",attrs:{disabled:""},model:{value:t.currentSource,callback:function(e){t.currentSource=e},expression:"currentSource"}}):["new"==t.action?[e("div",{staticClass:"u-create-source"},[e("el-select",{staticClass:"u-source-type",attrs:{placeholder:"选择通识类型"},model:{value:t.knowledge.type,callback:function(e){t.$set(t.knowledge,"type",e)},expression:"knowledge.type"}},t._l(t.types,(function(t){return e("el-option",{key:t.name,attrs:{value:t.name,label:t.label}})})),1),e("el-input",{staticClass:"u-source-name",attrs:{placeholder:"请输入通识名称"},model:{value:t.knowledge.name,callback:function(e){t.$set(t.knowledge,"name",e)},expression:"knowledge.name"}})],1),e("p",{staticClass:"u-source-add-tip"},[e("span",[t._v("Note：添加完成后的通识需要经过管理员审核通过后才会在通识百科上展示哦")])])]:[e("el-select",{staticClass:"u-source-id",attrs:{filterable:"",remote:"",placeholder:"通过输入通识名称进行搜索","remote-method":t.loadSources,loading:t.options.loading,clearable:""},on:{change:t.selectSource},model:{value:t.post.source_id,callback:function(e){t.$set(t.post,"source_id",e)},expression:"post.source_id"}},t._l(t.options.sources,(function(s){return e("el-option",{key:s.id,attrs:{label:s.name,value:s.id}},[e("div",{staticClass:"u-option"},[e("span",{staticClass:"u-type"},[t._v(t._s(t.showType(s.type)))]),e("span",{staticClass:"u-name",domProps:{textContent:t._s(s.name)}})])])})),1)]]],2),e("div",{staticClass:"m-publish-remark"},[e("el-divider",{attrs:{"content-position":"left"}},[t._v("修订说明 *")]),e("el-input",{attrs:{maxlength:200,minlength:1,"show-word-limit":"",required:"",placeholder:"请简单描述一下本次修订说明"},model:{value:t.post.remark,callback:function(e){t.$set(t.post,"remark",e)},expression:"post.remark"}})],1),e("div",{staticClass:"m-publish-content"},[e("el-divider",{attrs:{"content-position":"left"}},[t._v("通识正文 *")]),e("Tinymce",{attrs:{attachmentEnable:!0,resourceEnable:!0,height:600},model:{value:t.post.content,callback:function(e){t.$set(t.post,"content",e)},expression:"post.content"}},[!t.isLatest&&t.latest.post&&t.current.post?e("el-alert",{staticClass:"m-latest-check",attrs:{type:"warning","show-icon":""},scopedSlots:t._u([{key:"title",fn:function(){return[e("span",{staticClass:"u-alert-title"},[t._v("当前百科已经有更新的版本，你的攻略可能已经失效，请先进行比对。")]),e("el-link",{staticClass:"u-view-latest",attrs:{type:"primary",icon:"el-icon-link",href:t.getLink(t.post.source_id),target:"_blank"}},[t._v("查看最新攻略")]),t.latest.post?e("el-link",{staticClass:"u-get-latest",attrs:{icon:"el-icon-download",type:"primary"},on:{click:t.getLatest}},[t._v("获取最新攻略")]):t._e()]},proxy:!0}],null,!1,2238318328)}):t._e()],1)],1),e("div",{staticClass:"m-publish-tags"},[e("el-divider",{attrs:{"content-position":"left"}},[t._v("通识标签")]),t._l(t.post.tags,(function(s,i){return e("el-tag",{key:i,attrs:{closable:"","disable-transitions":!1},on:{close:function(e){return t.post.tags.splice(i,1)}}},[t._v(t._s(s)+" ")])})),t.inputVisible?e("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small",placeholder:"回车以添加"},on:{blur:t.handleInputConfirm},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleInputConfirm.apply(null,arguments)}},model:{value:t.inputValue,callback:function(e){t.inputValue=e},expression:"inputValue"}}):e("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:t.showInput}},[t._v("+ 添加标签 ")])],2),e("div",{staticClass:"m-publish-commit"},[e("el-divider",{attrs:{"content-position":"left"}}),e("el-button",{staticClass:"u-publish",attrs:{icon:"el-icon-s-promotion",type:"primary",disabled:t.processing},on:{click:t.handleSubmit}},[t._v("提交通识 ")])],1)])],1)},n=[],a=s("5530"),o=(s("7db0"),s("a15b"),s("14d9"),s("e9f5"),s("f665"),s("d3b7"),s("498a"),s("ba82")),r=s("221a"),c=s("500d"),l=s("c9d2"),u=s("41cb");function d(){return Object(u["$cms"])()({method:"GET",url:"/api/cms/helper/knowledge/types"})}function p(t){return Object(u["$cms"])()({method:"GET",url:"/api/cms/helper/knowledge",params:t})}function m(t){return Object(u["$cms"])().post("/api/cms/helper/knowledge",t)}var h=s("85e4"),v={name:"knowledge",data:function(){return{action:"new",isEditMode:!1,types:[],options:{sources:[],loading:!1},knowledge:{type:"",name:""},currentSource:"",processing:!1,post:{id:"",content:"",source_id:"",remark:"",tags:[],client:""},inputVisible:!1,inputValue:"",latest:{},current:{}}},computed:{client:function(){return this.$store.state.client},id:function(){var t;return null===(t=this.$route.query)||void 0===t?void 0:t.post_id},isLatest:function(){var t,e,s,i;return!(null===(t=this.current)||void 0===t||null===(e=t.post)||void 0===e||!e.id||null===(s=this.latest)||void 0===s||null===(i=s.post)||void 0===i||!i.id)&&this.current.post.id==this.latest.post.id}},methods:{loadData:function(t){var e=this;t&&c["a"].get({type:"knowledge",id:t},{client:"all"}).then((function(t){var s,i,n,a,o,r=null===(s=t.data)||void 0===s||null===(i=s.data)||void 0===i?void 0:i.source;e.currentSource=null===r||void 0===r?void 0:r.name,e.post.source_id=null===r||void 0===r?void 0:r.id,e.latest=t.data.data;var c=null===(n=t.data)||void 0===n||null===(a=n.data)||void 0===a?void 0:a.post;e.post.remark=null===c||void 0===c?void 0:c.remark,e.post.content=(null===c||void 0===c?void 0:c.content)||"",e.post.tags=(null===c||void 0===c||null===(o=c.tags)||void 0===o?void 0:o.split(","))||[]}))},loadDataByPostId:function(){var t=this;return c["a"].getById(this.id).then((function(e){var s,i,n=null===(s=e.data)||void 0===s||null===(i=s.data)||void 0===i?void 0:i.source;t.currentSource=null===n||void 0===n?void 0:n.name,t.post.source_id=null===n||void 0===n?void 0:n.id,t.current=e.data.data,t.post.content=t.current.post.content,t.post.remark=t.current.post.remark,t.post.tags=t.current.post.tags.split(",")||[]}))},loadTypes:function(){var t=this;d().then((function(e){t.types=e.data.data}))},loadSources:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.options.loading=!0,p({_search:e,per:10}).then((function(e){t.options.sources=e.data.data.list})).finally((function(){t.options.loading=!1}))},resetSource:function(){"new"==this.action&&(this.post.source_id="",this.currentSource="",this.post.content="",this.post.tags=[],this.post.remark="")},handleSubmit:function(){var t=this;"new"!=this.action||this.post.source_id?this.createPost():this.createSource().then((function(){t.createPost()}))},createSource:function(){var t=this;return this.processing=!0,m({type:this.knowledge.type,name:this.knowledge.name}).then((function(e){t.post.source_id=e.data.data.id})).finally((function(){t.processing=!1}))},selectSource:function(t){this.loadData(t)},validate:function(){var t=this,e=["source_id","content","remark"].every((function(e){return!!t.post[e]}));return e||this.$message.error("请完成必填项"),e},createPost:function(){var t=this;if(this.validate()){this.processing=!0;var e={source_id:String(this.post.source_id),user_nickname:l["a"].getInfo().name,content:this.post.content,remark:this.post.remark,tags:this.post.tags.join(",")};c["a"].post(Object(a["a"])(Object(a["a"])({type:"knowledge"},e),{},{client:"all"})).then((function(){t.$message({message:"提交成功，请等待审核",type:"success"}),setTimeout((function(){t.$router.push({name:"wiki_post",params:{type:"knowledge"}})}),500)})).finally((function(){t.processing=!1}))}},handleInputConfirm:function(){var t=this.inputValue.trim();t&&this.post.tags.push(t),this.inputVisible=!1,this.inputValue=""},showInput:function(){var t=this;this.inputVisible=!0,this.$nextTick((function(e){t.$refs.saveTagInput.$refs.input.focus()}))},showType:function(t){return this.types.find((function(e){return e.name==t})).label},getLink:function(t){return Object(h["getLink"])("knowledge",t)},getLatest:function(){var t;this.post.content=(null===(t=this.latest.post)||void 0===t?void 0:t.content)||""}},watch:{"$route.params.source_id":{immediate:!0,handler:function(t){t?(this.action="update",this.isEditMode=!0,this.post.source_id=~~t,this.loadData(t),this.id&&this.loadDataByPostId()):(this.action="new",this.loadTypes(),this.loadSources())}},action:{handler:function(){this.isEditMode||this.resetSource()}}},components:{"publish-header":o["a"],Tinymce:r["a"]}},f=v,g=(s("25dc"),s("2877")),b=Object(g["a"])(f,i,n,!1,null,"ecd800c2",null);e["default"]=b.exports}}]);