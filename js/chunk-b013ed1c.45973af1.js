(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b013ed1c"],{"099b":function(t,n,e){},"39ab":function(t,n,e){"use strict";e.r(n);var a=function(){var t=this,n=t._self._c;return n("uc",{staticClass:"m-dashboard-emotion m-dashboard-skin",attrs:{icon:"el-icon-brush",title:"主题装扮",tabList:t.tabList},scopedSlots:t._u([{key:"header",fn:function(){return[n("a",{staticClass:"u-link el-button el-button--default el-button--mini is-round is-plain",attrs:{href:"/vip/mall?category=virtual",target:"_blank"}},[n("i",{staticClass:"el-icon-shopping-cart-2"}),t._v(" 前往获取装扮")])]},proxy:!0}])},[n("div",{staticClass:"u-tips"},[n("i",{staticClass:"el-icon-warning-outline"}),t._v("自定义表情包最多只能同时激活五个。 ")]),n("div",{staticClass:"u-list"},t._l(t.emotions,(function(e){return n("div",{key:e.group_id,staticClass:"u-item",class:{"is-using":t.isUsing(e.group_name),disabled:t.isDisabled(e.group_name),hidden:t.isHidden(e.group_name)},on:{click:function(n){return n.stopPropagation(),t.handleEmotionClick(e)}}},[n("img",{staticClass:"u-img",attrs:{src:t.imgSrc(e.group_name),alt:e.group_name}}),n("div",{staticClass:"u-title"},[t._v(t._s(e.group_name))])])})),0),n("div",{staticClass:"u-actions"},[n("el-button",{attrs:{type:"primary",icon:"el-icon-circle-check",loading:t.loading},on:{click:t.handleSave}},[t._v("保存")])],1)])},i=[],o=(e("4de4"),e("7db0"),e("caad"),e("d81d"),e("14d9"),e("4e82"),e("e9f5"),e("910d"),e("f665"),e("ab43"),e("e9c4"),e("b64b"),e("d3b7"),e("2532"),e("48c0")),c=e("f6be"),s=e("65c2"),u=e("5c97"),r={name:"emotion",props:[],data:function(){return{tabList:u["e"],emotionList:[],emotions:[],active:[],loading:!1}},computed:{},methods:{loadDecoration:function(){var t=this;Object(c["b"])({type:"emotion"}).then((function(n){t.emotionList=n.data.data,t.active=t.emotionList.filter((function(t){return t.using})).map((function(t){return t.val}));var e=t.emotionList.map((function(t){return t.val}));t.emotions.sort((function(t,n){var a=e.includes(t.group_name),i=e.includes(n.group_name);return a&&!i?-1:!a&&i?1:0}))}))},getEmotion:function(){var t=this;try{var n=JSON.parse(sessionStorage.getItem("jx3_emotion"));if(n)return void(this.emotions=n);Object(c["d"])().then((function(n){t.emotions=n.data,sessionStorage.setItem("jx3_emotion",JSON.stringify(n.data))}))}catch(e){this.emotions=[]}finally{this.loadDecoration()}},imgSrc:function(t){var n,e=this.emotions.find((function(n){return n.group_name===t})),a=null===(n=e.items)||void 0===n?void 0:n[0];return s["__imgPath"]+"emotion/output/"+(null===a||void 0===a?void 0:a.filename)},isUsing:function(t){return this.active.includes(t)||"默认"===t},isDisabled:function(t){return!this.emotionList.map((function(t){return t.val})).includes(t)&&"默认"!==t},isHidden:function(t){return"默认"===t},handleEmotionClick:function(t){this.isDisabled(t.group_name)||(this.active.length>=5&&!this.isUsing(t.group_name)?this.$message.error("最多只能选择五个表情包"):this.isUsing(t.group_name)?this.active=this.active.filter((function(n){return n!==t.group_name})):this.active.push(t.group_name))},handleSave:function(){var t=this;this.loading=!0;var n=this.emotionList.map((function(n){return{type:"emotion",val:n.val,using:t.active.includes(n.val)}}));Object(c["j"])(n).then((function(n){t.$message.success("保存成功"),t.loading=!1}))}},mounted:function(){this.getEmotion()},components:{uc:o["a"]}},l=r,m=(e("8200"),e("2877")),d=Object(m["a"])(l,a,i,!1,null,null,null);n["default"]=d.exports},"39dd":function(t,n,e){},"48c0":function(t,n,e){"use strict";var a=function(){var t=this,n=t._self._c;return n("div",{staticClass:"m-dashboard-profile m-profile"},[n("h2",{staticClass:"u-title"},[n("i",{class:t.icon}),t._v(" "+t._s(t.title)+" "),t._t("header")],2),n("tabs",{attrs:{tabs:t.tabList,"msg-change-count":t.msgChangeCount}}),t._t("default")],2)},i=[],o=(e("a9e3"),e("b0c0"),function(){var t=this,n=t._self._c;return n("el-tabs",{staticClass:"m-dashboard-tabs",on:{"tab-click":t.changeTab},model:{value:t.active,callback:function(n){t.active=n},expression:"active"}},t._l(t.tabs,(function(e){return n("el-tab-pane",{key:e.name,attrs:{name:e.name}},[n("span",{attrs:{slot:"label"},slot:"label"},[n("i",{staticClass:"u-tab-icon",class:e.icon}),t._v(" "+t._s(e.label)+" "),t.showCount?n("span",{staticClass:"u-count",class:t.count[t.countMap[e.name]]?"is-orange":""},[t._v("("+t._s(t.count[t.countMap[e.name]]||0)+")")]):t._e()])])})),1)}),c=[],s=(e("caad"),e("14d9"),e("c944")),u={name:"",props:{tabs:{type:Array,default:function(){return[]}},msgChangeCount:{type:Number,default:0}},data:function(){return{active:"",countMap:{msg:"message",letter:"letter"},count:{message:0,letter:0}}},watch:{$route:function(){this.active=this.routeName},msgChangeCount:{immediate:!0,handler:function(t){t>0&&(this.count.message=0),t<0&&this.count.message>0&&(this.count.message+=t)}}},computed:{showCount:function(){return["msg","letter"].includes(this.routeName)},routeName:function(){return this.$route.name}},methods:{changeTab:function(){this.$router.push({name:this.active})},loadCount:function(){var t=this;Object(s["b"])().then((function(n){var e,a=(null===(e=n.data)||void 0===e?void 0:e.data)||{};t.count.letter=a.letter||0})),Object(s["c"])().then((function(n){var e;t.count.message=(null===(e=n.data.data)||void 0===e?void 0:e.unread_count)||0}))}},mounted:function(){this.active=this.routeName,this.showCount&&this.loadCount()},components:{}},r=u,l=e("2877"),m=Object(l["a"])(r,o,c,!1,null,null,null),d=m.exports,f=e("5c97"),p={name:"uc",props:{icon:{type:String,default:"el-icon-user"},title:{type:String,default:"我的资料"},tabList:{type:Array,default:function(){return f["d"]}},msgChangeCount:{type:Number,default:0}},data:function(){return{}},computed:{},methods:{},mounted:function(){},components:{tabs:d}},b=p,g=(e("dc6f"),Object(l["a"])(b,a,i,!1,null,null,null));n["a"]=g.exports},"5c97":function(t){t.exports=JSON.parse('{"e":[{"name":"frame","icon":"el-icon-camera","label":"头像框"},{"name":"theme","icon":"el-icon-orange","label":"主题风格"},{"name":"honor","icon":"el-icon-collection-tag","label":"称号"},{"name":"medal","icon":"el-icon-medal","label":"勋章"},{"name":"emotion","icon":"el-icon-picture-outline-round","label":"表情包"}],"d":[{"name":"profile","icon":"el-icon-user","label":"基本资料"},{"name":"avatar","icon":"el-icon-camera","label":"修改头像"},{"name":"pwd","icon":"el-icon-lock","label":"修改密码"},{"name":"notice","icon":"el-icon-message","label":"通知中心"},{"name":"connect","icon":"el-icon-connection","label":"绑定账号"},{"name":"address","icon":"el-icon-map-location","label":"地址管理"},{"name":"auth","icon":"el-icon-s-check","label":"账号认证"}],"b":[{"name":"mall","icon":"el-icon-shopping-bag-1","label":"商城订单"},{"name":"orders","icon":"el-icon-shopping-bag-2","label":"系统订单"}],"c":[{"name":"msg","icon":"el-icon-message","label":"通知"},{"name":"letter","icon":"el-icon-chat-dot-square","label":"私信"}],"a":[{"name":"certification","icon":"el-icon-medal","label":"电子证书"},{"name":"holidayCard","icon":"el-icon-sugar","label":"节日贺卡"},{"name":"birthdayCard","icon":"el-icon-present","label":"生日贺卡"}]}')},8200:function(t,n,e){"use strict";e("099b")},c944:function(t,n,e){"use strict";e.d(n,"d",(function(){return i})),e.d(n,"f",(function(){return o})),e.d(n,"e",(function(){return c})),e.d(n,"g",(function(){return s})),e.d(n,"b",(function(){return r})),e.d(n,"a",(function(){return l})),e.d(n,"c",(function(){return u}));var a=e("41cb");function i(t){return Object(a["$next"])().get("/api/next2/userdata/messages",{params:t})}function o(t){return Object(a["$next"])().put("/api/next2/userdata/messages/read/".concat(t))}function c(){return Object(a["$next"])().put("/api/next2/userdata/messages/read")}function s(t){return Object(a["$next"])().delete("/api/next2/userdata/messages/".concat(t))}function u(){return Object(a["$next"])({mute:!0}).get("/api/next2/userdata/messages/unread_total")}function r(){return Object(a["$next"])({mute:!0}).get("/api/letter/unread/count")}function l(t){return Object(a["$next"])().get("/api/next2/comment/item/".concat(t))}},dc6f:function(t,n,e){"use strict";e("39dd")},f6be:function(t,n,e){"use strict";e.d(n,"b",(function(){return s})),e.d(n,"j",(function(){return u})),e.d(n,"c",(function(){return r})),e.d(n,"d",(function(){return l})),e.d(n,"i",(function(){return m})),e.d(n,"l",(function(){return d})),e.d(n,"e",(function(){return f})),e.d(n,"g",(function(){return p})),e.d(n,"k",(function(){return b})),e.d(n,"a",(function(){return g})),e.d(n,"h",(function(){return h})),e.d(n,"f",(function(){return v}));e("99af");var a=e("41cb"),i=e("bc3a"),o=e.n(i),c=e("65c2");function s(t){return Object(a["$cms"])().get("/api/cms/user/decoration",{params:t})}function u(t){return Object(a["$cms"])().post("/api/cms/user/decoration",t)}function r(){var t=c["__cdn"]+"design/decoration/index.json?".concat(Date.now());return o.a.get(t)}function l(){return o.a.get("".concat(c["__dataPath"],"emotion/output/catalog.json?").concat(Date.now()))}function m(t,n){return Object(a["$cms"])().post("/api/cms/user/decoration/check-suit/".concat(t,"/").concat(n,"/for/avatar"))}function d(t){return Object(a["$cms"])().put("/api/cms/user/my/avatar-frame",t)}function f(){return Object(a["$cms"])().get("/api/cms/user/config/honor")}function p(t){return Object(a["$next"])({mute:!0}).get("/api/next2/user/"+t+"/honors").then((function(t){return t.data.data}))}function b(t){return Object(a["$cms"])().put("/api/cms/user/honor/use/".concat(t))}function g(){return Object(a["$cms"])().delete("/api/cms/user/honor/use")}function h(t){return Object(a["$next"])({mute:!0}).get("/api/next2/user/"+t+"/medals")}function v(t){return Object(a["$cms"])().get("/api/cms/config/medal",{params:t})}}}]);