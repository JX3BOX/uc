(function(t){function e(e){for(var r,c,i=e[0],s=e[1],u=e[2],f=0,d=[];f<i.length;f++)c=i[f],Object.prototype.hasOwnProperty.call(o,c)&&o[c]&&d.push(o[c][0]),o[c]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);l&&l(e);while(d.length)d.shift()();return a.push.apply(a,u||[]),n()}function n(){for(var t,e=0;e<a.length;e++){for(var n=a[e],r=!0,i=1;i<n.length;i++){var s=n[i];0!==o[s]&&(r=!1)}r&&(a.splice(e--,1),t=c(c.s=n[0]))}return t}var r={},o={login_callback:0},a=[];function c(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=r,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)c.d(n,r,function(e){return t[e]}.bind(null,r));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="https://cdn.jx3box.com/static/uc/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],s=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var l=s;a.push([8,"chunk-vendors","chunk-common"]),n()})({"0a02":function(t,e,n){"use strict";n("1f1c")},"1f1c":function(t,e,n){},"353e":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),o=n("5c96"),a=n.n(o),c=(n("6b30"),n("c5b4"),n("0af6")),i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"m-card",attrs:{id:"app"}},[e("el-card",{staticClass:"box-card"},[e("CardHeader"),1==t.success?e("main",{staticClass:"m-main"},[e("el-alert",{attrs:{title:"登录成功",type:"success",description:"欢迎回来(#^.^#)","show-icon":"",closable:!1}}),e("a",{staticClass:"u-skip el-button u-button el-button--primary",attrs:{href:t.redirect}},[t._v("即将跳转")])],1):t._e(),0==t.success?e("main",{staticClass:"m-main"},[e("el-alert",{attrs:{title:"登录失败",type:"error",description:"令牌不合法或已过期","show-icon":"",closable:!1}}),e("a",{staticClass:"u-skip el-button u-button el-button--primary",attrs:{href:t.login_url}},[t._v("返回登录")])],1):t._e()],1),e("Bottom")],1)},s=[],u=n("b85c"),l=(n("caad"),n("d3b7"),n("ac1f"),n("2532"),n("3ca3"),n("841c"),n("ddb0"),n("9861"),n("88a7"),n("271a"),n("5494"),n("c781")),f=n("c9d2"),d=n("65c2"),p=location.host.includes("origin")?"origin":"std",b={name:"Login_Callback",data:function(){return{success:null,redirect:"origin"==p?d["__OriginRoot"]:d["__Root"],login_url:d["__Links"].account.login}},methods:{},filters:{},mounted:function(){var t=this,e=new URLSearchParams(location.search),n={};if(e){var r,o=Object(u["a"])(e.entries());try{for(o.s();!(r=o.n()).done;){var a=r.value;n[a[0]]=a[1]}}catch(i){o.e(i)}finally{o.f()}var c=e.get("redirect");c&&(this.redirect=c)}f["a"].update(n).then((function(){t.success=!0,location.href=decodeURIComponent(t.redirect)}))},components:{CardHeader:l["a"]}},h=b,m=(n("0a02"),n("2877")),v=Object(m["a"])(h,i,s,!1,null,null,null),y=v.exports;r["default"].config.productionTip=!1,r["default"].use(a.a),r["default"].component("Bottom",c["a"]),new r["default"]({render:function(t){return t(y)}}).$mount("#app")},8:function(t,e,n){t.exports=n("353e")}});