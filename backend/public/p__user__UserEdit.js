(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[20],{"7H08":function(e,a,t){"use strict";t.r(a);var l=t("q1tI"),r=t.n(l),n=t("n+Aq"),o=t("Hx5s"),s=t("Ty5D"),c=t("gLBg"),u=t("cHh2"),i=t("9r0N");a["default"]=()=>{var e=Object(s["k"])(),a=Object(n["a"])(()=>({url:"".concat(c["b"].apiRoutes.userInfo,"?id=").concat(null===e||void 0===e?void 0:e.id),method:"get",headers:{access_token:localStorage.getItem(u["a"])}}),{manual:!1}),t=a.data;return r.a.createElement(o["b"],null,r.a.createElement(i["a"],{user:null===t||void 0===t?void 0:t.result,edit:!0}))}},"9r0N":function(e,a,t){"use strict";t("+L6B");var l=t("2/Rp"),r=(t("OaEy"),t("2fM7")),n=(t("y8nQ"),t("Vl3Y")),o=(t("5NDa"),t("5rEg")),s=(t("/xke"),t("TeRw")),c=t("ODXe"),u=t("q1tI"),i=t.n(u),d=t("n+Aq"),m=t("cHh2"),p=t("FfOG"),v=t("gLBg"),b=t("Hx5s");a["a"]=e=>{var a=Object(u["useState"])(),t=Object(c["a"])(a,2),E=t[0],g=t[1],O=Object(u["useState"])(),h=Object(c["a"])(O,2),w=h[0],y=h[1],I=Object(u["useState"])(),j=Object(c["a"])(I,2),f=j[0],q=j[1];Object(u["useEffect"])(()=>{var a;(null===e||void 0===e?void 0:e.user)&&(null===e||void 0===e||null===(a=e.user)||void 0===a?void 0:a.id)?(g(null===e||void 0===e?void 0:e.user),y("".concat(v["b"].apiRoutes.userUpdate)),q("put")):(y("".concat(v["b"].apiRoutes.userSave)),q("post"))});var S=Object(d["a"])(e=>({url:w,method:f,headers:{access_token:localStorage.getItem(m["a"])},data:e}),{manual:!0,onSuccess:(a,t)=>{var l;a&&(p["b"].replace(v["b"].pageRoutes.userIndex),s["a"].success({message:"\u7528\u6237\uff1a".concat(null===(l=t[0])||void 0===l?void 0:l.username),description:e.edit?"\u4fee\u6539\u64cd\u4f5c\u6210\u529f":"\u6dfb\u52a0\u6210\u529f"}))}}),k=S.run,R=S.loading;return!(null===E||void 0===E?void 0:E.id)&&e.edit?i.a.createElement(b["c"],null):i.a.createElement(n["a"],{labelCol:{span:4},wrapperCol:{span:16},layout:"horizontal",initialValues:E,onFinish:e=>{console.log("form submit payload",e),k(e)}},(null===E||void 0===E?void 0:E.id)?i.a.createElement(n["a"].Item,{name:"id",rules:[{required:!0,message:"\u7f16\u8f91\u9519\u8bef\uff0cid\u4e0d\u5b58\u5728!"}]},i.a.createElement(o["a"],{placeholder:"id",type:"hidden"})):"",i.a.createElement(n["a"].Item,{name:"username",label:"\u7528\u6237\u540d",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7528\u6237\u540d!"}]},i.a.createElement(o["a"],{placeholder:"username"})),i.a.createElement(n["a"].Item,{name:"password",label:"\u5bc6\u7801",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5bc6\u7801!"}]},i.a.createElement(o["a"].Password,{placeholder:"password"})),i.a.createElement(n["a"].Item,{name:"roleType",label:"\u7c7b\u578b",rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u7c7b\u578b!"}]},i.a.createElement(r["a"],{disabled:0===(null===E||void 0===E?void 0:E.roleType)},i.a.createElement(r["a"].Option,{value:0,disabled:!0},"\u8d85\u7ea7\u7ba1\u7406\u5458"),i.a.createElement(r["a"].Option,{value:1},"\u7ba1\u7406\u5458"),i.a.createElement(r["a"].Option,{value:2},"\u666e\u901a\u6210\u5458"))),i.a.createElement(n["a"].Item,{label:" ",colon:!1},i.a.createElement(l["a"],{type:"primary",htmlType:"submit",loading:R},"\u63d0\u4ea4")))}}}]);