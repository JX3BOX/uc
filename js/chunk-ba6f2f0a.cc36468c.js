(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ba6f2f0a"],{1681:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-publish m-draft"},[e("div",{staticClass:"m-draft-header"},[e("h1",{staticClass:"m-title"},[e("i",{staticClass:"el-icon-receiving"}),t._v(" 草稿箱 "),e("el-tooltip",{staticClass:"item",attrs:{effect:"dark",placement:"top","popper-class":"m-draft-help-tip"}},[e("div",{attrs:{slot:"content"},slot:"content"},[t._v("以下草稿是编辑器在当前浏览器下产生的临时本地草稿HTML源码，"),e("br"),t._v("并不存在于服务器中，仅用于断网或窗口异常关闭时恢复。")]),e("span",{staticClass:"u-help"},[e("i",{staticClass:"el-icon-question"}),t._v(" "),e("span",[t._v("使用帮助")])])])],1),e("div",{staticClass:"u-op"},[e("el-button",{attrs:{plain:"",icon:"el-icon-delete",size:"small",disabled:!t.isNotNull},on:{click:t.clean}},[t._v("清空")]),e("el-dropdown",{staticClass:"u-dropdown",attrs:{trigger:"click"},on:{command:t.handleCommand}},[e("el-button",{attrs:{size:"small",type:"primary",disabled:!t.canBatchOperate}},[t._v(" 批量操作"),e("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),e("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[e("el-dropdown-item",{attrs:{command:"batchDel"}},[t._v("批量删除")])],1)],1)],1)]),t.isSupported?[t.isNotNull?e("div",{staticClass:"m-draft-list"},[e("ul",{staticClass:"u-list"},t._l(t.data,(function(a,n){return e("li",{key:n,staticClass:"u-item"},[e("div",{staticClass:"u-label",class:{on:!!a.active}},[e("el-checkbox",{staticClass:"u-checkbox",attrs:{label:""},model:{value:a.checked,callback:function(e){t.$set(a,"checked",e)},expression:"item.checked"}}),e("i",{staticClass:"u-item-icon el-icon-document"}),e("span",{staticClass:"u-item-key"},[t._v(t._s(t._f("itemName")(a))+" "),a.data.cache_time?e("em",{staticClass:"u-item-time"},[t._v("( "+t._s(t._f("formatDate")(a))+" )")]):t._e()]),e("div",{staticClass:"u-op"},[e("el-button",{staticClass:"u-delete",attrs:{type:"primary",plain:"",icon:"el-icon-view",size:"mini"},on:{click:function(e){return e.stopPropagation(),t.preview(a)}}},[t._v("预览")]),e("el-popconfirm",{attrs:{title:"确定删除吗？"},on:{confirm:function(e){return t.del(a,n)}}},[e("el-button",{staticClass:"u-delete",attrs:{slot:"reference",plain:"",icon:"el-icon-delete",size:"mini"},on:{click:function(t){t.stopPropagation()}},slot:"reference"},[t._v("删除")])],1)],1)],1)])})),0)]):e("div",{staticClass:"m-draft-null"},[e("i",{staticClass:"el-icon-warning-outline"}),t._v(" 暂无任何内容")])]:[e("el-alert",{attrs:{title:"您的浏览器太旧了，不支持本功能。",type:"error","show-icon":""}})]],2)},i=[],s=a("c7eb"),c=a("1da1"),o=(a("99af"),a("4de4"),a("14d9"),a("a434"),a("e9f5"),a("910d"),a("7d54"),a("a732"),a("d3b7"),a("159b"),a("e4f1")),r={name:"draft",props:[],components:{},data:function(){return{data:[]}},computed:{isSupported:function(){return!!window.localStorage},isNotNull:function(){return!!this.data&&!!this.data.length},isWeb:function(t){var e=t.activeName;return"web"===e},db:function(){return this.$store.state.db},canBatchOperate:function(){return this.data.some((function(t){return t.checked}))}},methods:{loadDrafts:function(){var t=Object(c["a"])(Object(s["a"])().mark((function t(){var e,a,n,i;return Object(s["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.db.length();case 2:e=t.sent,a=[],n=0;case 5:if(!(n<e)){t.next=19;break}return t.next=8,this.db.key(n);case 8:return i=t.sent,t.t0=a,t.t1=i,t.next=13,this.db.getItem(i);case 13:t.t2=t.sent,t.t3={key:t.t1,data:t.t2,checked:!1},t.t0.push.call(t.t0,t.t3);case 16:n++,t.next=5;break;case 19:this.$set(this,"data",a);case 20:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),clean:function(){var t=this;this.$alert("此操作不可逆！请谨慎操作！","警告",{confirmButtonText:"确定清空",callback:function(e){t.db.clear(),t.data=[],t.$notify({title:"清空成功",type:"success",message:"本地草稿清空成功"})}})},preview:function(t){this.$router.push("/".concat(t.data.post_type,"/").concat(t.data.ID,"?mode=draft&key=").concat(t.key))},del:function(t,e){var a=this;this.db.removeItem(t.key).then((function(){a.data.splice(e,1)}))},onCopy:function(t){this.$notify({title:"复制成功",message:"草稿源码复制成功",type:"success"})},onError:function(){this.$notify.error({title:"复制失败",message:"请手动复制"})},handleCommand:function(t){var e=this;switch(t){case"batchDel":this.$confirm("此操作不可逆！请谨慎操作！","警告",{confirmButtonText:"确定删除",cancelButtonText:"取消",type:"warning"}).then((function(){var t=e.data.filter((function(t){return t.checked}));t.forEach((function(t){e.db.removeItem(t.key)})),e.data=e.data.filter((function(t){return!t.checked})),e.$notify({title:"删除成功",type:"success",message:"成功删除".concat(t.length,"个草稿")})}));break;default:break}}},filters:{itemName:function(t){var e;return(null===t||void 0===t||null===(e=t.data)||void 0===e?void 0:e.post_title)||"".concat(t.key)},formatDate:function(t){var e,a=null===t||void 0===t||null===(e=t.data)||void 0===e?void 0:e.cache_time;return a?Object(o["b"])(new Date(a)):""}},created:function(){this.loadDrafts()},mounted:function(){}},l=r,u=(a("fdab"),a("2877")),d=Object(u["a"])(l,n,i,!1,null,null,null);e["default"]=d.exports},"8d2a":function(t,e,a){},a732:function(t,e,a){"use strict";var n=a("23e7"),i=a("2266"),s=a("59ed"),c=a("825a"),o=a("46c4");n({target:"Iterator",proto:!0,real:!0},{some:function(t){c(this),s(t);var e=o(this),a=0;return i(e,(function(e,n){if(t(e,a++))return n()}),{IS_RECORD:!0,INTERRUPTED:!0}).stopped}})},fdab:function(t,e,a){"use strict";a("8d2a")}}]);