(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-11e10824"],{"39dd":function(t,e,n){},"48c0":function(t,e,n){"use strict";var a=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-dashboard-profile m-profile"},[e("h2",{staticClass:"u-title"},[e("i",{class:t.icon}),t._v(" "+t._s(t.title)+" "),t._t("header")],2),e("tabs",{attrs:{tabs:t.tabList,"msg-change-count":t.msgChangeCount}}),t._t("default")],2)},i=[],s=(n("a9e3"),n("b0c0"),function(){var t=this,e=t._self._c;return e("el-tabs",{staticClass:"m-dashboard-tabs",on:{"tab-click":t.changeTab},model:{value:t.active,callback:function(e){t.active=e},expression:"active"}},t._l(t.tabs,(function(n){return e("el-tab-pane",{key:n.name,attrs:{name:n.name}},[e("span",{attrs:{slot:"label"},slot:"label"},[e("i",{staticClass:"u-tab-icon",class:n.icon}),t._v(" "+t._s(n.label)+" "),t.showCount?e("span",{staticClass:"u-count",class:t.count[t.countMap[n.name]]?"is-orange":""},[t._v("("+t._s(t.count[t.countMap[n.name]]||0)+")")]):t._e()])])})),1)}),o=[],c=(n("caad"),n("14d9"),n("c944")),r={name:"",props:{tabs:{type:Array,default:function(){return[]}},msgChangeCount:{type:Number,default:0}},data:function(){return{active:"",countMap:{msg:"message",letter:"letter"},count:{message:0,letter:0}}},watch:{$route:function(){this.active=this.routeName},msgChangeCount:{immediate:!0,handler:function(t){t>0&&(this.count.message=0),t<0&&this.count.message>0&&(this.count.message+=t)}}},computed:{showCount:function(){return["msg","letter"].includes(this.routeName)},routeName:function(){return this.$route.name}},methods:{changeTab:function(){this.$router.push({name:this.active})},loadCount:function(){var t=this;Object(c["b"])().then((function(e){var n,a=(null===(n=e.data)||void 0===n?void 0:n.data)||{};t.count.letter=a.letter||0})),Object(c["c"])().then((function(e){var n;t.count.message=(null===(n=e.data.data)||void 0===n?void 0:n.unread_count)||0}))}},mounted:function(){this.active=this.routeName,this.showCount&&this.loadCount()},components:{}},l=r,u=n("2877"),d=Object(u["a"])(l,s,o,!1,null,null,null),h=d.exports,m=n("5c97"),f={name:"uc",props:{icon:{type:String,default:"el-icon-user"},title:{type:String,default:"我的资料"},tabList:{type:Array,default:function(){return m["d"]}},msgChangeCount:{type:Number,default:0}},data:function(){return{}},computed:{},methods:{},mounted:function(){},components:{tabs:h}},v=f,p=(n("dc6f"),Object(u["a"])(v,a,i,!1,null,null,null));e["a"]=p.exports},"4fed":function(t,e,n){"use strict";n("f669")},"506c":function(t,e,n){"use strict";var a=n("0bb7"),i=n("2ef0");const{__imgPath:s,__dataPath:o}=a,c=[],r=[];let l=!1;async function u(){if(r.length>0)return;if(l&&0===r.length)return await new Promise(t=>{c.push(t)});l=!0;const t=sessionStorage.getItem("jx3_emotion");if(t){const e=JSON.parse(t);r.push(...e.map(t=>t.items).reduce((t,e)=>t.concat(e),[])),r.push(...JSON.parse(t))}else{const t=await fetch(o+"emotion/output/catalog.json").then(t=>t.json());r.push(...t.map(t=>t.items).reduce((t,e)=>t.concat(e),[])),sessionStorage.setItem("jx3_emotion",JSON.stringify(t))}l=!1,c.forEach(t=>t())}class d{constructor(t){this.joke=String(t).trim()}async _renderHTML(){if(!this.joke.includes("#"))return this.joke;await u();const t=Object(i["keyBy"])(r,"key");for(const e in t)if(this.joke.includes(e)){const n=`${s}emotion/output/${t[e].filename}`;this.joke=this.joke.replaceAll(e,`<img src="${n}" alt="${e}" title="${e}" />`)}return this.joke}}e["a"]=d},"5c97":function(t){t.exports=JSON.parse('{"e":[{"name":"frame","icon":"el-icon-camera","label":"头像框"},{"name":"theme","icon":"el-icon-orange","label":"主题风格"},{"name":"honor","icon":"el-icon-collection-tag","label":"称号"},{"name":"medal","icon":"el-icon-medal","label":"勋章"},{"name":"emotion","icon":"el-icon-picture-outline-round","label":"表情包"}],"d":[{"name":"profile","icon":"el-icon-user","label":"基本资料"},{"name":"avatar","icon":"el-icon-camera","label":"修改头像"},{"name":"pwd","icon":"el-icon-lock","label":"修改密码"},{"name":"notice","icon":"el-icon-message","label":"通知中心"},{"name":"connect","icon":"el-icon-connection","label":"绑定账号"},{"name":"address","icon":"el-icon-map-location","label":"地址管理"},{"name":"auth","icon":"el-icon-s-check","label":"账号认证"}],"b":[{"name":"mall","icon":"el-icon-shopping-bag-1","label":"商城订单"},{"name":"orders","icon":"el-icon-shopping-bag-2","label":"系统订单"}],"c":[{"name":"msg","icon":"el-icon-message","label":"通知"},{"name":"letter","icon":"el-icon-chat-dot-square","label":"私信"}],"a":[{"name":"certification","icon":"el-icon-medal","label":"电子证书"},{"name":"holidayCard","icon":"el-icon-sugar","label":"节日贺卡"},{"name":"birthdayCard","icon":"el-icon-present","label":"生日贺卡"}]}')},"61c5":function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var a=n("c7eb"),i=n("1da1"),s=n("506c");function o(t){return c.apply(this,arguments)}function c(){return c=Object(i["a"])(Object(a["a"])().mark((function t(e){var n;return Object(a["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=new s["a"](e),t.next=3,n._renderHTML();case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}}),t)}))),c.apply(this,arguments)}},"938c":function(t,e,n){t.exports=n.p+"img/null.aec24a0e.png"},c944:function(t,e,n){"use strict";n.d(e,"d",(function(){return i})),n.d(e,"f",(function(){return s})),n.d(e,"e",(function(){return o})),n.d(e,"g",(function(){return c})),n.d(e,"b",(function(){return l})),n.d(e,"a",(function(){return u})),n.d(e,"c",(function(){return r}));var a=n("41cb");function i(t){return Object(a["$next"])().get("/api/next2/userdata/messages",{params:t})}function s(t){return Object(a["$next"])().put("/api/next2/userdata/messages/read/".concat(t))}function o(){return Object(a["$next"])().put("/api/next2/userdata/messages/read")}function c(t){return Object(a["$next"])().delete("/api/next2/userdata/messages/".concat(t))}function r(){return Object(a["$next"])({mute:!0}).get("/api/next2/userdata/messages/unread_total")}function l(){return Object(a["$next"])({mute:!0}).get("/api/letter/unread/count")}function u(t){return Object(a["$next"])().get("/api/next2/comment/item/".concat(t))}},cda8:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t._self._c;return e("uc",{staticClass:"m-dashboard-frame m-dashboard-skin",attrs:{icon:"el-icon-bell",title:"我的消息","tab-list":t.tabList}},[t.hasData?e("div",{staticClass:"m-dashboard-letter"},[e("div",{staticClass:"m-dashboard-letter__left"},[e("div",{staticClass:"u-title"},[t._v("近期消息 "),e("span",{staticClass:"u-limit"},[t._v("每日上限"+t._s(t.total_limit)+"条")])]),e("contact-list",{ref:"contacts",attrs:{"can-op":t.canOp},on:{"update:contact":t.updateContact,"check:contacts":t.checkContacts}})],1),e("div",{staticClass:"m-dashboard-letter__right"},[e("letter-list",{attrs:{contact:t.contact,"can-op":t.canOp},on:{"update:contact":t.letterUpdateContact}})],1)]):e("div",{staticClass:"u-null"},[e("el-empty",{attrs:{image:t.emptyPng,description:"这里什么都没有呢~"}})],1)])},i=[],s=n("5c97"),o=n("2ef0"),c=n("b490"),r=n("48c0"),l=function(){var t=this,e=t._self._c;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"m-letter-contacts"},t._l(t.contacts,(function(n,a){return e("div",{key:a,staticClass:"m-letter-contact",class:{active:t.active==n.receiver_info.id},on:{click:function(e){return t.onContactClick(n)}}},[0!=n.receiver_info.id&&t.canOp?e("div",{staticClass:"u-close",attrs:{title:"移除"},on:{click:function(e){return e.stopPropagation(),t.removeContact(n)}}},[e("i",{staticClass:"el-icon-close"})]):t._e(),e("img",{staticClass:"u-avatar",attrs:{src:t.showAvatar(n.receiver_info.avatar),alt:""}}),e("div",{staticClass:"m-user"},[e("div",{staticClass:"u-user-name",attrs:{title:n.receiver_info.display_name}},[t._v(" "+t._s(n.receiver_info.display_name)+" ")]),n.latest_letter?e("div",{staticClass:"u-latest-chat"},[t._v(" "+t._s(n.latest_letter.content_type?"[图片]":n.latest_letter.content)+" ")]):t._e()])])})),0)},u=[],d=(n("4de4"),n("7db0"),n("e9f5"),n("910d"),n("f665"),n("d3b7"),n("99af"),n("41cb"));function h(t){return Object(d["$cms"])({mute:!0}).get("/api/cms/config",{params:t})}function m(t){return Object(d["$next"])().post("/api/letter/recently/contacts/".concat(t))}function f(){return Object(d["$next"])().get("/api/letter/recently/contacts")}function v(t){return Object(d["$next"])().delete("/api/letter/recently/contacts/".concat(t))}function p(t,e,n){return Object(d["$next"])().post("/api/letter/".concat(t,"/to/").concat(e),n)}function g(t,e,n){return Object(d["$next"])().get("/api/letter/".concat(t,"/to/").concat(e,"/newest"),{params:n})}function b(t,e,n){return Object(d["$next"])().get("/api/letter/".concat(t,"/to/").concat(e,"/before"),{params:n})}var _=n("85e4"),y={name:"contacts",props:{canOp:{type:Boolean,default:!1}},emits:["update:contact","check:contacts"],data:function(){return{active:"",loading:!1,isInit:!0,contacts:[]}},watch:{active:{handler:function(){var t=this,e=this.contacts.find((function(e){return e.receiver_info.id==t.active}));this.$emit("update:contact",e)}},"$route.query":{deep:!0,immediate:!0,handler:function(t){null!==t&&void 0!==t&&t.receiver?this.addContact(t.receiver):this.getContacts()}}},methods:{addContact:function(t){var e=this;t&&m(t).then((function(t){e.getContacts()}))},getContacts:function(){var t=this;return this.isInit&&(this.loading=!0),f().then((function(e){var n,a,i,s,o;t.contacts=(null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.data)||[],t.$emit("check:contacts",!(null===(a=t.contacts)||void 0===a||!a.length)),t.contacts.length&&(t.active=t.isInit?null===(i=e.data)||void 0===i||null===(s=i.data[0])||void 0===s||null===(o=s.receiver_info)||void 0===o?void 0:o.id:t.active,t.isInit=!1)})).finally((function(){t.loading=!1}))},removeContact:function(t){var e,n=this;v(null===t||void 0===t||null===(e=t.receiver_info)||void 0===e?void 0:e.id).then((function(e){var a;n.contacts=n.contacts.filter((function(e){return e.receiver_info.id!=t.receiver_info.id})),n.active==t.receiver_info.id&&n.contacts.length&&(n.active=n.contacts[0].receiver_info.id),n.$emit("check:contacts",!(null===(a=n.contacts)||void 0===a||!a.length))}))},onContactClick:function(t){this.active=t.receiver_info.id},showAvatar:_["showAvatar"]}},C=y,x=n("2877"),w=Object(x["a"])(C,l,u,!1,null,null,null),O=w.exports,k=(n("9911"),function(){var t=this,e=t._self._c;return t.contact?e("div",{staticClass:"m-letter-box"},[t.hasData?e("div",{staticClass:"u-chat-name"},[t._v(t._s(t.contact.receiver_info.display_name))]):t._e(),e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"letterList",staticClass:"m-letter-list",attrs:{"element-loading-spinner":"el-icon-loading"}},[e("div",{staticClass:"u-letter-more"},[e("span",{directives:[{name:"show",rawName:"v-show",value:t.hasHistory,expression:"hasHistory"}],staticClass:"u-load-more",on:{click:function(e){return e.stopPropagation(),t.getHistory.apply(null,arguments)}}},[e("i",{staticClass:"el-icon-d-arrow-right u-more-icon"}),t._v("查看历史消息")]),e("span",{directives:[{name:"show",rawName:"v-show",value:t.historyFetched&&!t.hasHistory,expression:"historyFetched && !hasHistory"}],staticClass:"u-no-more"},[t._v("没有更多消息了~")]),e("span",{directives:[{name:"show",rawName:"v-show",value:t.historyFetching,expression:"historyFetching"}],staticClass:"u-loading"},[e("i",{staticClass:"el-icon-loading"})]),e("span",{directives:[{name:"show",rawName:"v-show",value:t.historyError,expression:"historyError"}],staticClass:"u-error"},[t._v(" 消息加载失败，"),e("span",{staticClass:"u-error__btn",on:{click:function(e){return e.stopPropagation(),t.getHistory.apply(null,arguments)}}},[t._v("点击重新加载")])])]),t._l(t.letters,(function(n,a){return e("div",{key:n.id,staticClass:"m-letter-list-content"},[t.showTime(n,a)?e("div",{staticClass:"u-time"},[t._v(t._s(n.created_at))]):t._e(),e("div",{staticClass:"m-letter-item",class:t.letterItemClass(n)},[e("a",{staticClass:"u-avatar",attrs:{href:t.link(n),target:"_blank"}},[e("img",{staticClass:"u-img",attrs:{src:t.letterBelong(n),alt:n.id}})]),e("div",{staticClass:"u-letter-content"},[0==n.content_type?e("div",{staticClass:"u-letter-text",domProps:{innerHTML:t._s(t.lettersTrans[n.content])}}):t._e(),1==n.content_type?e("div",{staticClass:"u-letter-image",attrs:{title:"点击查看大图"}},[e("el-image",{attrs:{src:t.resolveImagePath(n.content),"preview-src-list":[n.content]}})],1):t._e()])])])}))],2),e("div",{directives:[{name:"show",rawName:"v-show",value:t.newMessage,expression:"newMessage"}],staticClass:"u-letter-new"},[e("div",{staticClass:"u-text",on:{click:t.toBottom}},[t._v("您有新消息")])]),e("send-box",{ref:"sendBox",attrs:{disabled:!t.canOp},on:{send:t.send}})],1):t._e()}),j=[],I=n("2909"),$=(n("7d54"),n("ac1f"),n("5319"),n("159b"),n("c0c4")),L=n.n($),S=n("c9d2"),T=n("61c5"),H=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-letter-sendbox",class:{disabled:t.disabled}},[e("sendTools",{on:{"update:image":t.sendImage,"update:text":t.updateText}}),e("div",{staticClass:"u-send-content"},[e("el-input",{attrs:{type:"textarea",placeholder:"按 Ctrl+Enter 可快速发送消息",id:"letterInput"},nativeOn:{keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:e.ctrlKey?t.send.apply(null,arguments):null}},model:{value:t.content,callback:function(e){t.content=e},expression:"content"}})],1),e("div",{staticClass:"u-send-action"},[e("span",{staticClass:"u-text-sum"},[e("span",{staticClass:"u-current-sum",class:{over:t.isOver}},[t._v(t._s(t.currentSum))]),e("span",{staticClass:"u-max-sum"},[t._v("/"+t._s(t.max))])]),e("el-button",{attrs:{size:"mini",disabled:t.isOver||!t.currentSum},on:{click:t.send}},[t._v("发送")])],1)],1)},N=[],B=n("c7eb"),E=n("1da1"),F=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-send-tools"},[e("div",{staticClass:"m-upload"},[e("i",{staticClass:"el-icon-picture-outline u-upload-icon",on:{click:t.select}}),e("input",{ref:"uploadInput",staticClass:"u-upload-file",attrs:{type:"file",accept:".jpg, .jpeg, .png, .gif, .bmp,.webp"},on:{change:t.upload}})]),e("Emotion",{attrs:{type:"pop",max:6},on:{selected:t.emotionSelect}})],1)},M=[],P=n("c840"),D={name:"sendTools",components:{Emotion:P["a"]},emits:["update:image","update:text"],data:function(){return{data:"",maxSize:10}},computed:{fileInput:function(){return this.$refs.uploadInput}},methods:{select:function(){this.fileInput.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window}))},upload:function(){var t=this,e=this.fileInput.files[0];if(e)if(e.size>1024*this.maxSize*1024)this.$message.error("图片大小不能超过"+this.maxSize+"M");else{var n=new FormData;n.append("file",e),Object(c["f"])(n).then((function(e){t.data=e.data.data[0],t.$emit("update:image",t.data)}))}},emotionSelect:function(t){this.$emit("update:text",t.key)}}},A=D,z=Object(x["a"])(A,F,M,!1,null,null,null),J=z.exports,q={name:"sendBox",props:{disabled:{type:Boolean,default:!1}},components:{sendTools:J},emits:["send"],data:function(){return{content:"",max:500,user:S["a"].getInfo(),isLogin:S["a"].isLogin()}},computed:{currentSum:function(){return this.content.length},isOver:function(){return this.currentSum>this.max}},methods:{send:function(){!this.isOver&&this.currentSum&&this.$emit("send",{content:this.content,content_type:0})},clear:function(){this.content=""},sendImage:function(t){this.$emit("send",{content:t,content_type:1})},updateText:function(t){var e=this;return Object(E["a"])(Object(B["a"])().mark((function n(){var a,i,s,o;return Object(B["a"])().wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(a=document.querySelector("#letterInput"),i=t,!a.selectionStart&&0!==a.selectionStart){n.next=12;break}return s=a.selectionStart,o=a.selectionEnd,e.content=a.value.substring(0,s)+i+a.value.substring(o,a.value.length),n.next=8,e.$nextTick();case 8:a.focus(),a.setSelectionRange(o+i.length,o+i.length),n.next=13;break;case 12:e.content=i;case 13:case"end":return n.stop()}}),n)})))()}}},U=q,K=Object(x["a"])(U,H,N,!1,null,null,null),R=K.exports,G={name:"letterList",components:{sendBox:R},props:{contact:{type:Object,default:function(){return{}}},canOp:{type:Boolean,default:!1}},emits:["update:contact"],data:function(){return{lettersTrans:{},letters:[],peoples:{},user:S["a"].getInfo(),loading:!1,isInit:!0,firstId:0,lastId:0,limit:10,timer:null,hasHistory:!0,historyFetched:!1,historyFetching:!1,historyError:!1,newMessage:!1}},computed:{hasData:function(){var t,e;return!(null===(t=this.contact)||void 0===t||null===(e=t.receiver_info)||void 0===e||!e.id)},letterList:function(){return this.$refs.letterList}},watch:{contact:{deep:!0,immediate:!0,handler:function(t,e){var n,a;(null===t||void 0===t||null===(n=t.receiver_info)||void 0===n?void 0:n.id)!==(null===e||void 0===e||null===(a=e.receiver_info)||void 0===a?void 0:a.id)&&(this.letters=[],this.peoples={},this.firstId=0,this.lastId=0,this.hasHistory=!1),this.isInit=!0,this.loadLetter(),clearInterval(this.timer),this.cycleLoad()}},letters:{deep:!0,handler:function(t){var e=this;Array.isArray(t)&&t.length>0&&t.filter((function(t){return 0===t.content_type})).forEach((function(t){e.formatContent(t.content)}))}}},beforeDestroy:function(){clearInterval(this.timer)},methods:{resolveImagePath:_["resolveImagePath"],formatContent:function(t){var e=this;t=L.a.sanitize(t),Object(T["a"])(this.nl2br(t)).then((function(n){e.$set(e.lettersTrans,t,n)}))},nl2br:function(t){return t.replace(/\n/g,"<br>")},toBottom:function(){var t=this;this.newMessage=!1,this.$nextTick((function(){var e=t.letterList;e&&(e.scrollTop=e.scrollHeight)}))},loadLetter:function(){var t=this;if(this.hasData){this.isInit&&(this.loading=!0);var e={begin:this.lastId,limit:this.limit};return g(this.contact.sender_info.id,this.contact.receiver_info.id,e).then((function(e){var n,a,i,s;t.letters=Object(o["uniqBy"])(t.letters.concat((null===(n=e.data.data)||void 0===n?void 0:n.letters)||[]),"id"),t.peoples=(null===(a=e.data.data)||void 0===a?void 0:a.peoples)||{},t.lastId=(null===(i=t.letters[t.letters.length-1])||void 0===i?void 0:i.id)||t.lastId,t.firstId=(null===(s=t.letters[0])||void 0===s?void 0:s.id)||t.firstId,t.hasHistory=!(t.letters.length<t.limit),t.$nextTick((function(){t.isInit&&t.letterList&&(t.letterList.scrollTop=t.letterList.scrollHeight)})),t.isInit=!1})).finally((function(){t.loading=!1}))}},cycleLoad:function(){var t=this;this.timer=setInterval((function(){t.loadLetter(),t.$emit("update:contact")}),15e3)},getHistory:function(){var t=this;this.historyFetching=!0,this.hasHistory=!1;var e={begin:this.firstId,limit:this.limit};b(this.contact.sender_info.id,this.contact.receiver_info.id,e).then((function(e){var n,a,i;t.letters=Object(o["uniqBy"])([].concat(Object(I["a"])((null===(n=e.data.data)||void 0===n?void 0:n.letters)||[]),Object(I["a"])(t.letters)),"id"),t.hasHistory=!((null===(a=e.data.data.letters)||void 0===a?void 0:a.length)<t.limit),t.firstId=(null===(i=t.letters[0])||void 0===i?void 0:i.id)||t.firstId,t.historyFetched=!0,t.historyFetching=!1,t.historyError=!1})).catch((function(e){t.historyFetched=!0,t.historyFetching=!1,t.historyError=!0}))},letterItemClass:function(t){return t.sender==this.user.uid?"me":"not-me"},letterBelong:function(t){var e,n=t.sender==this.user.uid?this.user.uid:t.sender;return Object(_["showAvatar"])(null===(e=this.peoples[n])||void 0===e?void 0:e.avatar)},link:function(t){var e,n=t.sender==this.user.uid?this.user.uid:t.sender;return Object(_["authorLink"])(null===(e=this.peoples[n])||void 0===e?void 0:e.id)},showTime:function(t,e){if(0==e)return!0;var n=this.letters[e-1],a=new Date(n.created_at).getTime(),i=new Date(t.created_at).getTime();return i-a>18e4},send:function(t){var e=this;p(this.contact.sender_info.id,this.contact.receiver_info.id,t).then((function(t){e.loadLetter(!1).then((function(t){var n;null===(n=e.$refs.sendBox)||void 0===n||n.clear(),e.$emit("update:contact"),clearInterval(e.timer),e.cycleLoad(),e.$nextTick((function(){e.letterList&&(e.letterList.scrollTop=e.letterList.scrollHeight)}))}))}))}}},Q=G,V=Object(x["a"])(Q,k,j,!1,null,null,null),W=V.exports,X={name:"letter",components:{uc:r["a"],contactList:O,letterList:W},data:function(){return{tabList:s["c"],hasData:!0,info:{uid:8,name:"匿名",user_avatar:"https://img.jx3box.com/image/common/avatar.png",user_avatar_frame:"default",bio:"-",sign:0,experience:0},contact:{},total_limit:0}},computed:{emptyPng:function(){return n("938c")},userLevel:function(){var t;return S["a"].getLevel((null===(t=this.info)||void 0===t?void 0:t.experience)||0)},canOp:function(){return this.userLevel>=3}},mounted:function(){this.loadUserInfo(),this.loadConf()},methods:{updateContact:function(t){this.contact=Object(o["cloneDeep"])(t)},checkContacts:function(t){this.hasData=t},letterUpdateContact:function(){var t;null===(t=this.$refs.contacts)||void 0===t||t.getContacts()},loadUserInfo:function(){var t=this;Object(c["b"])().then((function(e){e.data.data&&(t.info=e.data.data)}))},loadConf:function(){var t=this;h({key:"private_letter_everyday_count_limit"}).then((function(e){t.total_limit=~~e.data.data.val}))}}},Y=X,Z=(n("4fed"),Object(x["a"])(Y,a,i,!1,null,null,null));e["default"]=Z.exports},dc6f:function(t,e,n){"use strict";n("39dd")},f669:function(t,e,n){}}]);