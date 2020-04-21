!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("ExploratoryMap",[],e):"object"==typeof exports?exports.ExploratoryMap=e():t.ExploratoryMap=e()}(window,(function(){return function(t){var e={};function n(s){if(e[s])return e[s].exports;var i=e[s]={i:s,l:!1,exports:{}};return t[s].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,s){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(s,i,function(e){return t[e]}.bind(null,i));return s},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}({"./asset/src/exploratory-text.js":
/*!***************************************!*\
  !*** ./asset/src/exploratory-text.js ***!
  \***************************************/
/*! no static exports found */function(t,e,n){n(/*! ./exploratory-text.scss */"./asset/src/exploratory-text.scss");class s{constructor(t={}){this.options=Object.assign({selector:".exploratory-text-block",color:"#0dae0b"},t),this.block=document.querySelector(this.options.selector),this.block||console.warn('No element matched the selector "'+this.options.selector+'"'),this.svg=d3.select(this.block).append("svg"),this.side=this.block.querySelector(".et-side"),this.sideInner=this.side.querySelector(".et-side-inner"),this.nav=document.querySelector("nav.fixed"),this.highlights=[null],this.annots=[null],this.paths=[null],this.init()}drawConnection(t,e,n,s){if(!e||!n||!s)return;const i=e.querySelector(".et-first"),o=this.block.getBoundingClientRect(),l=i.getBoundingClientRect(),r=n.getBoundingClientRect(),c=(document.documentElement.scrollTop,r.right-o.left),a=r.y+r.height/2-o.top,d=l.left-o.left,h=l.y+l.height/2-o.top;return t.moveTo(c,a),t.lineTo(d,h),t}showConnection(t){let e=this.annots[t],n=this.highlights[t];this.paths[t];e&&n&&e.classList.contains("selected")&&n.classList.contains("selected")&&(e.classList.add("preview"),n.classList.add("preview"))}hideConnection(t){this.annots[t],this.highlights[t],this.paths[t]}scrollTo(t){const e=this.annots[t],n=document.querySelector("nav.fixed"),s=this.block.querySelector(".et-side-inner");if(!e)return;const i=e.getBoundingClientRect(),o=(s.getBoundingClientRect(),n.getBoundingClientRect());s.scrollBy({top:i.top-o.height,behavior:"smooth"})}selectAnnotation(t){let e=this.annots[t],n=this.highlights[t];this.paths[t];e&&e.classList.add("selected"),n&&n.classList.add("selected"),this.scrollTo(t),this.side.classList.remove("et-side-empty")}unselectAnnotation(t){const e=t.dataset.index;this.highlights[e];t.classList.remove("selected"),this.side.querySelectorAll(".selected").length||this.side.classList.add("et-side-empty")}positionAnnotations(t){const e=this.block.getBoundingClientRect(),n=this.nav.getBoundingClientRect(),s=this.side.getBoundingClientRect();this.sideInner.style.width=s.width+"px",this.side.style.height=this.sideInner.scrollHeight+s.top+"px",e.y<=n.height?(this.sideInner.style.height=window.innerHeight-n.height+"px",this.sideInner.style.position="fixed",this.sideInner.style.left=s.x+"px",this.sideInner.style.top=n.height+"px"):(this.sideInner.style.position="absolute",this.sideInner.style.left="",this.sideInner.style.top="")}resizeAnnotation(t){t.classList.toggle("et-less")}init(){const t=this,e=document.querySelector(".et-side-inner"),n=this.block.querySelectorAll(".et-inner a"),s=document.querySelectorAll(".et-annot");let i=1;s.forEach((s,o)=>{s.querySelector(".et-annot-body");const l=s.querySelector(".et-annot-index"),r=s.querySelector(".et-annot-toggle"),c=s.querySelector(".et-annot-close"),a=(s=e.appendChild(s)).dataset.highlight;n.forEach((function(e,n){if(a===e.innerText){const n=s.dataset.type;e.classList.add("et-highlight"),e.dataset.type=n,e.dataset.index=i,s.dataset.index=i,l.innerText=i,t.annots[i]=s,t.highlights[i]=e}})),s.onmouseover=function(e){let n=s.dataset.index;t.showConnection(n)},s.onmouseleave=function(e){let n=s.dataset.index;t.hideConnection(n)},r.onclick=function(e){t.resizeAnnotation(s)},c.onclick=function(e){t.unselectAnnotation(s)},s.classList.remove("hidden"),i++}),n.forEach((function(e,n){const s=e.dataset.type,i=e.dataset.index,o=t.annots[i];o&&o.classList.add(s);let l=e.innerText,r=parseInt(e.dataset.index),c=l.split(" "),a=c.length;isNaN(r)?e.setAttribute("class","inactive"):(c.length>1?(c[0]="<span class='et-first'>"+c[0]+"</span>",c[a-1]="<span class='et-last' data-index-label='"+r+"'>"+c[a-1]+"</span>"):c[0]="<span class='et-first et-last' data-index-label='"+r+"'>"+c[0]+"</span>",e.innerHTML=c.join(" ")),e.onclick=function(n){n.preventDefault();let s=e.dataset.index;t.selectAnnotation(s)},e.onmouseover=function(n){let s=e.dataset.index;t.showConnection(s)},e.onmouseleave=function(n){let s=e.dataset.index;t.hideConnection(s)}})),this.side.onscroll=function(t){},window.onscroll=function(e){t.positionAnnotations()},window.onresize=function(e){t.positionAnnotations()},this.positionAnnotations()}}window.onload=function(){new s}},"./asset/src/exploratory-text.scss":
/*!*****************************************!*\
  !*** ./asset/src/exploratory-text.scss ***!
  \*****************************************/
/*! no static exports found */function(t,e,n){},0:
/*!*********************************************!*\
  !*** multi ./asset/src/exploratory-text.js ***!
  \*********************************************/
/*! no static exports found */function(t,e,n){t.exports=n(/*! /Users/coreytegeler/Sites/mct.barnard.edu/modules/ExploratoryText/asset/src/exploratory-text.js */"./asset/src/exploratory-text.js")}})}));