import{w as V,$ as A,bQ as xt,bR as mt,S as s,bS as we,bT as yt,bU as ee,bV as wt,X as n,bz as Q,Y as R,a0 as o,K as We,a6 as te,d as N,a7 as _e,C as Le,bW as Ct,E as St,I as Be,J as Rt,am as $t,ax as Tt,bX as zt,av as Pt,bY as Wt,Z as C,aE as Ce,a8 as ie,a2 as _t,q as oe,e as Lt,V as Bt,a3 as k,bZ as At,a4 as Et,ak as j,at as Z,aC as Se,a9 as se,b_ as kt,bq as J,bF as jt,ag as le,ab as It,ac as Ot,b$ as Ht,W as Ft}from"./app-D_NcfV-1.js";const Dt=we(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[we("&::-webkit-scrollbar",{width:0,height:0})]),Mt=V({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=A(null);function r(d){!(d.currentTarget.offsetWidth<d.currentTarget.scrollWidth)||d.deltaY===0||(d.currentTarget.scrollLeft+=d.deltaY+d.deltaX,d.preventDefault())}const l=xt();return Dt.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:mt,ssr:l}),Object.assign({selfRef:e,handleWheel:r},{scrollTo(...d){var u;(u=e.value)===null||u===void 0||u.scrollTo(...d)}})},render(){return s("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}});var Vt=/\s/;function Nt(e){for(var r=e.length;r--&&Vt.test(e.charAt(r)););return r}var Xt=/^\s+/;function Ut(e){return e&&e.slice(0,Nt(e)+1).replace(Xt,"")}var Re=NaN,Yt=/^[-+]0x[0-9a-f]+$/i,qt=/^0b[01]+$/i,Gt=/^0o[0-7]+$/i,Kt=parseInt;function $e(e){if(typeof e=="number")return e;if(yt(e))return Re;if(ee(e)){var r=typeof e.valueOf=="function"?e.valueOf():e;e=ee(r)?r+"":r}if(typeof e!="string")return e===0?e:+e;e=Ut(e);var l=qt.test(e);return l||Gt.test(e)?Kt(e.slice(2),l?2:8):Yt.test(e)?Re:+e}var de=function(){return wt.Date.now()},Zt="Expected a function",Jt=Math.max,Qt=Math.min;function ea(e,r,l){var p,d,u,c,v,x,g=0,m=!1,_=!1,L=!0;if(typeof e!="function")throw new TypeError(Zt);r=$e(r)||0,ee(l)&&(m=!!l.leading,_="maxWait"in l,u=_?Jt($e(l.maxWait)||0,r):u,L="trailing"in l?!!l.trailing:L);function y(f){var $=p,F=d;return p=d=void 0,g=f,c=e.apply(F,$),c}function T(f){return g=f,v=setTimeout(W,r),m?y(f):c}function S(f){var $=f-x,F=f-g,X=r-$;return _?Qt(X,u-F):X}function P(f){var $=f-x,F=f-g;return x===void 0||$>=r||$<0||_&&F>=u}function W(){var f=de();if(P(f))return z(f);v=setTimeout(W,S(f))}function z(f){return v=void 0,L&&p?y(f):(p=d=void 0,c)}function H(){v!==void 0&&clearTimeout(v),g=0,p=x=d=v=void 0}function B(){return v===void 0?c:z(de())}function h(){var f=de(),$=P(f);if(p=arguments,d=this,x=f,$){if(v===void 0)return T(x);if(_)return clearTimeout(v),v=setTimeout(W,r),y(x)}return v===void 0&&(v=setTimeout(W,r)),c}return h.cancel=H,h.flush=B,h}var ta="Expected a function";function ce(e,r,l){var p=!0,d=!0;if(typeof e!="function")throw new TypeError(ta);return ee(l)&&(p="leading"in l?!!l.leading:p,d="trailing"in l?!!l.trailing:d),ea(e,r,{leading:p,maxWait:r,trailing:d})}const aa=V({name:"Add",render(){return s("svg",{width:"512",height:"512",viewBox:"0 0 512 512",fill:"none",xmlns:"http://www.w3.org/2000/svg"},s("path",{d:"M256 112V400M400 256H112",stroke:"currentColor","stroke-width":"32","stroke-linecap":"round","stroke-linejoin":"round"}))}}),ra=n("divider",`
 position: relative;
 display: flex;
 width: 100%;
 box-sizing: border-box;
 font-size: 16px;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
`,[Q("vertical",`
 margin-top: 24px;
 margin-bottom: 24px;
 `,[Q("no-title",`
 display: flex;
 align-items: center;
 `)]),R("title",`
 display: flex;
 align-items: center;
 margin-left: 12px;
 margin-right: 12px;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 `),o("title-position-left",[R("line",[o("left",{width:"28px"})])]),o("title-position-right",[R("line",[o("right",{width:"28px"})])]),o("dashed",[R("line",`
 background-color: #0000;
 height: 0px;
 width: 100%;
 border-style: dashed;
 border-width: 1px 0 0;
 `)]),o("vertical",`
 display: inline-block;
 height: 1em;
 margin: 0 8px;
 vertical-align: middle;
 width: 1px;
 `),R("line",`
 border: none;
 transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier);
 height: 1px;
 width: 100%;
 margin: 0;
 `),Q("dashed",[R("line",{backgroundColor:"var(--n-color)"})]),o("dashed",[R("line",{borderColor:"var(--n-color)"})]),o("vertical",{backgroundColor:"var(--n-color)"})]),na=Object.assign(Object.assign({},te.props),{titlePlacement:{type:String,default:"center"},dashed:Boolean,vertical:Boolean}),da=V({name:"Divider",props:na,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:l}=We(e),p=te("Divider","-divider",ra,Ct,e,r),d=N(()=>{const{common:{cubicBezierEaseInOut:c},self:{color:v,textColor:x,fontWeight:g}}=p.value;return{"--n-bezier":c,"--n-color":v,"--n-text-color":x,"--n-font-weight":g}}),u=l?_e("divider",void 0,d,e):void 0;return{mergedClsPrefix:r,cssVars:l?void 0:d,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender}},render(){var e;const{$slots:r,titlePlacement:l,vertical:p,dashed:d,cssVars:u,mergedClsPrefix:c}=this;return(e=this.onRender)===null||e===void 0||e.call(this),s("div",{role:"separator",class:[`${c}-divider`,this.themeClass,{[`${c}-divider--vertical`]:p,[`${c}-divider--no-title`]:!r.default,[`${c}-divider--dashed`]:d,[`${c}-divider--title-position-${l}`]:r.default&&l}],style:u},p?null:s("div",{class:`${c}-divider__line ${c}-divider__line--left`}),!p&&r.default?s(Le,null,s("div",{class:`${c}-divider__title`},this.$slots),s("div",{class:`${c}-divider__line ${c}-divider__line--right`})):null)}}),pe=St("n-tabs"),Ae={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},ca=V({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:Ae,setup(e){const r=Be(pe,null);return r||Rt("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:r.paneStyleRef,class:r.paneClassRef,mergedClsPrefix:r.mergedClsPrefixRef}},render(){return s("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),ia=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},Wt(Ae,["displayDirective"])),fe=V({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:ia,setup(e){const{mergedClsPrefixRef:r,valueRef:l,typeRef:p,closableRef:d,tabStyleRef:u,addTabStyleRef:c,tabClassRef:v,addTabClassRef:x,tabChangeIdRef:g,onBeforeLeaveRef:m,triggerRef:_,handleAdd:L,activateTab:y,handleClose:T}=Be(pe);return{trigger:_,mergedClosable:N(()=>{if(e.internalAddable)return!1;const{closable:S}=e;return S===void 0?d.value:S}),style:u,addStyle:c,tabClass:v,addTabClass:x,clsPrefix:r,value:l,type:p,handleClose(S){S.stopPropagation(),!e.disabled&&T(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){L();return}const{name:S}=e,P=++g.id;if(S!==l.value){const{value:W}=m;W?Promise.resolve(W(e.name,l.value)).then(z=>{z&&g.id===P&&y(S)}):y(S)}}}},render(){const{internalAddable:e,clsPrefix:r,name:l,disabled:p,label:d,tab:u,value:c,mergedClosable:v,trigger:x,$slots:{default:g}}=this,m=d??u;return s("div",{class:`${r}-tabs-tab-wrapper`},this.internalLeftPadded?s("div",{class:`${r}-tabs-tab-pad`}):null,s("div",Object.assign({key:l,"data-name":l,"data-disabled":p?!0:void 0},$t({class:[`${r}-tabs-tab`,c===l&&`${r}-tabs-tab--active`,p&&`${r}-tabs-tab--disabled`,v&&`${r}-tabs-tab--closable`,e&&`${r}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:x==="click"?this.activateTab:void 0,onMouseenter:x==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),s("span",{class:`${r}-tabs-tab__label`},e?s(Le,null,s("div",{class:`${r}-tabs-tab__height-placeholder`}," "),s(Tt,{clsPrefix:r},{default:()=>s(aa,null)})):g?g():typeof m=="object"?m:zt(m??l)),v&&this.type==="card"?s(Pt,{clsPrefix:r,class:`${r}-tabs-tab__close`,onClick:this.handleClose,disabled:p}):null))}}),oa=n("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[o("segment-type",[n("tabs-rail",[C("&.transition-disabled",[n("tabs-capsule",`
 transition: none;
 `)])])]),o("top",[n("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),o("left",[n("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),o("left, right",`
 flex-direction: row;
 `,[n("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),n("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),o("right",`
 flex-direction: row-reverse;
 `,[n("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),n("tabs-bar",`
 left: 0;
 `)]),o("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[n("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),n("tabs-bar",`
 top: 0;
 `)]),n("tabs-rail",`
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[n("tabs-capsule",`
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: transform 0.3s var(--n-bezier);
 `),n("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[n("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[o("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `),C("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),o("flex",[n("tabs-nav",`
 width: 100%;
 position: relative;
 `,[n("tabs-wrapper",`
 width: 100%;
 `,[n("tabs-tab",`
 margin-right: 0;
 `)])])]),n("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[R("prefix, suffix",`
 display: flex;
 align-items: center;
 `),R("prefix","padding-right: 16px;"),R("suffix","padding-left: 16px;")]),o("top, bottom",[n("tabs-nav-scroll-wrapper",[C("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),C("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),o("shadow-start",[C("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),o("shadow-end",[C("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),o("left, right",[n("tabs-nav-scroll-content",`
 flex-direction: column;
 `),n("tabs-nav-scroll-wrapper",[C("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),C("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),o("shadow-start",[C("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),o("shadow-end",[C("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),n("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[n("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[C("&::-webkit-scrollbar",`
 width: 0;
 height: 0;
 `)]),C("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),n("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),n("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),n("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),n("tabs-tab",`
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
 `,[o("disabled",{cursor:"not-allowed"}),R("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),R("label",`
 display: flex;
 align-items: center;
 z-index: 1;
 `)]),n("tabs-bar",`
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
 `,[C("&.transition-disabled",`
 transition: none;
 `),o("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),n("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),n("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[C("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),C("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),C("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),C("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),C("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),n("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),o("line-type, bar-type",[n("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[C("&:hover",{color:"var(--n-tab-text-color-hover)"}),o("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),o("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),n("tabs-nav",[o("line-type",[o("top",[R("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),n("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),n("tabs-bar",`
 bottom: -1px;
 `)]),o("left",[R("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),n("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),n("tabs-bar",`
 right: -1px;
 `)]),o("right",[R("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),n("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),n("tabs-bar",`
 left: -1px;
 `)]),o("bottom",[R("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),n("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),n("tabs-bar",`
 top: -1px;
 `)]),R("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),n("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),n("tabs-bar",`
 border-radius: 0;
 `)]),o("card-type",[R("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-tab-border-color);
 `),n("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `),n("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),n("tabs-tab",`
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
 `,[o("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 `,[R("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),Q("disabled",[C("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),o("closable","padding-right: 8px;"),o("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),o("disabled","color: var(--n-tab-text-color-disabled);")]),n("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);")]),o("left, right",[n("tabs-wrapper",`
 flex-direction: column;
 `,[n("tabs-tab-wrapper",`
 flex-direction: column;
 `,[n("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])])]),o("top",[o("card-type",[n("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[o("active",`
 border-bottom: 1px solid #0000;
 `)]),n("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),n("tabs-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),o("left",[o("card-type",[n("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[o("active",`
 border-right: 1px solid #0000;
 `)]),n("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `),n("tabs-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),o("right",[o("card-type",[n("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[o("active",`
 border-left: 1px solid #0000;
 `)]),n("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `),n("tabs-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),o("bottom",[o("card-type",[n("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[o("active",`
 border-top: 1px solid #0000;
 `)]),n("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `),n("tabs-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),sa=Object.assign(Object.assign({},te.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),ba=V({name:"Tabs",props:sa,setup(e,{slots:r}){var l,p,d,u;const{mergedClsPrefixRef:c,inlineThemeDisabled:v}=We(e),x=te("Tabs","-tabs",oa,kt,e,c),g=A(null),m=A(null),_=A(null),L=A(null),y=A(null),T=A(null),S=A(!0),P=A(!0),W=Ce(e,["labelSize","size"]),z=Ce(e,["activeName","value"]),H=A((p=(l=z.value)!==null&&l!==void 0?l:e.defaultValue)!==null&&p!==void 0?p:r.default?(u=(d=ie(r.default())[0])===null||d===void 0?void 0:d.props)===null||u===void 0?void 0:u.name:null),B=_t(z,H),h={id:0},f=N(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});oe(B,()=>{h.id=0,U(),ve()});function $(){var a;const{value:t}=B;return t===null?null:(a=g.value)===null||a===void 0?void 0:a.querySelector(`[data-name="${t}"]`)}function F(a){if(e.type==="card")return;const{value:t}=m;if(!t)return;const i=t.style.opacity==="0";if(a){const b=`${c.value}-tabs-bar--disabled`,{barWidth:w,placement:I}=e;if(a.dataset.disabled==="true"?t.classList.add(b):t.classList.remove(b),["top","bottom"].includes(I)){if(ue(["top","maxHeight","height"]),typeof w=="number"&&a.offsetWidth>=w){const E=Math.floor((a.offsetWidth-w)/2)+a.offsetLeft;t.style.left=`${E}px`,t.style.maxWidth=`${w}px`}else t.style.left=`${a.offsetLeft}px`,t.style.maxWidth=`${a.offsetWidth}px`;t.style.width="8192px",i&&(t.style.transition="none"),t.offsetWidth,i&&(t.style.transition="",t.style.opacity="1")}else{if(ue(["left","maxWidth","width"]),typeof w=="number"&&a.offsetHeight>=w){const E=Math.floor((a.offsetHeight-w)/2)+a.offsetTop;t.style.top=`${E}px`,t.style.maxHeight=`${w}px`}else t.style.top=`${a.offsetTop}px`,t.style.maxHeight=`${a.offsetHeight}px`;t.style.height="8192px",i&&(t.style.transition="none"),t.offsetHeight,i&&(t.style.transition="",t.style.opacity="1")}}}function X(){if(e.type==="card")return;const{value:a}=m;a&&(a.style.opacity="0")}function ue(a){const{value:t}=m;if(t)for(const i of a)t.style[i]=""}function U(){if(e.type==="card")return;const a=$();a?F(a):X()}function ve(a){var t;const i=(t=y.value)===null||t===void 0?void 0:t.$el;if(!i)return;const b=$();if(!b)return;const{scrollLeft:w,offsetWidth:I}=i,{offsetLeft:E,offsetWidth:G}=b;w>E?i.scrollTo({top:0,left:E,behavior:"smooth"}):E+G>w+I&&i.scrollTo({top:0,left:E+G-I,behavior:"smooth"})}const Y=A(null);let ae=0,O=null;function Ee(a){const t=Y.value;if(t){ae=a.getBoundingClientRect().height;const i=`${ae}px`,b=()=>{t.style.height=i,t.style.maxHeight=i};O?(b(),O(),O=null):O=b}}function ke(a){const t=Y.value;if(t){const i=a.getBoundingClientRect().height,b=()=>{document.body.offsetHeight,t.style.maxHeight=`${i}px`,t.style.height=`${Math.max(ae,i)}px`};O?(O(),O=null,b()):O=b}}function je(){const a=Y.value;if(a){a.style.maxHeight="",a.style.height="";const{paneWrapperStyle:t}=e;if(typeof t=="string")a.style.cssText=t;else if(t){const{maxHeight:i,height:b}=t;i!==void 0&&(a.style.maxHeight=i),b!==void 0&&(a.style.height=b)}}}const he={value:[]},ge=A("next");function Ie(a){const t=B.value;let i="next";for(const b of he.value){if(b===t)break;if(b===a){i="prev";break}}ge.value=i,Oe(a)}function Oe(a){const{onActiveNameChange:t,onUpdateValue:i,"onUpdate:value":b}=e;t&&J(t,a),i&&J(i,a),b&&J(b,a),H.value=a}function He(a){const{onClose:t}=e;t&&J(t,a)}function xe(){const{value:a}=m;if(!a)return;const t="transition-disabled";a.classList.add(t),U(),a.classList.remove(t)}const D=A(null);function re({transitionDisabled:a}){const t=g.value;if(!t)return;a&&t.classList.add("transition-disabled");const i=$();i&&D.value&&(D.value.style.width=`${i.offsetWidth}px`,D.value.style.height=`${i.offsetHeight}px`,D.value.style.transform=`translateX(${i.offsetLeft-t.offsetLeft-jt(getComputedStyle(t).paddingLeft)}px)`,a&&D.value.offsetWidth),a&&t.classList.remove("transition-disabled")}oe([B],()=>{e.type==="segment"&&le(()=>{re({transitionDisabled:!1})})}),Lt(()=>{e.type==="segment"&&re({transitionDisabled:!0})});let me=0;function Fe(a){var t;if(a.contentRect.width===0&&a.contentRect.height===0||me===a.contentRect.width)return;me=a.contentRect.width;const{type:i}=e;if((i==="line"||i==="bar")&&xe(),i!=="segment"){const{placement:b}=e;ne((b==="top"||b==="bottom"?(t=y.value)===null||t===void 0?void 0:t.$el:T.value)||null)}}const De=ce(Fe,64);oe([()=>e.justifyContent,()=>e.size],()=>{le(()=>{const{type:a}=e;(a==="line"||a==="bar")&&xe()})});const q=A(!1);function Me(a){var t;const{target:i,contentRect:{width:b}}=a,w=i.parentElement.offsetWidth;if(!q.value)w<b&&(q.value=!0);else{const{value:I}=L;if(!I)return;w-b>I.$el.offsetWidth&&(q.value=!1)}ne(((t=y.value)===null||t===void 0?void 0:t.$el)||null)}const Ve=ce(Me,64);function Ne(){const{onAdd:a}=e;a&&a(),le(()=>{const t=$(),{value:i}=y;!t||!i||i.scrollTo({left:t.offsetLeft,top:0,behavior:"smooth"})})}function ne(a){if(!a)return;const{placement:t}=e;if(t==="top"||t==="bottom"){const{scrollLeft:i,scrollWidth:b,offsetWidth:w}=a;S.value=i<=0,P.value=i+w>=b}else{const{scrollTop:i,scrollHeight:b,offsetHeight:w}=a;S.value=i<=0,P.value=i+w>=b}}const Xe=ce(a=>{ne(a.target)},64);Bt(pe,{triggerRef:k(e,"trigger"),tabStyleRef:k(e,"tabStyle"),tabClassRef:k(e,"tabClass"),addTabStyleRef:k(e,"addTabStyle"),addTabClassRef:k(e,"addTabClass"),paneClassRef:k(e,"paneClass"),paneStyleRef:k(e,"paneStyle"),mergedClsPrefixRef:c,typeRef:k(e,"type"),closableRef:k(e,"closable"),valueRef:B,tabChangeIdRef:h,onBeforeLeaveRef:k(e,"onBeforeLeave"),activateTab:Ie,handleClose:He,handleAdd:Ne}),At(()=>{U(),ve()}),Et(()=>{const{value:a}=_;if(!a)return;const{value:t}=c,i=`${t}-tabs-nav-scroll-wrapper--shadow-start`,b=`${t}-tabs-nav-scroll-wrapper--shadow-end`;S.value?a.classList.remove(i):a.classList.add(i),P.value?a.classList.remove(b):a.classList.add(b)});const Ue={syncBarPosition:()=>{U()}},Ye=()=>{re({transitionDisabled:!0})},ye=N(()=>{const{value:a}=W,{type:t}=e,i={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[t],b=`${a}${i}`,{self:{barColor:w,closeIconColor:I,closeIconColorHover:E,closeIconColorPressed:G,tabColor:qe,tabBorderColor:Ge,paneTextColor:Ke,tabFontWeight:Ze,tabBorderRadius:Je,tabFontWeightActive:Qe,colorSegment:et,fontWeightStrong:tt,tabColorSegment:at,closeSize:rt,closeIconSize:nt,closeColorHover:it,closeColorPressed:ot,closeBorderRadius:st,[j("panePadding",a)]:K,[j("tabPadding",b)]:lt,[j("tabPaddingVertical",b)]:dt,[j("tabGap",b)]:ct,[j("tabGap",`${b}Vertical`)]:bt,[j("tabTextColor",t)]:ft,[j("tabTextColorActive",t)]:pt,[j("tabTextColorHover",t)]:ut,[j("tabTextColorDisabled",t)]:vt,[j("tabFontSize",a)]:ht},common:{cubicBezierEaseInOut:gt}}=x.value;return{"--n-bezier":gt,"--n-color-segment":et,"--n-bar-color":w,"--n-tab-font-size":ht,"--n-tab-text-color":ft,"--n-tab-text-color-active":pt,"--n-tab-text-color-disabled":vt,"--n-tab-text-color-hover":ut,"--n-pane-text-color":Ke,"--n-tab-border-color":Ge,"--n-tab-border-radius":Je,"--n-close-size":rt,"--n-close-icon-size":nt,"--n-close-color-hover":it,"--n-close-color-pressed":ot,"--n-close-border-radius":st,"--n-close-icon-color":I,"--n-close-icon-color-hover":E,"--n-close-icon-color-pressed":G,"--n-tab-color":qe,"--n-tab-font-weight":Ze,"--n-tab-font-weight-active":Qe,"--n-tab-padding":lt,"--n-tab-padding-vertical":dt,"--n-tab-gap":ct,"--n-tab-gap-vertical":bt,"--n-pane-padding-left":Z(K,"left"),"--n-pane-padding-right":Z(K,"right"),"--n-pane-padding-top":Z(K,"top"),"--n-pane-padding-bottom":Z(K,"bottom"),"--n-font-weight-strong":tt,"--n-tab-color-segment":at}}),M=v?_e("tabs",N(()=>`${W.value[0]}${e.type[0]}`),ye,e):void 0;return Object.assign({mergedClsPrefix:c,mergedValue:B,renderedNames:new Set,segmentCapsuleElRef:D,tabsPaneWrapperRef:Y,tabsElRef:g,barElRef:m,addTabInstRef:L,xScrollInstRef:y,scrollWrapperElRef:_,addTabFixed:q,tabWrapperStyle:f,handleNavResize:De,mergedSize:W,handleScroll:Xe,handleTabsResize:Ve,cssVars:v?void 0:ye,themeClass:M==null?void 0:M.themeClass,animationDirection:ge,renderNameListRef:he,yScrollElRef:T,handleSegmentResize:Ye,onAnimationBeforeLeave:Ee,onAnimationEnter:ke,onAnimationAfterEnter:je,onRender:M==null?void 0:M.onRender},Ue)},render(){const{mergedClsPrefix:e,type:r,placement:l,addTabFixed:p,addable:d,mergedSize:u,renderNameListRef:c,onRender:v,paneWrapperClass:x,paneWrapperStyle:g,$slots:{default:m,prefix:_,suffix:L}}=this;v==null||v();const y=m?ie(m()).filter(h=>h.type.__TAB_PANE__===!0):[],T=m?ie(m()).filter(h=>h.type.__TAB__===!0):[],S=!T.length,P=r==="card",W=r==="segment",z=!P&&!W&&this.justifyContent;c.value=[];const H=()=>{const h=s("div",{style:this.tabWrapperStyle,class:[`${e}-tabs-wrapper`]},z?null:s("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}),S?y.map((f,$)=>(c.value.push(f.props.name),be(s(fe,Object.assign({},f.props,{internalCreatedByPane:!0,internalLeftPadded:$!==0&&(!z||z==="center"||z==="start"||z==="end")}),f.children?{default:f.children.tab}:void 0)))):T.map((f,$)=>(c.value.push(f.props.name),be($!==0&&!z?Pe(f):f))),!p&&d&&P?ze(d,(S?y.length:T.length)!==0):null,z?null:s("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return s("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},P&&d?s(se,{onResize:this.handleTabsResize},{default:()=>h}):h,P?s("div",{class:`${e}-tabs-pad`}):null,P?null:s("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},B=W?"top":l;return s("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${r}-type`,`${e}-tabs--${u}-size`,z&&`${e}-tabs--flex`,`${e}-tabs--${B}`],style:this.cssVars},s("div",{class:[`${e}-tabs-nav--${r}-type`,`${e}-tabs-nav--${B}`,`${e}-tabs-nav`]},Se(_,h=>h&&s("div",{class:`${e}-tabs-nav__prefix`},h)),W?s(se,{onResize:this.handleSegmentResize},{default:()=>s("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},s("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},s("div",{class:`${e}-tabs-wrapper`},s("div",{class:`${e}-tabs-tab`}))),S?y.map((h,f)=>(c.value.push(h.props.name),s(fe,Object.assign({},h.props,{internalCreatedByPane:!0,internalLeftPadded:f!==0}),h.children?{default:h.children.tab}:void 0))):T.map((h,f)=>(c.value.push(h.props.name),f===0?h:Pe(h))))}):s(se,{onResize:this.handleNavResize},{default:()=>s("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(B)?s(Mt,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:H}):s("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},H()))}),p&&d&&P?ze(d,!0):null,Se(L,h=>h&&s("div",{class:`${e}-tabs-nav__suffix`},h))),S&&(this.animated&&(B==="top"||B==="bottom")?s("div",{ref:"tabsPaneWrapperRef",style:g,class:[`${e}-tabs-pane-wrapper`,x]},Te(y,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):Te(y,this.mergedValue,this.renderedNames)))}});function Te(e,r,l,p,d,u,c){const v=[];return e.forEach(x=>{const{name:g,displayDirective:m,"display-directive":_}=x.props,L=T=>m===T||_===T,y=r===g;if(x.key!==void 0&&(x.key=g),y||L("show")||L("show:lazy")&&l.has(g)){l.has(g)||l.add(g);const T=!L("if");v.push(T?It(x,[[Ot,y]]):x)}}),c?s(Ht,{name:`${c}-transition`,onBeforeLeave:p,onEnter:d,onAfterEnter:u},{default:()=>v}):v}function ze(e,r){return s(fe,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:r,disabled:typeof e=="object"&&e.disabled})}function Pe(e){const r=Ft(e);return r.props?r.props.internalLeftPadded=!0:r.props={internalLeftPadded:!0},r}function be(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}export{aa as A,da as N,ca as a,ba as b,$e as t};
