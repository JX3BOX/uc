(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-54d40fb0"],{"0803":function(t,a,e){"use strict";e.d(a,"e",(function(){return s})),e.d(a,"i",(function(){return r})),e.d(a,"f",(function(){return o})),e.d(a,"g",(function(){return i})),e.d(a,"a",(function(){return c})),e.d(a,"k",(function(){return u})),e.d(a,"c",(function(){return l})),e.d(a,"b",(function(){return f})),e.d(a,"h",(function(){return d})),e.d(a,"j",(function(){return m})),e.d(a,"d",(function(){return p})),e.d(a,"l",(function(){return h}));e("99af");var n=e("41cb");function s(t){return Object(n["$team"])().get("/api/team/my-game-roles",{params:t})}function r(t){return Object(n["$team"])().get("/api/team/role-unbind/"+t)}function o(){return Object(n["$team"])().get("/api/team/role-bind-token")}function i(t,a){return Object(n["$team"])().put("/api/team/role-update-note/".concat(t),{note:a})}function c(t){return Object(n["$team"])().post("/api/team/custom-role",t)}function u(t,a){return Object(n["$team"])().put("/api/team/custom-role/".concat(t),a)}function l(t){return Object(n["$team"])().get("/api/team/custom-role/".concat(t))}function f(t){return Object(n["$team"])().delete("/api/team/custom-role/".concat(t))}function d(t){return Object(n["$team"])().put("/api/team/role-priority/".concat(t,"/top"))}function m(t){return Object(n["$team"])().put("/api/team/role-priority/".concat(t,"/untop"))}function p(t){return Object(n["$team"])().get("/api/team/relation/role/".concat(t,"/teams"))}function h(t,a){return Object(n["$team"])().put("/api/team/my-game-roles/".concat(t,"/change-visible/").concat(a))}},1619:function(t,a,e){"use strict";e.d(a,"d",(function(){return c})),e.d(a,"e",(function(){return u})),e.d(a,"f",(function(){return l}));var n=e("fb5f"),s=e("33a5"),r=e("65c2"),o=e("e4f1");e.d(a,"g",(function(){return o["c"]}));var i=e("85e4");function c(t){var a;return(null===(a=n["bodyMap"][t])||void 0===a?void 0:a.label)||"未知"}function u(t){var a=t||0;return r["__imgPath"]+"image/school/"+a+".png"}function l(t){var a=t||0;return a&&s[a]||"未知"}e.d(a,"b",(function(){return i["getThumbnail"]})),e.d(a,"a",(function(){return i["authorLink"]})),e.d(a,"c",(function(){return i["showAvatar"]}))},"33a5":function(t){t.exports=JSON.parse('{"0":"江湖","1":"天策","2":"万花","3":"纯阳","4":"七秀","5":"少林","6":"藏剑","7":"丐帮","8":"明教","9":"五毒","10":"唐门","18":"苍云","19":"长歌","20":"霸刀","21":"蓬莱","22":"凌雪","23":"衍天","24":"药宗","26":"刀宗","29":"万灵","38":"段氏"}')},"724d":function(t,a,e){"use strict";e.r(a);e("b0c0");var n=function(){var t=this,a=t._self._c;return a("div",{staticClass:"v-role-view"},[a("h2",{staticClass:"u-title"},[a("i",{staticClass:"el-icon-user"}),t._v(" 角色信息 "),a("el-button",{staticClass:"u-back",attrs:{slot:"reference",size:"mini",plain:"",icon:"el-icon-arrow-left"},on:{click:t.goBack},slot:"reference"},[t._v("返回")])],1),t.data?a("div",{staticClass:"m-role-detail"},[a("div",{staticClass:"m-role-info"},[a("RoleAvatar",{staticClass:"u-avatar",attrs:{mount:t.data.mount,body_type:t.data.body_type}}),a("div",{staticClass:"u-meta u-name"},[~~t.data.custom?t._e():a("svg",{class:"u-verify",attrs:{height:"512",viewBox:"0 0 511.375 511.375",width:"512",xmlns:"http://www.w3.org/2000/svg","svg-inline":"",role:"presentation",focusable:"false",tabindex:"-1"}},[a("path",{attrs:{d:"M511.375 255.688l-57.89-64.273 9.064-86.046-84.651-17.92-43.18-75.012-79.03 35.321-10.667 207.93 10.667 207.929 79.031 35.321 43.179-75.011 84.651-17.921-9.064-86.046z",fill:"#0ed678"}}),a("path",{attrs:{d:"M176.656 12.437l-43.179 75.012-84.651 17.921 9.064 86.045L0 255.688l57.89 64.272-9.064 86.046 84.651 17.921 43.18 75.011 79.031-35.321V47.758z",fill:"#04eb84"}}),a("g",[a("path",{attrs:{d:"M362.878 199.702l-22.381-19.977-84.809 95.016-10.667 23.613 10.667 21.439z",fill:"#f7f0eb"}}),a("path",{attrs:{d:"M166.56 233.095l-21.212 21.213 89.185 89.186 21.155-23.701v-45.052l-22.393 25.088z",fill:"#fffbf5"}})])]),t._v(" "+t._s(t.data.name)+" ")]),a("div",{staticClass:"u-meta"},[a("span",{staticClass:"u-author"},[a("img",{staticClass:"u-author-avatar",attrs:{width:"24",height:"24",src:t._f("showAvatar")(t.data.user_avatar),alt:""}}),a("a",{staticClass:"u-author-name",attrs:{href:t._f("authorLink")(t.data.uid),target:"_blank"}},[t._v(" "+t._s(t.data.display_name)+" ")])]),a("span",{staticClass:"u-server"},[a("em",[t._v("服务器")]),t._v(" "+t._s(t.data.server)+" ")]),a("span",{staticClass:"u-school"},[a("em",[t._v("门 派")]),t._v(" "+t._s(t._f("showSchoolName")(t.data.mount))+" "),a("img",{staticClass:"u-icon",attrs:{src:t._f("showSchoolIcon")(t.data.mount)}})]),a("span",{staticClass:"u-body"},[a("em",[t._v("体 型")]),t._v(" "+t._s(t._f("showBodyType")(t.data.body_type))+" ")])])],1),t.hasRight?a("div",{staticClass:"m-role-belongs"},[a("el-divider",{attrs:{"content-position":"left"}},[a("i",{staticClass:"el-icon-collection-tag"}),t._v(" 加入团队 ")]),t.teams&&t.teams.length?[a("div",{staticClass:"u-teams"},t._l(t.teams,(function(n,s){return a("router-link",{key:s,staticClass:"u-team",attrs:{to:"/org/"+n.team_id}},[n.team_logo?a("img",{staticClass:"u-team-logo",attrs:{src:t._f("showTeamLogo")(n.team_logo)}}):a("img",{staticClass:"u-team-logo",attrs:{src:e("938c")}}),a("span",{staticClass:"u-team-name"},[t._v(t._s(n.team_name))])])})),1),t._m(0)]:[t._m(1)]],2):t._e()]):t._e(),t.warning_visible?a("div",{staticClass:"m-role-null m-team-limit"},[a("p",{staticClass:"u-title"},[a("svg",{class:"u-icon",attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512","svg-inline":"",role:"presentation",focusable:"false",tabindex:"-1"}},[a("linearGradient",{attrs:{id:"a",gradientUnits:"userSpaceOnUse",x1:"127.721",y1:"296.405",x2:"709.501",y2:"-285.375",gradientTransform:"matrix(1.0039 0 0 -1.0039 .192 516.558)"}},[a("stop",{attrs:{offset:"0","stop-color":"#ffb92d"}}),a("stop",{attrs:{offset:"1","stop-color":"#f59500"}})],1),a("path",{attrs:{d:"M437.29 511.903H74.707c-55.464 0-91.538-58.369-66.734-107.977L189.264 41.341c27.496-54.992 105.972-54.992 133.468 0l181.291 362.584c24.806 49.609-11.268 107.978-66.733 107.978z",fill:"url(#a)"}}),a("linearGradient",{attrs:{id:"b",gradientUnits:"userSpaceOnUse",x1:"204.952",y1:"219.176",x2:"380.322",y2:"43.816",gradientTransform:"matrix(1.0039 0 0 -1.0039 .192 516.558)"}},[a("stop",{attrs:{offset:"0","stop-color":"#ffb92d"}}),a("stop",{attrs:{offset:"1","stop-color":"#f59500"}})],1),a("path",{attrs:{d:"M437.29 511.903H74.707c-55.464 0-91.538-58.369-66.734-107.977L189.264 41.341c27.496-54.992 105.972-54.992 133.468 0l181.291 362.584c24.806 49.609-11.268 107.978-66.733 107.978z",fill:"url(#b)"}}),a("linearGradient",{attrs:{id:"c",gradientUnits:"userSpaceOnUse",x1:"19.855",y1:"259.541",x2:"489.762",y2:"259.541",gradientTransform:"matrix(1.0039 0 0 -1.0039 .192 516.558)"}},[a("stop",{attrs:{offset:"0","stop-color":"#fff465"}}),a("stop",{attrs:{offset:"1","stop-color":"#ffe600"}})],1),a("path",{attrs:{d:"M486.065 412.904L304.774 50.32c-9.438-18.876-27.672-30.145-48.775-30.145s-39.337 11.269-48.775 30.145L25.932 412.904c-8.514 17.028-7.622 36.863 2.387 53.057 10.009 16.195 27.351 25.864 46.388 25.864h362.584c19.037 0 36.379-9.669 46.388-25.864 10.008-16.194 10.901-36.028 2.386-53.057zM466.6 455.405c-6.324 10.232-17.28 16.341-29.308 16.341H74.707c-12.028 0-22.985-6.109-29.308-16.341-6.324-10.231-6.888-22.763-1.508-33.522L225.182 59.3c6.052-12.104 17.283-19.046 30.816-19.046s24.765 6.942 30.816 19.046l181.291 362.584c5.381 10.758 4.818 23.29-1.505 33.521z",fill:"url(#c)"}}),a("linearGradient",{attrs:{id:"d",gradientUnits:"userSpaceOnUse",x1:"421.327",y1:"104.45",x2:"137.237",y2:"388.54",gradientTransform:"matrix(1.0039 0 0 -1.0039 .192 516.558)"}},[a("stop",{attrs:{offset:"0","stop-color":"#be3f45","stop-opacity":"0"}}),a("stop",{attrs:{offset:"1","stop-color":"#be3f45"}})],1),a("path",{attrs:{d:"M437.286 511.899h-28.551L243.701 346.865c-4.879-2.389-7.329-6.515-7.329-12.408 0-22.267-.914-38.149-2.741-88.546-1.827-50.387-2.741-60.737-2.741-83.004 0-7.108 2.419-12.589 7.258-16.454 4.829-3.875 11.093-5.803 18.783-5.803s13.342 2.008 16.936 6.034c.693.763 151.14 151.16 203.072 203.072l27.086 54.171c24.808 49.604-11.272 107.972-66.739 107.972z",fill:"url(#d)"}}),a("linearGradient",{attrs:{id:"e",gradientUnits:"userSpaceOnUse",x1:"329.339",y1:"33.293",x2:"236.669",y2:"125.973",gradientTransform:"matrix(1.0039 0 0 -1.0039 .192 516.558)"}},[a("stop",{attrs:{offset:"0","stop-color":"#be3f45","stop-opacity":"0"}}),a("stop",{attrs:{offset:"1","stop-color":"#be3f45"}})],1),a("path",{attrs:{d:"M396.969 511.899h-74.671l-85.604-85.604c-5.692-5.02-8.543-10.872-8.543-17.569 0-6.977 2.851-12.91 8.543-17.789 5.692-4.879 12.609-7.319 20.741-7.319 7.158 0 13.352 2.44 18.572 7.319l120.962 120.962z",fill:"url(#e)"}}),a("path",{attrs:{d:"M228.154 408.722c0-6.977 2.846-12.903 8.537-17.781 5.692-4.88 12.61-7.326 20.741-7.326 7.161 0 13.351 2.446 18.571 7.326 5.221 4.878 7.84 10.804 7.84 17.781 0 6.696-2.617 12.553-7.84 17.573-5.22 5.022-11.411 7.532-18.571 7.532-8.132 0-15.049-2.511-20.741-7.532-5.691-5.02-8.537-10.876-8.537-17.573zm2.739-245.814c0-7.105 2.417-12.593 7.254-16.459 4.835-3.866 11.097-5.801 18.786-5.801s13.338 2.013 16.94 6.035c3.601 4.022 5.406 9.429 5.406 16.225 0 22.269-.386 32.613-1.141 83.008-.763 50.397-1.14 66.277-1.14 88.537 0 4.645-2.175 8.281-6.519 10.905-4.351 2.625-8.866 3.939-13.545 3.939-13.707 0-20.562-4.944-20.562-14.844 0-22.26-.914-38.14-2.739-88.537-1.828-50.396-2.74-60.74-2.74-83.008z",fill:"#fff"}})],1),t._v(" Not Found ")]),t._v("角色不存在或没有权限 ")]):t._e()])},s=[function(){var t=this,a=t._self._c;return a("div",{staticClass:"u-lock"},[a("i",{staticClass:"el-icon-lock"}),t._v("加入的团队仅自己可见 ")])},function(){var t=this,a=t._self._c;return a("div",{staticClass:"u-lock"},[a("i",{staticClass:"el-icon-warning-outline"}),t._v("当前角色没有加入任何团队 ")])}],r=(e("14d9"),e("c9d2")),o=e("0803"),i=function(){var t=this,a=t._self._c;return a("img",{attrs:{src:t.showAvatar(t.mount,t.body_type)}})},c=[],u=e("65c2"),l={name:"roleAvatar",props:["mount","body_type"],components:{},data:function(){return{}},computed:{},methods:{showAvatar:function(t,a){return u["__cdn"]+"design/avatar/xisai/"+t+"-"+a+".png"}},filters:{},created:function(){},mounted:function(){}},f=l,d=e("2877"),m=Object(d["a"])(f,i,c,!1,null,null,null),p=m.exports,h=e("1619"),v={name:"ViewRole",props:[],data:function(){return{data:"",warning_visible:!1,teams:[],isLogin:r["a"].isLogin()}},computed:{id:function(){return~~this.$route.params.id},hasRight:function(){return this.data.uid==r["a"].getInfo().uid||r["a"].isSuperAdmin()},isCustom:function(){return this.data&&this.data.custom},playerId:function(){return this.data.player_id},server:function(){return this.data.server}},methods:{delRole:function(){var t=this;this.$alert("确定删除该角色吗？","消息",{confirmButtonText:"确定",callback:function(a){"confirm"==a&&Object(o["b"])(t.id).then((function(a){t.$notify({title:"删除成功",message:"角色删除成功",type:"success"}),t.$router.push("/role")}))}})},loadData:function(){var t=this;Object(o["c"])(this.id).then((function(a){t.data=a.data.data,t.hasRight&&Object(o["d"])(t.id).then((function(a){t.teams=a.data.data}))}))},goBack:function(){this.$router.push("/role")}},filters:{showTeamLogo:function(t){return Object(h["b"])(t,256)},authorLink:h["a"],showAvatar:h["c"],showBodyType:h["d"],showSchoolIcon:h["e"],showSchoolName:h["f"]},mounted:function(){this.loadData()},components:{RoleAvatar:p}},b=v,g=(e("8a23"),Object(d["a"])(b,n,s,!1,null,null,null));a["default"]=g.exports},"8a23":function(t,a,e){"use strict";e("9644")},"938c":function(t,a,e){t.exports=e.p+"img/null.aec24a0e.png"},9644:function(t,a,e){},fb5f:function(t){t.exports=JSON.parse('{"bodyMap":{"1":{"label":"成男","value":"m2"},"2":{"label":"成女","value":"f2"},"5":{"label":"正太","value":"m1"},"6":{"label":"萝莉","value":"f1"}},"bodyFiles":{"LittleBoy":5,"LittleGirl":6,"StandardFemale":2,"StandardMale":1},"majorMap":{"1":"std","2":"origin"},"faceSubtype":{"0":"写意","1":"写实"}}')}}]);