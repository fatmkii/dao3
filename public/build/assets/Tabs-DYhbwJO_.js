import{w as V,$ as A,bm as xt,bn as mt,S as d,bo as we,bp as yt,bq as ee,br as wt,Y as n,b2 as Q,Z as R,a1 as o,L as We,a7 as te,d as N,a8 as _e,C as Le,bs as Ct,I as St,J as Be,K as Rt,an as $t,ay as Tt,bt as zt,aw as Pt,bu as Wt,a0 as C,aR as Ce,a9 as ie,a3 as _t,q as oe,e as Lt,V as Bt,a4 as k,bv as At,a5 as Et,al as j,au as J,aD as Se,aa as se,bw as kt,bh as Z,bx as jt,ah as le,ac as It,ad as Ot,by as Ht,W as Dt}from"./app-B4DzAUIj.js";import{A as Ft}from"./Add-loLTCSkp.js";const Mt=we(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[we("&::-webkit-scrollbar",{width:0,height:0})]),Nt=V({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=A(null);function r(l){!(l.currentTarget.offsetWidth<l.currentTarget.scrollWidth)||l.deltaY===0||(l.currentTarget.scrollLeft+=l.deltaY+l.deltaX,l.preventDefault())}const s=xt();return Mt.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:mt,ssr:s}),Object.assign({selfRef:e,handleWheel:r},{scrollTo(...l){var u;(u=e.value)===null||u===void 0||u.scrollTo(...l)}})},render(){return d("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}});var Vt=/\s/;function Xt(e){for(var r=e.length;r--&&Vt.test(e.charAt(r)););return r}var Ut=/^\s+/;function Yt(e){return e&&e.slice(0,Xt(e)+1).replace(Ut,"")}var Re=NaN,qt=/^[-+]0x[0-9a-f]+$/i,Gt=/^0b[01]+$/i,Kt=/^0o[0-7]+$/i,Jt=parseInt;function $e(e){if(typeof e=="number")return e;if(yt(e))return Re;if(ee(e)){var r=typeof e.valueOf=="function"?e.valueOf():e;e=ee(r)?r+"":r}if(typeof e!="string")return e===0?e:+e;e=Yt(e);var s=Gt.test(e);return s||Kt.test(e)?Jt(e.slice(2),s?2:8):qt.test(e)?Re:+e}var de=function(){return wt.Date.now()},Zt="Expected a function",Qt=Math.max,ea=Math.min;function ta(e,r,s){var p,l,u,c,v,x,g=0,m=!1,_=!1,L=!0;if(typeof e!="function")throw new TypeError(Zt);r=$e(r)||0,ee(s)&&(m=!!s.leading,_="maxWait"in s,u=_?Qt($e(s.maxWait)||0,r):u,L="trailing"in s?!!s.trailing:L);function y(f){var $=p,D=l;return p=l=void 0,g=f,c=e.apply(D,$),c}function T(f){return g=f,v=setTimeout(W,r),m?y(f):c}function S(f){var $=f-x,D=f-g,X=r-$;return _?ea(X,u-D):X}function P(f){var $=f-x,D=f-g;return x===void 0||$>=r||$<0||_&&D>=u}function W(){var f=de();if(P(f))return z(f);v=setTimeout(W,S(f))}function z(f){return v=void 0,L&&p?y(f):(p=l=void 0,c)}function H(){v!==void 0&&clearTimeout(v),g=0,p=x=l=v=void 0}function B(){return v===void 0?c:z(de())}function h(){var f=de(),$=P(f);if(p=arguments,l=this,x=f,$){if(v===void 0)return T(x);if(_)return clearTimeout(v),v=setTimeout(W,r),y(x)}return v===void 0&&(v=setTimeout(W,r)),c}return h.cancel=H,h.flush=B,h}var aa="Expected a function";function ce(e,r,s){var p=!0,l=!0;if(typeof e!="function")throw new TypeError(aa);return ee(s)&&(p="leading"in s?!!s.leading:p,l="trailing"in s?!!s.trailing:l),ta(e,r,{leading:p,maxWait:r,trailing:l})}const ra=n("divider",`
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
 `),Q("dashed",[R("line",{backgroundColor:"var(--n-color)"})]),o("dashed",[R("line",{borderColor:"var(--n-color)"})]),o("vertical",{backgroundColor:"var(--n-color)"})]),na=Object.assign(Object.assign({},te.props),{titlePlacement:{type:String,default:"center"},dashed:Boolean,vertical:Boolean}),ca=V({name:"Divider",props:na,setup(e){const{mergedClsPrefixRef:r,inlineThemeDisabled:s}=We(e),p=te("Divider","-divider",ra,Ct,e,r),l=N(()=>{const{common:{cubicBezierEaseInOut:c},self:{color:v,textColor:x,fontWeight:g}}=p.value;return{"--n-bezier":c,"--n-color":v,"--n-text-color":x,"--n-font-weight":g}}),u=s?_e("divider",void 0,l,e):void 0;return{mergedClsPrefix:r,cssVars:s?void 0:l,themeClass:u==null?void 0:u.themeClass,onRender:u==null?void 0:u.onRender}},render(){var e;const{$slots:r,titlePlacement:s,vertical:p,dashed:l,cssVars:u,mergedClsPrefix:c}=this;return(e=this.onRender)===null||e===void 0||e.call(this),d("div",{role:"separator",class:[`${c}-divider`,this.themeClass,{[`${c}-divider--vertical`]:p,[`${c}-divider--no-title`]:!r.default,[`${c}-divider--dashed`]:l,[`${c}-divider--title-position-${s}`]:r.default&&s}],style:u},p?null:d("div",{class:`${c}-divider__line ${c}-divider__line--left`}),!p&&r.default?d(Le,null,d("div",{class:`${c}-divider__title`},this.$slots),d("div",{class:`${c}-divider__line ${c}-divider__line--right`})):null)}}),pe=St("n-tabs"),Ae={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},ba=V({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:Ae,setup(e){const r=Be(pe,null);return r||Rt("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:r.paneStyleRef,class:r.paneClassRef,mergedClsPrefix:r.mergedClsPrefixRef}},render(){return d("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),ia=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},Wt(Ae,["displayDirective"])),fe=V({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:ia,setup(e){const{mergedClsPrefixRef:r,valueRef:s,typeRef:p,closableRef:l,tabStyleRef:u,addTabStyleRef:c,tabClassRef:v,addTabClassRef:x,tabChangeIdRef:g,onBeforeLeaveRef:m,triggerRef:_,handleAdd:L,activateTab:y,handleClose:T}=Be(pe);return{trigger:_,mergedClosable:N(()=>{if(e.internalAddable)return!1;const{closable:S}=e;return S===void 0?l.value:S}),style:u,addStyle:c,tabClass:v,addTabClass:x,clsPrefix:r,value:s,type:p,handleClose(S){S.stopPropagation(),!e.disabled&&T(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){L();return}const{name:S}=e,P=++g.id;if(S!==s.value){const{value:W}=m;W?Promise.resolve(W(e.name,s.value)).then(z=>{z&&g.id===P&&y(S)}):y(S)}}}},render(){const{internalAddable:e,clsPrefix:r,name:s,disabled:p,label:l,tab:u,value:c,mergedClosable:v,trigger:x,$slots:{default:g}}=this,m=l??u;return d("div",{class:`${r}-tabs-tab-wrapper`},this.internalLeftPadded?d("div",{class:`${r}-tabs-tab-pad`}):null,d("div",Object.assign({key:s,"data-name":s,"data-disabled":p?!0:void 0},$t({class:[`${r}-tabs-tab`,c===s&&`${r}-tabs-tab--active`,p&&`${r}-tabs-tab--disabled`,v&&`${r}-tabs-tab--closable`,e&&`${r}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:x==="click"?this.activateTab:void 0,onMouseenter:x==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),d("span",{class:`${r}-tabs-tab__label`},e?d(Le,null,d("div",{class:`${r}-tabs-tab__height-placeholder`}," "),d(Tt,{clsPrefix:r},{default:()=>d(Ft,null)})):g?g():typeof m=="object"?m:zt(m??s)),v&&this.type==="card"?d(Pt,{clsPrefix:r,class:`${r}-tabs-tab__close`,onClick:this.handleClose,disabled:p}):null))}}),oa=n("tabs",`
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
 `)])])])]),sa=Object.assign(Object.assign({},te.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),fa=V({name:"Tabs",props:sa,setup(e,{slots:r}){var s,p,l,u;const{mergedClsPrefixRef:c,inlineThemeDisabled:v}=We(e),x=te("Tabs","-tabs",oa,kt,e,c),g=A(null),m=A(null),_=A(null),L=A(null),y=A(null),T=A(null),S=A(!0),P=A(!0),W=Ce(e,["labelSize","size"]),z=Ce(e,["activeName","value"]),H=A((p=(s=z.value)!==null&&s!==void 0?s:e.defaultValue)!==null&&p!==void 0?p:r.default?(u=(l=ie(r.default())[0])===null||l===void 0?void 0:l.props)===null||u===void 0?void 0:u.name:null),B=_t(z,H),h={id:0},f=N(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});oe(B,()=>{h.id=0,U(),ve()});function $(){var a;const{value:t}=B;return t===null?null:(a=g.value)===null||a===void 0?void 0:a.querySelector(`[data-name="${t}"]`)}function D(a){if(e.type==="card")return;const{value:t}=m;if(!t)return;const i=t.style.opacity==="0";if(a){const b=`${c.value}-tabs-bar--disabled`,{barWidth:w,placement:I}=e;if(a.dataset.disabled==="true"?t.classList.add(b):t.classList.remove(b),["top","bottom"].includes(I)){if(ue(["top","maxHeight","height"]),typeof w=="number"&&a.offsetWidth>=w){const E=Math.floor((a.offsetWidth-w)/2)+a.offsetLeft;t.style.left=`${E}px`,t.style.maxWidth=`${w}px`}else t.style.left=`${a.offsetLeft}px`,t.style.maxWidth=`${a.offsetWidth}px`;t.style.width="8192px",i&&(t.style.transition="none"),t.offsetWidth,i&&(t.style.transition="",t.style.opacity="1")}else{if(ue(["left","maxWidth","width"]),typeof w=="number"&&a.offsetHeight>=w){const E=Math.floor((a.offsetHeight-w)/2)+a.offsetTop;t.style.top=`${E}px`,t.style.maxHeight=`${w}px`}else t.style.top=`${a.offsetTop}px`,t.style.maxHeight=`${a.offsetHeight}px`;t.style.height="8192px",i&&(t.style.transition="none"),t.offsetHeight,i&&(t.style.transition="",t.style.opacity="1")}}}function X(){if(e.type==="card")return;const{value:a}=m;a&&(a.style.opacity="0")}function ue(a){const{value:t}=m;if(t)for(const i of a)t.style[i]=""}function U(){if(e.type==="card")return;const a=$();a?D(a):X()}function ve(a){var t;const i=(t=y.value)===null||t===void 0?void 0:t.$el;if(!i)return;const b=$();if(!b)return;const{scrollLeft:w,offsetWidth:I}=i,{offsetLeft:E,offsetWidth:G}=b;w>E?i.scrollTo({top:0,left:E,behavior:"smooth"}):E+G>w+I&&i.scrollTo({top:0,left:E+G-I,behavior:"smooth"})}const Y=A(null);let ae=0,O=null;function Ee(a){const t=Y.value;if(t){ae=a.getBoundingClientRect().height;const i=`${ae}px`,b=()=>{t.style.height=i,t.style.maxHeight=i};O?(b(),O(),O=null):O=b}}function ke(a){const t=Y.value;if(t){const i=a.getBoundingClientRect().height,b=()=>{document.body.offsetHeight,t.style.maxHeight=`${i}px`,t.style.height=`${Math.max(ae,i)}px`};O?(O(),O=null,b()):O=b}}function je(){const a=Y.value;if(a){a.style.maxHeight="",a.style.height="";const{paneWrapperStyle:t}=e;if(typeof t=="string")a.style.cssText=t;else if(t){const{maxHeight:i,height:b}=t;i!==void 0&&(a.style.maxHeight=i),b!==void 0&&(a.style.height=b)}}}const he={value:[]},ge=A("next");function Ie(a){const t=B.value;let i="next";for(const b of he.value){if(b===t)break;if(b===a){i="prev";break}}ge.value=i,Oe(a)}function Oe(a){const{onActiveNameChange:t,onUpdateValue:i,"onUpdate:value":b}=e;t&&Z(t,a),i&&Z(i,a),b&&Z(b,a),H.value=a}function He(a){const{onClose:t}=e;t&&Z(t,a)}function xe(){const{value:a}=m;if(!a)return;const t="transition-disabled";a.classList.add(t),U(),a.classList.remove(t)}const F=A(null);function re({transitionDisabled:a}){const t=g.value;if(!t)return;a&&t.classList.add("transition-disabled");const i=$();i&&F.value&&(F.value.style.width=`${i.offsetWidth}px`,F.value.style.height=`${i.offsetHeight}px`,F.value.style.transform=`translateX(${i.offsetLeft-t.offsetLeft-jt(getComputedStyle(t).paddingLeft)}px)`,a&&F.value.offsetWidth),a&&t.classList.remove("transition-disabled")}oe([B],()=>{e.type==="segment"&&le(()=>{re({transitionDisabled:!1})})}),Lt(()=>{e.type==="segment"&&re({transitionDisabled:!0})});let me=0;function De(a){var t;if(a.contentRect.width===0&&a.contentRect.height===0||me===a.contentRect.width)return;me=a.contentRect.width;const{type:i}=e;if((i==="line"||i==="bar")&&xe(),i!=="segment"){const{placement:b}=e;ne((b==="top"||b==="bottom"?(t=y.value)===null||t===void 0?void 0:t.$el:T.value)||null)}}const Fe=ce(De,64);oe([()=>e.justifyContent,()=>e.size],()=>{le(()=>{const{type:a}=e;(a==="line"||a==="bar")&&xe()})});const q=A(!1);function Me(a){var t;const{target:i,contentRect:{width:b}}=a,w=i.parentElement.offsetWidth;if(!q.value)w<b&&(q.value=!0);else{const{value:I}=L;if(!I)return;w-b>I.$el.offsetWidth&&(q.value=!1)}ne(((t=y.value)===null||t===void 0?void 0:t.$el)||null)}const Ne=ce(Me,64);function Ve(){const{onAdd:a}=e;a&&a(),le(()=>{const t=$(),{value:i}=y;!t||!i||i.scrollTo({left:t.offsetLeft,top:0,behavior:"smooth"})})}function ne(a){if(!a)return;const{placement:t}=e;if(t==="top"||t==="bottom"){const{scrollLeft:i,scrollWidth:b,offsetWidth:w}=a;S.value=i<=0,P.value=i+w>=b}else{const{scrollTop:i,scrollHeight:b,offsetHeight:w}=a;S.value=i<=0,P.value=i+w>=b}}const Xe=ce(a=>{ne(a.target)},64);Bt(pe,{triggerRef:k(e,"trigger"),tabStyleRef:k(e,"tabStyle"),tabClassRef:k(e,"tabClass"),addTabStyleRef:k(e,"addTabStyle"),addTabClassRef:k(e,"addTabClass"),paneClassRef:k(e,"paneClass"),paneStyleRef:k(e,"paneStyle"),mergedClsPrefixRef:c,typeRef:k(e,"type"),closableRef:k(e,"closable"),valueRef:B,tabChangeIdRef:h,onBeforeLeaveRef:k(e,"onBeforeLeave"),activateTab:Ie,handleClose:He,handleAdd:Ve}),At(()=>{U(),ve()}),Et(()=>{const{value:a}=_;if(!a)return;const{value:t}=c,i=`${t}-tabs-nav-scroll-wrapper--shadow-start`,b=`${t}-tabs-nav-scroll-wrapper--shadow-end`;S.value?a.classList.remove(i):a.classList.add(i),P.value?a.classList.remove(b):a.classList.add(b)});const Ue={syncBarPosition:()=>{U()}},Ye=()=>{re({transitionDisabled:!0})},ye=N(()=>{const{value:a}=W,{type:t}=e,i={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[t],b=`${a}${i}`,{self:{barColor:w,closeIconColor:I,closeIconColorHover:E,closeIconColorPressed:G,tabColor:qe,tabBorderColor:Ge,paneTextColor:Ke,tabFontWeight:Je,tabBorderRadius:Ze,tabFontWeightActive:Qe,colorSegment:et,fontWeightStrong:tt,tabColorSegment:at,closeSize:rt,closeIconSize:nt,closeColorHover:it,closeColorPressed:ot,closeBorderRadius:st,[j("panePadding",a)]:K,[j("tabPadding",b)]:lt,[j("tabPaddingVertical",b)]:dt,[j("tabGap",b)]:ct,[j("tabGap",`${b}Vertical`)]:bt,[j("tabTextColor",t)]:ft,[j("tabTextColorActive",t)]:pt,[j("tabTextColorHover",t)]:ut,[j("tabTextColorDisabled",t)]:vt,[j("tabFontSize",a)]:ht},common:{cubicBezierEaseInOut:gt}}=x.value;return{"--n-bezier":gt,"--n-color-segment":et,"--n-bar-color":w,"--n-tab-font-size":ht,"--n-tab-text-color":ft,"--n-tab-text-color-active":pt,"--n-tab-text-color-disabled":vt,"--n-tab-text-color-hover":ut,"--n-pane-text-color":Ke,"--n-tab-border-color":Ge,"--n-tab-border-radius":Ze,"--n-close-size":rt,"--n-close-icon-size":nt,"--n-close-color-hover":it,"--n-close-color-pressed":ot,"--n-close-border-radius":st,"--n-close-icon-color":I,"--n-close-icon-color-hover":E,"--n-close-icon-color-pressed":G,"--n-tab-color":qe,"--n-tab-font-weight":Je,"--n-tab-font-weight-active":Qe,"--n-tab-padding":lt,"--n-tab-padding-vertical":dt,"--n-tab-gap":ct,"--n-tab-gap-vertical":bt,"--n-pane-padding-left":J(K,"left"),"--n-pane-padding-right":J(K,"right"),"--n-pane-padding-top":J(K,"top"),"--n-pane-padding-bottom":J(K,"bottom"),"--n-font-weight-strong":tt,"--n-tab-color-segment":at}}),M=v?_e("tabs",N(()=>`${W.value[0]}${e.type[0]}`),ye,e):void 0;return Object.assign({mergedClsPrefix:c,mergedValue:B,renderedNames:new Set,segmentCapsuleElRef:F,tabsPaneWrapperRef:Y,tabsElRef:g,barElRef:m,addTabInstRef:L,xScrollInstRef:y,scrollWrapperElRef:_,addTabFixed:q,tabWrapperStyle:f,handleNavResize:Fe,mergedSize:W,handleScroll:Xe,handleTabsResize:Ne,cssVars:v?void 0:ye,themeClass:M==null?void 0:M.themeClass,animationDirection:ge,renderNameListRef:he,yScrollElRef:T,handleSegmentResize:Ye,onAnimationBeforeLeave:Ee,onAnimationEnter:ke,onAnimationAfterEnter:je,onRender:M==null?void 0:M.onRender},Ue)},render(){const{mergedClsPrefix:e,type:r,placement:s,addTabFixed:p,addable:l,mergedSize:u,renderNameListRef:c,onRender:v,paneWrapperClass:x,paneWrapperStyle:g,$slots:{default:m,prefix:_,suffix:L}}=this;v==null||v();const y=m?ie(m()).filter(h=>h.type.__TAB_PANE__===!0):[],T=m?ie(m()).filter(h=>h.type.__TAB__===!0):[],S=!T.length,P=r==="card",W=r==="segment",z=!P&&!W&&this.justifyContent;c.value=[];const H=()=>{const h=d("div",{style:this.tabWrapperStyle,class:[`${e}-tabs-wrapper`]},z?null:d("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}),S?y.map((f,$)=>(c.value.push(f.props.name),be(d(fe,Object.assign({},f.props,{internalCreatedByPane:!0,internalLeftPadded:$!==0&&(!z||z==="center"||z==="start"||z==="end")}),f.children?{default:f.children.tab}:void 0)))):T.map((f,$)=>(c.value.push(f.props.name),be($!==0&&!z?Pe(f):f))),!p&&l&&P?ze(l,(S?y.length:T.length)!==0):null,z?null:d("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return d("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},P&&l?d(se,{onResize:this.handleTabsResize},{default:()=>h}):h,P?d("div",{class:`${e}-tabs-pad`}):null,P?null:d("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},B=W?"top":s;return d("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${r}-type`,`${e}-tabs--${u}-size`,z&&`${e}-tabs--flex`,`${e}-tabs--${B}`],style:this.cssVars},d("div",{class:[`${e}-tabs-nav--${r}-type`,`${e}-tabs-nav--${B}`,`${e}-tabs-nav`]},Se(_,h=>h&&d("div",{class:`${e}-tabs-nav__prefix`},h)),W?d(se,{onResize:this.handleSegmentResize},{default:()=>d("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},d("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},d("div",{class:`${e}-tabs-wrapper`},d("div",{class:`${e}-tabs-tab`}))),S?y.map((h,f)=>(c.value.push(h.props.name),d(fe,Object.assign({},h.props,{internalCreatedByPane:!0,internalLeftPadded:f!==0}),h.children?{default:h.children.tab}:void 0))):T.map((h,f)=>(c.value.push(h.props.name),f===0?h:Pe(h))))}):d(se,{onResize:this.handleNavResize},{default:()=>d("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(B)?d(Nt,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:H}):d("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},H()))}),p&&l&&P?ze(l,!0):null,Se(L,h=>h&&d("div",{class:`${e}-tabs-nav__suffix`},h))),S&&(this.animated&&(B==="top"||B==="bottom")?d("div",{ref:"tabsPaneWrapperRef",style:g,class:[`${e}-tabs-pane-wrapper`,x]},Te(y,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):Te(y,this.mergedValue,this.renderedNames)))}});function Te(e,r,s,p,l,u,c){const v=[];return e.forEach(x=>{const{name:g,displayDirective:m,"display-directive":_}=x.props,L=T=>m===T||_===T,y=r===g;if(x.key!==void 0&&(x.key=g),y||L("show")||L("show:lazy")&&s.has(g)){s.has(g)||s.add(g);const T=!L("if");v.push(T?It(x,[[Ot,y]]):x)}}),c?d(Ht,{name:`${c}-transition`,onBeforeLeave:p,onEnter:l,onAfterEnter:u},{default:()=>v}):v}function ze(e,r){return d(fe,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:r,disabled:typeof e=="object"&&e.disabled})}function Pe(e){const r=Dt(e);return r.props?r.props.internalLeftPadded=!0:r.props={internalLeftPadded:!0},r}function be(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}export{ca as N,ba as a,fa as b,$e as t};
