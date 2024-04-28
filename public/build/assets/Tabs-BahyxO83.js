import{w as Q,$ as A,ba as ut,bb as vt,S as b,bc as me,bd as ht,be as Z,bf as gt,I as xt,J as $e,K as mt,d as J,an as yt,C as wt,aN as St,bg as Ct,bh as Rt,bi as Tt,Y as r,a1 as i,a0 as S,Z as B,aJ as zt,L as $t,a7 as Pe,bj as ye,a9 as re,a3 as Pt,q as ne,e as Wt,V as Lt,a4 as k,bk as _t,a5 as At,al as j,bl as K,a8 as Bt,bm as we,aa as oe,bn as Et,b4 as q,bo as kt,ah as ie,ac as jt,ad as It,bp as Ot,W as Ht}from"./app-Dui3NARO.js";import{A as Ft}from"./Add-BJlhNwmr.js";const Dt=me(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[me("&::-webkit-scrollbar",{width:0,height:0})]),Mt=Q({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=A(null);function n(l){!(l.currentTarget.offsetWidth<l.currentTarget.scrollWidth)||l.deltaY===0||(l.currentTarget.scrollLeft+=l.deltaY+l.deltaX,l.preventDefault())}const d=ut();return Dt.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:vt,ssr:d}),Object.assign({selfRef:e,handleWheel:n},{scrollTo(...l){var m;(m=e.value)===null||m===void 0||m.scrollTo(...l)}})},render(){return b("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}});var Nt=/\s/;function Vt(e){for(var n=e.length;n--&&Nt.test(e.charAt(n)););return n}var Xt=/^\s+/;function Ut(e){return e&&e.slice(0,Vt(e)+1).replace(Xt,"")}var Se=NaN,Yt=/^[-+]0x[0-9a-f]+$/i,Gt=/^0b[01]+$/i,Kt=/^0o[0-7]+$/i,qt=parseInt;function Ce(e){if(typeof e=="number")return e;if(ht(e))return Se;if(Z(e)){var n=typeof e.valueOf=="function"?e.valueOf():e;e=Z(n)?n+"":n}if(typeof e!="string")return e===0?e:+e;e=Ut(e);var d=Gt.test(e);return d||Kt.test(e)?qt(e.slice(2),d?2:8):Yt.test(e)?Se:+e}var se=function(){return gt.Date.now()},Jt="Expected a function",Zt=Math.max,Qt=Math.min;function ea(e,n,d){var u,l,m,v,f,x,h=0,g=!1,W=!1,L=!0;if(typeof e!="function")throw new TypeError(Jt);n=Ce(n)||0,Z(d)&&(g=!!d.leading,W="maxWait"in d,m=W?Zt(Ce(d.maxWait)||0,n):m,L="trailing"in d?!!d.trailing:L);function y(c){var R=u,F=l;return u=l=void 0,h=c,v=e.apply(F,R),v}function T(c){return h=c,f=setTimeout(P,n),g?y(c):v}function C(c){var R=c-x,F=c-h,N=n-R;return W?Qt(N,m-F):N}function $(c){var R=c-x,F=c-h;return x===void 0||R>=n||R<0||W&&F>=m}function P(){var c=se();if($(c))return z(c);f=setTimeout(P,C(c))}function z(c){return f=void 0,L&&u?y(c):(u=l=void 0,v)}function H(){f!==void 0&&clearTimeout(f),h=0,u=x=l=f=void 0}function _(){return f===void 0?v:z(se())}function p(){var c=se(),R=$(c);if(u=arguments,l=this,x=c,R){if(f===void 0)return T(x);if(W)return clearTimeout(f),f=setTimeout(P,n),y(x)}return f===void 0&&(f=setTimeout(P,n)),v}return p.cancel=H,p.flush=_,p}var ta="Expected a function";function le(e,n,d){var u=!0,l=!0;if(typeof e!="function")throw new TypeError(ta);return Z(d)&&(u="leading"in d?!!d.leading:u,l="trailing"in d?!!d.trailing:l),ea(e,n,{leading:u,maxWait:n,trailing:l})}const ce=xt("n-tabs"),We={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},sa=Q({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:We,setup(e){const n=$e(ce,null);return n||mt("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:n.paneStyleRef,class:n.paneClassRef,mergedClsPrefix:n.mergedClsPrefixRef}},render(){return b("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),aa=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},Tt(We,["displayDirective"])),be=Q({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:aa,setup(e){const{mergedClsPrefixRef:n,valueRef:d,typeRef:u,closableRef:l,tabStyleRef:m,addTabStyleRef:v,tabClassRef:f,addTabClassRef:x,tabChangeIdRef:h,onBeforeLeaveRef:g,triggerRef:W,handleAdd:L,activateTab:y,handleClose:T}=$e(ce);return{trigger:W,mergedClosable:J(()=>{if(e.internalAddable)return!1;const{closable:C}=e;return C===void 0?l.value:C}),style:m,addStyle:v,tabClass:f,addTabClass:x,clsPrefix:n,value:d,type:u,handleClose(C){C.stopPropagation(),!e.disabled&&T(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){L();return}const{name:C}=e,$=++h.id;if(C!==d.value){const{value:P}=g;P?Promise.resolve(P(e.name,d.value)).then(z=>{z&&h.id===$&&y(C)}):y(C)}}}},render(){const{internalAddable:e,clsPrefix:n,name:d,disabled:u,label:l,tab:m,value:v,mergedClosable:f,trigger:x,$slots:{default:h}}=this,g=l??m;return b("div",{class:`${n}-tabs-tab-wrapper`},this.internalLeftPadded?b("div",{class:`${n}-tabs-tab-pad`}):null,b("div",Object.assign({key:d,"data-name":d,"data-disabled":u?!0:void 0},yt({class:[`${n}-tabs-tab`,v===d&&`${n}-tabs-tab--active`,u&&`${n}-tabs-tab--disabled`,f&&`${n}-tabs-tab--closable`,e&&`${n}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:x==="click"?this.activateTab:void 0,onMouseenter:x==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),b("span",{class:`${n}-tabs-tab__label`},e?b(wt,null,b("div",{class:`${n}-tabs-tab__height-placeholder`}," "),b(St,{clsPrefix:n},{default:()=>b(Ft,null)})):h?h():typeof g=="object"?g:Ct(g??d)),f&&this.type==="card"?b(Rt,{clsPrefix:n,class:`${n}-tabs-tab__close`,onClick:this.handleClose,disabled:u}):null))}}),ra=r("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[i("segment-type",[r("tabs-rail",[S("&.transition-disabled",[r("tabs-capsule",`
 transition: none;
 `)])])]),i("top",[r("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),i("left",[r("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),i("left, right",`
 flex-direction: row;
 `,[r("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),i("right",`
 flex-direction: row-reverse;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),r("tabs-bar",`
 left: 0;
 `)]),i("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[r("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),r("tabs-bar",`
 top: 0;
 `)]),r("tabs-rail",`
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[r("tabs-capsule",`
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: transform 0.3s var(--n-bezier);
 `),r("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[r("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[i("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `),S("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),i("flex",[r("tabs-nav",`
 width: 100%;
 position: relative;
 `,[r("tabs-wrapper",`
 width: 100%;
 `,[r("tabs-tab",`
 margin-right: 0;
 `)])])]),r("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[B("prefix, suffix",`
 display: flex;
 align-items: center;
 `),B("prefix","padding-right: 16px;"),B("suffix","padding-left: 16px;")]),i("top, bottom",[r("tabs-nav-scroll-wrapper",[S("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),S("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),i("shadow-start",[S("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),i("shadow-end",[S("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),i("left, right",[r("tabs-nav-scroll-content",`
 flex-direction: column;
 `),r("tabs-nav-scroll-wrapper",[S("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),S("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),i("shadow-start",[S("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),i("shadow-end",[S("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),r("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[r("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[S("&::-webkit-scrollbar",`
 width: 0;
 height: 0;
 `)]),S("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),r("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),r("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),r("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),r("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[i("disabled",{cursor:"not-allowed"}),B("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),B("label",`
 display: flex;
 align-items: center;
 z-index: 1;
 `)]),r("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[S("&.transition-disabled",`
 transition: none;
 `),i("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),r("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),r("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[S("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),S("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),S("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),S("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),S("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),r("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),i("line-type, bar-type",[r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[S("&:hover",{color:"var(--n-tab-text-color-hover)"}),i("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),i("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),r("tabs-nav",[i("line-type",[i("top",[B("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 bottom: -1px;
 `)]),i("left",[B("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 right: -1px;
 `)]),i("right",[B("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 left: -1px;
 `)]),i("bottom",[B("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-bar",`
 top: -1px;
 `)]),B("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-bar",`
 border-radius: 0;
 `)]),i("card-type",[B("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),r("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[i("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 `,[B("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),zt("disabled",[S("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),i("closable","padding-right: 8px;"),i("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),i("disabled","color: var(--n-tab-text-color-disabled);")]),r("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);")]),i("left, right",[r("tabs-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-wrapper",`
 flex-direction: column;
 `,[r("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])])]),i("top",[i("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-bottom: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),i("left",[i("card-type",[r("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-right: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),i("right",[i("card-type",[r("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-left: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),i("bottom",[i("card-type",[r("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[i("active",`
 border-top: 1px solid #0000;
 `)]),r("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `),r("tabs-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),na=Object.assign(Object.assign({},Pe.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),la=Q({name:"Tabs",props:na,setup(e,{slots:n}){var d,u,l,m;const{mergedClsPrefixRef:v,inlineThemeDisabled:f}=$t(e),x=Pe("Tabs","-tabs",ra,Et,e,v),h=A(null),g=A(null),W=A(null),L=A(null),y=A(null),T=A(null),C=A(!0),$=A(!0),P=ye(e,["labelSize","size"]),z=ye(e,["activeName","value"]),H=A((u=(d=z.value)!==null&&d!==void 0?d:e.defaultValue)!==null&&u!==void 0?u:n.default?(m=(l=re(n.default())[0])===null||l===void 0?void 0:l.props)===null||m===void 0?void 0:m.name:null),_=Pt(z,H),p={id:0},c=J(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});ne(_,()=>{p.id=0,V(),pe()});function R(){var a;const{value:t}=_;return t===null?null:(a=h.value)===null||a===void 0?void 0:a.querySelector(`[data-name="${t}"]`)}function F(a){if(e.type==="card")return;const{value:t}=g;if(!t)return;const o=t.style.opacity==="0";if(a){const s=`${v.value}-tabs-bar--disabled`,{barWidth:w,placement:I}=e;if(a.dataset.disabled==="true"?t.classList.add(s):t.classList.remove(s),["top","bottom"].includes(I)){if(fe(["top","maxHeight","height"]),typeof w=="number"&&a.offsetWidth>=w){const E=Math.floor((a.offsetWidth-w)/2)+a.offsetLeft;t.style.left=`${E}px`,t.style.maxWidth=`${w}px`}else t.style.left=`${a.offsetLeft}px`,t.style.maxWidth=`${a.offsetWidth}px`;t.style.width="8192px",o&&(t.style.transition="none"),t.offsetWidth,o&&(t.style.transition="",t.style.opacity="1")}else{if(fe(["left","maxWidth","width"]),typeof w=="number"&&a.offsetHeight>=w){const E=Math.floor((a.offsetHeight-w)/2)+a.offsetTop;t.style.top=`${E}px`,t.style.maxHeight=`${w}px`}else t.style.top=`${a.offsetTop}px`,t.style.maxHeight=`${a.offsetHeight}px`;t.style.height="8192px",o&&(t.style.transition="none"),t.offsetHeight,o&&(t.style.transition="",t.style.opacity="1")}}}function N(){if(e.type==="card")return;const{value:a}=g;a&&(a.style.opacity="0")}function fe(a){const{value:t}=g;if(t)for(const o of a)t.style[o]=""}function V(){if(e.type==="card")return;const a=R();a?F(a):N()}function pe(a){var t;const o=(t=y.value)===null||t===void 0?void 0:t.$el;if(!o)return;const s=R();if(!s)return;const{scrollLeft:w,offsetWidth:I}=o,{offsetLeft:E,offsetWidth:Y}=s;w>E?o.scrollTo({top:0,left:E,behavior:"smooth"}):E+Y>w+I&&o.scrollTo({top:0,left:E+Y-I,behavior:"smooth"})}const X=A(null);let ee=0,O=null;function Le(a){const t=X.value;if(t){ee=a.getBoundingClientRect().height;const o=`${ee}px`,s=()=>{t.style.height=o,t.style.maxHeight=o};O?(s(),O(),O=null):O=s}}function _e(a){const t=X.value;if(t){const o=a.getBoundingClientRect().height,s=()=>{document.body.offsetHeight,t.style.maxHeight=`${o}px`,t.style.height=`${Math.max(ee,o)}px`};O?(O(),O=null,s()):O=s}}function Ae(){const a=X.value;if(a){a.style.maxHeight="",a.style.height="";const{paneWrapperStyle:t}=e;if(typeof t=="string")a.style.cssText=t;else if(t){const{maxHeight:o,height:s}=t;o!==void 0&&(a.style.maxHeight=o),s!==void 0&&(a.style.height=s)}}}const ue={value:[]},ve=A("next");function Be(a){const t=_.value;let o="next";for(const s of ue.value){if(s===t)break;if(s===a){o="prev";break}}ve.value=o,Ee(a)}function Ee(a){const{onActiveNameChange:t,onUpdateValue:o,"onUpdate:value":s}=e;t&&q(t,a),o&&q(o,a),s&&q(s,a),H.value=a}function ke(a){const{onClose:t}=e;t&&q(t,a)}function he(){const{value:a}=g;if(!a)return;const t="transition-disabled";a.classList.add(t),V(),a.classList.remove(t)}const D=A(null);function te({transitionDisabled:a}){const t=h.value;if(!t)return;a&&t.classList.add("transition-disabled");const o=R();o&&D.value&&(D.value.style.width=`${o.offsetWidth}px`,D.value.style.height=`${o.offsetHeight}px`,D.value.style.transform=`translateX(${o.offsetLeft-t.offsetLeft-kt(getComputedStyle(t).paddingLeft)}px)`,a&&D.value.offsetWidth),a&&t.classList.remove("transition-disabled")}ne([_],()=>{e.type==="segment"&&ie(()=>{te({transitionDisabled:!1})})}),Wt(()=>{e.type==="segment"&&te({transitionDisabled:!0})});let ge=0;function je(a){var t;if(a.contentRect.width===0&&a.contentRect.height===0||ge===a.contentRect.width)return;ge=a.contentRect.width;const{type:o}=e;if((o==="line"||o==="bar")&&he(),o!=="segment"){const{placement:s}=e;ae((s==="top"||s==="bottom"?(t=y.value)===null||t===void 0?void 0:t.$el:T.value)||null)}}const Ie=le(je,64);ne([()=>e.justifyContent,()=>e.size],()=>{ie(()=>{const{type:a}=e;(a==="line"||a==="bar")&&he()})});const U=A(!1);function Oe(a){var t;const{target:o,contentRect:{width:s}}=a,w=o.parentElement.offsetWidth;if(!U.value)w<s&&(U.value=!0);else{const{value:I}=L;if(!I)return;w-s>I.$el.offsetWidth&&(U.value=!1)}ae(((t=y.value)===null||t===void 0?void 0:t.$el)||null)}const He=le(Oe,64);function Fe(){const{onAdd:a}=e;a&&a(),ie(()=>{const t=R(),{value:o}=y;!t||!o||o.scrollTo({left:t.offsetLeft,top:0,behavior:"smooth"})})}function ae(a){if(!a)return;const{placement:t}=e;if(t==="top"||t==="bottom"){const{scrollLeft:o,scrollWidth:s,offsetWidth:w}=a;C.value=o<=0,$.value=o+w>=s}else{const{scrollTop:o,scrollHeight:s,offsetHeight:w}=a;C.value=o<=0,$.value=o+w>=s}}const De=le(a=>{ae(a.target)},64);Lt(ce,{triggerRef:k(e,"trigger"),tabStyleRef:k(e,"tabStyle"),tabClassRef:k(e,"tabClass"),addTabStyleRef:k(e,"addTabStyle"),addTabClassRef:k(e,"addTabClass"),paneClassRef:k(e,"paneClass"),paneStyleRef:k(e,"paneStyle"),mergedClsPrefixRef:v,typeRef:k(e,"type"),closableRef:k(e,"closable"),valueRef:_,tabChangeIdRef:p,onBeforeLeaveRef:k(e,"onBeforeLeave"),activateTab:Be,handleClose:ke,handleAdd:Fe}),_t(()=>{V(),pe()}),At(()=>{const{value:a}=W;if(!a)return;const{value:t}=v,o=`${t}-tabs-nav-scroll-wrapper--shadow-start`,s=`${t}-tabs-nav-scroll-wrapper--shadow-end`;C.value?a.classList.remove(o):a.classList.add(o),$.value?a.classList.remove(s):a.classList.add(s)});const Me={syncBarPosition:()=>{V()}},Ne=()=>{te({transitionDisabled:!0})},xe=J(()=>{const{value:a}=P,{type:t}=e,o={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[t],s=`${a}${o}`,{self:{barColor:w,closeIconColor:I,closeIconColorHover:E,closeIconColorPressed:Y,tabColor:Ve,tabBorderColor:Xe,paneTextColor:Ue,tabFontWeight:Ye,tabBorderRadius:Ge,tabFontWeightActive:Ke,colorSegment:qe,fontWeightStrong:Je,tabColorSegment:Ze,closeSize:Qe,closeIconSize:et,closeColorHover:tt,closeColorPressed:at,closeBorderRadius:rt,[j("panePadding",a)]:G,[j("tabPadding",s)]:nt,[j("tabPaddingVertical",s)]:ot,[j("tabGap",s)]:it,[j("tabGap",`${s}Vertical`)]:st,[j("tabTextColor",t)]:lt,[j("tabTextColorActive",t)]:dt,[j("tabTextColorHover",t)]:bt,[j("tabTextColorDisabled",t)]:ct,[j("tabFontSize",a)]:ft},common:{cubicBezierEaseInOut:pt}}=x.value;return{"--n-bezier":pt,"--n-color-segment":qe,"--n-bar-color":w,"--n-tab-font-size":ft,"--n-tab-text-color":lt,"--n-tab-text-color-active":dt,"--n-tab-text-color-disabled":ct,"--n-tab-text-color-hover":bt,"--n-pane-text-color":Ue,"--n-tab-border-color":Xe,"--n-tab-border-radius":Ge,"--n-close-size":Qe,"--n-close-icon-size":et,"--n-close-color-hover":tt,"--n-close-color-pressed":at,"--n-close-border-radius":rt,"--n-close-icon-color":I,"--n-close-icon-color-hover":E,"--n-close-icon-color-pressed":Y,"--n-tab-color":Ve,"--n-tab-font-weight":Ye,"--n-tab-font-weight-active":Ke,"--n-tab-padding":nt,"--n-tab-padding-vertical":ot,"--n-tab-gap":it,"--n-tab-gap-vertical":st,"--n-pane-padding-left":K(G,"left"),"--n-pane-padding-right":K(G,"right"),"--n-pane-padding-top":K(G,"top"),"--n-pane-padding-bottom":K(G,"bottom"),"--n-font-weight-strong":Je,"--n-tab-color-segment":Ze}}),M=f?Bt("tabs",J(()=>`${P.value[0]}${e.type[0]}`),xe,e):void 0;return Object.assign({mergedClsPrefix:v,mergedValue:_,renderedNames:new Set,segmentCapsuleElRef:D,tabsPaneWrapperRef:X,tabsElRef:h,barElRef:g,addTabInstRef:L,xScrollInstRef:y,scrollWrapperElRef:W,addTabFixed:U,tabWrapperStyle:c,handleNavResize:Ie,mergedSize:P,handleScroll:De,handleTabsResize:He,cssVars:f?void 0:xe,themeClass:M==null?void 0:M.themeClass,animationDirection:ve,renderNameListRef:ue,yScrollElRef:T,handleSegmentResize:Ne,onAnimationBeforeLeave:Le,onAnimationEnter:_e,onAnimationAfterEnter:Ae,onRender:M==null?void 0:M.onRender},Me)},render(){const{mergedClsPrefix:e,type:n,placement:d,addTabFixed:u,addable:l,mergedSize:m,renderNameListRef:v,onRender:f,paneWrapperClass:x,paneWrapperStyle:h,$slots:{default:g,prefix:W,suffix:L}}=this;f==null||f();const y=g?re(g()).filter(p=>p.type.__TAB_PANE__===!0):[],T=g?re(g()).filter(p=>p.type.__TAB__===!0):[],C=!T.length,$=n==="card",P=n==="segment",z=!$&&!P&&this.justifyContent;v.value=[];const H=()=>{const p=b("div",{style:this.tabWrapperStyle,class:[`${e}-tabs-wrapper`]},z?null:b("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}),C?y.map((c,R)=>(v.value.push(c.props.name),de(b(be,Object.assign({},c.props,{internalCreatedByPane:!0,internalLeftPadded:R!==0&&(!z||z==="center"||z==="start"||z==="end")}),c.children?{default:c.children.tab}:void 0)))):T.map((c,R)=>(v.value.push(c.props.name),de(R!==0&&!z?ze(c):c))),!u&&l&&$?Te(l,(C?y.length:T.length)!==0):null,z?null:b("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return b("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},$&&l?b(oe,{onResize:this.handleTabsResize},{default:()=>p}):p,$?b("div",{class:`${e}-tabs-pad`}):null,$?null:b("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},_=P?"top":d;return b("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${n}-type`,`${e}-tabs--${m}-size`,z&&`${e}-tabs--flex`,`${e}-tabs--${_}`],style:this.cssVars},b("div",{class:[`${e}-tabs-nav--${n}-type`,`${e}-tabs-nav--${_}`,`${e}-tabs-nav`]},we(W,p=>p&&b("div",{class:`${e}-tabs-nav__prefix`},p)),P?b(oe,{onResize:this.handleSegmentResize},{default:()=>b("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},b("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},b("div",{class:`${e}-tabs-wrapper`},b("div",{class:`${e}-tabs-tab`}))),C?y.map((p,c)=>(v.value.push(p.props.name),b(be,Object.assign({},p.props,{internalCreatedByPane:!0,internalLeftPadded:c!==0}),p.children?{default:p.children.tab}:void 0))):T.map((p,c)=>(v.value.push(p.props.name),c===0?p:ze(p))))}):b(oe,{onResize:this.handleNavResize},{default:()=>b("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(_)?b(Mt,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:H}):b("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},H()))}),u&&l&&$?Te(l,!0):null,we(L,p=>p&&b("div",{class:`${e}-tabs-nav__suffix`},p))),C&&(this.animated&&(_==="top"||_==="bottom")?b("div",{ref:"tabsPaneWrapperRef",style:h,class:[`${e}-tabs-pane-wrapper`,x]},Re(y,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):Re(y,this.mergedValue,this.renderedNames)))}});function Re(e,n,d,u,l,m,v){const f=[];return e.forEach(x=>{const{name:h,displayDirective:g,"display-directive":W}=x.props,L=T=>g===T||W===T,y=n===h;if(x.key!==void 0&&(x.key=h),y||L("show")||L("show:lazy")&&d.has(h)){d.has(h)||d.add(h);const T=!L("if");f.push(T?jt(x,[[It,y]]):x)}}),v?b(Ot,{name:`${v}-transition`,onBeforeLeave:u,onEnter:l,onAfterEnter:m},{default:()=>f}):f}function Te(e,n){return b(be,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:n,disabled:typeof e=="object"&&e.disabled})}function ze(e){const n=Ht(e);return n.props?n.props.internalLeftPadded=!0:n.props={internalLeftPadded:!0},n}function de(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}export{sa as N,la as a,Ce as t};
