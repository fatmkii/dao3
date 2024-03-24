import{w as re,bQ as Tt,bR as Ot,e as $e,cx as dn,cy as Ft,d as P,$ as F,bv as Ke,bF as rt,al as We,S as l,a9 as ut,bS as Ue,bw as cn,am as zt,ag as st,bO as un,cz as ft,T as Mt,X as E,Y as N,Z as de,K as Ee,a6 as se,cA as fn,I as dt,cB as hn,ak as ge,a7 as Ze,ax as Pt,bX as Te,ad as kt,cC as ct,a0 as oe,bz as qe,bh as It,as as _t,a3 as ne,cD as vn,cE as gn,q as Oe,at as Be,V as ht,aC as vt,aF as pn,ce as bn,aw as mn,cf as Ge,cF as wn,cG as yn,a4 as xn,bN as Bt,C as Cn,cH as Sn,a2 as gt,ci as Rn,aE as Tn,bi as On,bj as Fn,bk as at,bl as zn,bm as Mn,bn as Pn,ab as kn,ac as In,bo as pt,cI as _n,ae as Bn,co as $n,bq as ue,cv as En,by as An,cc as Nn,cJ as Ln}from"./app-D_NcfV-1.js";import{u as $t}from"./use-locale-DCgCYyuK.js";import{N as nt}from"./Tag-D-nxO65t.js";import{a as Dn}from"./Input-HQSPwFoy.js";function bt(e){switch(typeof e){case"string":return e||void 0;case"number":return String(e);default:return}}function ot(e){const n=e.filter(o=>o!==void 0);if(n.length!==0)return n.length===1?n[0]:o=>{e.forEach(i=>{i&&i(o)})}}function mt(e){return e&-e}class Vn{constructor(n,o){this.l=n,this.min=o;const i=new Array(n+1);for(let r=0;r<n+1;++r)i[r]=0;this.ft=i}add(n,o){if(o===0)return;const{l:i,ft:r}=this;for(n+=1;n<=i;)r[n]+=o,n+=mt(n)}get(n){return this.sum(n+1)-this.sum(n)}sum(n){if(n===void 0&&(n=this.l),n<=0)return 0;const{ft:o,min:i,l:r}=this;if(n>r)throw new Error("[FinweckTree.sum]: `i` is larger than length.");let c=n*i;for(;n>0;)c+=o[n],n-=mt(n);return c}getBound(n){let o=0,i=this.l;for(;i>o;){const r=Math.floor((o+i)/2),c=this.sum(r);if(c>n){i=r;continue}else if(c<n){if(o===r)return this.sum(o+1)<=n?o+1:r;o=r}else return r}return o}}let He;function jn(){return typeof document>"u"?!1:(He===void 0&&("matchMedia"in window?He=window.matchMedia("(pointer:coarse)").matches:He=!1),He)}let it;function wt(){return typeof document>"u"?1:(it===void 0&&(it="chrome"in window?window.devicePixelRatio:1),it)}const Wn=Ue(".v-vl",{maxHeight:"inherit",height:"100%",overflow:"auto",minWidth:"1px"},[Ue("&:not(.v-vl--show-scrollbar)",{scrollbarWidth:"none"},[Ue("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",{width:0,height:0,display:"none"})])]),Hn=re({name:"VirtualList",inheritAttrs:!1,props:{showScrollbar:{type:Boolean,default:!0},items:{type:Array,default:()=>[]},itemSize:{type:Number,required:!0},itemResizable:Boolean,itemsStyle:[String,Object],visibleItemsTag:{type:[String,Object],default:"div"},visibleItemsProps:Object,ignoreItemResize:Boolean,onScroll:Function,onWheel:Function,onResize:Function,defaultScrollKey:[Number,String],defaultScrollIndex:Number,keyField:{type:String,default:"key"},paddingTop:{type:[Number,String],default:0},paddingBottom:{type:[Number,String],default:0}},setup(e){const n=Tt();Wn.mount({id:"vueuc/virtual-list",head:!0,anchorMetaName:Ot,ssr:n}),$e(()=>{const{defaultScrollIndex:g,defaultScrollKey:C}=e;g!=null?p({index:g}):C!=null&&p({key:C})});let o=!1,i=!1;dn(()=>{if(o=!1,!i){i=!0;return}p({top:M.value,left:v})}),Ft(()=>{o=!0,i||(i=!0)});const r=P(()=>{const g=new Map,{keyField:C}=e;return e.items.forEach((S,L)=>{g.set(S[C],L)}),g}),c=F(null),f=F(void 0),a=new Map,R=P(()=>{const{items:g,itemSize:C,keyField:S}=e,L=new Vn(g.length,C);return g.forEach((j,W)=>{const H=j[S],K=a.get(H);K!==void 0&&L.add(W,K)}),L}),T=F(0);let v=0;const M=F(0),k=Ke(()=>Math.max(R.value.getBound(M.value-rt(e.paddingTop))-1,0)),I=P(()=>{const{value:g}=f;if(g===void 0)return[];const{items:C,itemSize:S}=e,L=k.value,j=Math.min(L+Math.ceil(g/S+1),C.length-1),W=[];for(let H=L;H<=j;++H)W.push(C[H]);return W}),p=(g,C)=>{if(typeof g=="number"){y(g,C,"auto");return}const{left:S,top:L,index:j,key:W,position:H,behavior:K,debounce:ee=!0}=g;if(S!==void 0||L!==void 0)y(S,L,K);else if(j!==void 0)w(j,K,ee);else if(W!==void 0){const X=r.value.get(W);X!==void 0&&w(X,K,ee)}else H==="bottom"?y(0,Number.MAX_SAFE_INTEGER,K):H==="top"&&y(0,0,K)};let x,m=null;function w(g,C,S){const{value:L}=R,j=L.sum(g)+rt(e.paddingTop);if(!S)c.value.scrollTo({left:0,top:j,behavior:C});else{x=g,m!==null&&window.clearTimeout(m),m=window.setTimeout(()=>{x=void 0,m=null},16);const{scrollTop:W,offsetHeight:H}=c.value;if(j>W){const K=L.get(g);j+K<=W+H||c.value.scrollTo({left:0,top:j+K-H,behavior:C})}else c.value.scrollTo({left:0,top:j,behavior:C})}}function y(g,C,S){c.value.scrollTo({left:g,top:C,behavior:S})}function z(g,C){var S,L,j;if(o||e.ignoreItemResize||ie(C.target))return;const{value:W}=R,H=r.value.get(g),K=W.get(H),ee=(j=(L=(S=C.borderBoxSize)===null||S===void 0?void 0:S[0])===null||L===void 0?void 0:L.blockSize)!==null&&j!==void 0?j:C.contentRect.height;if(ee===K)return;ee-e.itemSize===0?a.delete(g):a.set(g,ee-e.itemSize);const ae=ee-K;if(ae===0)return;W.add(H,ae);const s=c.value;if(s!=null){if(x===void 0){const h=W.sum(H);s.scrollTop>h&&s.scrollBy(0,ae)}else if(H<x)s.scrollBy(0,ae);else if(H===x){const h=W.sum(H);ee+h>s.scrollTop+s.offsetHeight&&s.scrollBy(0,ae)}J()}T.value++}const D=!jn();let q=!1;function U(g){var C;(C=e.onScroll)===null||C===void 0||C.call(e,g),(!D||!q)&&J()}function V(g){var C;if((C=e.onWheel)===null||C===void 0||C.call(e,g),D){const S=c.value;if(S!=null){if(g.deltaX===0&&(S.scrollTop===0&&g.deltaY<=0||S.scrollTop+S.offsetHeight>=S.scrollHeight&&g.deltaY>=0))return;g.preventDefault(),S.scrollTop+=g.deltaY/wt(),S.scrollLeft+=g.deltaX/wt(),J(),q=!0,cn(()=>{q=!1})}}}function Q(g){if(o||ie(g.target)||g.contentRect.height===f.value)return;f.value=g.contentRect.height;const{onResize:C}=e;C!==void 0&&C(g)}function J(){const{value:g}=c;g!=null&&(M.value=g.scrollTop,v=g.scrollLeft)}function ie(g){let C=g;for(;C!==null;){if(C.style.display==="none")return!0;C=C.parentElement}return!1}return{listHeight:f,listStyle:{overflow:"auto"},keyToIndex:r,itemsStyle:P(()=>{const{itemResizable:g}=e,C=We(R.value.sum());return T.value,[e.itemsStyle,{boxSizing:"content-box",height:g?"":C,minHeight:g?C:"",paddingTop:We(e.paddingTop),paddingBottom:We(e.paddingBottom)}]}),visibleItemsStyle:P(()=>(T.value,{transform:`translateY(${We(R.value.sum(k.value))})`})),viewportItems:I,listElRef:c,itemsElRef:F(null),scrollTo:p,handleListResize:Q,handleListScroll:U,handleListWheel:V,handleItemResize:z}},render(){const{itemResizable:e,keyField:n,keyToIndex:o,visibleItemsTag:i}=this;return l(ut,{onResize:this.handleListResize},{default:()=>{var r,c;return l("div",zt(this.$attrs,{class:["v-vl",this.showScrollbar&&"v-vl--show-scrollbar"],onScroll:this.handleListScroll,onWheel:this.handleListWheel,ref:"listElRef"}),[this.items.length!==0?l("div",{ref:"itemsElRef",class:"v-vl-items",style:this.itemsStyle},[l(i,Object.assign({class:"v-vl-visible-items",style:this.visibleItemsStyle},this.visibleItemsProps),{default:()=>this.viewportItems.map(f=>{const a=f[n],R=o.get(a),T=this.$slots.default({item:f,index:R})[0];return e?l(ut,{key:a,onResize:v=>this.handleItemResize(a,v)},{default:()=>T}):(T.key=a,T)})})]):(c=(r=this.$slots).empty)===null||c===void 0?void 0:c.call(r)])}})}}),ve="v-hidden",Kn=Ue("[v-hidden]",{display:"none!important"}),yt=re({name:"Overflow",props:{getCounter:Function,getTail:Function,updateCounter:Function,onUpdateCount:Function,onUpdateOverflow:Function},setup(e,{slots:n}){const o=F(null),i=F(null);function r(f){const{value:a}=o,{getCounter:R,getTail:T}=e;let v;if(R!==void 0?v=R():v=i.value,!a||!v)return;v.hasAttribute(ve)&&v.removeAttribute(ve);const{children:M}=a;if(f.showAllItemsBeforeCalculate)for(const z of M)z.hasAttribute(ve)&&z.removeAttribute(ve);const k=a.offsetWidth,I=[],p=n.tail?T==null?void 0:T():null;let x=p?p.offsetWidth:0,m=!1;const w=a.children.length-(n.tail?1:0);for(let z=0;z<w-1;++z){if(z<0)continue;const D=M[z];if(m){D.hasAttribute(ve)||D.setAttribute(ve,"");continue}else D.hasAttribute(ve)&&D.removeAttribute(ve);const q=D.offsetWidth;if(x+=q,I[z]=q,x>k){const{updateCounter:U}=e;for(let V=z;V>=0;--V){const Q=w-1-V;U!==void 0?U(Q):v.textContent=`${Q}`;const J=v.offsetWidth;if(x-=I[V],x+J<=k||V===0){m=!0,z=V-1,p&&(z===-1?(p.style.maxWidth=`${k-J}px`,p.style.boxSizing="border-box"):p.style.maxWidth="");const{onUpdateCount:ie}=e;ie&&ie(Q);break}}}}const{onUpdateOverflow:y}=e;m?y!==void 0&&y(!0):(y!==void 0&&y(!1),v.setAttribute(ve,""))}const c=Tt();return Kn.mount({id:"vueuc/overflow",head:!0,anchorMetaName:Ot,ssr:c}),$e(()=>r({showAllItemsBeforeCalculate:!1})),{selfRef:o,counterRef:i,sync:r}},render(){const{$slots:e}=this;return st(()=>this.sync({showAllItemsBeforeCalculate:!1})),l("div",{class:"v-overflow",ref:"selfRef"},[un(e,"default"),e.counter?e.counter():l("span",{style:{display:"inline-block"},ref:"counterRef"}),e.tail?e.tail():null])}});function Et(e,n){n&&($e(()=>{const{value:o}=e;o&&ft.registerHandler(o,n)}),Mt(()=>{const{value:o}=e;o&&ft.unregisterHandler(o)}))}const Un=re({name:"Checkmark",render(){return l("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},l("g",{fill:"none"},l("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),qn=re({name:"Empty",render(){return l("svg",{viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l("path",{d:"M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z",fill:"currentColor"}),l("path",{d:"M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z",fill:"currentColor"}))}}),Gn=re({props:{onFocus:Function,onBlur:Function},setup(e){return()=>l("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}}),Yn=E("empty",`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[N("icon",`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[de("+",[N("description",`
 margin-top: 8px;
 `)])]),N("description",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),N("extra",`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),Zn=Object.assign(Object.assign({},se.props),{description:String,showDescription:{type:Boolean,default:!0},showIcon:{type:Boolean,default:!0},size:{type:String,default:"medium"},renderIcon:Function}),Xn=re({name:"Empty",props:Zn,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:o}=Ee(e),i=se("Empty","-empty",Yn,fn,e,n),{localeRef:r}=$t("Empty"),c=dt(hn,null),f=P(()=>{var v,M,k;return(v=e.description)!==null&&v!==void 0?v:(k=(M=c==null?void 0:c.mergedComponentPropsRef.value)===null||M===void 0?void 0:M.Empty)===null||k===void 0?void 0:k.description}),a=P(()=>{var v,M;return((M=(v=c==null?void 0:c.mergedComponentPropsRef.value)===null||v===void 0?void 0:v.Empty)===null||M===void 0?void 0:M.renderIcon)||(()=>l(qn,null))}),R=P(()=>{const{size:v}=e,{common:{cubicBezierEaseInOut:M},self:{[ge("iconSize",v)]:k,[ge("fontSize",v)]:I,textColor:p,iconColor:x,extraTextColor:m}}=i.value;return{"--n-icon-size":k,"--n-font-size":I,"--n-bezier":M,"--n-text-color":p,"--n-icon-color":x,"--n-extra-text-color":m}}),T=o?Ze("empty",P(()=>{let v="";const{size:M}=e;return v+=M[0],v}),R,e):void 0;return{mergedClsPrefix:n,mergedRenderIcon:a,localizedDescription:P(()=>f.value||r.value.description),cssVars:o?void 0:R,themeClass:T==null?void 0:T.themeClass,onRender:T==null?void 0:T.onRender}},render(){const{$slots:e,mergedClsPrefix:n,onRender:o}=this;return o==null||o(),l("div",{class:[`${n}-empty`,this.themeClass],style:this.cssVars},this.showIcon?l("div",{class:`${n}-empty__icon`},e.icon?e.icon():l(Pt,{clsPrefix:n},{default:this.mergedRenderIcon})):null,this.showDescription?l("div",{class:`${n}-empty__description`},e.default?e.default():this.localizedDescription):null,e.extra?l("div",{class:`${n}-empty__extra`},e.extra()):null)}});function Qn(e,n){return l(kt,{name:"fade-in-scale-up-transition"},{default:()=>e?l(Pt,{clsPrefix:n,class:`${n}-base-select-option__check`},{default:()=>l(Un)}):null})}const xt=re({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:n,pendingTmNodeRef:o,multipleRef:i,valueSetRef:r,renderLabelRef:c,renderOptionRef:f,labelFieldRef:a,valueFieldRef:R,showCheckmarkRef:T,nodePropsRef:v,handleOptionClick:M,handleOptionMouseEnter:k}=dt(ct),I=Ke(()=>{const{value:w}=o;return w?e.tmNode.key===w.key:!1});function p(w){const{tmNode:y}=e;y.disabled||M(w,y)}function x(w){const{tmNode:y}=e;y.disabled||k(w,y)}function m(w){const{tmNode:y}=e,{value:z}=I;y.disabled||z||k(w,y)}return{multiple:i,isGrouped:Ke(()=>{const{tmNode:w}=e,{parent:y}=w;return y&&y.rawNode.type==="group"}),showCheckmark:T,nodeProps:v,isPending:I,isSelected:Ke(()=>{const{value:w}=n,{value:y}=i;if(w===null)return!1;const z=e.tmNode.rawNode[R.value];if(y){const{value:D}=r;return D.has(z)}else return w===z}),labelField:a,renderLabel:c,renderOption:f,handleMouseMove:m,handleMouseEnter:x,handleClick:p}},render(){const{clsPrefix:e,tmNode:{rawNode:n},isSelected:o,isPending:i,isGrouped:r,showCheckmark:c,nodeProps:f,renderOption:a,renderLabel:R,handleClick:T,handleMouseEnter:v,handleMouseMove:M}=this,k=Qn(o,e),I=R?[R(n,o),c&&k]:[Te(n[this.labelField],n,o),c&&k],p=f==null?void 0:f(n),x=l("div",Object.assign({},p,{class:[`${e}-base-select-option`,n.class,p==null?void 0:p.class,{[`${e}-base-select-option--disabled`]:n.disabled,[`${e}-base-select-option--selected`]:o,[`${e}-base-select-option--grouped`]:r,[`${e}-base-select-option--pending`]:i,[`${e}-base-select-option--show-checkmark`]:c}],style:[(p==null?void 0:p.style)||"",n.style||""],onClick:ot([T,p==null?void 0:p.onClick]),onMouseenter:ot([v,p==null?void 0:p.onMouseenter]),onMousemove:ot([M,p==null?void 0:p.onMousemove])}),l("div",{class:`${e}-base-select-option__content`},I));return n.render?n.render({node:x,option:n,selected:o}):a?a({node:x,option:n,selected:o}):x}}),Ct=re({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:n,labelFieldRef:o,nodePropsRef:i}=dt(ct);return{labelField:o,nodeProps:i,renderLabel:e,renderOption:n}},render(){const{clsPrefix:e,renderLabel:n,renderOption:o,nodeProps:i,tmNode:{rawNode:r}}=this,c=i==null?void 0:i(r),f=n?n(r,!1):Te(r[this.labelField],r,!1),a=l("div",Object.assign({},c,{class:[`${e}-base-select-group-header`,c==null?void 0:c.class]}),f);return r.render?r.render({node:a,option:r}):o?o({node:a,option:r,selected:!1}):a}}),Jn=E("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[E("scrollbar",`
 max-height: var(--n-height);
 `),E("virtual-list",`
 max-height: var(--n-height);
 `),E("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[N("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),E("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),E("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),N("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),N("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),N("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),N("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),E("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),E("base-select-option",`
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
 `),de("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),de("&:active",`
 color: var(--n-option-text-color-pressed);
 `),oe("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),oe("pending",[de("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),oe("selected",`
 color: var(--n-option-text-color-active);
 `,[de("&::before",`
 background-color: var(--n-option-color-active);
 `),oe("pending",[de("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),oe("disabled",`
 cursor: not-allowed;
 `,[qe("selected",`
 color: var(--n-option-text-color-disabled);
 `),oe("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),N("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[It({enterScale:"0.5"})])])]),eo=re({name:"InternalSelectMenu",props:Object.assign(Object.assign({},se.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:o}=Ee(e),i=_t("InternalSelectMenu",o,n),r=se("InternalSelectMenu","-internal-select-menu",Jn,vn,e,ne(e,"clsPrefix")),c=F(null),f=F(null),a=F(null),R=P(()=>e.treeMate.getFlattenedNodes()),T=P(()=>gn(R.value)),v=F(null);function M(){const{treeMate:s}=e;let h=null;const{value:G}=e;G===null?h=s.getFirstAvailableNode():(e.multiple?h=s.getNode((G||[])[(G||[]).length-1]):h=s.getNode(G),(!h||h.disabled)&&(h=s.getFirstAvailableNode())),L(h||null)}function k(){const{value:s}=v;s&&!e.treeMate.getNode(s.key)&&(v.value=null)}let I;Oe(()=>e.show,s=>{s?I=Oe(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?M():k(),st(j)):k()},{immediate:!0}):I==null||I()},{immediate:!0}),Mt(()=>{I==null||I()});const p=P(()=>rt(r.value.self[ge("optionHeight",e.size)])),x=P(()=>Be(r.value.self[ge("padding",e.size)])),m=P(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),w=P(()=>{const s=R.value;return s&&s.length===0});function y(s){const{onToggle:h}=e;h&&h(s)}function z(s){const{onScroll:h}=e;h&&h(s)}function D(s){var h;(h=a.value)===null||h===void 0||h.sync(),z(s)}function q(){var s;(s=a.value)===null||s===void 0||s.sync()}function U(){const{value:s}=v;return s||null}function V(s,h){h.disabled||L(h,!1)}function Q(s,h){h.disabled||y(h)}function J(s){var h;Ge(s,"action")||(h=e.onKeyup)===null||h===void 0||h.call(e,s)}function ie(s){var h;Ge(s,"action")||(h=e.onKeydown)===null||h===void 0||h.call(e,s)}function g(s){var h;(h=e.onMousedown)===null||h===void 0||h.call(e,s),!e.focusable&&s.preventDefault()}function C(){const{value:s}=v;s&&L(s.getNext({loop:!0}),!0)}function S(){const{value:s}=v;s&&L(s.getPrev({loop:!0}),!0)}function L(s,h=!1){v.value=s,h&&j()}function j(){var s,h;const G=v.value;if(!G)return;const fe=T.value(G.key);fe!==null&&(e.virtualScroll?(s=f.value)===null||s===void 0||s.scrollTo({index:fe}):(h=a.value)===null||h===void 0||h.scrollTo({index:fe,elSize:p.value}))}function W(s){var h,G;!((h=c.value)===null||h===void 0)&&h.contains(s.target)&&((G=e.onFocus)===null||G===void 0||G.call(e,s))}function H(s){var h,G;!((h=c.value)===null||h===void 0)&&h.contains(s.relatedTarget)||(G=e.onBlur)===null||G===void 0||G.call(e,s)}ht(ct,{handleOptionMouseEnter:V,handleOptionClick:Q,valueSetRef:m,pendingTmNodeRef:v,nodePropsRef:ne(e,"nodeProps"),showCheckmarkRef:ne(e,"showCheckmark"),multipleRef:ne(e,"multiple"),valueRef:ne(e,"value"),renderLabelRef:ne(e,"renderLabel"),renderOptionRef:ne(e,"renderOption"),labelFieldRef:ne(e,"labelField"),valueFieldRef:ne(e,"valueField")}),ht(wn,c),$e(()=>{const{value:s}=a;s&&s.sync()});const K=P(()=>{const{size:s}=e,{common:{cubicBezierEaseInOut:h},self:{height:G,borderRadius:fe,color:xe,groupHeaderTextColor:Ce,actionDividerColor:he,optionTextColorPressed:le,optionTextColor:Se,optionTextColorDisabled:pe,optionTextColorActive:Fe,optionOpacityDisabled:ze,optionCheckColor:Me,actionTextColor:Pe,optionColorPending:me,optionColorActive:we,loadingColor:ke,loadingSize:Ie,optionColorActivePending:_e,[ge("optionFontSize",s)]:Re,[ge("optionHeight",s)]:ye,[ge("optionPadding",s)]:te}}=r.value;return{"--n-height":G,"--n-action-divider-color":he,"--n-action-text-color":Pe,"--n-bezier":h,"--n-border-radius":fe,"--n-color":xe,"--n-option-font-size":Re,"--n-group-header-text-color":Ce,"--n-option-check-color":Me,"--n-option-color-pending":me,"--n-option-color-active":we,"--n-option-color-active-pending":_e,"--n-option-height":ye,"--n-option-opacity-disabled":ze,"--n-option-text-color":Se,"--n-option-text-color-active":Fe,"--n-option-text-color-disabled":pe,"--n-option-text-color-pressed":le,"--n-option-padding":te,"--n-option-padding-left":Be(te,"left"),"--n-option-padding-right":Be(te,"right"),"--n-loading-color":ke,"--n-loading-size":Ie}}),{inlineThemeDisabled:ee}=e,X=ee?Ze("internal-select-menu",P(()=>e.size[0]),K,e):void 0,ae={selfRef:c,next:C,prev:S,getPendingTmNode:U};return Et(c,e.onResize),Object.assign({mergedTheme:r,mergedClsPrefix:n,rtlEnabled:i,virtualListRef:f,scrollbarRef:a,itemSize:p,padding:x,flattenedNodes:R,empty:w,virtualListContainer(){const{value:s}=f;return s==null?void 0:s.listElRef},virtualListContent(){const{value:s}=f;return s==null?void 0:s.itemsElRef},doScroll:z,handleFocusin:W,handleFocusout:H,handleKeyUp:J,handleKeyDown:ie,handleMouseDown:g,handleVirtualListResize:q,handleVirtualListScroll:D,cssVars:ee?void 0:K,themeClass:X==null?void 0:X.themeClass,onRender:X==null?void 0:X.onRender},ae)},render(){const{$slots:e,virtualScroll:n,clsPrefix:o,mergedTheme:i,themeClass:r,onRender:c}=this;return c==null||c(),l("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${o}-base-select-menu`,this.rtlEnabled&&`${o}-base-select-menu--rtl`,r,this.multiple&&`${o}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},vt(e.header,f=>f&&l("div",{class:`${o}-base-select-menu__header`,"data-header":!0,key:"header"},f)),this.loading?l("div",{class:`${o}-base-select-menu__loading`},l(pn,{clsPrefix:o,strokeWidth:20})):this.empty?l("div",{class:`${o}-base-select-menu__empty`,"data-empty":!0},mn(e.empty,()=>[l(Xn,{theme:i.peers.Empty,themeOverrides:i.peerOverrides.Empty})])):l(bn,{ref:"scrollbarRef",theme:i.peers.Scrollbar,themeOverrides:i.peerOverrides.Scrollbar,scrollable:this.scrollable,container:n?this.virtualListContainer:void 0,content:n?this.virtualListContent:void 0,onScroll:n?void 0:this.doScroll},{default:()=>n?l(Hn,{ref:"virtualListRef",class:`${o}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:f})=>f.isGroup?l(Ct,{key:f.key,clsPrefix:o,tmNode:f}):f.ignored?null:l(xt,{clsPrefix:o,key:f.key,tmNode:f})}):l("div",{class:`${o}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(f=>f.isGroup?l(Ct,{key:f.key,clsPrefix:o,tmNode:f}):l(xt,{clsPrefix:o,key:f.key,tmNode:f})))}),vt(e.action,f=>f&&[l("div",{class:`${o}-base-select-menu__action`,"data-action":!0,key:"action"},f),l(Gn,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),to=de([E("base-selection",`
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
 `,[E("base-loading",`
 color: var(--n-loading-color);
 `),E("base-selection-tags","min-height: var(--n-height);"),N("border, state-border",`
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
 `),N("state-border",`
 z-index: 1;
 border-color: #0000;
 `),E("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[N("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),E("base-selection-overlay",`
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
 `,[N("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),E("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[N("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),E("base-selection-tags",`
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
 `),E("base-selection-label",`
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
 `,[E("base-selection-input",`
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
 `,[N("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),N("render-label",`
 color: var(--n-text-color);
 `)]),qe("disabled",[de("&:hover",[N("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),oe("focus",[N("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),oe("active",[N("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),E("base-selection-label","background-color: var(--n-color-active);"),E("base-selection-tags","background-color: var(--n-color-active);")])]),oe("disabled","cursor: not-allowed;",[N("arrow",`
 color: var(--n-arrow-color-disabled);
 `),E("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[E("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),N("render-label",`
 color: var(--n-text-color-disabled);
 `)]),E("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),E("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),E("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[N("input",`
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
 `),N("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>oe(`${e}-status`,[N("state-border",`border: var(--n-border-${e});`),qe("disabled",[de("&:hover",[N("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),oe("active",[N("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),E("base-selection-label",`background-color: var(--n-color-active-${e});`),E("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),oe("focus",[N("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),E("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),E("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[de("&:last-child","padding-right: 0;"),E("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[N("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),no=re({name:"InternalSelection",props:Object.assign(Object.assign({},se.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:o}=Ee(e),i=_t("InternalSelection",o,n),r=F(null),c=F(null),f=F(null),a=F(null),R=F(null),T=F(null),v=F(null),M=F(null),k=F(null),I=F(null),p=F(!1),x=F(!1),m=F(!1),w=se("InternalSelection","-internal-selection",to,yn,e,ne(e,"clsPrefix")),y=P(()=>e.clearable&&!e.disabled&&(m.value||e.active)),z=P(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):Te(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),D=P(()=>{const d=e.selectedOption;if(d)return d[e.labelField]}),q=P(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function U(){var d;const{value:b}=r;if(b){const{value:Y}=c;Y&&(Y.style.width=`${b.offsetWidth}px`,e.maxTagCount!=="responsive"&&((d=k.value)===null||d===void 0||d.sync({showAllItemsBeforeCalculate:!1})))}}function V(){const{value:d}=I;d&&(d.style.display="none")}function Q(){const{value:d}=I;d&&(d.style.display="inline-block")}Oe(ne(e,"active"),d=>{d||V()}),Oe(ne(e,"pattern"),()=>{e.multiple&&st(U)});function J(d){const{onFocus:b}=e;b&&b(d)}function ie(d){const{onBlur:b}=e;b&&b(d)}function g(d){const{onDeleteOption:b}=e;b&&b(d)}function C(d){const{onClear:b}=e;b&&b(d)}function S(d){const{onPatternInput:b}=e;b&&b(d)}function L(d){var b;(!d.relatedTarget||!(!((b=f.value)===null||b===void 0)&&b.contains(d.relatedTarget)))&&J(d)}function j(d){var b;!((b=f.value)===null||b===void 0)&&b.contains(d.relatedTarget)||ie(d)}function W(d){C(d)}function H(){m.value=!0}function K(){m.value=!1}function ee(d){!e.active||!e.filterable||d.target!==c.value&&d.preventDefault()}function X(d){g(d)}function ae(d){if(d.key==="Backspace"&&!s.value&&!e.pattern.length){const{selectedOptions:b}=e;b!=null&&b.length&&X(b[b.length-1])}}const s=F(!1);let h=null;function G(d){const{value:b}=r;if(b){const Y=d.target.value;b.textContent=Y,U()}e.ignoreComposition&&s.value?h=d:S(d)}function fe(){s.value=!0}function xe(){s.value=!1,e.ignoreComposition&&S(h),h=null}function Ce(d){var b;x.value=!0,(b=e.onPatternFocus)===null||b===void 0||b.call(e,d)}function he(d){var b;x.value=!1,(b=e.onPatternBlur)===null||b===void 0||b.call(e,d)}function le(){var d,b;if(e.filterable)x.value=!1,(d=T.value)===null||d===void 0||d.blur(),(b=c.value)===null||b===void 0||b.blur();else if(e.multiple){const{value:Y}=a;Y==null||Y.blur()}else{const{value:Y}=R;Y==null||Y.blur()}}function Se(){var d,b,Y;e.filterable?(x.value=!1,(d=T.value)===null||d===void 0||d.focus()):e.multiple?(b=a.value)===null||b===void 0||b.focus():(Y=R.value)===null||Y===void 0||Y.focus()}function pe(){const{value:d}=c;d&&(Q(),d.focus())}function Fe(){const{value:d}=c;d&&d.blur()}function ze(d){const{value:b}=v;b&&b.setTextContent(`+${d}`)}function Me(){const{value:d}=M;return d}function Pe(){return c.value}let me=null;function we(){me!==null&&window.clearTimeout(me)}function ke(){e.active||(we(),me=window.setTimeout(()=>{q.value&&(p.value=!0)},100))}function Ie(){we()}function _e(d){d||(we(),p.value=!1)}Oe(q,d=>{d||(p.value=!1)}),$e(()=>{xn(()=>{const d=T.value;d&&(e.disabled?d.removeAttribute("tabindex"):d.tabIndex=x.value?-1:0)})}),Et(f,e.onResize);const{inlineThemeDisabled:Re}=e,ye=P(()=>{const{size:d}=e,{common:{cubicBezierEaseInOut:b},self:{borderRadius:Y,color:Xe,placeholderColor:Qe,textColor:Ae,paddingSingle:Ne,paddingMultiple:Le,caretColor:Je,colorDisabled:et,textColorDisabled:De,placeholderColorDisabled:be,colorActive:t,boxShadowFocus:u,boxShadowActive:O,boxShadowHover:A,border:B,borderFocus:_,borderHover:$,borderActive:Z,arrowColor:ce,arrowColorDisabled:tt,loadingColor:Nt,colorActiveWarning:Lt,boxShadowFocusWarning:Dt,boxShadowActiveWarning:Vt,boxShadowHoverWarning:jt,borderWarning:Wt,borderFocusWarning:Ht,borderHoverWarning:Kt,borderActiveWarning:Ut,colorActiveError:qt,boxShadowFocusError:Gt,boxShadowActiveError:Yt,boxShadowHoverError:Zt,borderError:Xt,borderFocusError:Qt,borderHoverError:Jt,borderActiveError:en,clearColor:tn,clearColorHover:nn,clearColorPressed:on,clearSize:ln,arrowSize:rn,[ge("height",d)]:an,[ge("fontSize",d)]:sn}}=w.value,Ve=Be(Ne),je=Be(Le);return{"--n-bezier":b,"--n-border":B,"--n-border-active":Z,"--n-border-focus":_,"--n-border-hover":$,"--n-border-radius":Y,"--n-box-shadow-active":O,"--n-box-shadow-focus":u,"--n-box-shadow-hover":A,"--n-caret-color":Je,"--n-color":Xe,"--n-color-active":t,"--n-color-disabled":et,"--n-font-size":sn,"--n-height":an,"--n-padding-single-top":Ve.top,"--n-padding-multiple-top":je.top,"--n-padding-single-right":Ve.right,"--n-padding-multiple-right":je.right,"--n-padding-single-left":Ve.left,"--n-padding-multiple-left":je.left,"--n-padding-single-bottom":Ve.bottom,"--n-padding-multiple-bottom":je.bottom,"--n-placeholder-color":Qe,"--n-placeholder-color-disabled":be,"--n-text-color":Ae,"--n-text-color-disabled":De,"--n-arrow-color":ce,"--n-arrow-color-disabled":tt,"--n-loading-color":Nt,"--n-color-active-warning":Lt,"--n-box-shadow-focus-warning":Dt,"--n-box-shadow-active-warning":Vt,"--n-box-shadow-hover-warning":jt,"--n-border-warning":Wt,"--n-border-focus-warning":Ht,"--n-border-hover-warning":Kt,"--n-border-active-warning":Ut,"--n-color-active-error":qt,"--n-box-shadow-focus-error":Gt,"--n-box-shadow-active-error":Yt,"--n-box-shadow-hover-error":Zt,"--n-border-error":Xt,"--n-border-focus-error":Qt,"--n-border-hover-error":Jt,"--n-border-active-error":en,"--n-clear-size":ln,"--n-clear-color":tn,"--n-clear-color-hover":nn,"--n-clear-color-pressed":on,"--n-arrow-size":rn}}),te=Re?Ze("internal-selection",P(()=>e.size[0]),ye,e):void 0;return{mergedTheme:w,mergedClearable:y,mergedClsPrefix:n,rtlEnabled:i,patternInputFocused:x,filterablePlaceholder:z,label:D,selected:q,showTagsPanel:p,isComposing:s,counterRef:v,counterWrapperRef:M,patternInputMirrorRef:r,patternInputRef:c,selfRef:f,multipleElRef:a,singleElRef:R,patternInputWrapperRef:T,overflowRef:k,inputTagElRef:I,handleMouseDown:ee,handleFocusin:L,handleClear:W,handleMouseEnter:H,handleMouseLeave:K,handleDeleteOption:X,handlePatternKeyDown:ae,handlePatternInputInput:G,handlePatternInputBlur:he,handlePatternInputFocus:Ce,handleMouseEnterCounter:ke,handleMouseLeaveCounter:Ie,handleFocusout:j,handleCompositionEnd:xe,handleCompositionStart:fe,onPopoverUpdateShow:_e,focus:Se,focusInput:pe,blur:le,blurInput:Fe,updateCounter:ze,getCounter:Me,getTail:Pe,renderLabel:e.renderLabel,cssVars:Re?void 0:ye,themeClass:te==null?void 0:te.themeClass,onRender:te==null?void 0:te.onRender}},render(){const{status:e,multiple:n,size:o,disabled:i,filterable:r,maxTagCount:c,bordered:f,clsPrefix:a,ellipsisTagPopoverProps:R,onRender:T,renderTag:v,renderLabel:M}=this;T==null||T();const k=c==="responsive",I=typeof c=="number",p=k||I,x=l(Sn,null,{default:()=>l(Dn,{clsPrefix:a,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var w,y;return(y=(w=this.$slots).arrow)===null||y===void 0?void 0:y.call(w)}})});let m;if(n){const{labelField:w}=this,y=S=>l("div",{class:`${a}-base-selection-tag-wrapper`,key:S.value},v?v({option:S,handleClose:()=>{this.handleDeleteOption(S)}}):l(nt,{size:o,closable:!S.disabled,disabled:i,onClose:()=>{this.handleDeleteOption(S)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>M?M(S,!0):Te(S[w],S,!0)})),z=()=>(I?this.selectedOptions.slice(0,c):this.selectedOptions).map(y),D=r?l("div",{class:`${a}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},l("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:i,value:this.pattern,autofocus:this.autofocus,class:`${a}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),l("span",{ref:"patternInputMirrorRef",class:`${a}-base-selection-input-tag__mirror`},this.pattern)):null,q=k?()=>l("div",{class:`${a}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},l(nt,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:i})):void 0;let U;if(I){const S=this.selectedOptions.length-c;S>0&&(U=l("div",{class:`${a}-base-selection-tag-wrapper`,key:"__counter__"},l(nt,{size:o,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:i},{default:()=>`+${S}`})))}const V=k?r?l(yt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:z,counter:q,tail:()=>D}):l(yt,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:z,counter:q}):I&&U?z().concat(U):z(),Q=p?()=>l("div",{class:`${a}-base-selection-popover`},k?z():this.selectedOptions.map(y)):void 0,J=p?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},R):null,g=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?l("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`},l("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)):null,C=r?l("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-tags`},V,k?null:D,x):l("div",{ref:"multipleElRef",class:`${a}-base-selection-tags`,tabindex:i?void 0:0},V,x);m=l(Cn,null,p?l(Bt,Object.assign({},J,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>C,default:Q}):C,g)}else if(r){const w=this.pattern||this.isComposing,y=this.active?!w:!this.selected,z=this.active?!1:this.selected;m=l("div",{ref:"patternInputWrapperRef",class:`${a}-base-selection-label`,title:this.patternInputFocused?void 0:bt(this.label)},l("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${a}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:i,disabled:i,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),z?l("div",{class:`${a}-base-selection-label__render-label ${a}-base-selection-overlay`,key:"input"},l("div",{class:`${a}-base-selection-overlay__wrapper`},v?v({option:this.selectedOption,handleClose:()=>{}}):M?M(this.selectedOption,!0):Te(this.label,this.selectedOption,!0))):null,y?l("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},l("div",{class:`${a}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,x)}else m=l("div",{ref:"singleElRef",class:`${a}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?l("div",{class:`${a}-base-selection-input`,title:bt(this.label),key:"input"},l("div",{class:`${a}-base-selection-input__content`},v?v({option:this.selectedOption,handleClose:()=>{}}):M?M(this.selectedOption,!0):Te(this.label,this.selectedOption,!0))):l("div",{class:`${a}-base-selection-placeholder ${a}-base-selection-overlay`,key:"placeholder"},l("div",{class:`${a}-base-selection-placeholder__inner`},this.placeholder)),x);return l("div",{ref:"selfRef",class:[`${a}-base-selection`,this.rtlEnabled&&`${a}-base-selection--rtl`,this.themeClass,e&&`${a}-base-selection--${e}-status`,{[`${a}-base-selection--active`]:this.active,[`${a}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${a}-base-selection--disabled`]:this.disabled,[`${a}-base-selection--multiple`]:this.multiple,[`${a}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},m,f?l("div",{class:`${a}-base-selection__border`}):null,f?l("div",{class:`${a}-base-selection__state-border`}):null)}});function Ye(e){return e.type==="group"}function At(e){return e.type==="ignored"}function lt(e,n){try{return!!(1+n.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch{return!1}}function oo(e,n){return{getIsGroup:Ye,getIgnored:At,getKey(i){return Ye(i)?i.name||i.key||"key-required":i[e]},getChildren(i){return i[n]}}}function io(e,n,o,i){if(!n)return e;function r(c){if(!Array.isArray(c))return[];const f=[];for(const a of c)if(Ye(a)){const R=r(a[i]);R.length&&f.push(Object.assign({},a,{[i]:R}))}else{if(At(a))continue;n(o,a)&&f.push(a)}return f}return r(e)}function lo(e,n,o){const i=new Map;return e.forEach(r=>{Ye(r)?r[o].forEach(c=>{i.set(c[n],c)}):i.set(r[n],r)}),i}const ro=de([E("select",`
 z-index: auto;
 outline: none;
 width: 100%;
 position: relative;
 `),E("select-menu",`
 margin: 4px 0;
 box-shadow: var(--n-menu-box-shadow);
 `,[It({originalTransition:"background-color .3s var(--n-bezier), box-shadow .3s var(--n-bezier)"})])]),ao=Object.assign(Object.assign({},se.props),{to:at.propTo,bordered:{type:Boolean,default:void 0},clearable:Boolean,clearFilterAfterSelect:{type:Boolean,default:!0},options:{type:Array,default:()=>[]},defaultValue:{type:[String,Number,Array],default:null},keyboard:{type:Boolean,default:!0},value:[String,Number,Array],placeholder:String,menuProps:Object,multiple:Boolean,size:String,filterable:Boolean,disabled:{type:Boolean,default:void 0},remote:Boolean,loading:Boolean,filter:Function,placement:{type:String,default:"bottom-start"},widthMode:{type:String,default:"trigger"},tag:Boolean,onCreate:Function,fallbackOption:{type:[Function,Boolean],default:void 0},show:{type:Boolean,default:void 0},showArrow:{type:Boolean,default:!0},maxTagCount:[Number,String],ellipsisTagPopoverProps:Object,consistentMenuWidth:{type:Boolean,default:!0},virtualScroll:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},childrenField:{type:String,default:"children"},renderLabel:Function,renderOption:Function,renderTag:Function,"onUpdate:value":[Function,Array],inputProps:Object,nodeProps:Function,ignoreComposition:{type:Boolean,default:!0},showOnFocus:Boolean,onUpdateValue:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onFocus:[Function,Array],onScroll:[Function,Array],onSearch:[Function,Array],onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],displayDirective:{type:String,default:"show"},resetMenuOnOptionsChange:{type:Boolean,default:!0},status:String,showCheckmark:{type:Boolean,default:!0},onChange:[Function,Array],items:Array}),bo=re({name:"Select",props:ao,setup(e){const{mergedClsPrefixRef:n,mergedBorderedRef:o,namespaceRef:i,inlineThemeDisabled:r}=Ee(e),c=se("Select","-select",ro,_n,e,n),f=F(e.defaultValue),a=ne(e,"value"),R=gt(a,f),T=F(!1),v=F(""),M=P(()=>{const{valueField:t,childrenField:u}=e,O=oo(t,u);return Rn(C.value,O)}),k=P(()=>lo(ie.value,e.valueField,e.childrenField)),I=F(!1),p=gt(ne(e,"show"),I),x=F(null),m=F(null),w=F(null),{localeRef:y}=$t("Select"),z=P(()=>{var t;return(t=e.placeholder)!==null&&t!==void 0?t:y.value.placeholder}),D=Tn(e,["items","options"]),q=[],U=F([]),V=F([]),Q=F(new Map),J=P(()=>{const{fallbackOption:t}=e;if(t===void 0){const{labelField:u,valueField:O}=e;return A=>({[u]:String(A),[O]:A})}return t===!1?!1:u=>Object.assign(t(u),{value:u})}),ie=P(()=>V.value.concat(U.value).concat(D.value)),g=P(()=>{const{filter:t}=e;if(t)return t;const{labelField:u,valueField:O}=e;return(A,B)=>{if(!B)return!1;const _=B[u];if(typeof _=="string")return lt(A,_);const $=B[O];return typeof $=="string"?lt(A,$):typeof $=="number"?lt(A,String($)):!1}}),C=P(()=>{if(e.remote)return D.value;{const{value:t}=ie,{value:u}=v;return!u.length||!e.filterable?t:io(t,g.value,u,e.childrenField)}});function S(t){const u=e.remote,{value:O}=Q,{value:A}=k,{value:B}=J,_=[];return t.forEach($=>{if(A.has($))_.push(A.get($));else if(u&&O.has($))_.push(O.get($));else if(B){const Z=B($);Z&&_.push(Z)}}),_}const L=P(()=>{if(e.multiple){const{value:t}=R;return Array.isArray(t)?S(t):[]}return null}),j=P(()=>{const{value:t}=R;return!e.multiple&&!Array.isArray(t)?t===null?null:S([t])[0]||null:null}),W=On(e),{mergedSizeRef:H,mergedDisabledRef:K,mergedStatusRef:ee}=W;function X(t,u){const{onChange:O,"onUpdate:value":A,onUpdateValue:B}=e,{nTriggerFormChange:_,nTriggerFormInput:$}=W;O&&ue(O,t,u),B&&ue(B,t,u),A&&ue(A,t,u),f.value=t,_(),$()}function ae(t){const{onBlur:u}=e,{nTriggerFormBlur:O}=W;u&&ue(u,t),O()}function s(){const{onClear:t}=e;t&&ue(t)}function h(t){const{onFocus:u,showOnFocus:O}=e,{nTriggerFormFocus:A}=W;u&&ue(u,t),A(),O&&he()}function G(t){const{onSearch:u}=e;u&&ue(u,t)}function fe(t){const{onScroll:u}=e;u&&ue(u,t)}function xe(){var t;const{remote:u,multiple:O}=e;if(u){const{value:A}=Q;if(O){const{valueField:B}=e;(t=L.value)===null||t===void 0||t.forEach(_=>{A.set(_[B],_)})}else{const B=j.value;B&&A.set(B[e.valueField],B)}}}function Ce(t){const{onUpdateShow:u,"onUpdate:show":O}=e;u&&ue(u,t),O&&ue(O,t),I.value=t}function he(){K.value||(Ce(!0),I.value=!0,e.filterable&&Le())}function le(){Ce(!1)}function Se(){v.value="",V.value=q}const pe=F(!1);function Fe(){e.filterable&&(pe.value=!0)}function ze(){e.filterable&&(pe.value=!1,p.value||Se())}function Me(){K.value||(p.value?e.filterable?Le():le():he())}function Pe(t){var u,O;!((O=(u=w.value)===null||u===void 0?void 0:u.selfRef)===null||O===void 0)&&O.contains(t.relatedTarget)||(T.value=!1,ae(t),le())}function me(t){h(t),T.value=!0}function we(t){T.value=!0}function ke(t){var u;!((u=x.value)===null||u===void 0)&&u.$el.contains(t.relatedTarget)||(T.value=!1,ae(t),le())}function Ie(){var t;(t=x.value)===null||t===void 0||t.focus(),le()}function _e(t){var u;p.value&&(!((u=x.value)===null||u===void 0)&&u.$el.contains(Bn(t))||le())}function Re(t){if(!Array.isArray(t))return[];if(J.value)return Array.from(t);{const{remote:u}=e,{value:O}=k;if(u){const{value:A}=Q;return t.filter(B=>O.has(B)||A.has(B))}else return t.filter(A=>O.has(A))}}function ye(t){te(t.rawNode)}function te(t){if(K.value)return;const{tag:u,remote:O,clearFilterAfterSelect:A,valueField:B}=e;if(u&&!O){const{value:_}=V,$=_[0]||null;if($){const Z=U.value;Z.length?Z.push($):U.value=[$],V.value=q}}if(O&&Q.value.set(t[B],t),e.multiple){const _=Re(R.value),$=_.findIndex(Z=>Z===t[B]);if(~$){if(_.splice($,1),u&&!O){const Z=d(t[B]);~Z&&(U.value.splice(Z,1),A&&(v.value=""))}}else _.push(t[B]),A&&(v.value="");X(_,S(_))}else{if(u&&!O){const _=d(t[B]);~_?U.value=[U.value[_]]:U.value=q}Ne(),le(),X(t[B],t)}}function d(t){return U.value.findIndex(O=>O[e.valueField]===t)}function b(t){p.value||he();const{value:u}=t.target;v.value=u;const{tag:O,remote:A}=e;if(G(u),O&&!A){if(!u){V.value=q;return}const{onCreate:B}=e,_=B?B(u):{[e.labelField]:u,[e.valueField]:u},{valueField:$,labelField:Z}=e;D.value.some(ce=>ce[$]===_[$]||ce[Z]===_[Z])||U.value.some(ce=>ce[$]===_[$]||ce[Z]===_[Z])?V.value=q:V.value=[_]}}function Y(t){t.stopPropagation();const{multiple:u}=e;!u&&e.filterable&&le(),s(),u?X([],[]):X(null,null)}function Xe(t){!Ge(t,"action")&&!Ge(t,"empty")&&t.preventDefault()}function Qe(t){fe(t)}function Ae(t){var u,O,A,B,_;if(!e.keyboard){t.preventDefault();return}switch(t.key){case" ":if(e.filterable)break;t.preventDefault();case"Enter":if(!(!((u=x.value)===null||u===void 0)&&u.isComposing)){if(p.value){const $=(O=w.value)===null||O===void 0?void 0:O.getPendingTmNode();$?ye($):e.filterable||(le(),Ne())}else if(he(),e.tag&&pe.value){const $=V.value[0];if($){const Z=$[e.valueField],{value:ce}=R;e.multiple&&Array.isArray(ce)&&ce.some(tt=>tt===Z)||te($)}}}t.preventDefault();break;case"ArrowUp":if(t.preventDefault(),e.loading)return;p.value&&((A=w.value)===null||A===void 0||A.prev());break;case"ArrowDown":if(t.preventDefault(),e.loading)return;p.value?(B=w.value)===null||B===void 0||B.next():he();break;case"Escape":p.value&&($n(t),le()),(_=x.value)===null||_===void 0||_.focus();break}}function Ne(){var t;(t=x.value)===null||t===void 0||t.focus()}function Le(){var t;(t=x.value)===null||t===void 0||t.focusInput()}function Je(){var t;p.value&&((t=m.value)===null||t===void 0||t.syncPosition())}xe(),Oe(ne(e,"options"),xe);const et={focus:()=>{var t;(t=x.value)===null||t===void 0||t.focus()},focusInput:()=>{var t;(t=x.value)===null||t===void 0||t.focusInput()},blur:()=>{var t;(t=x.value)===null||t===void 0||t.blur()},blurInput:()=>{var t;(t=x.value)===null||t===void 0||t.blurInput()}},De=P(()=>{const{self:{menuBoxShadow:t}}=c.value;return{"--n-menu-box-shadow":t}}),be=r?Ze("select",void 0,De,e):void 0;return Object.assign(Object.assign({},et),{mergedStatus:ee,mergedClsPrefix:n,mergedBordered:o,namespace:i,treeMate:M,isMounted:Fn(),triggerRef:x,menuRef:w,pattern:v,uncontrolledShow:I,mergedShow:p,adjustedTo:at(e),uncontrolledValue:f,mergedValue:R,followerRef:m,localizedPlaceholder:z,selectedOption:j,selectedOptions:L,mergedSize:H,mergedDisabled:K,focused:T,activeWithoutMenuOpen:pe,inlineThemeDisabled:r,onTriggerInputFocus:Fe,onTriggerInputBlur:ze,handleTriggerOrMenuResize:Je,handleMenuFocus:we,handleMenuBlur:ke,handleMenuTabOut:Ie,handleTriggerClick:Me,handleToggle:ye,handleDeleteOption:te,handlePatternInput:b,handleClear:Y,handleTriggerBlur:Pe,handleTriggerFocus:me,handleKeydown:Ae,handleMenuAfterLeave:Se,handleMenuClickOutside:_e,handleMenuScroll:Qe,handleMenuKeydown:Ae,handleMenuMousedown:Xe,mergedTheme:c,cssVars:r?void 0:De,themeClass:be==null?void 0:be.themeClass,onRender:be==null?void 0:be.onRender})},render(){return l("div",{class:`${this.mergedClsPrefix}-select`},l(zn,null,{default:()=>[l(Mn,null,{default:()=>l(no,{ref:"triggerRef",inlineThemeDisabled:this.inlineThemeDisabled,status:this.mergedStatus,inputProps:this.inputProps,clsPrefix:this.mergedClsPrefix,showArrow:this.showArrow,maxTagCount:this.maxTagCount,ellipsisTagPopoverProps:this.ellipsisTagPopoverProps,bordered:this.mergedBordered,active:this.activeWithoutMenuOpen||this.mergedShow,pattern:this.pattern,placeholder:this.localizedPlaceholder,selectedOption:this.selectedOption,selectedOptions:this.selectedOptions,multiple:this.multiple,renderTag:this.renderTag,renderLabel:this.renderLabel,filterable:this.filterable,clearable:this.clearable,disabled:this.mergedDisabled,size:this.mergedSize,theme:this.mergedTheme.peers.InternalSelection,labelField:this.labelField,valueField:this.valueField,themeOverrides:this.mergedTheme.peerOverrides.InternalSelection,loading:this.loading,focused:this.focused,onClick:this.handleTriggerClick,onDeleteOption:this.handleDeleteOption,onPatternInput:this.handlePatternInput,onClear:this.handleClear,onBlur:this.handleTriggerBlur,onFocus:this.handleTriggerFocus,onKeydown:this.handleKeydown,onPatternBlur:this.onTriggerInputBlur,onPatternFocus:this.onTriggerInputFocus,onResize:this.handleTriggerOrMenuResize,ignoreComposition:this.ignoreComposition},{arrow:()=>{var e,n;return[(n=(e=this.$slots).arrow)===null||n===void 0?void 0:n.call(e)]}})}),l(Pn,{ref:"followerRef",show:this.mergedShow,to:this.adjustedTo,teleportDisabled:this.adjustedTo===at.tdkey,containerClass:this.namespace,width:this.consistentMenuWidth?"target":void 0,minWidth:"target",placement:this.placement},{default:()=>l(kt,{name:"fade-in-scale-up-transition",appear:this.isMounted,onAfterLeave:this.handleMenuAfterLeave},{default:()=>{var e,n,o;return this.mergedShow||this.displayDirective==="show"?((e=this.onRender)===null||e===void 0||e.call(this),kn(l(eo,Object.assign({},this.menuProps,{ref:"menuRef",onResize:this.handleTriggerOrMenuResize,inlineThemeDisabled:this.inlineThemeDisabled,virtualScroll:this.consistentMenuWidth&&this.virtualScroll,class:[`${this.mergedClsPrefix}-select-menu`,this.themeClass,(n=this.menuProps)===null||n===void 0?void 0:n.class],clsPrefix:this.mergedClsPrefix,focusable:!0,labelField:this.labelField,valueField:this.valueField,autoPending:!0,nodeProps:this.nodeProps,theme:this.mergedTheme.peers.InternalSelectMenu,themeOverrides:this.mergedTheme.peerOverrides.InternalSelectMenu,treeMate:this.treeMate,multiple:this.multiple,size:"medium",renderOption:this.renderOption,renderLabel:this.renderLabel,value:this.mergedValue,style:[(o=this.menuProps)===null||o===void 0?void 0:o.style,this.cssVars],onToggle:this.handleToggle,onScroll:this.handleMenuScroll,onFocus:this.handleMenuFocus,onBlur:this.handleMenuBlur,onKeydown:this.handleMenuKeydown,onTabOut:this.handleMenuTabOut,onMousedown:this.handleMenuMousedown,show:this.mergedShow,showCheckmark:this.showCheckmark,resetMenuOnOptionsChange:this.resetMenuOnOptionsChange}),{empty:()=>{var i,r;return[(r=(i=this.$slots).empty)===null||r===void 0?void 0:r.call(i)]},header:()=>{var i,r;return[(r=(i=this.$slots).header)===null||r===void 0?void 0:r.call(i)]},action:()=>{var i,r;return[(r=(i=this.$slots).action)===null||r===void 0?void 0:r.call(i)]}}),this.displayDirective==="show"?[[In,this.mergedShow],[pt,this.handleMenuClickOutside,void 0,{capture:!0}]]:[[pt,this.handleMenuClickOutside,void 0,{capture:!0}]])):null}})})]}))}}),so=Object.assign(Object.assign({},En),se.props),co=re({name:"Tooltip",props:so,__popover__:!0,setup(e){const{mergedClsPrefixRef:n}=Ee(e),o=se("Tooltip","-tooltip",void 0,An,e,n),i=F(null);return Object.assign(Object.assign({},{syncPosition(){i.value.syncPosition()},setShow(c){i.value.setShow(c)}}),{popoverRef:i,mergedTheme:o,popoverThemeOverrides:P(()=>o.value.self)})},render(){const{mergedTheme:e,internalExtraClass:n}=this;return l(Bt,Object.assign(Object.assign({},this.$props),{theme:e.peers.Popover,themeOverrides:e.peerOverrides.Popover,builtinThemeOverrides:this.popoverThemeOverrides,internalExtraClass:n.concat("tooltip"),ref:"popoverRef"}),this.$slots)}}),uo=E("ellipsis",{overflow:"hidden"},[qe("line-clamp",`
 white-space: nowrap;
 display: inline-block;
 vertical-align: bottom;
 max-width: 100%;
 `),oe("line-clamp",`
 display: -webkit-inline-box;
 -webkit-box-orient: vertical;
 `),oe("cursor-pointer",`
 cursor: pointer;
 `)]);function St(e){return`${e}-ellipsis--line-clamp`}function Rt(e,n){return`${e}-ellipsis--cursor-${n}`}const fo=Object.assign(Object.assign({},se.props),{expandTrigger:String,lineClamp:[Number,String],tooltip:{type:[Boolean,Object],default:!0}}),mo=re({name:"Ellipsis",inheritAttrs:!1,props:fo,setup(e,{slots:n,attrs:o}){const i=Nn(),r=se("Ellipsis","-ellipsis",uo,Ln,e,i),c=F(null),f=F(null),a=F(null),R=F(!1),T=P(()=>{const{lineClamp:m}=e,{value:w}=R;return m!==void 0?{textOverflow:"","-webkit-line-clamp":w?"":m}:{textOverflow:w?"":"ellipsis","-webkit-line-clamp":""}});function v(){let m=!1;const{value:w}=R;if(w)return!0;const{value:y}=c;if(y){const{lineClamp:z}=e;if(I(y),z!==void 0)m=y.scrollHeight<=y.offsetHeight;else{const{value:D}=f;D&&(m=D.getBoundingClientRect().width<=y.getBoundingClientRect().width)}p(y,m)}return m}const M=P(()=>e.expandTrigger==="click"?()=>{var m;const{value:w}=R;w&&((m=a.value)===null||m===void 0||m.setShow(!1)),R.value=!w}:void 0);Ft(()=>{var m;e.tooltip&&((m=a.value)===null||m===void 0||m.setShow(!1))});const k=()=>l("span",Object.assign({},zt(o,{class:[`${i.value}-ellipsis`,e.lineClamp!==void 0?St(i.value):void 0,e.expandTrigger==="click"?Rt(i.value,"pointer"):void 0],style:T.value}),{ref:"triggerRef",onClick:M.value,onMouseenter:e.expandTrigger==="click"?v:void 0}),e.lineClamp?n:l("span",{ref:"triggerInnerRef"},n));function I(m){if(!m)return;const w=T.value,y=St(i.value);e.lineClamp!==void 0?x(m,y,"add"):x(m,y,"remove");for(const z in w)m.style[z]!==w[z]&&(m.style[z]=w[z])}function p(m,w){const y=Rt(i.value,"pointer");e.expandTrigger==="click"&&!w?x(m,y,"add"):x(m,y,"remove")}function x(m,w,y){y==="add"?m.classList.contains(w)||m.classList.add(w):m.classList.contains(w)&&m.classList.remove(w)}return{mergedTheme:r,triggerRef:c,triggerInnerRef:f,tooltipRef:a,handleClick:M,renderTrigger:k,getTooltipDisabled:v}},render(){var e;const{tooltip:n,renderTrigger:o,$slots:i}=this;if(n){const{mergedTheme:r}=this;return l(co,Object.assign({ref:"tooltipRef",placement:"top"},n,{getDisabled:this.getTooltipDisabled,theme:r.peers.Tooltip,themeOverrides:r.peerOverrides.Tooltip}),{trigger:o,default:(e=i.tooltip)!==null&&e!==void 0?e:i.default})}else return o()}});export{Gn as F,mo as N,Hn as V,co as a,bo as b,St as c,Rt as d,fo as e,Xn as f,eo as g,oo as h,ot as m,uo as s};
