(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{ay9I:function(e,a,t){"use strict";t.r(a);var l=t("q1tI"),n=t.n(l),r=t("n+Aq"),o=t("Hx5s"),s=t("Ty5D"),c=t("gLBg"),i=t("eB3v"),d=t("cHh2");a["default"]=()=>{var e=Object(s["k"])(),a=Object(r["a"])(()=>({url:"".concat(c["b"].apiRoutes.serverInfo.url,"?id=").concat(null===e||void 0===e?void 0:e.id),method:c["b"].apiRoutes.serverInfo.method,headers:{access_token:localStorage.getItem(d["a"])}}),{manual:!1}),t=a.data;return n.a.createElement(o["b"],null,n.a.createElement(i["a"],{info:null===t||void 0===t?void 0:t.result,edit:!0}))}},eB3v:function(e,a,t){"use strict";t("+L6B");var l=t("2/Rp"),n=(t("OaEy"),t("2fM7")),r=(t("y8nQ"),t("Vl3Y")),o=(t("5NDa"),t("5rEg")),s=(t("/xke"),t("TeRw")),c=t("ODXe"),i=t("q1tI"),d=t.n(i),u=t("n+Aq"),m=t("FfOG"),p=t("gLBg"),v=t("Hx5s"),b=t("cHh2");a["a"]=e=>{var a,t,h=Object(i["useState"])(),E=Object(c["a"])(h,2),g=E[0],I=E[1],O=Object(i["useState"])(),f=Object(c["a"])(O,2),j=f[0],y=f[1],q=Object(i["useState"])(),R=Object(c["a"])(q,2),k=R[0],w=R[1];Object(i["useEffect"])(()=>{var a;(null===e||void 0===e?void 0:e.info)&&(null===e||void 0===e||null===(a=e.info)||void 0===a?void 0:a.id)?(I(null===e||void 0===e?void 0:e.info),y("".concat(p["b"].apiRoutes.serverUpdate.url)),w(p["a"].put)):(y("".concat(p["b"].apiRoutes.serverSave.url)),w(p["a"].post))});var S=Object(u["a"])(e=>({url:j,method:k,headers:{access_token:localStorage.getItem(b["a"])},data:e}),{manual:!0,onSuccess:(a,t)=>{var l;1===a.code?(s["a"].success({message:"\u670d\u52a1\u5668\uff1a".concat(null===(l=t[0])||void 0===l?void 0:l.name),description:e.edit?"\u4fee\u6539\u64cd\u4f5c\u6210\u529f":"\u6dfb\u52a0\u6210\u529f"}),m["b"].replace(p["b"].pageRoutes.serverIndex)):s["a"].error({message:"\u8bf7\u6c42\u9519\u8bef ".concat(a.code,": ").concat(j),description:a.desc})}}),B=S.run,L=S.loading,x=Object(u["a"])(()=>({url:"".concat(p["b"].apiRoutes.envList.url),method:p["b"].apiRoutes.envList.method,headers:{access_token:localStorage.getItem(b["a"])}}),{manual:!1});return!(null===g||void 0===g?void 0:g.id)&&e.edit?d.a.createElement(v["c"],null):d.a.createElement(r["a"],{labelCol:{span:4},wrapperCol:{span:16},layout:"horizontal",initialValues:g,onFinish:e=>{console.log("form submit payload",e),B(e)}},(null===g||void 0===g?void 0:g.id)?d.a.createElement(r["a"].Item,{name:"id",rules:[{required:!0,message:"\u7f16\u8f91\u9519\u8bef\uff0cid\u4e0d\u5b58\u5728!"}]},d.a.createElement(o["a"],{placeholder:"id",type:"hidden"})):"",d.a.createElement(r["a"].Item,{name:"name",label:"\u670d\u52a1\u5668\u540d\u79f0",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u670d\u52a1\u5668\u540d\u79f0!"}]},d.a.createElement(o["a"],{placeholder:"name"})),d.a.createElement(r["a"].Item,{name:"intranetIp",label:"\u5185\u7f51ip",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5185\u7f51ip!"}]},d.a.createElement(o["a"],{placeholder:"intranetIp"})),d.a.createElement(r["a"].Item,{name:"ip",label:"\u5916\u7f51ip",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5916\u7f51ip!"}]},d.a.createElement(o["a"],{placeholder:"ip"})),d.a.createElement(r["a"].Item,{name:"sshUsername",label:"ssh\u7528\u6237\u540d",rules:[{required:!0,message:"\u8bf7\u8f93\u5165ssh\u7528\u6237\u540d!"}]},d.a.createElement(o["a"],{placeholder:"sshUsername"})),d.a.createElement(r["a"].Item,{name:"sshPort",label:"ssh\u7aef\u53e3",rules:[{required:!0,message:"\u8bf7\u8f93\u5165ssh\u7aef\u53e3!"}]},d.a.createElement(o["a"],{placeholder:"sshPort"})),d.a.createElement(r["a"].Item,{name:"envId",label:"\u73af\u5883"},d.a.createElement(n["a"],null,null===x||void 0===x||null===(a=x.data)||void 0===a||null===(t=a.result)||void 0===t?void 0:t.map(e=>d.a.createElement(n["a"].Option,{value:e.id,key:e.id},null===e||void 0===e?void 0:e.name)))),d.a.createElement(r["a"].Item,{label:" ",colon:!1},d.a.createElement(l["a"],{type:"primary",htmlType:"submit",loading:L},"\u63d0\u4ea4")))}}}]);