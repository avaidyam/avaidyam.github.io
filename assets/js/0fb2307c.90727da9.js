"use strict";(self.webpackChunkAditya_Vaidyam=self.webpackChunkAditya_Vaidyam||[]).push([[681],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),c=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=c(r),m=a,f=d["".concat(u,".").concat(m)]||d[m]||s[m]||o;return r?n.createElement(f,i(i({ref:t},p),{},{components:r})):n.createElement(f,i({ref:t},p))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},3777:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>s,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const o={},i="Building a Better RegisterEventHotKey",l={permalink:"/blog/2018/03/16/",source:"@site/blog/2018-03-16.md",title:"Building a Better RegisterEventHotKey",description:"Okay, well, maybe not better, but at least, not under imminent threat of deprecation - and even that is questionable, because we'll be using [Private SPI] (I mean, would you really be here reading this if it didn't? At least I've marked it all so you can cut it out for MAS apps.)",date:"2018-03-16T00:00:00.000Z",formattedDate:"March 16, 2018",tags:[],readingTime:16.195,truncated:!0,authors:[],frontMatter:{},prevItem:{title:"An Exercise in Modern Cocoa Views",permalink:"/blog/2018/03/22/"},nextItem:{title:"The Secret Life of Core Animation",permalink:"/blog/2018/02/22/"}},u={authorsImageUrls:[]},c=[],p={toc:c};function s(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Okay, well, maybe not better, but at least, not under imminent threat of deprecation - and even that is questionable, because we'll be using ",(0,a.kt)("inlineCode",{parentName:"p"},"[Private SPI]")," (I mean, would you really be here reading this if it didn't? At least I've marked it all so you can cut it out for MAS apps.)"),(0,a.kt)("p",null,"Recently, I've wanted to get around to adding \"hot key\" support for Parrot, and realized I didn't like any of the existing solutions:"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Use ",(0,a.kt)("inlineCode",{parentName:"li"},"MASShortcut")," or ",(0,a.kt)("inlineCode",{parentName:"li"},"ShortcutRecorder")," which are tried and proven to work in ObjC-land."),(0,a.kt)("li",{parentName:"ol"},"Use a new but not proven Swift hotkey recorder (there's a few out there)."),(0,a.kt)("li",{parentName:"ol"},"Roll my own using dangerous private SPI and not test it at all! ")),(0,a.kt)("p",null,(0,a.kt)("em",{parentName:"p"},"Obviously I went with option #3.")))}s.isMDXComponent=!0}}]);