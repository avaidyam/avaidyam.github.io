"use strict";(self.webpackChunkAditya_Vaidyam=self.webpackChunkAditya_Vaidyam||[]).push([[890],{5680:(e,t,r)=>{r.d(t,{xA:()=>s,yg:()=>y});var n=r(6540);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=p(r),m=a,y=u["".concat(l,".").concat(m)]||u[m]||f[m]||o;return r?n.createElement(y,i(i({ref:t},s),{},{components:r})):n.createElement(y,i({ref:t},s))}));function y(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[u]="string"==typeof e?e:a,i[1]=c;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4444:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>c,toc:()=>p});var n=r(8168),a=(r(6540),r(5680));const o={},i="DIY: Core Animation",c={permalink:"/blog/2019/02/19/",source:"@site/blog/2019-02-19.md",title:"DIY: Core Animation",description:"(Check out the project over here.)",date:"2019-02-19T00:00:00.000Z",formattedDate:"February 19, 2019",tags:[],readingTime:5.96,hasTruncateMarker:!0,authors:[],frontMatter:{},prevItem:{title:"On the debate of iOS vs. macOS",permalink:"/blog/2019/06/02/"},nextItem:{title:"An Exercise in Modern Cocoa Views",permalink:"/blog/2018/03/22/"}},l={authorsImageUrls:[]},p=[],s={toc:p},u="wrapper";function f(e){let{components:t,...r}=e;return(0,a.yg)(u,(0,n.A)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.yg)("p",null,(0,a.yg)("a",{parentName:"p",href:"https://github.com/avaidyam/DIYAnimation"},"(Check out the project over here.)")),(0,a.yg)("p",null,"After having been a consumer of the ",(0,a.yg)("strong",{parentName:"p"},"Core Animation")," (originally ",(0,a.yg)("strong",{parentName:"p"},"LayerKit"),') framework for about a decade now, I began to wonder how it was designed and implemented under the hood. Not simply the surface details such as "it\'s rendered out of process" or "it handles the animation interpolation for you" or whatnot, but more specifically, ',(0,a.yg)("strong",{parentName:"p"},"HOW")," all of its beautiful bells and whistles translate into nitty gritty graphics ideas and associated draw calls. I figured the best way was to try to build it myself from scratch!"))}f.isMDXComponent=!0}}]);