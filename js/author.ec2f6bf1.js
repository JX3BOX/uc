(function(e){function n(n){for(var r,c,a=n[0],i=n[1],d=n[2],l=0,f=[];l<a.length;l++)c=a[l],Object.prototype.hasOwnProperty.call(u,c)&&u[c]&&f.push(u[c][0]),u[c]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);s&&s(n);while(f.length)f.shift()();return o.push.apply(o,d||[]),t()}function t(){for(var e,n=0;n<o.length;n++){for(var t=o[n],r=!0,c=1;c<t.length;c++){var a=t[c];0!==u[a]&&(r=!1)}r&&(o.splice(n--,1),e=i(i.s=t[0]))}return e}var r={},c={author:0},u={author:0},o=[];function a(e){return i.p+"js/"+({}[e]||e)+"."+{"chunk-116d53f1":"dceca370","chunk-43f669ce":"bcc27431","chunk-4748c33c":"3756a043","chunk-4854ed53":"890eb004","chunk-c913ad90":"70734340","chunk-cf269fc4":"1bb401d2","chunk-68030208":"3cee31b8"}[e]+".js"}function i(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.e=function(e){var n=[],t={"chunk-43f669ce":1,"chunk-4854ed53":1,"chunk-c913ad90":1,"chunk-cf269fc4":1,"chunk-68030208":1};c[e]?n.push(c[e]):0!==c[e]&&t[e]&&n.push(c[e]=new Promise((function(n,t){for(var r="css/"+({}[e]||e)+"."+{"chunk-116d53f1":"31d6cfe0","chunk-43f669ce":"d9b0a915","chunk-4748c33c":"31d6cfe0","chunk-4854ed53":"ab7e0eb0","chunk-c913ad90":"e44c8dd6","chunk-cf269fc4":"9c7e7463","chunk-68030208":"82d61d5f"}[e]+".css",u=i.p+r,o=document.getElementsByTagName("link"),a=0;a<o.length;a++){var d=o[a],l=d.getAttribute("data-href")||d.getAttribute("href");if("stylesheet"===d.rel&&(l===r||l===u))return n()}var f=document.getElementsByTagName("style");for(a=0;a<f.length;a++){d=f[a],l=d.getAttribute("data-href");if(l===r||l===u)return n()}var s=document.createElement("link");s.rel="stylesheet",s.type="text/css",s.onload=n,s.onerror=function(n){var r=n&&n.target&&n.target.src||u,o=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=r,delete c[e],s.parentNode.removeChild(s),t(o)},s.href=u;var h=document.getElementsByTagName("head")[0];h.appendChild(s)})).then((function(){c[e]=0})));var r=u[e];if(0!==r)if(r)n.push(r[2]);else{var o=new Promise((function(n,t){r=u[e]=[n,t]}));n.push(r[2]=o);var d,l=document.createElement("script");l.charset="utf-8",l.timeout=120,i.nc&&l.setAttribute("nonce",i.nc),l.src=a(e);var f=new Error;d=function(n){l.onerror=l.onload=null,clearTimeout(s);var t=u[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),c=n&&n.target&&n.target.src;f.message="Loading chunk "+e+" failed.\n("+r+": "+c+")",f.name="ChunkLoadError",f.type=r,f.request=c,t[1](f)}u[e]=void 0}};var s=setTimeout((function(){d({type:"timeout",target:l})}),12e4);l.onerror=l.onload=d,document.head.appendChild(l)}return Promise.all(n)},i.m=e,i.c=r,i.d=function(e,n,t){i.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,n){if(1&n&&(e=i(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)i.d(t,r,function(n){return e[n]}.bind(null,r));return t},i.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="https://cdn.jx3box.com/static/uc/",i.oe=function(e){throw console.error(e),e};var d=window["webpackJsonp"]=window["webpackJsonp"]||[],l=d.push.bind(d);d.push=n,d=d.slice();for(var f=0;f<d.length;f++)n(d[f]);var s=l;o.push([2,"chunk-vendors"]),t()})({2:function(e,n,t){e.exports=t("2430")},2430:function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d");var r=t("2b0e"),c=t("5c96"),u=t.n(c),o=t("4eb5"),a=t.n(o),i=t("6a69"),d=(t("6b30"),t("c5b4"),t("16e5")),l=(t("d3b7"),t("3ca3"),t("ddb0"),t("8c4f"));r["default"].use(l["a"]);var f=[{path:"/:id(\\d+)",name:"index",component:function(){return Promise.all([t.e("chunk-116d53f1"),t.e("chunk-c913ad90")]).then(t.bind(null,"5198"))}},{path:"/birthday",name:"birthday",component:function(){return Promise.all([t.e("chunk-116d53f1"),t.e("chunk-4748c33c")]).then(t.bind(null,"316b"))}},{path:"/:uid(\\d+)/certificate/:id(\\d+)",name:"certificate",component:function(){return Promise.all([t.e("chunk-116d53f1"),t.e("chunk-4854ed53")]).then(t.bind(null,"c3f6"))}},{path:"/:uid(\\d+)/groupCertificate/:id(\\d+)",name:"groupCertificate",component:function(){return Promise.all([t.e("chunk-116d53f1"),t.e("chunk-cf269fc4")]).then(t.bind(null,"8559"))}},{path:"/:uid(\\d+)/holiday-card/:event_id(\\d+)",name:"holidayCard",component:function(){return t.e("chunk-68030208").then(t.bind(null,"d076"))}},{path:"/:uid(\\d+)/birthday-card/:skin(\\w+)?",name:"birthdayCard",component:function(){return Promise.all([t.e("chunk-116d53f1"),t.e("chunk-43f669ce")]).then(t.bind(null,"9f25"))}}],s=new l["a"]({routes:f,mode:"history",base:"/author"}),h=s,p=(t("caad"),t("2532"),t("2f62"));r["default"].use(p["a"]);var m={state:{userdata:"",client:location.href.includes("origin")?"origin":"std"},mutations:{},getters:{},actions:{},modules:{},decoration_me:null},b=new p["a"].Store(m),k=function(){var e=this,n=e._self._c;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},v=[],g={name:"App",components:{},props:[],data:function(){return{}},computed:{},created:function(){},methods:{}},y=g,w=t("2877"),P=Object(w["a"])(y,k,v,!1,null,null,null),j=P.exports;r["default"].config.productionTip=!1,r["default"].use(u.a),r["default"].use(a.a),r["default"].use(i["a"]),d["a"].install(r["default"]),new r["default"]({router:h,store:b,render:function(e){return e(j)}}).$mount("#app")}});