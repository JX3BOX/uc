(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b70e73ee"],{1645:function(t){t.exports=JSON.parse('{"default":{"name":"default","style":"square","files":{"xs":{"w":48,"width":60,"file":"default-xs.gif"},"s":{"w":68,"width":84,"file":"default-s.gif"},"m":{"w":108,"width":136,"file":"default-m.png"},"l":{"w":180,"width":224,"file":"default-l.png"},"xl":{"w":240,"width":300,"file":"default-xl.png"}}},"flower_1":{"name":"flower_1","style":"circle","files":{"xs":{"w":48,"width":60,"file":"flower_1-xs.png"},"s":{"w":68,"width":84,"file":"flower_1-s.png"},"m":{"w":108,"width":136,"file":"flower_1-m.png"},"l":{"w":180,"width":224,"file":"flower_1-l.png"},"xl":{"w":240,"width":300,"file":"flower_1-xl.png"}}}}')},"2d46":function(t,a,e){"use strict";e.d(a,"o",(function(){return s})),e.d(a,"e",(function(){return r})),e.d(a,"m",(function(){return u})),e.d(a,"n",(function(){return f})),e.d(a,"j",(function(){return h})),e.d(a,"a",(function(){return p})),e.d(a,"h",(function(){return b})),e.d(a,"k",(function(){return v})),e.d(a,"b",(function(){return g})),e.d(a,"p",(function(){return l})),e.d(a,"d",(function(){return m})),e.d(a,"f",(function(){return d})),e.d(a,"g",(function(){return w})),e.d(a,"l",(function(){return _})),e.d(a,"i",(function(){return j})),e.d(a,"q",(function(){return x})),e.d(a,"c",(function(){return O}));var n=e("41cb"),c=e("bc3a"),i=e.n(c),o=e("65c2");function r(){return Object(n["$cms"])().get("/api/cms/user/my/profile")}function s(t){return Object(n["$cms"])().put("/api/cms/user/my/profile",t)}function u(t){return Object(n["$cms"])().put("/api/cms/user/my/avatar",t)}function l(t){return Object(n["$cms"])().post("/api/cms/upload/avatar",t)}function m(){var t=o["__imgPath"]+"avatar/index.json";return i.a.get(t)}function d(t){return Object(n["$cms"])().get("/api/cms/user/".concat(t,"/info"),{params:{__no_cache:1}})}function f(t){return Object(n["$cms"])().put("/api/cms/user/my/password",t)}function p(t){return Object(n["$cms"])().get("/api/cms/user/account/email/valid",{params:{email:t}})}function b(t){return Object(n["$cms"])().post("/api/cms/user/account/email/bind",t)}function h(t){return Object(n["$cms"])().put("/api/cms/user/account/email/verify",{code:t},{app:"jx3box"})}function g(){return Object(n["$cms"])().get("/api/cms/account/oauth/status")}function v(t){return Object(n["$cms"])({popType:"alert"}).delete("/api/cms/account/oauth/unbind/".concat(t))}function w(){return Object(n["$cms"])().get("/api/cms/wechat/mp/bind")}function _(){return Object(n["$cms"])().get("/api/cms/wechat/mp/unbind")}function j(t){return Object(n["$cms"])().post("/api/cms/account/oauth/phone/bind",t,{app:"jx3box"})}function x(t){return Object(n["$cms"])().put("/api/cms/account/oauth/phone/verify",t,{app:"jx3box"})}function O(t){return Object(n["$cms"])().get("/api/cms/account/oauth/phone/check",{params:t})}},"39dd":function(t,a,e){},"3db7":function(t,a,e){"use strict";e.r(a);e("99af");var n=function(){var t=this,a=t._self._c;return a("uc",{staticClass:"m-dashboard-avatar"},[a("div",{staticClass:"m-profile-avatar"},[a("div",{staticClass:"m-profile-box m-profile-avatar-primary"},[a("img",{staticClass:"u-avatar u-avatar-l",attrs:{src:t.showAvatar(t.avatar)}}),a("el-upload",{staticClass:"u-upload",attrs:{drag:"",accept:"image/png, image/gif, image/jpeg","on-change":t.upload,action:"upload/avatar","auto-upload":!1}},[a("i",{staticClass:"el-icon-upload"}),a("div",{staticClass:"el-upload__text"},[t._v(" 将文件拖到此处，或 "),a("em",[t._v("点击上传")]),a("br"),a("span",{staticClass:"u-tip"},[t._v("只能上传jpg/png/gif文件")])])])],1),a("div",{staticClass:"m-profile-box m-profile-avatar-list"},[a("div",{staticClass:"u-title"},[t._v("默认头像")]),t.avatarList.length?t._l(t.avatarList,(function(e,n){return a("span",{key:n,staticClass:"u-avatar",on:{click:function(a){return t.changeAvatar("".concat(t.imgPath,"img/avatar/").concat(e,".jpg"))}}},[a("el-avatar",{attrs:{shape:"square",size:86,src:"".concat(t.imgPath,"img/avatar/").concat(e,".jpg")}})],1)})):t._e()],2)]),a("div",{staticClass:"u-profile-btn"},[a("el-button",{attrs:{type:"primary"},on:{click:t.submit}},[t._v("确认")]),a("el-button",{on:{click:t.reset}},[t._v("重置")])],1)])},c=[],i=e("48c0"),o=e("cc9a"),r=e("2d46"),s=e("c9d2"),u=e("85e4"),l=e("1645"),m=e("65c2"),d={name:"avatar",props:[],data:function(){return{bak:"",avatar:"",frame:"",isVIP:!1,uid:s["a"].getInfo().uid,frames:l,tabActivate:"0",decorationJson:{},decoration:[],decorationActivate:null,originalActivateName:null,selectAll:[],noDecoration:!1,avatarList:[],imgPath:m["__imgPath"]}},computed:{data:function(){return{user_avatar:this.avatar}}},methods:{upload:function(t,a){var e=this,n=new FormData,c=t.raw;n.append("avatar",c),Object(r["p"])(n).then((function(t){e.$message({message:"上传成功",type:"success"}),e.avatar=t.data.data[0]}))},reset:function(){this.avatar=this.bak},submit:function(){var t=this;Object(r["m"])(this.data).then((function(a){s["a"].refresh("avatar",t.avatar),t.$message({message:"头像更新成功",type:"success"})}))},showFrame:function(t){return m["__imgPath"]+"avatar/images/".concat(t,"/").concat(t,".svg")},init:function(){var t=this;this.avatar=this.bak=s["a"].getInfo().avatar_origin,Object(r["f"])(this.uid).then((function(a){t.frame=a.data.data.user_avatar_frame||""})),this.loadAvatar()},loadAvatar:function(){var t=this;Object(o["b"])("dashboard-default-avatar").then((function(a){t.avatarList=a?a.split(","):[]}))},changeAvatar:function(t){this.avatar=t},showAvatar:function(t){return Object(u["showAvatar"])(t,480,!1)},showSmallAvatar:function(t){return Object(u["showAvatar"])(t,136,!1)}},created:function(){this.init()},components:{uc:i["a"]}},f=d,p=(e("9b44"),e("2877")),b=Object(p["a"])(f,n,c,!1,null,null,null);a["default"]=b.exports},"48c0":function(t,a,e){"use strict";var n=function(){var t=this,a=t._self._c;return a("div",{staticClass:"m-dashboard-profile m-profile"},[a("h2",{staticClass:"u-title"},[a("i",{class:t.icon}),t._v(" "+t._s(t.title)+" "),t._t("header")],2),a("tabs",{attrs:{tabs:t.tabList,"msg-change-count":t.msgChangeCount}}),t._t("default")],2)},c=[],i=(e("a9e3"),e("b0c0"),function(){var t=this,a=t._self._c;return a("el-tabs",{staticClass:"m-dashboard-tabs",on:{"tab-click":t.changeTab},model:{value:t.active,callback:function(a){t.active=a},expression:"active"}},t._l(t.tabs,(function(e){return a("el-tab-pane",{key:e.name,attrs:{name:e.name}},[a("span",{attrs:{slot:"label"},slot:"label"},[a("i",{staticClass:"u-tab-icon",class:e.icon}),t._v(" "+t._s(e.label)+" "),t.showCount?a("span",{staticClass:"u-count",class:t.count[t.countMap[e.name]]?"is-orange":""},[t._v("("+t._s(t.count[t.countMap[e.name]]||0)+")")]):t._e()])])})),1)}),o=[],r=(e("caad"),e("14d9"),e("c944")),s={name:"",props:{tabs:{type:Array,default:function(){return[]}},msgChangeCount:{type:Number,default:0}},data:function(){return{active:"",countMap:{msg:"message",letter:"letter"},count:{message:0,letter:0}}},watch:{$route:function(){this.active=this.routeName},msgChangeCount:{immediate:!0,handler:function(t){t>0&&(this.count.message=0),t<0&&this.count.message>0&&(this.count.message+=t)}}},computed:{showCount:function(){return["msg","letter"].includes(this.routeName)},routeName:function(){return this.$route.name}},methods:{changeTab:function(){this.$router.push({name:this.active})},loadCount:function(){var t=this;Object(r["b"])().then((function(a){var e,n=(null===(e=a.data)||void 0===e?void 0:e.data)||{};t.count.letter=n.letter||0})),Object(r["c"])().then((function(a){var e;t.count.message=(null===(e=a.data.data)||void 0===e?void 0:e.unread_count)||0}))}},mounted:function(){this.active=this.routeName,this.showCount&&this.loadCount()},components:{}},u=s,l=e("2877"),m=Object(l["a"])(u,i,o,!1,null,null,null),d=m.exports,f=e("5c97"),p={name:"uc",props:{icon:{type:String,default:"el-icon-user"},title:{type:String,default:"我的资料"},tabList:{type:Array,default:function(){return f["d"]}},msgChangeCount:{type:Number,default:0}},data:function(){return{}},computed:{},methods:{},mounted:function(){},components:{tabs:d}},b=p,h=(e("dc6f"),Object(l["a"])(b,n,c,!1,null,null,null));a["a"]=h.exports},"5c97":function(t){t.exports=JSON.parse('{"e":[{"name":"frame","icon":"el-icon-camera","label":"头像框"},{"name":"theme","icon":"el-icon-orange","label":"主题风格"},{"name":"honor","icon":"el-icon-collection-tag","label":"称号"},{"name":"medal","icon":"el-icon-medal","label":"勋章"},{"name":"emotion","icon":"el-icon-picture-outline-round","label":"表情包"}],"d":[{"name":"profile","icon":"el-icon-user","label":"基本资料"},{"name":"avatar","icon":"el-icon-camera","label":"修改头像"},{"name":"pwd","icon":"el-icon-lock","label":"修改密码"},{"name":"notice","icon":"el-icon-message","label":"通知中心"},{"name":"connect","icon":"el-icon-connection","label":"绑定账号"},{"name":"address","icon":"el-icon-map-location","label":"地址管理"},{"name":"auth","icon":"el-icon-s-check","label":"账号认证"}],"b":[{"name":"mall","icon":"el-icon-shopping-bag-1","label":"商城订单"},{"name":"orders","icon":"el-icon-shopping-bag-2","label":"系统订单"}],"c":[{"name":"msg","icon":"el-icon-message","label":"通知"},{"name":"letter","icon":"el-icon-chat-dot-square","label":"私信"}],"a":[{"name":"certification","icon":"el-icon-medal","label":"电子证书"},{"name":"holidayCard","icon":"el-icon-sugar","label":"节日贺卡"},{"name":"birthdayCard","icon":"el-icon-present","label":"生日贺卡"}]}')},"9b44":function(t,a,e){"use strict";e("dc55")},c944:function(t,a,e){"use strict";e.d(a,"d",(function(){return c})),e.d(a,"f",(function(){return i})),e.d(a,"e",(function(){return o})),e.d(a,"g",(function(){return r})),e.d(a,"b",(function(){return u})),e.d(a,"a",(function(){return l})),e.d(a,"c",(function(){return s}));var n=e("41cb");function c(t){return Object(n["$next"])().get("/api/next2/userdata/messages",{params:t})}function i(t){return Object(n["$next"])().put("/api/next2/userdata/messages/read/".concat(t))}function o(){return Object(n["$next"])().put("/api/next2/userdata/messages/read")}function r(t){return Object(n["$next"])().delete("/api/next2/userdata/messages/".concat(t))}function s(){return Object(n["$next"])({mute:!0}).get("/api/next2/userdata/messages/unread_total")}function u(){return Object(n["$next"])({mute:!0}).get("/api/letter/unread/count")}function l(t){return Object(n["$next"])().get("/api/next2/comment/item/".concat(t))}},dc55:function(t,a,e){},dc6f:function(t,a,e){"use strict";e("39dd")}}]);