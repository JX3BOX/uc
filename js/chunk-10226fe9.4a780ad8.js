(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-10226fe9"],{"181f":function(t,a,e){},"5dfb1":function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t._self._c;return a("div",{staticClass:"m-credit m-ic"},[t._m(0),a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"m-credit-table m-packet-table"},[a("el-tabs",{attrs:{type:"border-card"},model:{value:t.tab,callback:function(a){t.tab=a},expression:"tab"}},[a("el-tab-pane",{attrs:{label:"注册邀请码",name:"first",lazy:""}},[a("div",{staticClass:"m-tip-box"},[a("el-button",{staticClass:"u-btn",attrs:{type:"primary"},on:{click:t.createCode}},[t._v(" 生成邀请码 ")]),a("el-alert",{staticClass:"m-ic-tip",attrs:{title:"邀请码生成规则",type:"warning","show-icon":""}},[t._t("description",(function(){return[a("div",{domProps:{innerHTML:t._s(t.rules)}})]}))],2)],1),t.list&&t.list.length?a("div",{staticClass:"m-packet-table"},[a("table",{staticClass:"m-ic-in-list m-packet-in-list"},[a("tr",[a("th",[t._v("邀请码")]),a("th",[t._v("状态")]),a("th",[t._v("生成时间")])]),t._l(t.list,(function(e,i){return a("tr",{key:i},[a("td",[t._v(" "+t._s(e.code)+" "),a("i",{directives:[{name:"clipboard",rawName:"v-clipboard:copy",value:e.code,expression:"item.code",arg:"copy"},{name:"clipboard",rawName:"v-clipboard:success",value:t.onCopy,expression:"onCopy",arg:"success"}],staticClass:"u-copy el-icon-document-copy"})]),a("td",[a("el-tag",{attrs:{type:e.status?"success":"info",size:"small"}},[t._v(t._s(e.status?"未使用":"已使用"))])],1),a("td",[t._v(t._s(t.formatDate(e.created_at)))])])}))],2)]):a("el-alert",{staticClass:"m-credit-null m-packet-null",attrs:{title:"没有找到相关条目",type:"info",center:"","show-icon":""}})],1)],1)],1)])},s=[function(){var t=this,a=t._self._c;return a("h2",{staticClass:"u-title"},[a("i",{staticClass:"el-icon-coin"}),t._v(" 我的盒码")])}],n=(e("d3b7"),e("e4f1")),c=e("41cb");function o(){return Object(c["$cms"])().post("/api/cms/user/invitation/register",{})}function l(){return Object(c["$cms"])().get("/api/cms/user/invitation")}var r=e("cc9a"),u={name:"Ic",props:[],data:function(){return{loading:!1,tab:"first",list:[],rules:""}},methods:{init:function(){this.loadData(),this.loadAc()},createCode:function(){var t=this;o().then((function(a){t.$message.success("生成邀请码成功"),t.loadData()}))},loadData:function(){var t=this;this.loading=!0,l().then((function(a){t.list=a.data.data})).finally((function(){t.loading=!1}))},loadAc:function(){var t=this;Object(r["b"])("user_invitation_register").then((function(a){t.rules=a}))},formatDate:function(t){return Object(n["c"])(t)},onCopy:function(){this.$message.success("复制成功")}},created:function(){this.init()}},d=u,p=(e("a53a"),e("2877")),f=Object(p["a"])(d,i,s,!1,null,null,null);a["default"]=f.exports},a53a:function(t,a,e){"use strict";e("181f")}}]);