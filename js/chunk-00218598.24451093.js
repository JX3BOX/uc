(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-00218598"],{"0bb7":function(t){t.exports=JSON.parse('{"__Domain":"www.jx3box.com","__Origin":"origin.jx3box.com","__Root":"https://www.jx3box.com/","__OriginRoot":"https://origin.jx3box.com/","__Github":"https://github.jx3box.com/","__server":"https://server.jx3box.com/","__sso":"https://sso.jx3box.com/","__cms":"https://cms.jx3box.com/","__node":"https://node.jx3box.com/","__spider":"https://spider.jx3box.com/","__spider2":"https://spider2.jx3box.com/","__next":"https://next2.jx3box.com/","__pay":"https://pay.jx3box.com/","__team":"https://team.api.jx3box.com/","__lua":"https://lua.jx3box.com/","__down":"https://down.jx3box.com/","__dbm":"https://dbm.jx3box.com/","__helperUrl":"https://helper.jx3box.com/","__os":"https://os.jx3box.com/","__jx3":"https://xn--3-4g8a959k.com/","__cdn":"https://cdn.jx3box.com/","__ossRoot":"https://oss.jx3box.com/","__ossMirror":"https://cdn.jx3box.com/","__staticPath":{"origin":"https://oss.jx3box.com/static/","github":"https://jx3box.github.io/","jsdelivr":"https://cdn.jsdelivr.net/gh/JX3BOX/","mirror":"https://cdn.jx3box.com/static/"},"__dataPath":"https://data.jx3box.com/","__imgPath":"https://img.jx3box.com/","__iconPath":"https://icon.jx3box.com/","__clients":{"std":"重制","origin":"缘起","all":"双端"},"__postType":{"macro":"宏库","bps":"职业","pvp":"竞技","fb":"副本","tool":"工具","bbs":"茶馆","notice":"公告","jx3dat":"插件"},"__wikiType":{"achievement":"成就","item":"物品","knowledge":"通识","quest":"任务"},"__appType":{"face":"捏脸","pz":"配装","joke":"骚话","emotion":"表情","collection":"小册","item_plan":"清单","question":"题目","paper":"试卷","calendar":"日历","battle":"战斗"},"__gameType":{"pet":"宠物","adventure":"奇遇","furniture":"家具","horse":"坐骑","book":"书籍","exterior":"外观","reputation":"声望"},"__sourceType":{"cms_types":["macro","jx3dat","fb","bps","tool","bbs","notice","house","share","joke","emotion","feedback","collection","face"],"pvx_types":["pet","adventure","furniture","horse","book","exterior","reputation"],"wiki_types":["cj","achievement","item","item_plan","wiki","knowledge","quest"],"app_types":["pz","calendar","battle"],"exam_types":["question","paper"],"db_types":["skill","buff","npc","doodad"],"dbm_types":["vpk"],"team_types":["org","role","raid","apply"],"vip_types":["mall"]},"__visibleMap":{"0":"公开","1":"仅自己可见","2":"仅亲友可见","3":"密码可见","4":"付费可见","5":"粉丝可见"},"__userGroup":{"0":"游客","1":"待验证用户","8":"邮箱验证用户","16":"手机验证用户","32":"特约签约作者","64":"编辑","128":"管理员","256":"开发组","512":"超级管理"},"__userLevel":{"1":[0,600],"2":[600,900],"3":[900,1800],"4":[1800,3600],"5":[3600,7200],"6":[7200,999999]},"__userLevelColor":{"1":"#32d3c4","2":"#86c0fb","3":"#33d9ff","4":"#ffdb2a","5":"#ffa739","6":"#ff70b2","7":"#ff3399","8":"#f93c3c"},"__Links":{"account":{"login":"/account/login","register":"/account/register","email_verify":"/account/email_verify","login_callback":"/account/login_callback"},"dashboard":{"home":"/dashboard","msg":"/dashboard/msg","feed":"/dashboard/feed","fav":"/dashboard/fav","profile":"/dashboard/profile","connect":"/dashboard/connect","work":"/publish","publish":"/publish"}},"default_avatar":"https://cdn.jx3box.com/image/common/avatar.png","feedback":"https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=o8LHzsrN48nbkMHM243AzM4"}')},"23a2":function(t,e,a){"use strict";a("e2f5")},"39dd":function(t,e,a){},"48c0":function(t,e,a){"use strict";var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-dashboard-profile m-profile"},[e("h2",{staticClass:"u-title"},[e("i",{class:t.icon}),t._v(" "+t._s(t.title)+" "),t._t("header")],2),e("tabs",{attrs:{tabs:t.tabList,"msg-change-count":t.msgChangeCount}}),t._t("default")],2)},o=[],i=(a("a9e3"),a("b0c0"),function(){var t=this,e=t._self._c;return e("el-tabs",{staticClass:"m-dashboard-tabs",on:{"tab-click":t.changeTab},model:{value:t.active,callback:function(e){t.active=e},expression:"active"}},t._l(t.tabs,(function(a){return e("el-tab-pane",{key:a.name,attrs:{name:a.name}},[e("span",{attrs:{slot:"label"},slot:"label"},[e("i",{staticClass:"u-tab-icon",class:a.icon}),t._v(" "+t._s(a.label)+" "),t.showCount?e("span",{staticClass:"u-count",class:t.count[t.countMap[a.name]]?"is-orange":""},[t._v("("+t._s(t.count[t.countMap[a.name]]||0)+")")]):t._e()])])})),1)}),r=[],s=(a("caad"),a("14d9"),a("c944")),c={name:"",props:{tabs:{type:Array,default:function(){return[]}},msgChangeCount:{type:Number,default:0}},data:function(){return{active:"",countMap:{msg:"message",letter:"letter"},count:{message:0,letter:0}}},watch:{$route:function(){this.active=this.routeName},msgChangeCount:{immediate:!0,handler:function(t){t>0&&(this.count.message=0),t<0&&this.count.message>0&&(this.count.message+=t)}}},computed:{showCount:function(){return["msg","letter"].includes(this.routeName)},routeName:function(){return this.$route.name}},methods:{changeTab:function(){this.$router.push({name:this.active})},loadCount:function(){var t=this;Object(s["b"])().then((function(e){var a,n=(null===(a=e.data)||void 0===a?void 0:a.data)||{};t.count.letter=n.letter||0})),Object(s["c"])().then((function(e){var a;t.count.message=(null===(a=e.data.data)||void 0===a?void 0:a.unread_count)||0}))}},mounted:function(){this.active=this.routeName,this.showCount&&this.loadCount()},components:{}},l=c,u=a("2877"),d=Object(u["a"])(l,i,r,!1,null,null,null),m=d.exports,h=a("5c97"),p={name:"uc",props:{icon:{type:String,default:"el-icon-user"},title:{type:String,default:"我的资料"},tabList:{type:Array,default:function(){return h["d"]}},msgChangeCount:{type:Number,default:0}},data:function(){return{}},computed:{},methods:{},mounted:function(){},components:{tabs:m}},b=p,f=(a("dc6f"),Object(u["a"])(b,n,o,!1,null,null,null));e["a"]=f.exports},"506c":function(t,e,a){"use strict";var n=a("0bb7"),o=a("2ef0");const{__imgPath:i,__dataPath:r}=n,s=[],c=[];let l=!1;async function u(){if(c.length>0)return;if(l&&0===c.length)return await new Promise(t=>{s.push(t)});l=!0;const t=sessionStorage.getItem("jx3_emotion");if(t){const e=JSON.parse(t);c.push(...e.map(t=>t.items).reduce((t,e)=>t.concat(e),[])),c.push(...JSON.parse(t))}else{const t=await fetch(r+"emotion/output/catalog.json").then(t=>t.json());c.push(...t.map(t=>t.items).reduce((t,e)=>t.concat(e),[])),sessionStorage.setItem("jx3_emotion",JSON.stringify(t))}l=!1,s.forEach(t=>t())}class d{constructor(t){this.joke=String(t).trim()}async _renderHTML(){if(!this.joke.includes("#"))return this.joke;await u();const t=Object(o["keyBy"])(c,"key");for(const e in t)if(this.joke.includes(e)){const a=`${i}emotion/output/${t[e].filename}`;this.joke=this.joke.replaceAll(e,`<img src="${a}" alt="${e}" title="${e}" />`)}return this.joke}}e["a"]=d},"59b6":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t._self._c;return e("uc",{staticClass:"m-dashboard-frame m-dashboard-skin",attrs:{icon:"el-icon-bell",title:"我的消息","tab-list":t.tabList,"msg-change-count":t.msgChangeCount}},[e("div",{staticClass:"m-dashboard m-dashboard-work m-dashboard-msg"},[e("div",{staticClass:"m-dashboard-msg-header"},[e("el-input",{staticClass:"m-dashboard-work-search",attrs:{placeholder:"请输入搜索内容"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.changePage(1)}},model:{value:t.keyword,callback:function(e){t.keyword=e},expression:"keyword"}},[e("template",{slot:"prepend"},[t._v("关键词")]),e("el-button",{attrs:{slot:"append",icon:"el-icon-search"},on:{click:function(e){return t.changePage(1)}},slot:"append"})],2),e("el-button",{staticClass:"u-read-all",attrs:{type:"primary"},on:{click:function(e){return t.read(null)}}},[e("i",{staticClass:"el-icon el-icon-check"}),e("span",{domProps:{textContent:t._s("全部设为已读")}})])],1),t.data.length?e("ul",{staticClass:"m-dashboard-box-list"},t._l(t.data,(function(a,n){return e("li",{key:n,class:{on:1==a.read}},[e("div",{staticClass:"u-primary"},[e("span",{staticClass:"u-content"},[1==a.read?e("span",{staticClass:"u-label u-hasChecked"},[t._v("已读")]):e("span",{staticClass:"u-label u-hasNotChecked"},[t._v("未读")]),e("span",{domProps:{innerHTML:t._s(a.content)}}),"comments"===a.ext_type&&a.ext_type_id>0?e("span",{staticClass:"u-msg-detail",on:{click:function(e){return t.handleDetail(a.ext_type_id)}}},[e("i",{staticClass:"el-icon-view"}),e("span",[t._v("详情")])]):t._e(),t.hasLink(a)?e("a",{staticClass:"u-msg-link",attrs:{href:t.msgLink(a),target:"_blank"},on:{click:function(e){return t.read(a)}}},[e("i",{staticClass:"el-icon-link"}),t._v(" 查看 ")]):t._e()]),e("time",{staticClass:"u-time"},[e("i",{staticClass:"el-icon-phone-outline"}),t._v(" "+t._s(t.dateFormat(~~a.created))+" ")])]),e("el-button-group",{staticClass:"u-action"},[e("el-button",{attrs:{size:"mini",icon:"el-icon-check",title:"设为已读",disabled:1==a.read},on:{click:function(e){return t.read(a)}}}),e("el-button",{attrs:{size:"mini",icon:"el-icon-delete",title:"删除"},on:{click:function(e){return t.del(a)}}})],1)],1)})),0):e("el-alert",{staticClass:"m-dashboard-box-null",attrs:{title:"没有找到相关条目",type:"info",center:"","show-icon":""}}),t.paginationShow?e("el-pagination",{staticClass:"m-dashboard-box-pages",attrs:{background:"","hide-on-single-page":!0,"current-page":t.page,"page-size":t.limit,layout:"total, prev, pager, next, jumper",total:t.total},on:{"current-change":t.changePage,"update:currentPage":function(e){t.page=e},"update:current-page":function(e){t.page=e},"update:pageSize":function(e){t.limit=e},"update:page-size":function(e){t.limit=e}}}):t._e()],1),t.visible?e("CommentDetail",{attrs:{visible:t.visible,id:t.id},on:{close:t.close}}):t._e()],1)},o=[],i=(a("99af"),a("caad"),a("a15b"),a("14d9"),a("e9c4"),a("a9e3"),a("ac1f"),a("5319"),a("2ca0"),a("5c97")),r=a("c944"),s=a("e4f1"),c=a("85e4"),l=a("927b"),u=a("e762"),d=a("48c0"),m=function(){var t,e,a=this,n=a._self._c;return n("el-dialog",{staticClass:"m-comment-detail-dialog",attrs:{visible:a.show,title:a.title,"before-close":a.close},on:{"update:visible":function(t){a.show=t}}},[n("el-descriptions",{directives:[{name:"loading",rawName:"v-loading",value:a.loading,expression:"loading"}],staticClass:"m-msg-comment-detail",attrs:{direction:"vertical",column:2,border:""}},[n("el-descriptions-item",{attrs:{label:"评论内容",span:2}},[n("div",{domProps:{innerHTML:a._s(a.renderContent||"-")}})]),a.attachments.length?n("el-descriptions-item",{attrs:{label:"评论附件",span:2}},a._l(a.attachments,(function(t,e){return n("el-image",{key:e,attrs:{src:a.resolveImagePath(t),"preview-src-list":[t]}})})),1):a._e(),n("el-descriptions-item",{attrs:{label:"评论人"}},[a.data.userId?n("div",{staticClass:"m-user"},[n("a",{staticClass:"u-name",attrs:{href:a.authorLink(a.data.userId),target:"_blank"}},[n("img",{staticClass:"u-avatar",attrs:{src:a.showAvatar(null===(t=a.data.user_info)||void 0===t?void 0:t.avatar),alt:""}}),a._v(" "+a._s(null===(e=a.data.user_info)||void 0===e?void 0:e.display_name)+" ")])]):n("span",[a._v("-")])]),n("el-descriptions-item",{attrs:{label:"评论时间"}},[a._v(" "+a._s(a.formatDate(a.data.commentDate))+" ")])],1)],1)},h=[],p=a("c7eb"),b=a("1da1"),f=(a("b64b"),a("d3b7"),a("61c5")),g=a("85e4"),_=g.authorLink,x=g.resolveImagePath,v=g.showAvatar,y={name:"MsgCommentDetail",emits:["close"],props:["visible","id"],data:function(){return{loading:!1,data:{},attachments:[],renderContent:""}},computed:{title:function(){return"消息详情"}},watch:{visible:{handler:function(t){this.show=t},immediate:!0},id:{immediate:!0,handler:function(t){var e=this;this.loading=!0,Object(r["a"])(t).then((function(t){e.data=t.data.data||{},e.getImages(e.data.attachments),e.formatContent(e.data.content)})).finally((function(){e.loading=!1}))}}},methods:{formatContent:function(t){var e=this;return Object(b["a"])(Object(p["a"])().mark((function a(){return Object(p["a"])().wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,Object(f["a"])(t);case 2:e.renderContent=a.sent;case 3:case"end":return a.stop()}}),a)})))()},getImages:function(t){try{this.attachments=JSON.parse(t)}catch(e){this.attachments=[]}},resolveImagePath:function(t){return x(t)+"?x-oss-process=style/comment_thumb"},showAvatar:v,authorLink:_,formatDate:function(t){return Object(s["c"])(t)},close:function(){this.show=!1,this.$emit("close")}}},C=y,j=(a("698e"),a("2877")),k=Object(j["a"])(C,m,h,!1,null,null,null),w=k.exports,A=["namespace"],O={team_member_list:"/team/my/org/{id}?tab=manage-member"},S={name:"msg",components:{uc:d["a"],CommentDetail:w},data:function(){return{keyword:"",type:"all",data:[],unread_total:0,total:1,page:1,limit:15,paginationShow:!0,tabList:i["c"],msgChangeCount:0,id:"",visible:!1}},methods:{close:function(){this.id="",this.visible=!1},handleDetail:function(t){this.id=t,this.visible=!0},changePage:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.$router.push({name:"msg",query:{page:e}}),this.page=e,this.paginationShow=!1,Object(r["d"])({content:this.keyword,index:e,pageSize:this.limit}).then((function(e){t.unread_total=e.data.data.unread_count,t.total=e.data.data.page.total,t.data=e.data.data.list||[],t.paginationShow=!0})).catch((function(e){t.$message.error(e.message),t.paginationShow=!0}))},read:function(t){var e=this;this.msgChangeCount=0,t?Object(r["f"])(t.ID).then((function(a){0===a.data.code?(t.read||(e.msgChangeCount=-1),t.read=1):e.$notify.error({title:a.data.message})})):Object(r["e"])().then((function(t){0===t.data.code?(e.changePage(e.page),e.msgChangeCount=1,l["a"].emit("refresh")):e.$notify.error({title:t.data.message})}))},del:function(t){var e=this;Object(r["g"])(t.ID).then((function(a){0===a.data.code?t.deleted=Math.round(new Date/1e3):e.$notify.error({title:a.data.message})}))},dateFormat:function(t){return Object(s["c"])(new Date(1e3*t))},hasLink:function(t){return!A.includes(t.source_type)&&(!!t.redirect||!(!t.source_id||!t.source_type))},msgLink:function(t){var e=t.source_id,a=t.source_type,n=t.type,o=t.subtype,i=t.redirect;t.user_id;if(i){if(i.startsWith("http")||i.startsWith("/"))return i;var r;if(O[i]){var s=O[i];return s.replace("{id}",e)}return"/"+(null===i||void 0===i||null===(r=i.split("_"))||void 0===r?void 0:r.join("/"))}if("birthday"==a)return"/author/birthday?code="+u["a"].encode(e);if("callback"==a){var l=encodeURIComponent(u["a"].encode(JSON.stringify(t)));return"/dashboard/callback/".concat(n,"/").concat(o,"?info=").concat(l)}return Object(c["getLink"])(a,e)}},mounted:function(){this.changePage(Number(this.$route.query.page||1))}},P=S,L=(a("23a2"),Object(j["a"])(P,n,o,!1,null,"09f0f9e4",null));e["default"]=L.exports},"5c97":function(t){t.exports=JSON.parse('{"e":[{"name":"frame","icon":"el-icon-camera","label":"头像框"},{"name":"theme","icon":"el-icon-orange","label":"主题风格"},{"name":"honor","icon":"el-icon-collection-tag","label":"称号"},{"name":"medal","icon":"el-icon-medal","label":"勋章"},{"name":"emotion","icon":"el-icon-picture-outline-round","label":"表情包"}],"d":[{"name":"profile","icon":"el-icon-user","label":"基本资料"},{"name":"avatar","icon":"el-icon-camera","label":"修改头像"},{"name":"pwd","icon":"el-icon-lock","label":"修改密码"},{"name":"notice","icon":"el-icon-message","label":"通知中心"},{"name":"connect","icon":"el-icon-connection","label":"绑定账号"},{"name":"address","icon":"el-icon-map-location","label":"地址管理"},{"name":"auth","icon":"el-icon-s-check","label":"账号认证"}],"b":[{"name":"mall","icon":"el-icon-shopping-bag-1","label":"商城订单"},{"name":"orders","icon":"el-icon-shopping-bag-2","label":"系统订单"}],"c":[{"name":"msg","icon":"el-icon-message","label":"通知"},{"name":"letter","icon":"el-icon-chat-dot-square","label":"私信"}],"a":[{"name":"certification","icon":"el-icon-medal","label":"电子证书"},{"name":"holidayCard","icon":"el-icon-sugar","label":"节日贺卡"},{"name":"birthdayCard","icon":"el-icon-present","label":"生日贺卡"}]}')},"61c5":function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));var n=a("c7eb"),o=a("1da1"),i=a("506c");function r(t){return s.apply(this,arguments)}function s(){return s=Object(o["a"])(Object(n["a"])().mark((function t(e){var a;return Object(n["a"])().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=new i["a"](e),t.next=3,a._renderHTML();case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}}),t)}))),s.apply(this,arguments)}},"698e":function(t,e,a){"use strict";a("6e4e")},"6e4e":function(t,e,a){},c944:function(t,e,a){"use strict";a.d(e,"d",(function(){return o})),a.d(e,"f",(function(){return i})),a.d(e,"e",(function(){return r})),a.d(e,"g",(function(){return s})),a.d(e,"b",(function(){return l})),a.d(e,"a",(function(){return u})),a.d(e,"c",(function(){return c}));var n=a("41cb");function o(t){return Object(n["$next"])().get("/api/next2/userdata/messages",{params:t})}function i(t){return Object(n["$next"])().put("/api/next2/userdata/messages/read/".concat(t))}function r(){return Object(n["$next"])().put("/api/next2/userdata/messages/read")}function s(t){return Object(n["$next"])().delete("/api/next2/userdata/messages/".concat(t))}function c(){return Object(n["$next"])({mute:!0}).get("/api/next2/userdata/messages/unread_total")}function l(){return Object(n["$next"])({mute:!0}).get("/api/letter/unread/count")}function u(t){return Object(n["$next"])().get("/api/next2/comment/item/".concat(t))}},dc6f:function(t,e,a){"use strict";a("39dd")},e2f5:function(t,e,a){},e762:function(t,e,a){"use strict";(function(t){a.d(e,"a",(function(){return q}));const n="3.7.7",o=n,i="function"===typeof t,r="function"===typeof TextDecoder?new TextDecoder:void 0,s="function"===typeof TextEncoder?new TextEncoder:void 0,c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",l=Array.prototype.slice.call(c),u=(t=>{let e={};return t.forEach((t,a)=>e[t]=a),e})(l),d=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,m=String.fromCharCode.bind(String),h="function"===typeof Uint8Array.from?Uint8Array.from.bind(Uint8Array):t=>new Uint8Array(Array.prototype.slice.call(t,0)),p=t=>t.replace(/=/g,"").replace(/[+\/]/g,t=>"+"==t?"-":"_"),b=t=>t.replace(/[^A-Za-z0-9\+\/]/g,""),f=t=>{let e,a,n,o,i="";const r=t.length%3;for(let s=0;s<t.length;){if((a=t.charCodeAt(s++))>255||(n=t.charCodeAt(s++))>255||(o=t.charCodeAt(s++))>255)throw new TypeError("invalid character found");e=a<<16|n<<8|o,i+=l[e>>18&63]+l[e>>12&63]+l[e>>6&63]+l[63&e]}return r?i.slice(0,r-3)+"===".substring(r):i},g="function"===typeof btoa?t=>btoa(t):i?e=>t.from(e,"binary").toString("base64"):f,_=i?e=>t.from(e).toString("base64"):t=>{const e=4096;let a=[];for(let n=0,o=t.length;n<o;n+=e)a.push(m.apply(null,t.subarray(n,n+e)));return g(a.join(""))},x=(t,e=!1)=>e?p(_(t)):_(t),v=t=>{if(t.length<2){var e=t.charCodeAt(0);return e<128?t:e<2048?m(192|e>>>6)+m(128|63&e):m(224|e>>>12&15)+m(128|e>>>6&63)+m(128|63&e)}e=65536+1024*(t.charCodeAt(0)-55296)+(t.charCodeAt(1)-56320);return m(240|e>>>18&7)+m(128|e>>>12&63)+m(128|e>>>6&63)+m(128|63&e)},y=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,C=t=>t.replace(y,v),j=i?e=>t.from(e,"utf8").toString("base64"):s?t=>_(s.encode(t)):t=>g(C(t)),k=(t,e=!1)=>e?p(j(t)):j(t),w=t=>k(t,!0),A=/[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g,O=t=>{switch(t.length){case 4:var e=(7&t.charCodeAt(0))<<18|(63&t.charCodeAt(1))<<12|(63&t.charCodeAt(2))<<6|63&t.charCodeAt(3),a=e-65536;return m(55296+(a>>>10))+m(56320+(1023&a));case 3:return m((15&t.charCodeAt(0))<<12|(63&t.charCodeAt(1))<<6|63&t.charCodeAt(2));default:return m((31&t.charCodeAt(0))<<6|63&t.charCodeAt(1))}},S=t=>t.replace(A,O),P=t=>{if(t=t.replace(/\s+/g,""),!d.test(t))throw new TypeError("malformed base64.");t+="==".slice(2-(3&t.length));let e,a,n,o="";for(let i=0;i<t.length;)e=u[t.charAt(i++)]<<18|u[t.charAt(i++)]<<12|(a=u[t.charAt(i++)])<<6|(n=u[t.charAt(i++)]),o+=64===a?m(e>>16&255):64===n?m(e>>16&255,e>>8&255):m(e>>16&255,e>>8&255,255&e);return o},L="function"===typeof atob?t=>atob(b(t)):i?e=>t.from(e,"base64").toString("binary"):P,$=i?e=>h(t.from(e,"base64")):t=>h(L(t).split("").map(t=>t.charCodeAt(0))),D=t=>$(B(t)),N=i?e=>t.from(e,"base64").toString("utf8"):r?t=>r.decode($(t)):t=>S(L(t)),B=t=>b(t.replace(/[-_]/g,t=>"-"==t?"+":"/")),T=t=>N(B(t)),U=t=>{if("string"!==typeof t)return!1;const e=t.replace(/\s+/g,"").replace(/={0,2}$/,"");return!/[^\s0-9a-zA-Z\+/]/.test(e)||!/[^\s0-9a-zA-Z\-_]/.test(e)},z=t=>({value:t,enumerable:!1,writable:!0,configurable:!0}),F=function(){const t=(t,e)=>Object.defineProperty(String.prototype,t,z(e));t("fromBase64",(function(){return T(this)})),t("toBase64",(function(t){return k(this,t)})),t("toBase64URI",(function(){return k(this,!0)})),t("toBase64URL",(function(){return k(this,!0)})),t("toUint8Array",(function(){return D(this)}))},I=function(){const t=(t,e)=>Object.defineProperty(Uint8Array.prototype,t,z(e));t("toBase64",(function(t){return x(this,t)})),t("toBase64URI",(function(){return x(this,!0)})),t("toBase64URL",(function(){return x(this,!0)}))},M=()=>{F(),I()},q={version:n,VERSION:o,atob:L,atobPolyfill:P,btoa:g,btoaPolyfill:f,fromBase64:T,toBase64:k,encode:k,encodeURI:w,encodeURL:w,utob:C,btou:S,decode:T,isValid:U,fromUint8Array:x,toUint8Array:D,extendString:F,extendUint8Array:I,extendBuiltins:M}}).call(this,a("b639").Buffer)}}]);