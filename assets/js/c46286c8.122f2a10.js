"use strict";(self.webpackChunkAditya_Vaidyam=self.webpackChunkAditya_Vaidyam||[]).push([[853],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>m});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),f=u(r),m=o,y=f["".concat(s,".").concat(m)]||f[m]||p[m]||a;return r?n.createElement(y,i(i({ref:t},l),{},{components:r})):n.createElement(y,i({ref:t},l))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var u=2;u<a;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},7834:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>c,toc:()=>u});var n=r(7462),o=(r(7294),r(3905));const a={},i="Picture-in-Picture on macOS Sierra",c={permalink:"/blog/2016/08/05/",source:"@site/blog/2016-08-05.md",title:"Picture-in-Picture on macOS Sierra",description:"Similar to iOS, macOS recently gained Picture-In-Picture mode for videos; so far, only Safari seems to support it out of the box. The question remains: why isn\u2019t it a public API? That\u2019s a question we\u2019ll never have an answer for, but as it turns out, PIP.framework does exist in the PrivateFrameworks realm, and a quick job of reverse engineering shows exactly how it works.",date:"2016-08-05T00:00:00.000Z",formattedDate:"August 5, 2016",tags:[],readingTime:.825,truncated:!0,authors:[],frontMatter:{},prevItem:{title:"ViewBridge.framework: It works!",permalink:"/blog/2017/10/01/"},nextItem:{title:"NSExtension  & PlugInKit",permalink:"/blog/2016/07/12/"}},s={authorsImageUrls:[]},u=[],l={toc:u};function p(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Similar to iOS, macOS recently gained Picture-In-Picture mode for videos; so far, only Safari seems to support it out of the box. The question remains: why isn\u2019t it a public API? That\u2019s a question we\u2019ll never have an answer for, but as it turns out, PIP.framework does exist in the PrivateFrameworks realm, and a quick job of reverse engineering shows exactly how it works."))}p.isMDXComponent=!0}}]);