import{w as ae,bF as Tt,bG as Rt,e as $e,cv as an,cw as Ot,d as $,$ as R,bk as He,bs as it,al as Ve,S as d,aa as ut,bH as Ke,bi as sn,am as Ft,ah as at,bC as dn,cx as ct,X as kt,J as Mt,bL as Re,aw as un,ae as Pt,cy as st,Y as _,Z as L,a1 as oe,a0 as ue,ba as Ue,b9 as zt,a7 as ce,L as Ye,aq as It,a4 as ne,cz as cn,cA as fn,q as Oe,ak as ye,ar as _e,V as ft,a8 as dt,aB as ht,aE as hn,c5 as vn,av as gn,c7 as qe,cB as pn,ca as bn,cC as mn,a5 as wn,bB as Bt,C as yn,cD as xn,cE as Cn,a3 as vt,cb as Sn,bc as Tn,aD as Rn,bj as On,bd as Fn,ch as rt,ci as kn,cj as Mn,ck as Pn,ac as zn,ad as In,cl as gt,cF as Bn,af as _n,cm as $n,bp as de,ct as An,cG as En,c1 as Nn,cH as Ln}from"./app-BYB32yAm.js";import{N as tt}from"./Tag-BnmF-oYL.js";function pt(e){switch(typeof e){case"string":return e||void 0;case"number":return String(e);default:return}}function nt(e){const n=e.filter(o=>o!==void 0);if(n.length!==0)return n.length===1?n[0]:o=>{e.forEach(l=>{l&&l(o)})}}function bt(e){return e&-e}class Dn{constructor(n,o){this.l=n,this.min=o;const l=new Array(n+1);for(let r=0;r<n+1;++r)l[r]=0;this.ft=l}add(n,o){if(o===0)return;const{l,ft:r}=this;for(n+=1;n<=l;)r[n]+=o,n+=bt(n)}get(n){return this.sum(n+1)-this.sum(n)}sum(n){if(n===void 0&&(n=this.l),n<=0)return 0;const{ft:o,min:l,l:r}=this;if(n>r)throw new Error("[FinweckTree.sum]: `i` is larger than length.");let u=n*l;for(;n>0;)u+=o[n],n-=bt(n);return u}getBound(n){let o=0,l=this.l;for(;l>o;){const r=Math.floor((o+l)/2),u=this.sum(r);if(u>n){l=r;continue}else if(u<n){if(o===r)return this.sum(o+1)<=n?o+1:r;o=r}else return r}return o}}let We;function jn(){return typeof document>"u"?!1:(We===void 0&&("matchMedia"in window?We=window.matchMedia("(pointer:coarse)").matches:We=!1),We)}let ot;function mt(){return typeof document>"u"?1:(ot===void 0&&(ot="chrome"in window?window.devicePixelRatio:1),ot)}const Vn=Ke(".v-vl",{maxHeight:"inherit",height:"100%",overflow:"auto",minWidth:"1px"},[Ke("&:not(.v-vl--show-scrollbar)",{scrollbarWidth:"none"},[Ke("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",{width:0,height:0,display:"none"})])]),Wn=ae({name:"VirtualList",inheritAttrs:!1,props:{showScrollbar:{type:Boolean,default:!0},items:{type:Array,default:()=>[]},itemSize:{type:Number,required:!0},itemResizable:Boolean,itemsStyle:[String,Object],visibleItemsTag:{type:[String,Object],default:"div"},visibleItemsProps:Object,ignoreItemResize:Boolean,onScroll:Function,onWheel:Function,onResize:Function,defaultScrollKey:[Number,String],defaultScrollIndex:Number,keyField:{type:String,default:"key"},paddingTop:{type:[Number,String],default:0},paddingBottom:{type:[Number,String],default:0}},setup(e){const n=Tt();Vn.mount({id:"vueuc/virtual-list",head:!0,anchorMetaName:Rt,ssr:n}),$e(()=>{const{defaultScrollIndex:v,defaultScrollKey:y}=e;v!=null?b({index:v}):y!=null&&b({key:y})});let o=!1,l=!1;an(()=>{if(o=!1,!l){l=!0;return}b({top:N.value,left:C})}),Ot(()=>{o=!0,l||(l=!0)});const r=$(()=>{const v=new Map,{keyField:y}=e;return e.items.forEach((S,E)=>{v.set(S[y],E)}),v}),u=R(null),h=R(void 0),a=new Map,F=$(()=>{const{items:v,itemSize:y,keyField:S}=e,E=new Dn(v.length,y);return v.forEach((V,W)=>{const H=V[S],K=a.get(H);K!==void 0&&E.add(W,K)}),E}),k=R(0);let C=0;const N=R(0),A=He(()=>Math.max(F.value.getBound(N.value-it(e.paddingTop))-1,0)),I=$(()=>{const{value:v}=h;if(v===void 0)return[];const{items:y,itemSize:S}=e,E=A.value,V=Math.min(E+Math.ceil(v/S+1),y.length-1),W=[];for(let H=E;H<=V;++H)W.push(y[H]);return W}),b=(v,y)=>{if(typeof v=="number"){w(v,y,"auto");return}const{left:S,top:E,index:V,key:W,position:H,behavior:K,debounce:ee=!0}=v;if(S!==void 0||E!==void 0)w(S,E,K);else if(V!==void 0)p(V,K,ee);else if(W!==void 0){const Z=r.value.get(W);Z!==void 0&&p(Z,K,ee)}else H==="bottom"?w(0,Number.MAX_SAFE_INTEGER,K):H==="top"&&w(0,0,K)};let x,m=null;function p(v,y,S){const{value:E}=F,V=E.sum(v)+it(e.paddingTop);if(!S)u.value.scrollTo({left:0,top:V,behavior:y});else{x=v,m!==null&&window.clearTimeout(m),m=window.setTimeout(()=>{x=void 0,m=null},16);const{scrollTop:W,offsetHeight:H}=u.value;if(V>W){const K=E.get(v);V+K<=W+H||u.value.scrollTo({left:0,top:V+K-H,behavior:y})}else u.value.scrollTo({left:0,top:V,behavior:y})}}function w(v,y,S){u.value.scrollTo({left:v,top:y,behavior:S})}function O(v,y){var S,E,V;if(o||e.ignoreItemResize||le(y.target))return;const{value:W}=F,H=r.value.get(v),K=W.get(H),ee=(V=(E=(S=y.borderBoxSize)===null||S===void 0?void 0:S[0])===null||E===void 0?void 0:E.blockSize)!==null&&V!==void 0?V:y.contentRect.height;if(ee===K)return;ee-e.itemSize===0?a.delete(v):a.set(v,ee-e.itemSize);const re=ee-K;if(re===0)return;W.add(H,re);const i=u.value;if(i!=null){if(x===void 0){const f=W.sum(H);i.scrollTop>f&&i.scrollBy(0,re)}else if(H<x)i.scrollBy(0,re);else if(H===x){const f=W.sum(H);ee+f>i.scrollTop+i.offsetHeight&&i.scrollBy(0,re)}Q()}k.value++}const D=!jn();let q=!1;function U(v){var y;(y=e.onScroll)===null||y===void 0||y.call(e,v),(!D||!q)&&Q()}function j(v){var y;if((y=e.onWheel)===null||y===void 0||y.call(e,v),D){const S=u.value;if(S!=null){if(v.deltaX===0&&(S.scrollTop===0&&v.deltaY<=0||S.scrollTop+S.offsetHeight>=S.scrollHeight&&v.deltaY>=0))return;v.preventDefault(),S.scrollTop+=v.deltaY/mt(),S.scrollLeft+=v.deltaX/mt(),Q(),q=!0,sn(()=>{q=!1})}}}function J(v){if(o||le(v.target)||v.contentRect.height===h.value)return;h.value=v.contentRect.height;const{onResize:y}=e;y!==void 0&&y(v)}function Q(){const{value:v}=u;v!=null&&(N.value=v.scrollTop,C=v.scrollLeft)}function le(v){let y=v;for(;y!==null;){if(y.style.display==="none")return!0;y=y.parentElement}return!1}return{listHeight:h,listStyle:{overflow:"auto"},keyToIndex:r,itemsStyle:$(()=>{const{itemResizable:v}=e,y=Ve(F.value.sum());return k.value,[e.itemsStyle,{boxSizing:"content-box",height:v?"":y,minHeight:v?y:"",paddingTop:Ve(e.paddingTop),paddingBottom:Ve(e.paddingBottom)}]}),visibleItemsStyle:$(()=>(k.value,{transform:`translateY(${Ve(F.value.sum(A.value))})`})),viewportItems:I,listElRef:u,itemsElRef:R(null),scrollTo:b,handleListResize:J,handleListScroll:U,handleListWheel:j,handleItemResize:O}},render(){const{itemResizable:e,keyField:n,keyToIndex:o,visibleItemsTag:l}=this;return d(ut,{onResize:this.handleListResize},{default:()=>{var r,u;return d("div",Ft(this.$attrs,{class:["v-vl",this.showScrollbar&&"v-vl--show-scrollbar"],onScroll:this.handleListScroll,onWheel:this.handleListWheel,ref:"listElRef"}),[this.items.length!==0?d("div",{ref:"itemsElRef",class:"v-vl-items",style:this.itemsStyle},[d(l,Object.assign({class:"v-vl-visible-items",style:this.visibleItemsStyle},this.visibleItemsProps),{default:()=>this.viewportItems.map(h=>{const a=h[n],F=o.get(a),k=this.$slots.default({item:h,index:F})[0];return e?d(ut,{key:a,onResize:C=>this.handleItemResize(a,C)},{default:()=>k}):(k.key=a,k)})})]):(u=(r=this.$slots).empty)===null||u===void 0?void 0:u.call(r)])}})}}),ve="v-hidden",Hn=Ke("[v-hidden]",{display:"none!important"}),wt=ae({name:"Overflow",props:{getCounter:Function,getTail:Function,updateCounter:Function,onUpdateCount:Function,onUpdateOverflow:Function},setup(e,{slots:n}){const o=R(null),l=R(null);function r(h){const{value:a}=o,{getCounter:F,getTail:k}=e;let C;if(F!==void 0?C=F():C=l.value,!a||!C)return;C.hasAttribute(ve)&&C.removeAttribute(ve);const{children:N}=a;if(h.showAllItemsBeforeCalculate)for(const O of N)O.hasAttribute(ve)&&O.removeAttribute(ve);const A=a.offsetWidth,I=[],b=n.tail?k==null?void 0:k():null;let x=b?b.offsetWidth:0,m=!1;const p=a.children.length-(n.tail?1:0);for(let O=0;O<p-1;++O){if(O<0)continue;const D=N[O];if(m){D.hasAttribute(ve)||D.setAttribute(ve,"");continue}else D.hasAttribute(ve)&&D.removeAttribute(ve);const q=D.offsetWidth;if(x+=q,I[O]=q,x>A){const{updateCounter:U}=e;for(let j=O;j>=0;--j){const J=p-1-j;U!==void 0?U(J):C.textContent=`${J}`;const Q=C.offsetWidth;if(x-=I[j],x+Q<=A||j===0){m=!0,O=j-1,b&&(O===-1?(b.style.maxWidth=`${A-Q}px`,b.style.boxSizing="border-box"):b.style.maxWidth="");const{onUpdateCount:le}=e;le&&le(J);break}}}}const{onUpdateOverflow:w}=e;m?w!==void 0&&w(!0):(w!==void 0&&w(!1),C.setAttribute(ve,""))}const u=Tt();return Hn.mount({id:"vueuc/overflow",head:!0,anchorMetaName:Rt,ssr:u}),$e(()=>r({showAllItemsBeforeCalculate:!1})),{selfRef:o,counterRef:l,sync:r}},render(){const{$slots:e}=this;return at(()=>this.sync({showAllItemsBeforeCalculate:!1})),d("div",{class:"v-overflow",ref:"selfRef"},[dn(e,"default"),e.counter?e.counter():d("span",{style:{display:"inline-block"},ref:"counterRef"}),e.tail?e.tail():null])}});function _t(e,n){n&&($e(()=>{const{value:o}=e;o&&ct.registerHandler(o,n)}),kt(()=>{const{value:o}=e;o&&ct.unregisterHandler(o)}))}const Kn=ae({name:"Checkmark",render(){return d("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},d("g",{fill:"none"},d("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),Un=ae({props:{onFocus:Function,onBlur:Function},setup(e){return()=>d("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}});function qn(e,n){return d(Pt,{name:"fade-in-scale-up-transition"},{default:()=>e?d(un,{clsPrefix:n,class:`${n}-base-select-option__check`},{default:()=>d(Kn)}):null})}const yt=ae({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:n,pendingTmNodeRef:o,multipleRef:l,valueSetRef:r,renderLabelRef:u,renderOptionRef:h,labelFieldRef:a,valueFieldRef:F,showCheckmarkRef:k,nodePropsRef:C,handleOptionClick:N,handleOptionMouseEnter:A}=Mt(st),I=He(()=>{const{value:p}=o;return p?e.tmNode.key===p.key:!1});function b(p){const{tmNode:w}=e;w.disabled||N(p,w)}function x(p){const{tmNode:w}=e;w.disabled||A(p,w)}function m(p){const{tmNode:w}=e,{value:O}=I;w.disabled||O||A(p,w)}return{multiple:l,isGrouped:He(()=>{const{tmNode:p}=e,{parent:w}=p;return w&&w.rawNode.type==="group"}),showCheckmark:k,nodeProps:C,isPending:I,isSelected:He(()=>{const{value:p}=n,{value:w}=l;if(p===null)return!1;const O=e.tmNode.rawNode[F.value];if(w){const{value:D}=r;return D.has(O)}else return p===O}),labelField:a,renderLabel:u,renderOption:h,handleMouseMove:m,handleMouseEnter:x,handleClick:b}},render(){const{clsPrefix:e,tmNode:{rawNode:n},isSelected:o,isPending:l,isGrouped:r,showCheckmark:u,nodeProps:h,renderOption:a,renderLabel:F,handleClick:k,handleMouseEnter:C,handleMouseMove:N}=this,A=qn(o,e),I=F?[F(n,o),u&&A]:[Re(n[this.labelField],n,o),u&&A],b=h==null?void 0:h(n),x=d("div",Object.assign({},b,{class:[`${e}-base-select-option`,n.class,b==null?void 0:b.class,{[`${e}-base-select-option--disabled`]:n.disabled,[`${e}-base-select-option--selected`]:o,[`${e}-base-select-option--grouped`]:r,[`${e}-base-select-option--pending`]:l,[`${e}-base-select-option--show-checkmark`]:u}],style:[(b==null?void 0:b.style)||"",n.style||""],onClick:nt([k,b==null?void 0:b.onClick]),onMouseenter:nt([C,b==null?void 0:b.onMouseenter]),onMousemove:nt([N,b==null?void 0:b.onMousemove])}),d("div",{class:`${e}-base-select-option__content`},I));return n.render?n.render({node:x,option:n,selected:o}):a?a({node:x,option:n,selected:o}):x}}),xt=ae({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:n,labelFieldRef:o,nodePropsRef:l}=Mt(st);return{labelField:o,nodeProps:l,renderLabel:e,renderOption:n}},render(){const{clsPrefix:e,renderLabel:n,renderOption:o,nodeProps:l,tmNode:{rawNode:r}}=this,u=l==null?void 0:l(r),h=n?n(r,!1):Re(r[this.labelField],r,!1),a=d("div",Object.assign({},u,{class:[`${e}-base-select-group-header`,u==null?void 0:u.class]}),h);return r.render?r.render({node:a,option:r}):o?o({node:a,option:r,selected:!1}):a}}),Gn=_("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[_("scrollbar",`
 max-height: var(--n-height);
 `),_("virtual-list",`
 max-height: var(--n-height);
 `),_("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[L("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),_("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),_("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),L("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),L("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),L("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),L("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),_("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),_("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[oe("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),ue("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),ue("&:active",`
 color: var(--n-option-text-color-pressed);
 `),oe("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),oe("pending",[ue("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),oe("selected",`
 color: var(--n-option-text-color-active);
 `,[ue("&::before",`
 background-color: var(--n-option-color-active);
 `),oe("pending",[ue("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),oe("disabled",`
 cursor: not-allowed;
 `,[Ue("selected",`
 color: var(--n-option-text-color-disabled);
 `),oe("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),L("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[zt({enterScale:"0.5"})])])]),Yn=ae({name:"InternalSelectMenu",props:Object.assign(Object.assign({},ce.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:o}=Ye(e),l=It("InternalSelectMenu",o,n),r=ce("InternalSelectMenu","-internal-select-menu",Gn,cn,e,ne(e,"clsPrefix")),u=R(null),h=R(null),a=R(null),F=$(()=>e.treeMate.getFlattenedNodes()),k=$(()=>fn(F.value)),C=R(null);function N(){const{treeMate:i}=e;let f=null;const{value:G}=e;G===null?f=i.getFirstAvailableNode():(e.multiple?f=i.getNode((G||[])[(G||[]).length-1]):f=i.getNode(G),(!f||f.disabled)&&(f=i.getFirstAvailableNode())),E(f||null)}function A(){const{value:i}=C;i&&!e.treeMate.getNode(i.key)&&(C.value=null)}let I;Oe(()=>e.show,i=>{i?I=Oe(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?N():A(),at(V)):A()},{immediate:!0}):I==null||I()},{immediate:!0}),kt(()=>{I==null||I()});const b=$(()=>it(r.value.self[ye("optionHeight",e.size)])),x=$(()=>_e(r.value.self[ye("padding",e.size)])),m=$(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),p=$(()=>{const i=F.value;return i&&i.length===0});function w(i){const{onToggle:f}=e;f&&f(i)}function O(i){const{onScroll:f}=e;f&&f(i)}function D(i){var f;(f=a.value)===null||f===void 0||f.sync(),O(i)}function q(){var i;(i=a.value)===null||i===void 0||i.sync()}function U(){const{value:i}=C;return i||null}function j(i,f){f.disabled||E(f,!1)}function J(i,f){f.disabled||w(f)}function Q(i){var f;qe(i,"action")||(f=e.onKeyup)===null||f===void 0||f.call(e,i)}function le(i){var f;qe(i,"action")||(f=e.onKeydown)===null||f===void 0||f.call(e,i)}function v(i){var f;(f=e.onMousedown)===null||f===void 0||f.call(e,i),!e.focusable&&i.preventDefault()}function y(){const{value:i}=C;i&&E(i.getNext({loop:!0}),!0)}function S(){const{value:i}=C;i&&E(i.getPrev({loop:!0}),!0)}function E(i,f=!1){C.value=i,f&&V()}function V(){var i,f;const G=C.value;if(!G)return;const fe=k.value(G.key);fe!==null&&(e.virtualScroll?(i=h.value)===null||i===void 0||i.scrollTo({index:fe}):(f=a.value)===null||f===void 0||f.scrollTo({index:fe,elSize:b.value}))}function W(i){var f,G;!((f=u.value)===null||f===void 0)&&f.contains(i.target)&&((G=e.onFocus)===null||G===void 0||G.call(e,i))}function H(i){var f,G;!((f=u.value)===null||f===void 0)&&f.contains(i.relatedTarget)||(G=e.onBlur)===null||G===void 0||G.call(e,i)}ft(st,{handleOptionMouseEnter:j,handleOptionClick:J,valueSetRef:m,pendingTmNodeRef:C,nodePropsRef:ne(e,"nodeProps"),showCheckmarkRef:ne(e,"showCheckmark"),multipleRef:ne(e,"multiple"),valueRef:ne(e,"value"),renderLabelRef:ne(e,"renderLabel"),renderOptionRef:ne(e,"renderOption"),labelFieldRef:ne(e,"labelField"),valueFieldRef:ne(e,"valueField")}),ft(pn,u),$e(()=>{const{value:i}=a;i&&i.sync()});const K=$(()=>{const{size:i}=e,{common:{cubicBezierEaseInOut:f},self:{height:G,borderRadius:fe,color:xe,groupHeaderTextColor:Ce,actionDividerColor:he,optionTextColorPressed:ie,optionTextColor:Se,optionTextColorDisabled:ge,optionTextColorActive:Fe,optionOpacityDisabled:ke,optionCheckColor:Me,actionTextColor:Pe,optionColorPending:be,optionColorActive:me,loadingColor:ze,loadingSize:Ie,optionColorActivePending:Be,[ye("optionFontSize",i)]:Te,[ye("optionHeight",i)]:we,[ye("optionPadding",i)]:te}}=r.value;return{"--n-height":G,"--n-action-divider-color":he,"--n-action-text-color":Pe,"--n-bezier":f,"--n-border-radius":fe,"--n-color":xe,"--n-option-font-size":Te,"--n-group-header-text-color":Ce,"--n-option-check-color":Me,"--n-option-color-pending":be,"--n-option-color-active":me,"--n-option-color-active-pending":Be,"--n-option-height":we,"--n-option-opacity-disabled":ke,"--n-option-text-color":Se,"--n-option-text-color-active":Fe,"--n-option-text-color-disabled":ge,"--n-option-text-color-pressed":ie,"--n-option-padding":te,"--n-option-padding-left":_e(te,"left"),"--n-option-padding-right":_e(te,"right"),"--n-loading-color":ze,"--n-loading-size":Ie}}),{inlineThemeDisabled:ee}=e,Z=ee?dt("internal-select-menu",$(()=>e.size[0]),K,e):void 0,re={selfRef:u,next:y,prev:S,getPendingTmNode:U};return _t(u,e.onResize),Object.assign({mergedTheme:r,mergedClsPrefix:n,rtlEnabled:l,virtualListRef:h,scrollbarRef:a,itemSize:b,padding:x,flattenedNodes:F,empty:p,virtualListContainer(){const{value:i}=h;return i==null?void 0:i.listElRef},virtualListContent(){const{value:i}=h;return i==null?void 0:i.itemsElRef},doScroll:O,handleFocusin:W,handleFocusout:H,handleKeyUp:Q,handleKeyDown:le,handleMouseDown:v,handleVirtualListResize:q,handleVirtualListScroll:D,cssVars:ee?void 0:K,themeClass:Z==null?void 0:Z.themeClass,onRender:Z==null?void 0:Z.onRender},re)},render(){const{$slots:e,virtualScroll:n,clsPrefix:o,mergedTheme:l,themeClass:r,onRender:u}=this;return u==null||u(),d("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${o}-base-select-menu`,this.rtlEnabled&&`${o}-base-select-menu--rtl`,r,this.multiple&&`${o}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},ht(e.header,h=>h&&d("div",{class:`${o}-base-select-menu__header`,"data-header":!0,key:"header"},h)),this.loading?d("div",{class:`${o}-base-select-menu__loading`},d(hn,{clsPrefix:o,strokeWidth:20})):this.empty?d("div",{class:`${o}-base-select-menu__empty`,"data-empty":!0},gn(e.empty,()=>[d(bn,{theme:l.peers.Empty,themeOverrides:l.peerOverrides.Empty})])):d(vn,{ref:"scrollbarRef",theme:l.peers.Scrollbar,themeOverrides:l.peerOverrides.Scrollbar,scrollable:this.scrollable,container:n?this.virtualListContainer:void 0,content:n?this.virtualListContent:void 0,onScroll:n?void 0:this.doScroll},{default:()=>n?d(Wn,{ref:"virtualListRef",class:`${o}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:h})=>h.isGroup?d(xt,{key:h.key,clsPrefix:o,tmNode:h}):h.ignored?null:d(yt,{clsPrefix:o,key:h.key,tmNode:h})}):d("div",{class:`${o}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(h=>h.isGroup?d(xt,{key:h.key,clsPrefix:o,tmNode:h}):d(yt,{clsPrefix:o,key:h.key,tmNode:h})))}),ht(e.action,h=>h&&[d("div",{class:`${o}-base-select-menu__action`,"data-action":!0,key:"action"},h),d(Un,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),Xn=ue([_("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[_("base-loading",`
 color: var(--n-loading-color);
 `),_("base-selection-tags","min-height: var(--n-height);"),L("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),L("state-border",`
 z-index: 1;
 border-color: #0000;
 `),_("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[L("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),_("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[L("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),_("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[L("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),_("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),_("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[_("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[L("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),L("render-label",`
 color: var(--n-text-color);
 `)]),Ue("disabled",[ue("&:hover",[L("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),oe("focus",[L("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),oe("active",[L("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),_("base-selection-label","background-color: var(--n-color-active);"),_("base-selection-tags","background-color: var(--n-color-active);")])]),oe("disabled","cursor: not-allowed;",[L("arrow",`
 color: var(--n-arrow-color-disabled);
 `),_("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[_("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),L("render-label",`
 color: var(--n-text-color-disabled);
 `)]),_("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),_("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),_("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[L("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),L("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>oe(`${e}-status`,[L("state-border",`border: var(--n-border-${e});`),Ue("disabled",[ue("&:hover",[L("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),oe("active",[L("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),_("base-selection-label",`background-color: var(--n-color-active-${e});`),_("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),oe("focus",[L("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),_("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),_("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[ue("&:last-child","padding-right: 0;"),_("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[L("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),Zn=ae({name:"InternalSelection",props:Object.assign(Object.assign({},ce.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:o}=Ye(e),l=It("InternalSelection",o,n),r=R(null),u=R(null),h=R(null),a=R(null),F=R(null),k=R(null),C=R(null),N=R(null),A=R(null),I=R(null),b=R(!1),x=R(!1),m=R(!1),p=ce("InternalSelection","-internal-selection",Xn,mn,e,ne(e,"clsPrefix")),w=$(()=>e.clearable&&!e.disabled&&(m.value||e.active)),O=$(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):Re(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),D=$(()=>{const s=e.selectedOption;if(s)return s[e.labelField]}),q=$(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function U(){var s;const{value:g}=r;if(g){const{value:Y}=u;Y&&(Y.style.width=`${g.offsetWidth}px`,e.maxTagCount!=="responsive"&&((s=A.value)===null||s===void 0||s.sync({showAllItemsBeforeCalculate:!1})))}}function j(){const{value:s}=I;s&&(s.style.display="none")}function J(){const{value:s}=I;s&&(s.style.display="inline-block")}Oe(ne(e,"active"),s=>{s||j()}),Oe(ne(e,"pattern"),()=>{e.multiple&&at(U)});function Q(s){const{onFocus:g}=e;g&&g(s)}function le(s){const{onBlur:g}=e;g&&g(s)}function v(s){const{onDeleteOption:g}=e;g&&g(s)}function y(s){const{onClear:g}=e;g&&g(s)}function S(s){const{onPatternInput:g}=e;g&&g(s)}function E(s){var g;(!s.relatedTarget||!(!((g=h.value)===null||g===void 0)&&g.contains(s.relatedTarget)))&&Q(s)}function V(s){var g;!((g=h.value)===null||g===void 0)&&g.contains(s.relatedTarget)||le(s)}function W(s){y(s)}function H(){m.value=!0}function K(){m.value=!1}function ee(s){!e.active||!e.filterable||s.target!==u.value&&s.preventDefault()}function Z(s){v(s)}function re(s){if(s.key==="Backspace"&&!i.value&&!e.pattern.length){const{selectedOptions:g}=e;g!=null&&g.length&&Z(g[g.length-1])}}const i=R(!1);let f=null;function G(s){const{value:g}=r;if(g){const Y=s.target.value;g.textContent=Y,U()}e.ignoreComposition&&i.value?f=s:S(s)}function fe(){i.value=!0}function xe(){i.value=!1,e.ignoreComposition&&S(f),f=null}function Ce(s){var g;x.value=!0,(g=e.onPatternFocus)===null||g===void 0||g.call(e,s)}function he(s){var g;x.value=!1,(g=e.onPatternBlur)===null||g===void 0||g.call(e,s)}function ie(){var s,g;if(e.filterable)x.value=!1,(s=k.value)===null||s===void 0||s.blur(),(g=u.value)===null||g===void 0||g.blur();else if(e.multiple){const{value:Y}=a;Y==null||Y.blur()}else{const{value:Y}=F;Y==null||Y.blur()}}function Se(){var s,g,Y;e.filterable?(x.value=!1,(s=k.value)===null||s===void 0||s.focus()):e.multiple?(g=a.value)===null||g===void 0||g.focus():(Y=F.value)===null||Y===void 0||Y.focus()}function ge(){const{value:s}=u;s&&(J(),s.focus())}function Fe(){const{value:s}=u;s&&s.blur()}function ke(s){const{value:g}=C;g&&g.setTextContent(`+${s}`)}function Me(){const{value:s}=N;return s}function Pe(){return u.value}let be=null;function me(){be!==null&&window.clearTimeout(be)}function ze(){e.active||(me(),be=window.setTimeout(()=>{q.value&&(b.value=!0)},100))}function Ie(){me()}function Be(s){s||(me(),b.value=!1)}Oe(q,s=>{s||(b.value=!1)}),$e(()=>{wn(()=>{const s=k.value;s&&(e.disabled?s.removeAttribute("tabindex"):s.tabIndex=x.value?-1:0)})}),_t(h,e.onResize);const{inlineThemeDisabled:Te}=e,we=$(()=>{const{size:s}=e,{common:{cubicBezierEaseInOut:g},self:{borderRadius:Y,color:Xe,placeholderColor:Ze,textColor:Ae,paddingSingle:Ee,paddingMultiple:Ne,caretColor:Je,colorDisabled:Qe,textColorDisabled:Le,placeholderColorDisabled:pe,colorActive:t,boxShadowFocus:c,boxShadowActive:T,boxShadowHover:B,border:P,borderFocus:M,borderHover:z,borderActive:X,arrowColor:se,arrowColorDisabled:et,loadingColor:At,colorActiveWarning:Et,boxShadowFocusWarning:Nt,boxShadowActiveWarning:Lt,boxShadowHoverWarning:Dt,borderWarning:jt,borderFocusWarning:Vt,borderHoverWarning:Wt,borderActiveWarning:Ht,colorActiveError:Kt,boxShadowFocusError:Ut,boxShadowActiveError:qt,boxShadowHoverError:Gt,borderError:Yt,borderFocusError:Xt,borderHoverError:Zt,borderActiveError:Jt,clearColor:Qt,clearColorHover:en,clearColorPressed:tn,clearSize:nn,arrowSize:on,[ye("height",s)]:ln,[ye("fontSize",s)]:rn}}=p.value,De=_e(Ee),je=_e(Ne);return{"--n-bezier":g,"--n-border":P,"--n-border-active":X,"--n-border-focus":M,"--n-border-hover":z,"--n-border-radius":Y,"--n-box-shadow-active":T,"--n-box-shadow-focus":c,"--n-box-shadow-hover":B,"--n-caret-color":Je,"--n-color":Xe,"--n-color-active":t,"--n-color-disabled":Qe,"--n-font-size":rn,"--n-height":ln,"--n-padding-single-top":De.top,"--n-padding-multiple-top":je.top,"--n-padding-single-right":De.right,"--n-padding-multiple-right":je.right,"--n-padding-single-left":De.left,"--n-padding-multiple-left":je.left,"--n-padding-single-bottom":De.bottom,"--n-padding-multiple-bottom":je.bottom,"--n-placeholder-color":Ze,"--n-placeholder-color-disabled":pe,"--n-text-color":Ae,"--n-text-color-disabled":Le,"--n-arrow-color":se,"--n-arrow-color-disabled":et,"--n-loading-color":At,"--n-color-active-warning":Et,"--n-box-shadow-focus-warning":Nt,"--n-box-shadow-active-warning":Lt,"--n-box-shadow-hover-warning":Dt,"--n-border-warning":jt,"--n-border-focus-warning":Vt,"--n-border-hover-warning":Wt,"--n-border-active-warning":Ht,"--n-color-active-error":Kt,"--n-box-shadow-focus-error":Ut,"--n-box-shadow-active-error":qt,"--n-box-shadow-hover-error":Gt,"--n-border-error":Yt,"--n-border-focus-error":Xt,"--n-border-hover-error":Zt,"--n-border-active-error":Jt,"--n-clear-size":nn,"--n-clear-color":Qt,"--n-clear-color-hover":en,"--n-clear-color-pressed":tn,"--n-arrow-size":on}}),te=Te?dt("internal-selection",$(()=>e.size[0]),we,e):void 0;return{mergedTheme:p,mergedClearable:w,mergedClsPrefix:n,rtlEnabled:l,patternInputFocused:x,filterablePlaceholder:O,label:D,selected:q,showTagsPanel:b,isComposing:i,counterRef:C,counterWrapperRef:N,patternInputMirrorRef:r,patternInputRef:u,selfRef:h,multipleElRef:a,singleElRef:F,patternInputWrapperRef:k,overflowRef:A,inputTagElRef:I,handleMouseDown:ee,handleFocusin:E,handleClear:W,handleMouseEnter:H,handleMouseLeave:K,handleDeleteOption:Z,handlePatternKeyDown:re,handlePatternInputInput:G,handlePatternInputBlur:he,handlePatternInputFocus:Ce,handleMouseEnterCounter:ze,handleMouseLeaveCounter:Ie,handleFocusout:V,handleCompositionEnd:xe,handleCompositionStart:fe,onPopoverUpdateShow:Be,focus:Se,focusInput:ge,blur:ie,blurInput:Fe,updateCounter:ke,getCounter:Me,getTail:Pe,renderLabel:e.renderLabel,cssVars:Te?void 0:we,themeClass:te==null?void 0:te.themeClass,onRender:te==null?void 0:te.onRender}},render(){const{status:e,multiple:n,size:o,disabled:l,filterable:r,maxTagCount:u,bordered:h,clsPrefix:a,ellipsisTagPopoverProps:F,onRender:k,renderTag:C,renderLabel:N}=this;k==null||k();const A=u==="responsive",I=typeof u=="number",b=A||I,x=d(Cn,null,{default:()=>d(xn,{clsPrefix:a,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var p,w;return(w=(p=this.$slots).arrow)===null||w===void 0?void 0:w.call(p)}})});let m;if(n){const{labelField:p}=this,w=S=>d("div",{class:`${a}-base-selection-tag-wrapper`,key:S.value},C?C({option:S,handleClose:()=>{this.handleDeleteOption(S)}}):d(tt,{size:o,closable:!S.disabled,disabled:l,onClose:()=>{this.handleDeleteOption(S)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>N?N(S,!0):Re(S[p],S,!0)})),O=()=>(I?this.selectedOptions.slice(0,u):this.selectedOptions).map(w),D=r?d("div",{class:`${a}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},d("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:l,value:this.pattern,autofocus:this.autofocus,class:`${a}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),d("span",{ref:"patternInputMirrorRef",class:`${a}-base-selection-input-tag__mirror`},this.pattern)):null,q=A?()=>d("div",{class:`${a}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},d(tt,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:l})):void 0;let U;if(I){const S=this.selectedOptions.length-u;S>0&&(U=d("div",{class:`${a}-base-selection-tag-wrapper`,key:"__counter__"},d(tt,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:l},{default:()=>`+${S}`})))}const j=A?r?d(wt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:O,counter:q,tail:()=>D}):d(wt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:O,counter:q}):I&&U?O().concat(U):O(),J=b?()=>d("div",{class:`${a}-base-selection-popover`},A?O():this.selectedOptions.map(w)):void 0,Q=b?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},F):null,v=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`},d("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)):null,y=r?d("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-tags`},j,A?null:D,x):d("div",{ref:"multipleElRef",class:`${a}-base-selection-tags`,tabindex:l?void 0:0},j,x);m=d(yn,null,b?d(Bt,Object.assign({},Q,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>y,default:J}):y,v)}else if(r){const p=this.pattern||this.isComposing,w=this.active?!p:!this.selected,O=this.active?!1:this.selected;m=d("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-label`,title:this.patternInputFocused?void 0:pt(this.label)},d("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${a}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:l,disabled:l,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),O?d("div",{class:`${a}-base-selection-label__render-label ${a}-base-selection-overlay`,key:"input"},d("div",{class:`${a}-base-selection-overlay__wrapper`},C?C({option:this.selectedOption,handleClose:()=>{}}):N?N(this.selectedOption,!0):Re(this.label,this.selectedOption,!0))):null,w?d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},d("div",{class:`${a}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,x)}else m=d("div",{ref:"singleElRef",class:`${a}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?d("div",{class:`${a}-base-selection-input`,title:pt(this.label),key:"input"},d("div",{class:`${a}-base-selection-input__content`},C?C({option:this.selectedOption,handleClose:()=>{}}):N?N(this.selectedOption,!0):Re(this.label,this.selectedOption,!0))):d("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},d("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)),x);return d("div",{ref:"selfRef",class:[`${a}-base-selection`,this.rtlEnabled&&`${a}-base-selection--rtl`,this.themeClass,e&&`${a}-base-selection--${e}-status`,{[`${a}-base-selection--active`]:this.active,[`${a}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${a}-base-selection--disabled`]:this.disabled,[`${a}-base-selection--multiple`]:this.multiple,[`${a}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},m,h?d("div",{class:`${a}-base-selection__border`}):null,h?d("div",{class:`${a}-base-selection__state-border`}):null)}});function Ge(e){return e.type==="group"}function $t(e){return e.type==="ignored"}function lt(e,n){try{return!!(1+n.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function Jn(e,n){return{getIsGroup:Ge,getIgnored:$t,getKey(l){return Ge(l)?l.name||l.key||"key-required":l[e]},getChildren(l){return l[n]}}}function Qn(e,n,o,l){if(!n)return e;function r(u){if(!Array.isArray(u))return[];const h=[];for(const a of u)if(Ge(a)){const F=r(a[l]);F.length&&h.push(Object.assign({},a,{[l]:F}))}else{if($t(a))continue;n(o,a)&&h.push(a)}return h}return r(e)}function eo(e,n,o){const l=new Map;return e.forEach(r=>{Ge(r)?r[o].forEach(u=>{l.set(u[n],u)}):l.set(r[n],r)}),l}const to=ue([_("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `),_("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[zt({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),no=Object.assign(Object.assign({},ce.props),{to:rt.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),uo=ae({name:"Select",props:no,setup(e){const{mergedClsPrefixRef:n,mergedBorderedRef:o,namespaceRef:l,inlineThemeDisabled:r}=Ye(e),u=ce("Select","-select",to,Bn,e,n),h=R(e.defaultValue),a=ne(e,"value"),F=vt(a,h),k=R(!1),C=R(""),N=$(()=>{const{valueField:t,childrenField:c}=e,T=Jn(t,c);return Sn(y.value,T)}),A=$(()=>eo(le.value,e.valueField,e.childrenField)),I=R(!1),b=vt(ne(e,"show"),I),x=R(null),m=R(null),p=R(null),{localeRef:w}=Tn("Select"),O=$(()=>{var t;return(t=e.placeholder)!==null&&t!==void 0?t:w.value.placeholder}),D=Rn(e,["items","options"]),q=[],U=R([]),j=R([]),J=R(new Map),Q=$(()=>{const{fallbackOption:t}=e;if(t===void 0){const{labelField:c,valueField:T}=e;return B=>({[c]:String(B),[T]:B})}return t===!1?!1:c=>Object.assign(t(c),{value:c})}),le=$(()=>j.value.concat(U.value).concat(D.value)),v=$(()=>{const{filter:t}=e;if(t)return t;const{labelField:c,valueField:T}=e;return(B,P)=>{if(!P)return!1;const M=P[c];if(typeof M=="string")return lt(B,M);const z=P[T];return typeof z=="string"?lt(B,z):typeof z=="number"?lt(B,String(z)):!1}}),y=$(()=>{if(e.remote)return D.value;{const{value:t}=le,{value:c}=C;return!c.length||!e.filterable?t:Qn(t,v.value,c,e.childrenField)}});function S(t){const c=e.remote,{value:T}=J,{value:B}=A,{value:P}=Q,M=[];return t.forEach(z=>{if(B.has(z))M.push(B.get(z));else if(c&&T.has(z))M.push(T.get(z));else if(P){const X=P(z);X&&M.push(X)}}),M}const E=$(()=>{if(e.multiple){const{value:t}=F;return Array.isArray(t)?S(t):[]}return null}),V=$(()=>{const{value:t}=F;return!e.multiple&&!Array.isArray(t)?t===null?null:S([t])[0]||null:null}),W=On(e),{mergedSizeRef:H,mergedDisabledRef:K,mergedStatusRef:ee}=W;function Z(t,c){const{onChange:T,"onUpdate:value":B,onUpdateValue:P}=e,{nTriggerFormChange:M,nTriggerFormInput:z}=W;T&&de(T,t,c),P&&de(P,t,c),B&&de(B,t,c),h.value=t,M(),z()}function re(t){const{onBlur:c}=e,{nTriggerFormBlur:T}=W;c&&de(c,t),T()}function i(){const{onClear:t}=e;t&&de(t)}function f(t){const{onFocus:c,showOnFocus:T}=e,{nTriggerFormFocus:B}=W;c&&de(c,t),B(),T&&he()}function G(t){const{onSearch:c}=e;c&&de(c,t)}function fe(t){const{onScroll:c}=e;c&&de(c,t)}function xe(){var t;const{remote:c,multiple:T}=e;if(c){const{value:B}=J;if(T){const{valueField:P}=e;(t=E.value)===null||t===void 0||t.forEach(M=>{B.set(M[P],M)})}else{const P=V.value;P&&B.set(P[e.valueField],P)}}}function Ce(t){const{onUpdateShow:c,"onUpdate:show":T}=e;c&&de(c,t),T&&de(T,t),I.value=t}function he(){K.value||(Ce(!0),I.value=!0,e.filterable&&Ne())}function ie(){Ce(!1)}function Se(){C.value="",j.value=q}const ge=R(!1);function Fe(){e.filterable&&(ge.value=!0)}function ke(){e.filterable&&(ge.value=!1,b.value||Se())}function Me(){K.value||(b.value?e.filterable?Ne():ie():he())}function Pe(t){var c,T;!((T=(c=p.value)===null||c===void 0?void 0:c.selfRef)===null||T===void 0)&&T.contains(t.relatedTarget)||(k.value=!1,re(t),ie())}function be(t){f(t),k.value=!0}function me(t){k.value=!0}function ze(t){var c;!((c=x.value)===null||c===void 0)&&c.$el.contains(t.relatedTarget)||(k.value=!1,re(t),ie())}function Ie(){var t;(t=x.value)===null||t===void 0||t.focus(),ie()}function Be(t){var c;b.value&&(!((c=x.value)===null||c===void 0)&&c.$el.contains(_n(t))||ie())}function Te(t){if(!Array.isArray(t))return[];if(Q.value)return Array.from(t);{const{remote:c}=e,{value:T}=A;if(c){const{value:B}=J;return t.filter(P=>T.has(P)||B.has(P))}else return t.filter(B=>T.has(B))}}function we(t){te(t.rawNode)}function te(t){if(K.value)return;const{tag:c,remote:T,clearFilterAfterSelect:B,valueField:P}=e;if(c&&!T){const{value:M}=j,z=M[0]||null;if(z){const X=U.value;X.length?X.push(z):U.value=[z],j.value=q}}if(T&&J.value.set(t[P],t),e.multiple){const M=Te(F.value),z=M.findIndex(X=>X===t[P]);if(~z){if(M.splice(z,1),c&&!T){const X=s(t[P]);~X&&(U.value.splice(X,1),B&&(C.value=""))}}else M.push(t[P]),B&&(C.value="");Z(M,S(M))}else{if(c&&!T){const M=s(t[P]);~M?U.value=[U.value[M]]:U.value=q}Ee(),ie(),Z(t[P],t)}}function s(t){return U.value.findIndex(T=>T[e.valueField]===t)}function g(t){b.value||he();const{value:c}=t.target;C.value=c;const{tag:T,remote:B}=e;if(G(c),T&&!B){if(!c){j.value=q;return}const{onCreate:P}=e,M=P?P(c):{[e.labelField]:c,[e.valueField]:c},{valueField:z,labelField:X}=e;D.value.some(se=>se[z]===M[z]||se[X]===M[X])||U.value.some(se=>se[z]===M[z]||se[X]===M[X])?j.value=q:j.value=[M]}}function Y(t){t.stopPropagation();const{multiple:c}=e;!c&&e.filterable&&ie(),i(),c?Z([],[]):Z(null,null)}function Xe(t){!qe(t,"action")&&!qe(t,"empty")&&t.preventDefault()}function Ze(t){fe(t)}function Ae(t){var c,T,B,P,M;if(!e.keyboard){t.preventDefault();return}switch(t.key){case" ":if(e.filterable)break;t.preventDefault();case"Enter":if(!(!((c=x.value)===null||c===void 0)&&c.isComposing)){if(b.value){const z=(T=p.value)===null||T===void 0?void 0:T.getPendingTmNode();z?we(z):e.filterable||(ie(),Ee())}else if(he(),e.tag&&ge.value){const z=j.value[0];if(z){const X=z[e.valueField],{value:se}=F;e.multiple&&Array.isArray(se)&&se.some(et=>et===X)||te(z)}}}t.preventDefault();break;case"ArrowUp":if(t.preventDefault(),e.loading)return;b.value&&((B=p.value)===null||B===void 0||B.prev());break;case"ArrowDown":if(t.preventDefault(),e.loading)return;b.value?(P=p.value)===null||P===void 0||P.next():he();break;case"Escape":b.value&&($n(t),ie()),(M=x.value)===null||M===void 0||M.focus();break}}function Ee(){var t;(t=x.value)===null||t===void 0||t.focus()}function Ne(){var t;(t=x.value)===null||t===void 0||t.focusInput()}function Je(){var t;b.value&&((t=m.value)===null||t===void 0||t.syncPosition())}xe(),Oe(ne(e,"options"),xe);const Qe={focus:()=>{var t;(t=x.value)===null||t===void 0||t.focus()},focusInput:()=>{var t;(t=x.value)===null||t===void 0||t.focusInput()},blur:()=>{var t;(t=x.value)===null||t===void 0||t.blur()},blurInput:()=>{var t;(t=x.value)===null||t===void 0||t.blurInput()}},Le=$(()=>{const{self:{menuBoxShadow:t}}=u.value;return{"--n-menu-box-shadow":t}}),pe=r?dt("select",void 0,Le,e):void 0;return Object.assign(Object.assign({},Qe),{mergedStatus:ee,mergedClsPrefix:n,mergedBordered:o,namespace:l,treeMate:N,isMounted:Fn(),triggerRef:x,menuRef:p,pattern:C,uncontrolledShow:I,mergedShow:b,adjustedTo:rt(e),uncontrolledValue:h,mergedValue:F,followerRef:m,localizedPlaceholder:O,selectedOption:V,selectedOptions:E,mergedSize:H,mergedDisabled:K,focused:k,activeWithoutMenuOpen:ge,inlineThemeDisabled:r,onTriggerInputFocus:Fe,onTriggerInputBlur:ke,handleTriggerOrMenuResize:Je,handleMenuFocus:me,handleMenuBlur:ze,handleMenuTabOut:Ie,handleTriggerClick:Me,handleToggle:we,handleDeleteOption:te,handlePatternInput:g,handleClear:Y,handleTriggerBlur:Pe,handleTriggerFocus:be,handleKeydown:Ae,handleMenuAfterLeave:Se,handleMenuClickOutside:Be,handleMenuScroll:Ze,handleMenuKeydown:Ae,handleMenuMousedown:Xe,mergedTheme:u,cssVars:r?void 0:Le,themeClass:pe==null?void 0:pe.themeClass,onRender:pe==null?void 0:pe.onRender})},render(){return d("div",{class:`${this.mergedClsPrefix}-select`},d(kn,null,{default:()=>[d(Mn,null,{default:()=>d(Zn,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,n;return[(n=(e=this.$slots).arrow)===null||n===void 0?void 0:n.call(e)]}})}),d(Pn,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===rt.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>d(Pt,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,n,o;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),zn(d(Yn,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(n=this.menuProps)===null||n===void 0?void 0:n.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:"medium",renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(o=this.menuProps)===null||o===void 0?void 0:o.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var l,r;return[(r=(l=this.$slots).empty)===null||r===void 0?void 0:r.call(l)]},header:()=>{var l,r;return[(r=(l=this.$slots).header)===null||r===void 0?void 0:r.call(l)]},action:()=>{var l,r;return[(r=(l=this.$slots).action)===null||r===void 0?void 0:r.call(l)]}}),this.displayDirective==="show"?[[In,this.mergedShow],[gt,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[gt,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}}),oo=Object.assign(Object.assign({},An),ce.props),lo=ae({name:"Tooltip",props:oo,__popover__:!0,setup(e){const{mergedClsPrefixRef:n}=Ye(e),o=ce("Tooltip","-tooltip",void 0,En,e,n),l=R(null);return Object.assign(Object.assign({},{syncPosition(){l.value.syncPosition()},setShow(u){l.value.setShow(u)}}),{popoverRef:l,mergedTheme:o,popoverThemeOverrides:$(()=>o.value.self)})},render(){const{mergedTheme:e,internalExtraClass:n}=this;return d(Bt,Object.assign(Object.assign({},this.$props),{theme:e.peers.Popover,themeOverrides:e.peerOverrides.Popover,builtinThemeOverrides:this.popoverThemeOverrides,internalExtraClass:n.concat("tooltip"),ref:"popoverRef"}),this.$slots)}}),io=_("ellipsis",{overflow:"hidden"},[Ue("line-clamp",`
 white-space: nowrap;
 display: inline-block;
 vertical-align: bottom;
 max-width: 100%;
 `),oe("line-clamp",`
 display: -webkit-inline-box;
 -webkit-box-orient: vertical;
 `),oe("cursor-pointer",`
 cursor: pointer;
 `)]);function Ct(e){return`${e}-ellipsis--line-clamp`}function St(e,n){return`${e}-ellipsis--cursor-${n}`}const ro=Object.assign(Object.assign({},ce.props),{expandTrigger:String,lineClamp:[Number,String],tooltip:{type:[Boolean,Object],default:!0}}),co=ae({name:"Ellipsis",inheritAttrs:!1,props:ro,setup(e,{slots:n,attrs:o}){const l=Nn(),r=ce("Ellipsis","-ellipsis",io,Ln,e,l),u=R(null),h=R(null),a=R(null),F=R(!1),k=$(()=>{const{lineClamp:m}=e,{value:p}=F;return m!==void 0?{textOverflow:"","-webkit-line-clamp":p?"":m}:{textOverflow:p?"":"ellipsis","-webkit-line-clamp":""}});function C(){let m=!1;const{value:p}=F;if(p)return!0;const{value:w}=u;if(w){const{lineClamp:O}=e;if(I(w),O!==void 0)m=w.scrollHeight<=w.offsetHeight;else{const{value:D}=h;D&&(m=D.getBoundingClientRect().width<=w.getBoundingClientRect().width)}b(w,m)}return m}const N=$(()=>e.expandTrigger==="click"?()=>{var m;const{value:p}=F;p&&((m=a.value)===null||m===void 0||m.setShow(!1)),F.value=!p}:void 0);Ot(()=>{var m;e.tooltip&&((m=a.value)===null||m===void 0||m.setShow(!1))});const A=()=>d("span",Object.assign({},Ft(o,{class:[`${l.value}-ellipsis`,e.lineClamp!==void 0?Ct(l.value):void 0,e.expandTrigger==="click"?St(l.value,"pointer"):void 0],style:k.value}),{ref:"triggerRef",onClick:N.value,onMouseenter:e.expandTrigger==="click"?C:void 0}),e.lineClamp?n:d("span",{ref:"triggerInnerRef"},n));function I(m){if(!m)return;const p=k.value,w=Ct(l.value);e.lineClamp!==void 0?x(m,w,"add"):x(m,w,"remove");for(const O in p)m.style[O]!==p[O]&&(m.style[O]=p[O])}function b(m,p){const w=St(l.value,"pointer");e.expandTrigger==="click"&&!p?x(m,w,"add"):x(m,w,"remove")}function x(m,p,w){w==="add"?m.classList.contains(p)||m.classList.add(p):m.classList.contains(p)&&m.classList.remove(p)}return{mergedTheme:r,triggerRef:u,triggerInnerRef:h,tooltipRef:a,handleClick:N,renderTrigger:A,getTooltipDisabled:C}},render(){var e;const{tooltip:n,renderTrigger:o,$slots:l}=this;if(n){const{mergedTheme:r}=this;return d(lo,Object.assign({ref:"tooltipRef",placement:"top"},n,{getDisabled:this.getTooltipDisabled,theme:r.peers.Tooltip,themeOverrides:r.peerOverrides.Tooltip}),{trigger:o,default:(e=l.tooltip)!==null&&e!==void 0?e:l.default})}else return o()}});export{Un as F,co as N,Wn as V,lo as a,uo as b,Ct as c,St as d,ro as e,Yn as f,Jn as g,nt as m,io as s};
