(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4218b166"],{"0608":function(t){t.exports=JSON.parse('{"#下雨":"下雨.gif","#严寒":"严寒.gif","#亲亲":"亲亲.gif","#傲慢":"傲慢.gif","#冷汗":"冷汗.gif","#凶恶":"凶恶.gif","#刀":"刀.gif","#发怒":"发怒.gif","#口水":"口水.gif","#可怜":"可怜.gif","#吐":"吐.gif","#吓":"吓.gif","#呆":"呆.gif","#呲牙":"呲牙.gif","#咖啡":"咖啡.gif","#唇":"唇.gif","#喜欢":"喜欢.gif","#嘴":"嘴.gif","#噢":"噢.gif","#困":"困.gif","#大笑":"大笑.gif","#太阳":"太阳.gif","#媚眼":"媚眼.gif","#害羞":"害羞.gif","#寒":"寒.gif","#尴尬":"尴尬.gif","#差劲":"差劲.gif","#巴掌":"巴掌.gif","#强":"强.gif","#得意":"得意.gif","#微笑":"微笑.gif","#心碎":"心碎.gif","#恐慌":"恐慌.gif","#恶心":"恶心.gif","#感叹号":"感叹号.gif","#扁嘴":"扁嘴.gif","#打雷":"打雷.gif","#拍手":"拍手.gif","#握手":"握手.gif","#撇嘴":"撇嘴.gif","#无奈":"无奈.gif","#昏":"昏.gif","#晕":"晕.gif","#月亮":"月亮.gif","#标记":"标记.gif","#樱桃":"樱桃.gif","#欣喜":"欣喜.gif","#沉默":"沉默.gif","#流汗":"流汗.gif","#流泪":"流泪.gif","#灯泡":"灯泡.gif","#烟花":"烟花.gif","#爱心":"爱心.gif","#狂汗":"狂汗.gif","#狡猾":"狡猾.gif","#狡诈":"狡诈.gif","#猪":"猪.gif","#玫瑰":"玫瑰.gif","#生气":"生气.gif","#电话":"电话.gif","#睡":"睡.gif","#礼物":"礼物.gif","#笨猪":"笨猪.gif","#第一名":"第一名.gif","#第三名":"第三名.gif","#第二名":"第二名.gif","#红灯":"红灯.gif","#绿灯":"绿灯.gif","#胜利":"胜利.gif","#舌头":"舌头.gif","#色":"色.gif","#花":"花.gif","#苹果":"苹果.gif","#菠萝":"菠萝.gif","#蒜头":"蒜头.gif","#蜡烛":"蜡烛.gif","#衰":"衰.gif","#西瓜":"西瓜.gif","#讨厌":"讨厌.gif","#讶异":"讶异.gif","#鄙视":"鄙视.gif","#酷":"酷.gif","#钱":"钱.gif","#锤子":"锤子.gif","#问号":"问号.gif","#阴险":"阴险.gif","#难过":"难过.gif","#雪糕":"雪糕.gif","#饮料":"饮料.gif","#馒头":"馒头.gif","#香蕉":"香蕉.gif","#骷髅":"骷髅.gif","#鬼脸":"鬼脸.gif","#黄灯":"黄灯.gif"}')},"06f5":function(t,e,n){"use strict";n("9fad")},"33a5":function(t){t.exports=JSON.parse('{"0":"江湖","1":"天策","2":"万花","3":"纯阳","4":"七秀","5":"少林","6":"藏剑","7":"丐帮","8":"明教","9":"五毒","10":"唐门","18":"苍云","19":"长歌","20":"霸刀","21":"蓬莱","22":"凌雪","23":"衍天","24":"药宗","26":"刀宗","29":"万灵","38":"段氏"}')},3835:function(t,e,n){"use strict";function i(t){if(Array.isArray(t))return t}n.d(e,"a",(function(){return c}));n("a4d3"),n("e01a"),n("d28b"),n("14d9"),n("d3b7"),n("3ca3"),n("ddb0");function r(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var i,r,a,o,c=[],u=!0,f=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;u=!1}else for(;!(u=(i=a.call(n)).done)&&(c.push(i.value),c.length!==e);u=!0);}catch(t){f=!0,r=t}finally{try{if(!u&&null!=n["return"]&&(o=n["return"](),Object(o)!==o))return}finally{if(f)throw r}}return c}}var a=n("06c5");n("d9e2");function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t,e){return i(t)||r(t,e)||Object(a["a"])(t,e)||o()}},"450a":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t._self._c;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"m-publish-box"},[e("publish-header",{attrs:{name:"剑三骚话"}}),e("Emotion",{staticClass:"m-publish-joke-emotion",on:{selected:t.handleEmotionSelect}}),e("el-form",{attrs:{"label-position":"left","label-width":"80px"}},[e("el-form-item",{attrs:{label:"门派"}},[e("el-select",{attrs:{placeholder:"请选择门派"},model:{value:t.data.type,callback:function(e){t.$set(t.data,"type",e)},expression:"data.type"}},t._l(t.schools,(function(n){return e("el-option",{key:n.value,attrs:{value:n.key,label:n.value}},[e("span",{staticStyle:{float:"left"}},[t._v(t._s(n.value))]),e("span",{staticStyle:{float:"right"}},[e("img",{attrs:{src:n.path,width:"32",alt:n.key}})])])})),1)],1),e("el-form-item",{attrs:{label:"内容"}},[e("el-input",{attrs:{type:"textarea",rows:6,placeholder:"请输入内容",id:"textarea",maxlength:128,minlength:1,"show-word-limit":""},model:{value:t.data.content,callback:function(e){t.$set(t.data,"content",e)},expression:"data.content"}})],1),e("div",{staticClass:"m-publish-buttons"},[e("el-button",{attrs:{type:"primary",disabled:t.processing},on:{click:t.publish}},[t._v("发    布")])],1)],1)],1)},r=[],a=n("3835"),o=n("c7eb"),c=n("1da1"),u=(n("4de4"),n("caad"),n("14d9"),n("e9f5"),n("910d"),n("7d54"),n("4fadc"),n("b64b"),n("d3b7"),n("ac1f"),n("2532"),n("466d"),n("5319"),n("498a"),n("159b"),n("85e4")),f=n("c840"),s=n("65c2"),l=n("33a5"),g=n("0608"),d=n("ba82"),h=n("b49b"),p={name:"joke",components:{"publish-header":d["a"],Emotion:f["a"]},data:function(){return{loading:!1,processing:!1,inputVisible:!1,inputValue:"",contentLength:0,data:{type:"0",content:""},schools:[]}},computed:{id:function(){return this.$route.params.id},publishAction:function(){return this.id?h["j"]:h["h"]}},methods:{handleEmotionSelect:function(t){this.insertVariable(t.key)},showInput:function(){var t=this;this.inputVisible=!0,this.$nextTick((function(e){t.$refs.saveTagInput.$refs.input.focus()}))},handleInputConfirm:function(){var t=this.inputValue;t&&this.post.tags.push(t),this.inputVisible=!1,this.inputValue=""},insertVariable:function(t){var e=this;return Object(c["a"])(Object(o["a"])().mark((function n(){var i,r,a;return Object(o["a"])().wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(i=document.querySelector("#textarea"),!i.selectionStart&&0!==i.selectionStart){n.next=11;break}return r=i.selectionStart,a=i.selectionEnd,e.data.content=i.value.substring(0,r)+t+i.value.substring(a,i.value.length),n.next=7,e.$nextTick();case 7:i.focus(),i.setSelectionRange(a+t.length,a+t.length),n.next=12;break;case 11:e.data.content=t;case 12:case"end":return n.stop()}}),n)})))()},formatSchool:function(){for(var t=[],e=0,n=Object.entries(l);e<n.length;e++){var i=Object(a["a"])(n[e],2),r=i[0],o=i[1],c={key:r,value:String(o),path:s["__imgPath"]+"image/school/".concat(r,".png")};t.push(c)}this.schools=t},init:function(){var t=this;if(this.id)return this.loading=!0,Object(h["d"])(this.id).then((function(e){var n;t.data=null===e||void 0===e||null===(n=e.data)||void 0===n?void 0:n.data})).finally((function(){t.loading=!1}))},publish:function(){var t=this;this.check()&&(this.processing=!0,this.publishAction(this.data).then((function(e){var n,i,r=t.id||(null===e||void 0===e||null===(n=e.data)||void 0===n||null===(i=n.data)||void 0===i?void 0:i.id);t.$message({message:"发布成功,请等待审核",type:"success"}),setTimeout((function(){location.href=Object(u["getLink"])("joke",r)}),500)})).finally((function(){t.processing=!1})))},check:function(){var t,e=Object.keys(g),n=this.data.content.trim(),i=/(#[\u4e00-\u9fa5]{1})/g,r=/(#[\u4e00-\u9fa5]{2})/g,a=/(#[\u4e00-\u9fa5]{3})/g;if(!n.length)return this.$notify({title:"错误",message:"内容不能为空",type:"error"}),!1;var o=n.match(i)?n.match(i).filter((function(t){return e.includes(t)})):[];o.forEach((function(t){return n.replace(t,"")}));var c=n.match(r)?n.match(r).filter((function(t){return e.includes(t)})):[];c.forEach((function(t){return n.replace(t,"")}));var u=n.match(a)?n.match(a).filter((function(t){return e.includes(t)})):[];u.forEach((function(t){return n.replace(t,"")}));var f=o.length+c.length+u.length;if(this.contentLength=f,f>10)return this.$notify({title:"错误",message:"表情个数不能超过10个",type:"error"}),!1;var s=(null===(t=n.match(/[^\x00-\xff]/g))||void 0===t?void 0:t.length)||0;return!(2*s+(n.length-s)>128)||(this.$notify({title:"错误",message:"内容长度不能超过128个字符",type:"error"}),!1)}},created:function(){this.init(),this.formatSchool()},watch:{"$route.params.id":function(t){t&&this.init()}}},m=p,b=(n("06f5"),n("2877")),v=Object(b["a"])(m,i,r,!1,null,"e42ee9e6",null);e["default"]=v.exports},"498a":function(t,e,n){"use strict";var i=n("23e7"),r=n("58a8").trim,a=n("c8d2");i({target:"String",proto:!0,forced:a("trim")},{trim:function(){return r(this)}})},"4fadc":function(t,e,n){"use strict";var i=n("23e7"),r=n("6f53").entries;i({target:"Object",stat:!0},{entries:function(t){return r(t)}})},"5d98":function(t,e,n){},"6f53":function(t,e,n){"use strict";var i=n("83ab"),r=n("d039"),a=n("e330"),o=n("e163"),c=n("df75"),u=n("fc6a"),f=n("d1e7").f,s=a(f),l=a([].push),g=i&&r((function(){var t=Object.create(null);return t[2]=2,!s(t,2)})),d=function(t){return function(e){var n,r=u(e),a=c(r),f=g&&null===o(r),d=a.length,h=0,p=[];while(d>h)n=a[h++],i&&!(f?n in r:s(r,n))||l(p,t?[n,r[n]]:r[n]);return p}};t.exports={entries:d(!0),values:d(!1)}},"9fad":function(t,e,n){},b49b:function(t,e,n){"use strict";n.d(e,"g",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"i",(function(){return a})),n.d(e,"e",(function(){return c})),n.d(e,"a",(function(){return u})),n.d(e,"k",(function(){return f})),n.d(e,"h",(function(){return s})),n.d(e,"j",(function(){return l})),n.d(e,"d",(function(){return g})),n.d(e,"f",(function(){return d})),n.d(e,"b",(function(){return h}));var i=n("41cb");function r(t){return Object(i["$cms"])().post("/api/cms/post/emotion",t)}function a(t,e){return Object(i["$cms"])().put("/api/cms/post/emotion/".concat(t),e)}function o(t){return Object(i["$cms"])().get("/api/cms/post/emotion/".concat(t))}function c(t){return Object(i["$cms"])().get("/api/cms/post/emotions/my",{params:t})}function u(t){return Object(i["$cms"])().delete("/api/cms/post/emotion/".concat(t))}function f(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"emotions";return Object(i["$next"])().post("/api/".concat(e,"/upload"),t)}function s(t){return Object(i["$next"])().post("/api/joke/share",t)}function l(t){return Object(i["$next"])().put("/api/joke/share/".concat(t.id),t)}function g(t){return Object(i["$cms"])().get("/api/cms/post/joke/".concat(t))}function d(t){return Object(i["$cms"])().get("/api/cms/post/jokes/my",{params:t})}function h(t){return Object(i["$cms"])().delete("/api/cms/post/joke/".concat(t))}},b800:function(t,e,n){"use strict";n("5d98")},ba82:function(t,e,n){"use strict";n("b0c0");var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-publish-header"},[e("el-page-header",{attrs:{content:t.name},on:{back:t.goBack}}),t._t("default")],2)},r=[],a=(n("14d9"),{name:"publish_header",props:["name"],data:function(){return{}},computed:{},methods:{goBack:function(){window.history.length?this.$router.go(-1):this.$router.push("/")}},mounted:function(){},components:{}}),o=a,c=(n("b800"),n("2877")),u=Object(c["a"])(o,i,r,!1,null,null,null);e["a"]=u.exports},c8d2:function(t,e,n){"use strict";var i=n("5e77").PROPER,r=n("d039"),a=n("5899"),o="​᠎";t.exports=function(t){return r((function(){return!!a[t]()||o[t]()!==o||i&&a[t].name!==t}))}}}]);