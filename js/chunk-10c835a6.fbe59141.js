(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-10c835a6"],{"1fc5":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("Header"),t.isLogin?e("div",{staticClass:"m-vip-container"},[e("div",{staticClass:"m-vip-rename"},[e("simple-header",{staticClass:"m-vip-rename-title",attrs:{title:"修改您的昵称",desc:"Rename your nickname"}}),e("div",{staticClass:"u-tip"},[t.had_renamed?e("div",[t._v(" 当前剩余可改名次数 "),e("b",[t._v(t._s(t.count))])]):e("div",[e("i",{staticClass:"el-icon-s-opportunity"}),t._v(" 每个账号拥有一次免费更名机会")])]),t.done?e("result",[e("div",{staticClass:"m-rename-result-title",attrs:{slot:"title"},slot:"title"},[t._v(" 修改成功，新昵称"),e("b",[t._v(t._s(t.new_name||"未知"))])]),e("div",{staticClass:"m-rename-result-desc",attrs:{slot:"desc"},slot:"desc"},[e("i",{staticClass:"el-icon-info"}),t._v(" 修改昵称后部分应用需要自行重新更新作品方可生效，"),e("a",{attrs:{href:"/account/login"}},[t._v("重新登录")])])]):e("el-form",{ref:"form",staticClass:"m-vip-rename-form",class:{isNormal:t.count},attrs:{"label-width":"80px","label-position":"left"}},[e("el-form-item",{staticClass:"u-old-name",attrs:{label:"当前昵称"}},[e("b",[t._v(t._s(t.old_name))])]),e("el-form-item",{staticClass:"u-new-name",attrs:{label:"新昵称"}},[e("el-input",{attrs:{placeholder:"2-20个字符,不允许特殊字符","show-word-limit":"",maxlength:20,minlength:2,disabled:!t.count},on:{input:t.checkName},model:{value:t.new_name,callback:function(e){t.new_name=e},expression:"new_name"}},[e("i",{staticClass:"u-status",class:t.checkicon,attrs:{slot:"append"},slot:"append"})]),t.isEmpty?t._e():e("el-alert",{attrs:{title:t.checktips,type:t.status?"success":"error","show-icon":""}})],1),e("el-form-item",{staticClass:"u-btns",attrs:{label:""}},[t.count?e("el-button",{staticClass:"u-submit u-submit-rename",attrs:{type:"primary",icon:"el-icon-check",disabled:!t.status},on:{click:t.submit}},[t._v("提交")]):e("el-button",{staticClass:"u-submit u-submit-buy",attrs:{type:"primary",icon:"el-icon-shopping-cart-2"},on:{click:t.buy}},[t._v("购买改名次数")])],1)],1)],1)]):e("div",{staticClass:"m-vip-container"},[e("el-alert",{attrs:{title:"请先登录",type:"error","show-icon":""}})],1),t.will?e("paypop",{attrs:{productDesc:t.productDesc,productId:t.productId,returnUrl:t.returnUrl},on:{done:t.finish},model:{value:t.dialog_visible,callback:function(e){t.dialog_visible=e},expression:"dialog_visible"}}):t._e(),e("Footer")],1)},n=[],a=(s("b0c0"),s("d3b7"),s("c9d2")),r=s("bd13"),l=s("41cb");function o(t){return Object(l["$pay"])({mute:!0}).get("/api/vip/i/rename/check",{params:{name:t}})}function c(t){return Object(l["$pay"])().put("/api/vip/i/rename","",{params:{name:t}})}var u=s("eb3c"),m=s("65c2"),h=s("7eaf"),d=s("b98a"),p=s("0db9"),b={data:function(){return{isLogin:a["a"].isLogin(),asset:"",old_name:a["a"].getInfo().name,new_name:"",available:null,valid:null,count:1,done:!1,pay_success:!1,refer:"",dialog_visible:!1,will:!1,productId:"4",productDesc:"购买改名卡",returnUrl:Object(d["a"])("rename"),checktips:""}},computed:{isEmpty:function(){return""==this.new_name},status:function(){return this.available&&this.valid},checkicon:function(){return this.isEmpty?"el-icon-remove":this.status?"el-icon-success":"el-icon-error"},had_renamed:function(){return this.asset&&~~this.asset.had_renamed||!1}},methods:{checkName:function(){var t=this;if(this.isEmpty)return this.valid=null,this.available=null,!1;if(this.new_name.length<2||this.new_name.length>20)return this.valid=!1,!1;if("账号已注销"==this.new_name)return this.valid=!1,!1;this.new_name=Object(r["a"])(this.new_name).kill(),this.new_name=Object(r["a"])(this.new_name).removeSpace(),this.valid=!0;var e="";o(this.new_name).then((function(e){t.available=e.data.data})).catch((function(s){t.available=!1,e=s.data.msg})).finally((function(){t.valid?t.available?t.checktips="昵称可以使用":t.checktips=e||"昵称已被使用":t.checktips="昵称格式不正确，长度2-20字符，禁止使用所有特殊符号"}))},checkPermission:function(){var t=this;a["a"].getAsset().then((function(e){t.asset=e,t.count=~~e.rename_card_count}))},submit:function(){var t=this;c(this.new_name).then((function(){a["a"].destroy().then((function(e){t.done=!0,setTimeout((function(){location.href=m["__Root"]+"account/login"}),2e3)}))}))},buy:function(){this.will=!0,this.dialog_visible=!0},finish:function(){location.reload()}},mounted:function(){this.checkPermission()},components:{result:u["a"],paypop:h["a"],"simple-header":p["a"]}},_=b,v=(s("ed5b"),s("2877")),f=Object(v["a"])(_,i,n,!1,null,null,null);e["default"]=f.exports},b50e:function(t,e,s){},bd13:function(t,e,s){"use strict";function i(t){var e=Object.prototype.toString.call(t);return e.match(/\[object (.*?)\]/)[1].toLowerCase()}s.d(e,"a",(function(){return r}));var n=i;class a{constructor(t){if("string"!==n(t))throw new Error("[Sterilizer::init] params should be string");this._symbols={"`":"`","~":"~","!":"!","@":"@","#":"#",$:"\\$","%":"%","^":"\\^","&":"&","*":"\\*","-":"\\-",_:"_","=":"=","+":"+","(":"\\(",")":"\\)","[":"\\[","]":"\\]","{":"\\{","}":"\\}","|":"\\|","\\":"\\\\","/":"/","?":"\\?",":":":",";":";","'":"'",'"':'"',">":">","<":"<",",":",",".":"\\."},this.symbols=Object.keys(this._symbols),this.regs=Object.values(this._symbols),this.str=t,this._str=t}toString(){return this._str}_detected(t){let e=n(t),s=["string","array","set"];if(!s.includes(e))throw new Error("[Sterilizer::remove] params should be string|array|set");return t}_sterilize(t){t=[...t].join("");let e=new RegExp(`[${t}]`,"gm");return this._str=this._str.replace(e,""),this}kill(t){let e=null;if(void 0==t)e=new Set(this.regs);else{this._detected(t),e=new Set;let s=new Set(t);for(let t of s)this.symbols.includes(t)&&e.add(this._symbols[t])}return this._sterilize(e)}live(t){this._detected(t);let e=new Set(this.regs);for(let s of t)this.symbols.includes(s)&&e.delete(this._symbols[s]);return this._sterilize(e)}safe(){return this.kill(["&","<",">",'"',"'","+",":","/","?","=","#","%"])}removeHSC(){return this.kill(["&","<",">",'"',"'"])}removeURL(){return this.kill(["+",":","/","?","=","&","#","%"])}removeSpace(){return this._str=this._str.replace(/\s/gm,""),this}remove(t,e){let s=new RegExp(""+t,"gm");return e=void 0!==e?e:"",this._str=this._str.replace(s,e),this}removeHTMLtag(){return this._str=this._str.replace(/<[^>]+>/gm,""),this}isDirty(t){return t?this.str.includes(t):this.symbols.some(t=>this.str.includes(t))}}function r(t){return new a(t)}},ed5b:function(t,e,s){"use strict";s("b50e")}}]);