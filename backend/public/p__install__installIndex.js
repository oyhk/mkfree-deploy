(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{Nns8:function(e,a,t){e.exports={container:"container___1sHf6",content:"content___P8pQ5",top:"top___3hktv",header:"header___3Ta4m",logo:"logo___26BoQ",title:"title___WScEc",desc:"desc___uCLdf",main:"main___1dai6",mainTitle:"mainTitle___1zVhW"}},kXZB:function(e,a,t){"use strict";t.d(a,"a",(function(){return r}));var l=t("Hx5s"),n=t("q1tI"),s=t.n(n),r=s.a.createElement(l["a"],{copyright:"MKfree Deploy 2016-2020",links:[{key:"Mkfree Deploy",title:"Mkfree Deploy",href:"https://gitee.com/381895649/mkfree-deploy",blankTarget:!0}]})},"l3/n":function(e,a,t){"use strict";t.r(a);t("+L6B");var l=t("2/Rp"),n=(t("y8nQ"),t("Vl3Y")),s=(t("5NDa"),t("5rEg")),r=(t("FJo9"),t("L41K")),o=t("VTBJ"),c=t("ODXe"),i=t("q1tI"),m=t.n(i),p=t("Nns8"),d=t.n(p),u=t("mxmt"),y=t.n(u),E=t("kXZB"),_=t("gLBg"),f=t("n+Aq"),g=t("FfOG");a["default"]=()=>{var e=Object(i["useState"])(0),a=Object(c["a"])(e,2),t=a[0],p=a[1],u=Object(f["a"])(e=>Object(o["a"])({},_["b"].apiRoutes.systemInstall,{data:e}),{manual:!0,formatResult:e=>e,onSuccess:(e,a)=>{p(3),localStorage.setItem("installed",e.result)},refreshOnWindowFocus:!1});return m.a.createElement("div",{className:d.a.container},m.a.createElement("div",{className:d.a.content},m.a.createElement("div",{className:d.a.top},m.a.createElement("div",{className:d.a.header},m.a.createElement("img",{alt:"logo",className:d.a.logo,src:y.a}),m.a.createElement("span",{className:d.a.title},"Mkfree Deploy")),m.a.createElement("div",{className:d.a.desc},"Mkfree Deploy \u8f7b\u91cf\u7ea7\u81ea\u52a8\u5316\u8fd0\u7ef4\u5de5\u5177\u3002")),m.a.createElement("div",{className:d.a.main},m.a.createElement("p",{className:d.a.mainTitle},"\u7cfb\u7edf\u5b89\u88c5"),m.a.createElement(r["a"],{current:t},m.a.createElement(r["a"].Step,{title:"\u7b2c\u4e00\u6b65",description:"\u8d85\u7ea7\u7ba1\u7406\u5458\u8d26\u53f7"}),m.a.createElement(r["a"].Step,{title:"\u7b2c\u4e8c\u6b65",description:"\u7cfb\u7edf\u914d\u7f6e"}),m.a.createElement(r["a"].Step,{title:"\u7b2c\u4e09\u6b65",description:"\u5b8c\u6210"})),m.a.createElement(n["a"],{style:{paddingTop:"100px"},labelCol:{span:6},wrapperCol:{span:14},layout:"horizontal",onFinish:e=>{console.log("install form submit payload",e),u.run(e)}},m.a.createElement(n["a"].Item,{style:{display:0===t||2===t?"flex":"none"},name:"username",label:"\u8d85\u7ea7\u7ba1\u7406\u5458\u7528\u6237\u540d",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u8d85\u7ea7\u7ba1\u7406\u5458\u7528\u6237\u540d!"}]},m.a.createElement(s["a"],{placeholder:"username"})),m.a.createElement(n["a"].Item,{style:{display:0===t||2===t?"flex":"none"},name:"password",label:"\u8d85\u7ea7\u7ba1\u7406\u5458\u5bc6\u7801",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u8d85\u7ea7\u7ba1\u7406\u5458\u5bc6\u7801!"}]},m.a.createElement(s["a"].Password,{placeholder:"password"})),m.a.createElement(n["a"].Item,{style:{display:1===t||2===t?"flex":"none"},name:"installPath",label:"\u7cfb\u7edf\u5de5\u4f5c\u8def\u5f84",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u7cfb\u7edf\u5de5\u4f5c\u8def\u5f84!"}]},m.a.createElement(s["a"],{placeholder:"installPath"})),m.a.createElement(n["a"].Item,{label:" ",colon:!1,style:{display:0===t||1===t?"flex":"none"}},m.a.createElement(l["a"],{type:"primary",block:!0,onClick:()=>{p(t+1)}},"\u4e0b\u4e00\u6b65")),m.a.createElement(n["a"].Item,{label:" ",colon:!1,style:{display:2===t?"flex":"none"}},m.a.createElement(l["a"],{loading:u.loading,type:"primary",htmlType:"submit",block:!0},"\u63d0 \u4ea4")),m.a.createElement(n["a"].Item,{label:" ",colon:!1,style:{display:t>0&&t<3?"flex":"none"}},m.a.createElement(l["a"],{type:"dashed",danger:!0,block:!0,onClick:()=>{p(t-1)}},"\u4e0a\u4e00\u6b65")),m.a.createElement("div",{style:{textAlign:"center",display:3===t?"block":"none"}},"\u7cfb\u7edf\u5b89\u88c5\u6210\u529f\uff01 ",m.a.createElement(l["a"],{type:"link",onClick:()=>g["b"].replace(_["b"].pageRoutes.userLogin)},"\u767b\u5f55\u7cfb\u7edf"))))),E["a"])}},mxmt:function(e,a,t){e.exports=t.p+"static/logo.9bc8753a.svg"}}]);