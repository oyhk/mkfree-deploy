(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{"14J3":function(e,t,n){"use strict";n("cIOH"),n("1GLa")},"9jjd":function(e,t,n){"use strict";var a=n("q1tI"),l={name:"file",theme:"outlined",icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"}}]}},o=l,i=n("6VBw"),r=function(e,t){return a["createElement"](i["a"],Object.assign({},e,{ref:t,icon:o}))};r.displayName="FileOutlined";t["a"]=a["forwardRef"](r)},BMrR:function(e,t,n){"use strict";var a=n("qrJ5");t["a"]=a["a"]},jCWc:function(e,t,n){"use strict";n("cIOH"),n("1GLa")},kPKH:function(e,t,n){"use strict";var a=n("/kpp");t["a"]=a["a"]},owxF:function(e,t,n){"use strict";n.r(t);n("jCWc");var a=n("kPKH"),l=(n("14J3"),n("BMrR")),o=(n("OaEy"),n("2fM7")),i=(n("lUTK"),n("BvKs")),r=(n("B9cy"),n("Ol7k")),c=n("q1tI"),d=n.n(c),v=n("55Ip"),u=n("Ty5D"),s=n("9kvl"),p=n("ye1Q"),m=n("9jjd"),g=n("gLBg"),E=n("Hx5s"),f=r["a"].Sider,j=r["a"].Content,L=r["a"].Header,y=e=>{var t,n,c,y,h,I,b,x,w,k,O,S,q,H,B,M,R=e.projectEnvLog,V=null===(t=e.projectEnvLog)||void 0===t||null===(n=t.historyLogList)||void 0===n?void 0:n.map(e=>d.a.createElement(i["a"].Item,{key:e.projectEnvLogSeq},d.a.createElement(v["a"],{to:g["b"].pageRoutes.projectEnvLogInfoParams(e.projectId,e.envId,e.projectEnvLogSeq)},"#",e.projectEnvLogSeq))),C=null===(c=e.projectEnvLog)||void 0===c||null===(y=c.buildingLogList)||void 0===y?void 0:y.map(e=>d.a.createElement(i["a"].Item,{key:e.projectEnvLogSeq},d.a.createElement(v["a"],{to:g["b"].pageRoutes.projectEnvLogInfoParams(e.projectId,e.envId,e.projectEnvLogSeq)},"#",e.projectEnvLogSeq)));return d.a.createElement(E["b"],{title:"\u9879\u76ee\uff1a".concat(null===(h=R.info)||void 0===h?void 0:h.projectName)},d.a.createElement(r["a"],null,d.a.createElement(f,{theme:"light"},d.a.createElement(l["a"],{justify:"center",style:{padding:"30px"}},d.a.createElement(o["a"],{defaultValue:Object(u["k"])().envId,style:{width:"120px"},onChange:(e,t)=>{var n=null===t||void 0===t?void 0:t.prop;s["b"].replace(g["b"].pageRoutes.projectEnvLogInfoParams(n.projectId,n.envId))}},null===R||void 0===R||null===(I=R.projectEnvList)||void 0===I?void 0:I.map(e=>d.a.createElement(o["a"].Option,{key:e.id,prop:{projectId:e.projectId,envId:e.envId},value:"".concat(null===e||void 0===e?void 0:e.envId)},e.envName)))),d.a.createElement(i["a"],{defaultOpenKeys:["building","history"],defaultSelectedKeys:[Object(u["k"])().seq],mode:"inline",theme:"light"},d.a.createElement(i["a"].SubMenu,{key:"building",title:(null===(b=e.projectEnvLog)||void 0===b?void 0:b.buildingLogList)?d.a.createElement("div",null,d.a.createElement(p["a"],null),"\u6b63\u5728\u6784\u5efa\uff08",null===(x=e.projectEnvLog)||void 0===x||null===(w=x.buildingLogList)||void 0===w?void 0:w.length," \u4e2a\uff09"):d.a.createElement("div",null,"\u6b63\u5728\u6784\u5efa\uff08\u65e0\uff09")},C),d.a.createElement(i["a"].SubMenu,{key:"history",title:d.a.createElement("span",null,d.a.createElement(m["a"],null),d.a.createElement("span",null,"\u5386\u53f2\u6784\u5efa\u65e5\u5fd7"))},V))),(null===R||void 0===R?void 0:R.info)?d.a.createElement(r["a"],null,d.a.createElement(L,{style:{padding:"0 20px",height:"auto"}},d.a.createElement(l["a"],null,d.a.createElement(a["a"],{sm:12},"\u65f6\u95f4\uff1a",null===(k=R.info)||void 0===k?void 0:k.createdAt),d.a.createElement(a["a"],{sm:12},"\u7c7b\u578b\uff1a",null===(O=R.info)||void 0===O?void 0:O.typeDesc)),d.a.createElement(l["a"],null,d.a.createElement(a["a"],{sm:12},"\u670d\u52a1\u5668\uff1a",null===(S=R.info)||void 0===S?void 0:S.serverIp),d.a.createElement(a["a"],{sm:12},"\u7248\u672c\uff1a",null===(q=R.info)||void 0===q?void 0:q.publishVersion))),d.a.createElement(j,null,d.a.createElement("div",{style:{wordWrap:"break-word",padding:"20px 20px 10px 20px"},dangerouslySetInnerHTML:{__html:null===R||void 0===R||null===(H=R.info)||void 0===H||null===(B=H.text)||void 0===B?void 0:B.toString()}}),(null===R||void 0===R||null===(M=R.info)||void 0===M?void 0:M.isFinish)?"":d.a.createElement("div",{style:{padding:"0px 20px 10px 20px"}},d.a.createElement(p["a"],{style:{fontSize:"20px"}})))):(null===R||void 0===R?void 0:R.info)||R.historyLogList?d.a.createElement(E["c"],null):d.a.createElement("div",{style:{width:"100%",textAlign:"center"}},"\u65e0\u6784\u5efa\u65e5\u5fd7")))};t["default"]=Object(s["a"])(e=>{var t=e.projectEnvLog;return{projectEnvLog:t}})(y)},ye1Q:function(e,t,n){"use strict";var a=n("q1tI"),l={name:"loading",theme:"outlined",icon:{tag:"svg",attrs:{viewBox:"0 0 1024 1024",focusable:"false"},children:[{tag:"path",attrs:{d:"M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"}}]}},o=l,i=n("6VBw"),r=function(e,t){return a["createElement"](i["a"],Object.assign({},e,{ref:t,icon:o}))};r.displayName="LoadingOutlined";t["a"]=a["forwardRef"](r)}}]);