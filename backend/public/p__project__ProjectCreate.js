(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{"14J3":function(e,a,t){"use strict";t("cIOH"),t("1GLa")},"5wTv":function(e,a,t){"use strict";t("7Kak");var l=t("9yH6"),n=(t("sRBo"),t("kaz8")),r=(t("+L6B"),t("2/Rp")),m=(t("BoS7"),t("Sdc0")),c=(t("14J3"),t("BMrR")),i=(t("jCWc"),t("kPKH")),o=(t("5NDa"),t("5rEg")),d=(t("y8nQ"),t("Vl3Y")),s=t("ODXe"),E=(t("OaEy"),t("2fM7")),u=t("q1tI"),v=t.n(u),p=t("RXW0"),h=t("6VBw"),y=function(e,a){return u["createElement"](h["a"],Object.assign({},e,{ref:a,icon:p["a"]}))};y.displayName="MinusCircleOutlined";var x=u["forwardRef"](y),g=t("xvlK"),b=t("c+yx"),k=t("Hx5s"),I=E["a"].Option,j=e=>{var a=e.project,t=e.isCreate,u=e.dispatch,p=d["a"].useForm(),h=Object(s["a"])(p,1),y=h[0],j=null===a||void 0===a?void 0:a.project;if(console.log("project info",j),!j)return v.a.createElement(k["c"],null);if(!u)return v.a.createElement("div",null);var f=[];return j.branchList&&(f=JSON.parse(j.branchList)),v.a.createElement(d["a"],{form:y,labelCol:{span:4},wrapperCol:{span:16},layout:"horizontal",initialValues:j,onFinish:e=>{console.log("project submit payload : ",e),e.id&&!t?u({type:"project/update",payload:e}):u({type:"project/saved",payload:e})}},v.a.createElement("div",null,v.a.createElement(d["a"].Item,{name:"id"},v.a.createElement(o["a"],{type:"hidden"})),v.a.createElement("h2",null,"\u57fa\u672c\u4fe1\u606f"),v.a.createElement(d["a"].Item,{label:"\u9879\u76ee\u540d\u79f0",name:"name",rules:[{required:!0,message:"\u5fc5\u586b"}]},v.a.createElement(o["a"],null)),v.a.createElement(d["a"].Item,{label:"git\u4ed3\u5e93\u5730\u5740",name:"gitUrl",rules:[{required:!0,message:"\u5fc5\u586b"}]},v.a.createElement(o["a"],null)),v.a.createElement(d["a"].Item,{label:"\u8fdc\u7a0b\u670d\u52a1\u5668\u9879\u76ee\u8def\u52b2",name:"remotePath",rules:[{required:!0,message:"\u5fc5\u586b"}]},v.a.createElement(o["a"],null)),v.a.createElement(d["a"].Item,{label:"\u9879\u76ee\u6a21\u5757\u540d\u79f0",name:"moduleName",rules:[{required:!0,message:"\u5fc5\u586b"}]},v.a.createElement(o["a"],null))),v.a.createElement("div",null,v.a.createElement("h2",null,"\u90e8\u7f72\u6587\u4ef6"),v.a.createElement(d["a"].List,{name:"projectDeployFileList"},(e,a)=>{var t=a.add,l=a.remove;return v.a.createElement("div",null,e.map((e,a)=>v.a.createElement("div",{key:"".concat(e.name,"_").concat(e.key)},v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right",fontSize:"14px",color:"rgba(0, 0, 0, 0.85)"}},"\u6587\u4ef6\uff08",a+1,"\uff09\uff1a"),v.a.createElement(i["a"],{xl:16,style:{textAlign:"right"}},v.a.createElement(x,{style:{fontSize:"14px"},className:"dynamic-delete-button",onClick:()=>{l(e.name)}}))),v.a.createElement(d["a"].Item,{label:"\u672c\u5730\u670d\u52a1\u5668\u6587\u4ef6\u8def\u5f84",name:[e.name,"localFilePath"]},v.a.createElement(o["a"],{placeholder:"\u8def\u5f84\u4e3a\u76f8\u5bf9\u8def\u5f84"})),v.a.createElement(d["a"].Item,{label:"\u8fdc\u7a0b\u670d\u52a1\u5668\u6587\u4ef6\u8def\u5f84",name:[e.name,"remoteFilePath"]},v.a.createElement(o["a"],{placeholder:"\u8def\u5f84\u4e3a\u76f8\u5bf9\u8def\u5f84"})),v.a.createElement(d["a"].Item,{label:"\u72b6\u6001",name:[e.name,"isEnable"],valuePropName:"checked"},v.a.createElement(m["a"],{checkedChildren:"\u542f\u7528",unCheckedChildren:"\u5173\u95ed"})))),v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{push:4,xl:16},v.a.createElement(d["a"].Item,null,v.a.createElement(r["a"],{type:"dashed",onClick:()=>{t()},style:{width:"100%"}},v.a.createElement(g["a"],null)," \u6dfb\u52a0\u4e00\u9879")))))})),v.a.createElement(d["a"].List,{name:"projectEnvList"},(e,t)=>{var s,p,h,k=t.add,L=t.remove;null===j||void 0===j||null===(s=j.projectEnvList)||void 0===s||s.forEach((a,t)=>{e[t]&&(e[t].record=a)});var S=e.map(e=>{var a;return null===e||void 0===e||null===(a=e.record)||void 0===a?void 0:a.envId});return v.a.createElement("div",null,v.a.createElement(c["a"],null,v.a.createElement(i["a"],{xl:4},v.a.createElement("h2",null,"\u73af\u5883\u914d\u7f6e")),v.a.createElement(i["a"],{xl:4,style:{textAlign:"right",lineHeight:"24px"}},v.a.createElement("h4",{style:{display:"inline"}},"\u9009\u62e9\u73af\u5883\uff1a")),v.a.createElement(i["a"],{xl:12},v.a.createElement(d["a"].Item,{noStyle:!0},v.a.createElement(E["a"],{mode:"multiple",value:null===j||void 0===j||null===(p=j.projectEnvList)||void 0===p?void 0:p.map(e=>e.envId),style:{minWidth:"100%"},onSelect:(e,t)=>{var l,n;k();var r=null===a||void 0===a||null===(l=a.serverList)||void 0===l?void 0:l.map(e=>({envId:e.envId,envName:e.envName,serverIp:e.ip,serverName:e.name}));null===j||void 0===j||null===(n=j.projectEnvList)||void 0===n||n.push({envId:e,envName:t.children,projectEnvServerList:r,projectEnvPluginList:[{pluginName:"Eureka"}]}),y.setFieldsValue({projectEnvList:null===j||void 0===j?void 0:j.projectEnvList})}},null===a||void 0===a||null===(h=a.envList)||void 0===h?void 0:h.map((e,a)=>v.a.createElement(I,{value:e.id,disabled:-1!==(null===S||void 0===S?void 0:S.indexOf(e.id)),key:"env_".concat(a)},e.name)))))),e.map((e,t)=>{var s,p,h;return v.a.createElement("div",{key:Object(b["a"])()},v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{xl:4,style:{textAlign:"center"}},v.a.createElement("h3",null,null===e||void 0===e||null===(s=e.record)||void 0===s?void 0:s.envName)),v.a.createElement(i["a"],{xl:16,style:{textAlign:"right"}},v.a.createElement(x,{style:{fontSize:"28px"},className:"dynamic-delete-button",onClick:()=>{var a;L(e.name),u({type:"project/editProjectEnvDel",payload:{envId:null===e||void 0===e||null===(a=e.record)||void 0===a?void 0:a.envId}})}}))),v.a.createElement(d["a"].Item,{noStyle:!0,name:[e.name,"envId"]},v.a.createElement(o["a"],{type:"hidden"})),v.a.createElement(d["a"].Item,{label:"\u53d1\u5e03\u5206\u652f",name:[e.name,"publishBranch"]},v.a.createElement(E["a"],null,0===f.length?v.a.createElement(I,{value:"master"},"master"):null===(p=f)||void 0===p?void 0:p.map(e=>v.a.createElement(I,{value:e,key:Object(b["a"])()},e)))),v.a.createElement(d["a"].List,{name:[e.name,"projectEnvServerList"]},a=>(null===a||void 0===a||a.forEach((a,t)=>{var l;a.record=null===e||void 0===e||null===(l=e.record)||void 0===l?void 0:l.projectEnvServerList[t]}),v.a.createElement("div",null,a.map((e,a)=>{var t,l;return v.a.createElement(c["a"],{style:{lineHeight:"32px"},key:Object(b["a"])()},0===a?v.a.createElement(i["a"],{xl:4,style:{textAlign:"right",color:"rgba(0, 0, 0, 0.85)",fontSize:"14px"}},"\u9009\u62e9\u670d\u52a1\u5668\uff1a"):v.a.createElement(i["a"],{xl:4}),v.a.createElement(i["a"],{xl:8},v.a.createElement(d["a"].Item,{name:[e.name,"isSelectServerIp"],valuePropName:"checked"},v.a.createElement(n["a"],null,null===e||void 0===e||null===(t=e.record)||void 0===t?void 0:t.serverName,"-",null===e||void 0===e||null===(l=e.record)||void 0===l?void 0:l.serverIp))),v.a.createElement(i["a"],{xl:6,style:{textAlign:"right",color:"rgba(0, 0, 0, 0.85)",fontSize:"14px"}},"\u662f\u5426\u8bbe\u7f6e\u4e3a\u53d1\u5e03\u670d\u52a1\u5668\uff1a"),v.a.createElement(i["a"],{xl:2},v.a.createElement(d["a"].Item,{name:[e.name,"isPublish"],valuePropName:"checked"},v.a.createElement(m["a"],{checkedChildren:"\u542f\u7528",unCheckedChildren:"\u5173\u95ed"}))))})))),v.a.createElement(d["a"].Item,{label:"\u53ef\u9009\u5206\u652f\u53d1\u5e03",valuePropName:"checked",name:[e.name,"isSelectBranch"]},v.a.createElement(m["a"],{checkedChildren:"\u542f\u7528",unCheckedChildren:"\u5173\u95ed"})),v.a.createElement(d["a"].Item,{label:"\u9009\u62e9\u540c\u6b65\u670d\u52a1\u5668",name:[e.name,"syncServerId"]},v.a.createElement(l["a"].Group,{buttonStyle:"solid"},null===a||void 0===a||null===(h=a.serverList)||void 0===h?void 0:h.map(e=>v.a.createElement(l["a"].Button,{value:e.id,key:Object(b["a"])()},e.name,"-",e.ip)))),v.a.createElement(d["a"].List,{name:[e.name,"projectCommandStepBuildList"]},(e,a)=>{var t=a.add,l=a.remove;return v.a.createElement("div",null,v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right"}},v.a.createElement("h4",null,"\u6784\u5efa\u547d\u4ee4\uff1a"))),e.map((e,a)=>v.a.createElement(c["a"],{key:Object(b["a"])()},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right",color:"rgba(0, 0, 0, 0.85)"}},"\uff08",a+1,"\uff09\uff1a"),v.a.createElement(i["a"],{xl:14},v.a.createElement(d["a"].Item,{name:[e.name,"step"]},v.a.createElement(o["a"].TextArea,{placeholder:"\u6784\u5efa\u547d\u4ee4 shell \u811a\u672c ".concat(a+1)}))),v.a.createElement(i["a"],{xl:2},v.a.createElement(x,{className:"dynamic-delete-button",style:{fontSize:"14px"},onClick:()=>{l(e.name)}})))),v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{push:4,xl:16},v.a.createElement(d["a"].Item,null,v.a.createElement(r["a"],{type:"dashed",onClick:()=>{t()},style:{width:"100%"}},v.a.createElement(g["a"],null)," \u6dfb\u52a0\u4e00\u9879")))))}),v.a.createElement(d["a"].List,{name:[e.name,"projectCommandStepBuildAfterList"]},(e,a)=>{var t=a.add,l=a.remove;return v.a.createElement("div",null,v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right"}},v.a.createElement("h4",null,"\u6784\u5efa\u540e\u547d\u4ee4\uff1a"))),e.map((e,a)=>v.a.createElement(c["a"],{key:Object(b["a"])()},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right",color:"rgba(0, 0, 0, 0.85)"}},"\uff08",a+1,"\uff09\uff1a"),v.a.createElement(i["a"],{xl:14},v.a.createElement(d["a"].Item,{name:[e.name,"step"]},v.a.createElement(o["a"].TextArea,{placeholder:"\u6784\u5efa\u540e\u547d\u4ee4 shell \u811a\u672c ".concat(a+1)}))),v.a.createElement(i["a"],{xl:2},v.a.createElement(x,{className:"dynamic-delete-button",style:{fontSize:"14px"},onClick:()=>{l(e.name)}})))),v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{push:4,xl:16},v.a.createElement(d["a"].Item,null,v.a.createElement(r["a"],{type:"dashed",onClick:()=>{t()},style:{width:"100%"}},v.a.createElement(g["a"],null)," \u6dfb\u52a0\u4e00\u9879")))))}),v.a.createElement(d["a"].List,{name:[e.name,"projectCommandStepSyncAfterList"]},(e,a)=>{var t=a.add,l=a.remove;return v.a.createElement("div",null,v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right"}},v.a.createElement("h4",null,"\u540c\u6b65\u540e\u547d\u4ee4\uff1a"))),e.map((e,a)=>v.a.createElement(c["a"],{key:Object(b["a"])()},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right",color:"rgba(0, 0, 0, 0.85)"}},"\uff08",a+1,"\uff09\uff1a"),v.a.createElement(i["a"],{xl:14},v.a.createElement(d["a"].Item,{name:[e.name,"step"]},v.a.createElement(o["a"].TextArea,{placeholder:"\u540c\u6b65\u540e\u547d\u4ee4 shell \u811a\u672c ".concat(a+1)}))),v.a.createElement(i["a"],{xl:2},v.a.createElement(x,{className:"dynamic-delete-button",style:{fontSize:"14px"},onClick:()=>{l(e.name)}})))),v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{push:4,xl:16},v.a.createElement(d["a"].Item,null,v.a.createElement(r["a"],{type:"dashed",onClick:()=>{t()},style:{width:"100%"}},v.a.createElement(g["a"],null)," \u6dfb\u52a0\u4e00\u9879")))))}),v.a.createElement("div",null,v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right"}},v.a.createElement("h4",null,"\u63d2\u4ef6\u5e94\u7528\uff1a"))),v.a.createElement(d["a"].List,{name:[e.name,"projectEnvPluginList"]},e=>(e.forEach((e,a)=>{var l;e.record=null===j||void 0===j||null===(l=j.projectEnvList[t])||void 0===l?void 0:l.projectEnvPluginList[a]}),v.a.createElement("div",null,e.map(e=>{var a;return v.a.createElement("div",{key:Object(b["a"])()},v.a.createElement(c["a"],{style:{marginBottom:"24px"}},v.a.createElement(i["a"],{xl:4,style:{textAlign:"right"}},v.a.createElement("h4",null,e.record.pluginName,"\uff1a"))),v.a.createElement(d["a"].Item,{name:[e.name,"projectId"],noStyle:!0},v.a.createElement(o["a"],{type:"hidden"})),v.a.createElement(d["a"].Item,{name:[e.name,"envId"],noStyle:!0},v.a.createElement(o["a"],{type:"hidden"})),v.a.createElement(d["a"].Item,{name:[e.name,"pluginName"],noStyle:!0},v.a.createElement(o["a"],{type:"hidden"})),"Eureka"===(null===e||void 0===e||null===(a=e.record)||void 0===a?void 0:a.pluginName)?v.a.createElement("div",null,v.a.createElement(d["a"].Item,{name:[e.name,"eurekaUrl"],label:"\u8bf7\u6c42\u5730\u5740"},v.a.createElement(o["a"],{placeholder:"Eureka URL"})),v.a.createElement(d["a"].Item,{name:[e.name,"eurekaAuthType"],label:"\u8ba4\u8bc1\u65b9\u5f0f"},v.a.createElement(l["a"].Group,null,v.a.createElement(l["a"],{value:"none"},"\u65e0"),v.a.createElement(l["a"],{value:"Basic"},"Basic"))),v.a.createElement(d["a"].Item,{name:[e.name,"eurekaUsername"],label:"\u7528\u6237\u540d"},v.a.createElement(o["a"],{placeholder:"Eureka Username"})),v.a.createElement(d["a"].Item,{name:[e.name,"eurekaPassword"],label:"\u5bc6\u7801"},v.a.createElement(o["a"],{placeholder:"Eureka Password"}))):"")}))))))}))}),v.a.createElement(d["a"].Item,{label:" ",colon:!1,style:{marginTop:"10vh"}},v.a.createElement(r["a"],{type:"primary",htmlType:"submit",block:!0},"\u63d0\u4ea4")),(null===j||void 0===j?void 0:j.id)?v.a.createElement(d["a"].Item,{label:" ",colon:!1,style:{marginTop:"20vh"}},v.a.createElement(r["a"],{type:"danger",block:!0,onClick:()=>{u({type:"project/deleted",payload:{id:null===j||void 0===j?void 0:j.id,name:null===j||void 0===j?void 0:j.name}})}},"\u5220\u9664\u9879\u76ee\uff08\u8c28\u614e\u64cd\u4f5c\uff09")):"")};a["a"]=j},BMrR:function(e,a,t){"use strict";var l=t("qrJ5");a["a"]=l["a"]},RXW0:function(e,a,t){"use strict";var l={name:"minus-circle",theme:"outlined",icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"}},{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"}}]}};a["a"]=l},"c+yx":function(e,a,t){"use strict";t.d(a,"a",(function(){return l}));var l=()=>{for(var e,a="",t=0;t<32;t++)e=16*Math.random()|0,8!==t&&12!==t&&16!==t&&20!==t||(a+="-"),a+=(12===t?4:16===t?3&e|8:e).toString(16);return a}},jCWc:function(e,a,t){"use strict";t("cIOH"),t("1GLa")},kPKH:function(e,a,t){"use strict";var l=t("/kpp");a["a"]=l["a"]},vstz:function(e,a,t){"use strict";t.r(a);var l=t("q1tI"),n=t.n(l),r=t("Hx5s"),m=t("9kvl"),c=t("5wTv"),i=e=>{var a=e.project,t=e.dispatch;return n.a.createElement(r["b"],{title:"\u9879\u76ee\u521b\u5efa"},n.a.createElement(c["a"],{project:a,dispatch:t,isCreate:!0}))};a["default"]=Object(m["a"])(e=>{var a=e.project;e.dispatch;return{project:a}})(i)}}]);