(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{"9r0N":function(e,a,t){"use strict";t("+L6B");var l=t("2/Rp"),n=(t("OaEy"),t("2fM7")),r=(t("y8nQ"),t("Vl3Y")),s=(t("5NDa"),t("5rEg")),o=(t("/xke"),t("TeRw")),u=t("ODXe"),c=t("q1tI"),i=t.n(c),d=t("n+Aq"),m=t("cHh2"),p=t("FfOG"),v=t("gLBg"),b=t("Hx5s");a["a"]=e=>{var a=Object(c["useState"])(),t=Object(u["a"])(a,2),E=t[0],O=t[1],g=Object(c["useState"])(),h=Object(u["a"])(g,2),w=h[0],y=h[1],I=Object(c["useState"])(),f=Object(u["a"])(I,2),j=f[0],S=f[1];Object(c["useEffect"])(()=>{var a;(null===e||void 0===e?void 0:e.user)&&(null===e||void 0===e||null===(a=e.user)||void 0===a?void 0:a.id)?(O(null===e||void 0===e?void 0:e.user),y("".concat(v["b"].apiRoutes.userUpdate)),S("put")):(y("".concat(v["b"].apiRoutes.userSave)),S("post"))});var q=Object(d["a"])(e=>({url:w,method:j,headers:{access_token:localStorage.getItem(m["a"].ACCESS_TOKEN)},data:e}),{manual:!0,onSuccess:(a,t)=>{var l;a&&(p["b"].replace(v["b"].pageRoutes.userIndex),o["a"].success({message:"\u7528\u6237\uff1a".concat(null===(l=t[0])||void 0===l?void 0:l.username),description:e.edit?"\u4fee\u6539\u64cd\u4f5c\u6210\u529f":"\u6dfb\u52a0\u6210\u529f"}))}}),R=q.run,T=q.loading;return!(null===E||void 0===E?void 0:E.id)&&e.edit?i.a.createElement(b["c"],null):i.a.createElement(r["a"],{labelCol:{span:4},wrapperCol:{span:16},layout:"horizontal",initialValues:E,onFinish:e=>{console.log("form submit payload",e),R(e)}},(null===E||void 0===E?void 0:E.id)?i.a.createElement(r["a"].Item,{name:"id",rules:[{required:!0,message:"\u7f16\u8f91\u9519\u8bef\uff0cid\u4e0d\u5b58\u5728!"}]},i.a.createElement(s["a"],{placeholder:"id",type:"hidden"})):"",i.a.createElement(r["a"].Item,{name:"username",label:"\u7528\u6237\u540d",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7528\u6237\u540d!"}]},i.a.createElement(s["a"],{placeholder:"username"})),i.a.createElement(r["a"].Item,{name:"password",label:"\u5bc6\u7801",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801!"}]},i.a.createElement(s["a"].Password,{placeholder:"password"})),i.a.createElement(r["a"].Item,{name:"roleType",label:"\u7c7b\u578b",rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u7c7b\u578b!"}]},i.a.createElement(n["a"],{disabled:0===(null===E||void 0===E?void 0:E.roleType)},i.a.createElement(n["a"].Option,{value:0,disabled:!0},"\u8d85\u7ea7\u7ba1\u7406\u5458"),i.a.createElement(n["a"].Option,{value:1},"\u7ba1\u7406\u5458"),i.a.createElement(n["a"].Option,{value:2},"\u666e\u901a\u6210\u5458"))),i.a.createElement(r["a"].Item,{label:" ",colon:!1},i.a.createElement(l["a"],{type:"primary",htmlType:"submit",loading:T},"\u63d0\u4ea4")))}},BzJn:function(e,a,t){"use strict";t.r(a);var l=t("q1tI"),n=t.n(l),r=t("Hx5s"),s=t("9r0N");a["default"]=()=>n.a.createElement(r["b"],null,n.a.createElement(s["a"],null))}}]);