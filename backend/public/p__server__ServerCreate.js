(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[16],{RNcJ:function(e,a,t){"use strict";t.r(a);var l=t("q1tI"),n=t.n(l),r=t("Hx5s"),s=t("eB3v");a["default"]=()=>n.a.createElement(r["b"],null,n.a.createElement(s["a"],null))},eB3v:function(e,a,t){"use strict";t("+L6B");var l=t("2/Rp"),n=(t("OaEy"),t("2fM7")),r=(t("y8nQ"),t("Vl3Y")),s=(t("5NDa"),t("5rEg")),o=(t("/xke"),t("TeRw")),i=t("ODXe"),c=t("q1tI"),d=t.n(c),m=t("n+Aq"),u=t("FfOG"),p=t("gLBg"),v=t("Hx5s"),b=t("cHh2");a["a"]=e=>{var a,t,h=Object(c["useState"])(),E=Object(i["a"])(h,2),g=E[0],I=E[1],O=Object(c["useState"])(),f=Object(i["a"])(O,2),j=f[0],q=f[1],y=Object(c["useState"])(),w=Object(i["a"])(y,2),R=w[0],S=w[1];Object(c["useEffect"])(()=>{var a;(null===e||void 0===e?void 0:e.info)&&(null===e||void 0===e||null===(a=e.info)||void 0===a?void 0:a.id)?(I(null===e||void 0===e?void 0:e.info),q("".concat(p["b"].apiRoutes.serverUpdate.url)),S(p["a"].put)):(q("".concat(p["b"].apiRoutes.serverSave.url)),S(p["a"].post))});var k=Object(m["a"])(e=>({url:j,method:R,data:e}),{manual:!0,onSuccess:(a,t)=>{var l;1===a.code?(o["a"].success({message:"\u670d\u52a1\u5668\uff1a".concat(null===(l=t[0])||void 0===l?void 0:l.name),description:e.edit?"\u4fee\u6539\u64cd\u4f5c\u6210\u529f":"\u6dfb\u52a0\u6210\u529f"}),u["b"].replace(p["b"].pageRoutes.serverIndex)):o["a"].error({message:"\u8bf7\u6c42\u9519\u8bef ".concat(a.code,": ").concat(j),description:a.desc})}}),x=k.run,B=k.loading,L=Object(m["a"])(()=>({url:"".concat(p["b"].apiRoutes.envList.url),method:p["b"].apiRoutes.envList.method,headers:{access_token:localStorage.getItem(b["a"])}}),{manual:!1});return!(null===g||void 0===g?void 0:g.id)&&e.edit?d.a.createElement(v["c"],null):d.a.createElement(r["a"],{labelCol:{span:4},wrapperCol:{span:16},layout:"horizontal",initialValues:g,onFinish:e=>{console.log("form submit payload",e),x(e)}},(null===g||void 0===g?void 0:g.id)?d.a.createElement(r["a"].Item,{name:"id",rules:[{required:!0,message:"\u7f16\u8f91\u9519\u8bef\uff0cid\u4e0d\u5b58\u5728!"}]},d.a.createElement(s["a"],{placeholder:"id",type:"hidden"})):"",d.a.createElement(r["a"].Item,{name:"name",label:"\u670d\u52a1\u5668\u540d\u79f0",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u670d\u52a1\u5668\u540d\u79f0!"}]},d.a.createElement(s["a"],{placeholder:"name"})),d.a.createElement(r["a"].Item,{name:"intranetIp",label:"\u5185\u7f51ip",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5185\u7f51ip!"}]},d.a.createElement(s["a"],{placeholder:"intranetIp"})),d.a.createElement(r["a"].Item,{name:"ip",label:"\u5916\u7f51ip",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5916\u7f51ip!"}]},d.a.createElement(s["a"],{placeholder:"ip"})),d.a.createElement(r["a"].Item,{name:"sshUsername",label:"ssh\u7528\u6237\u540d",rules:[{required:!0,message:"\u8bf7\u8f93\u5165ssh\u7528\u6237\u540d!"}]},d.a.createElement(s["a"],{placeholder:"sshUsername"})),d.a.createElement(r["a"].Item,{name:"sshPort",label:"ssh\u7aef\u53e3",rules:[{required:!0,message:"\u8bf7\u8f93\u5165ssh\u7aef\u53e3!"}]},d.a.createElement(s["a"],{placeholder:"sshPort"})),d.a.createElement(r["a"].Item,{name:"envId",label:"\u73af\u5883"},d.a.createElement(n["a"],null,null===L||void 0===L||null===(a=L.data)||void 0===a||null===(t=a.result)||void 0===t?void 0:t.map(e=>d.a.createElement(n["a"].Option,{value:e.id,key:e.id},null===e||void 0===e?void 0:e.name)))),d.a.createElement(r["a"].Item,{label:" ",colon:!1},d.a.createElement(l["a"],{type:"primary",htmlType:"submit",loading:B},"\u63d0\u4ea4")))}}}]);