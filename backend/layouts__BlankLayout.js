(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{Hl79:function(e,t,a){"use strict";a.r(t);a("/xke");var s=a("TeRw"),r=a("VTBJ"),o=a("q1tI"),n=a.n(o),c=a("9XV7"),l=a("io9h"),i={200:"\u670d\u52a1\u5668\u6210\u529f\u8fd4\u56de\u8bf7\u6c42\u7684\u6570\u636e\u3002",201:"\u65b0\u5efa\u6216\u4fee\u6539\u6570\u636e\u6210\u529f\u3002",202:"\u4e00\u4e2a\u8bf7\u6c42\u5df2\u7ecf\u8fdb\u5165\u540e\u53f0\u6392\u961f\uff08\u5f02\u6b65\u4efb\u52a1\uff09\u3002",204:"\u5220\u9664\u6570\u636e\u6210\u529f\u3002",400:"\u53d1\u51fa\u7684\u8bf7\u6c42\u6709\u9519\u8bef\uff0c\u670d\u52a1\u5668\u6ca1\u6709\u8fdb\u884c\u65b0\u5efa\u6216\u4fee\u6539\u6570\u636e\u7684\u64cd\u4f5c\u3002",401:"\u7528\u6237\u6ca1\u6709\u6743\u9650\uff08\u4ee4\u724c\u3001\u7528\u6237\u540d\u3001\u5bc6\u7801\u9519\u8bef\uff09\u3002",403:"\u7528\u6237\u5f97\u5230\u6388\u6743\uff0c\u4f46\u662f\u8bbf\u95ee\u662f\u88ab\u7981\u6b62\u7684\u3002",404:"\u53d1\u51fa\u7684\u8bf7\u6c42\u9488\u5bf9\u7684\u662f\u4e0d\u5b58\u5728\u7684\u8bb0\u5f55\uff0c\u670d\u52a1\u5668\u6ca1\u6709\u8fdb\u884c\u64cd\u4f5c\u3002",406:"\u8bf7\u6c42\u7684\u683c\u5f0f\u4e0d\u53ef\u5f97\u3002",410:"\u8bf7\u6c42\u7684\u8d44\u6e90\u88ab\u6c38\u4e45\u5220\u9664\uff0c\u4e14\u4e0d\u4f1a\u518d\u5f97\u5230\u7684\u3002",422:"\u5f53\u521b\u5efa\u4e00\u4e2a\u5bf9\u8c61\u65f6\uff0c\u53d1\u751f\u4e00\u4e2a\u9a8c\u8bc1\u9519\u8bef\u3002",500:"\u670d\u52a1\u5668\u53d1\u751f\u9519\u8bef\uff0c\u8bf7\u68c0\u67e5\u670d\u52a1\u5668\u3002",502:"\u7f51\u5173\u9519\u8bef\u3002",503:"\u670d\u52a1\u4e0d\u53ef\u7528\uff0c\u670d\u52a1\u5668\u6682\u65f6\u8fc7\u8f7d\u6216\u7ef4\u62a4\u3002",504:"\u7f51\u5173\u8d85\u65f6\u3002"},u=e=>{var t=e.response;if(t&&t.status){var a=i[t.status]||t.statusText,r=t.status,o=t.url;s["a"].error({message:"\u8bf7\u6c42\u9519\u8bef ".concat(r,": ").concat(o),description:a})}else t||s["a"].error({description:"\u60a8\u7684\u7f51\u7edc\u53d1\u751f\u5f02\u5e38\uff0c\u65e0\u6cd5\u8fde\u63a5\u670d\u52a1\u5668",message:"\u7f51\u7edc\u5f02\u5e38"});return t},d=Object(l["b"])({errorHandler:u}),h=d,p=a("gLBg"),g=a("cHh2");t["default"]=e=>(Object(o["useEffect"])(()=>{var t,a=localStorage.getItem("installed");a||(null===e||void 0===e||null===(t=e.location)||void 0===t?void 0:t.pathname)===p["b"].pageRoutes.installIndex||h.get(p["b"].apiRoutes.systemInstalled.url).then(t=>{"SUCCESS"!==t.result&&e.history.replace(p["b"].pageRoutes.installIndex),localStorage.setItem("installed",t.result)})}),n.a.createElement(c["a"],{value:{refreshOnWindowFocus:!0,requestMethod:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(null===t||void 0===t?void 0:t.custom)?(t.headers=Object(r["a"])({},t.headers),h(t.url,t).then(e=>e)):(t.headers=Object(r["a"])({access_token:localStorage.getItem(g["a"].ACCESS_TOKEN)},t.headers),h(t.url,t).then(a=>{if(!(a instanceof Response)){var r=a;if(1===r.code)return r;103!==r.code&&104!==r.code?s["a"].error({message:"\u8bf7\u6c42\u9519\u8bef ".concat(r.code,": ").concat(t.url),description:r.desc}):e.history.replace(p["b"].pageRoutes.userLogin)}}))}}},e.children))}}]);