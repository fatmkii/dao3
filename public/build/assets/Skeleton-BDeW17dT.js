import{I as mt,J as xt,W as We,V as bt,K as wt,L as yt,P as St,w as Q,T as G,$ as j,X as Ct,S as w,Y as Rt,d as h,e as Fe,Z as Ze,a0 as He,a1 as d,a2 as I,a3 as f,a4 as Ee,a5 as Pt,a6 as zt,a7 as kt,a8 as It,p as ce,a9 as ve,aa as Dt,ab as Nt,ac as Ae,ad as Me,ae as _t,af as $t,ag as Vt,B as Tt,ah as Et,ai as q,aj as je,ak as J,al as At,am as Mt,an as jt,ao as Be,ap as Bt,aq as Ot,C as Lt}from"./app-BFaYVfH7.js";import{c as Xt}from"./_createCompounder-tJsxabxA.js";import{u as Kt}from"./use-houdini-C9xfGtiI.js";function Yt(e){return mt(xt(e).toLowerCase())}var Oe=Xt(function(e,o,a){return o=o.toLowerCase(),e+(a?Yt(o):o)});function Wt(e){const{length:o}=e;return o>1&&(e.push(Le(e[0],0,"append")),e.unshift(Le(e[o-1],o-1,"prepend"))),e}function Le(e,o,a){return We(e,{key:`carousel-item-duplicate-${o}-${a}`})}function Xe(e,o,a){return o===1?0:a?e===0?o-3:e===o-1?0:e-1:e}function Ce(e,o){return o?e+1:e}function Ft(e,o,a){return e<0?null:e===0?a?o-1:null:e-1}function Zt(e,o,a){return e>o-1?null:e===o-1?a?0:null:e+1}function Ht(e,o){return o&&e>3?e-2:e}function Ke(e){return window.TouchEvent&&e instanceof window.TouchEvent}function Ye(e,o){let{offsetWidth:a,offsetHeight:s}=e;if(o){const i=getComputedStyle(e);a=a-parseFloat(i.getPropertyValue("padding-left"))-parseFloat(i.getPropertyValue("padding-right")),s=s-parseFloat(i.getPropertyValue("padding-top"))-parseFloat(i.getPropertyValue("padding-bottom"))}return{width:a,height:s}}function de(e,o,a){return e<o?o:e>a?a:e}function Ut(e){if(e===void 0)return 0;if(typeof e=="number")return e;const o=/^((\d+)?\.?\d+?)(ms|s)?$/,a=e.match(o);if(a){const[,s,,i="ms"]=a;return Number(s)*(i==="ms"?1:1e3)}return 0}const Ue=wt("n-carousel-methods"),qt=e=>{bt(Ue,e)},Pe=(e="unknown",o="component")=>{const a=yt(Ue);return a||St(e,`\`${o}\` must be placed inside \`n-carousel\`.`),a},Jt={total:{type:Number,default:0},currentIndex:{type:Number,default:0},dotType:{type:String,default:"dot"},trigger:{type:String,default:"click"},keyboard:Boolean},Qt=Q({name:"CarouselDots",props:Jt,setup(e){const{mergedClsPrefixRef:o}=G(e),a=j([]),s=Pe();function i(x,v){switch(x.key){case"Enter":case" ":x.preventDefault(),s.to(v);return}e.keyboard&&S(x)}function m(x){e.trigger==="hover"&&s.to(x)}function z(x){e.trigger==="click"&&s.to(x)}function S(x){var v;if(x.shiftKey||x.altKey||x.ctrlKey||x.metaKey)return;const p=(v=document.activeElement)===null||v===void 0?void 0:v.nodeName.toLowerCase();if(p==="input"||p==="textarea")return;const{code:C}=x,T=C==="PageUp"||C==="ArrowUp",A=C==="PageDown"||C==="ArrowDown",b=C==="PageUp"||C==="ArrowRight",R=C==="PageDown"||C==="ArrowLeft",k=s.isVertical(),D=k?T:b,B=k?A:R;!D&&!B||(x.preventDefault(),D&&!s.isNextDisabled()?(s.next(),P(s.currentIndexRef.value)):B&&!s.isPrevDisabled()&&(s.prev(),P(s.currentIndexRef.value)))}function P(x){var v;(v=a.value[x])===null||v===void 0||v.focus()}return Ct(()=>a.value.length=0),{mergedClsPrefix:o,dotEls:a,handleKeydown:i,handleMouseenter:m,handleClick:z}},render(){const{mergedClsPrefix:e,dotEls:o}=this;return w("div",{class:[`${e}-carousel__dots`,`${e}-carousel__dots--${this.dotType}`],role:"tablist"},Rt(this.total,a=>{const s=a===this.currentIndex;return w("div",{"aria-selected":s,ref:i=>o.push(i),role:"button",tabindex:"0",class:[`${e}-carousel__dot`,s&&`${e}-carousel__dot--active`],key:a,onClick:()=>{this.handleClick(a)},onMouseenter:()=>{this.handleMouseenter(a)},onKeydown:i=>{this.handleKeydown(i,a)}})}))}}),Gt=w("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},w("g",{fill:"none"},w("path",{d:"M10.26 3.2a.75.75 0 0 1 .04 1.06L6.773 8l3.527 3.74a.75.75 0 1 1-1.1 1.02l-4-4.25a.75.75 0 0 1 0-1.02l4-4.25a.75.75 0 0 1 1.06-.04z",fill:"currentColor"}))),en=w("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},w("g",{fill:"none"},w("path",{d:"M5.74 3.2a.75.75 0 0 0-.04 1.06L9.227 8L5.7 11.74a.75.75 0 1 0 1.1 1.02l4-4.25a.75.75 0 0 0 0-1.02l-4-4.25a.75.75 0 0 0-1.06-.04z",fill:"currentColor"}))),tn=Q({name:"CarouselArrow",setup(e){const{mergedClsPrefixRef:o}=G(e),{isVertical:a,isPrevDisabled:s,isNextDisabled:i,prev:m,next:z}=Pe();return{mergedClsPrefix:o,isVertical:a,isPrevDisabled:s,isNextDisabled:i,prev:m,next:z}},render(){const{mergedClsPrefix:e}=this;return w("div",{class:`${e}-carousel__arrow-group`},w("div",{class:[`${e}-carousel__arrow`,this.isPrevDisabled()&&`${e}-carousel__arrow--disabled`],role:"button",onClick:this.prev},Gt),w("div",{class:[`${e}-carousel__arrow`,this.isNextDisabled()&&`${e}-carousel__arrow--disabled`],role:"button",onClick:this.next},en))}}),fe="CarouselItem",nn=e=>{var o;return((o=e.type)===null||o===void 0?void 0:o.name)===fe},on=Q({name:fe,setup(e){const{mergedClsPrefixRef:o}=G(e),a=Pe(Oe(fe),`n-${Oe(fe)}`),s=j(),i=h(()=>{const{value:v}=s;return v?a.getSlideIndex(v):-1}),m=h(()=>a.isPrev(i.value)),z=h(()=>a.isNext(i.value)),S=h(()=>a.isActive(i.value)),P=h(()=>a.getSlideStyle(i.value));Fe(()=>{a.addSlide(s.value)}),Ze(()=>{a.removeSlide(s.value)});function x(v){const{value:p}=i;p!==void 0&&(a==null||a.onCarouselItemClick(p,v))}return{mergedClsPrefix:o,selfElRef:s,isPrev:m,isNext:z,isActive:S,index:i,style:P,handleClick:x}},render(){var e;const{$slots:o,mergedClsPrefix:a,isPrev:s,isNext:i,isActive:m,index:z,style:S}=this,P=[`${a}-carousel__slide`,{[`${a}-carousel__slide--current`]:m,[`${a}-carousel__slide--prev`]:s,[`${a}-carousel__slide--next`]:i}];return w("div",{ref:"selfElRef",class:P,role:"option",tabindex:"-1","data-index":z,"aria-hidden":!m,style:S,onClickCapture:this.handleClick},(e=o.default)===null||e===void 0?void 0:e.call(o,{isPrev:s,isNext:i,isActive:m,index:z}))}}),an=He("carousel",`
 position: relative;
 width: 100%;
 height: 100%;
 touch-action: pan-y;
 overflow: hidden;
`,[d("slides",`
 display: flex;
 width: 100%;
 height: 100%;
 transition-timing-function: var(--n-bezier);
 transition-property: transform;
 `,[d("slide",`
 flex-shrink: 0;
 position: relative;
 width: 100%;
 height: 100%;
 outline: none;
 overflow: hidden;
 `,[I("> img",`
 display: block;
 `)])]),d("dots",`
 position: absolute;
 display: flex;
 flex-wrap: nowrap;
 `,[f("dot",[d("dot",`
 height: var(--n-dot-size);
 width: var(--n-dot-size);
 background-color: var(--n-dot-color);
 border-radius: 50%;
 cursor: pointer;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 `,[I("&:focus",`
 background-color: var(--n-dot-color-focus);
 `),f("active",`
 background-color: var(--n-dot-color-active);
 `)])]),f("line",[d("dot",`
 border-radius: 9999px;
 width: var(--n-dot-line-width);
 height: 4px;
 background-color: var(--n-dot-color);
 cursor: pointer;
 transition:
 width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 `,[I("&:focus",`
 background-color: var(--n-dot-color-focus);
 `),f("active",`
 width: var(--n-dot-line-width-active);
 background-color: var(--n-dot-color-active);
 `)])])]),d("arrow",`
 transition: background-color .3s var(--n-bezier);
 cursor: pointer;
 height: 28px;
 width: 28px;
 display: flex;
 align-items: center;
 justify-content: center;
 background-color: rgba(255, 255, 255, .2);
 color: var(--n-arrow-color);
 border-radius: 8px;
 user-select: none;
 -webkit-user-select: none;
 font-size: 18px;
 `,[I("svg",`
 height: 1em;
 width: 1em;
 `),I("&:hover",`
 background-color: rgba(255, 255, 255, .3);
 `)]),f("vertical",`
 touch-action: pan-x;
 `,[d("slides",`
 flex-direction: column;
 `),f("fade",[d("slide",`
 top: 50%;
 left: unset;
 transform: translateY(-50%);
 `)]),f("card",[d("slide",`
 top: 50%;
 left: unset;
 transform: translateY(-50%) translateZ(-400px);
 `,[f("current",`
 transform: translateY(-50%) translateZ(0);
 `),f("prev",`
 transform: translateY(-100%) translateZ(-200px);
 `),f("next",`
 transform: translateY(0%) translateZ(-200px);
 `)])])]),f("usercontrol",[d("slides",[I(">",[I("div",`
 position: absolute;
 top: 50%;
 left: 50%;
 width: 100%;
 height: 100%;
 transform: translate(-50%, -50%);
 `)])])]),f("left",[d("dots",`
 transform: translateY(-50%);
 top: 50%;
 left: 12px;
 flex-direction: column;
 `,[f("line",[d("dot",`
 width: 4px;
 height: var(--n-dot-line-width);
 margin: 4px 0;
 transition:
 height .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 `,[f("active",`
 height: var(--n-dot-line-width-active);
 `)])])]),d("dot",`
 margin: 4px 0;
 `)]),d("arrow-group",`
 position: absolute;
 display: flex;
 flex-wrap: nowrap;
 `),f("vertical",[d("arrow",`
 transform: rotate(90deg);
 `)]),f("show-arrow",[f("bottom",[d("dots",`
 transform: translateX(0);
 bottom: 18px;
 left: 18px;
 `)]),f("top",[d("dots",`
 transform: translateX(0);
 top: 18px;
 left: 18px;
 `)]),f("left",[d("dots",`
 transform: translateX(0);
 top: 18px;
 left: 18px;
 `)]),f("right",[d("dots",`
 transform: translateX(0);
 top: 18px;
 right: 18px;
 `)])]),f("left",[d("arrow-group",`
 bottom: 12px;
 left: 12px;
 flex-direction: column;
 `,[I("> *:first-child",`
 margin-bottom: 12px;
 `)])]),f("right",[d("dots",`
 transform: translateY(-50%);
 top: 50%;
 right: 12px;
 flex-direction: column;
 `,[f("line",[d("dot",`
 width: 4px;
 height: var(--n-dot-line-width);
 margin: 4px 0;
 transition:
 height .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 outline: none;
 `,[f("active",`
 height: var(--n-dot-line-width-active);
 `)])])]),d("dot",`
 margin: 4px 0;
 `),d("arrow-group",`
 bottom: 12px;
 right: 12px;
 flex-direction: column;
 `,[I("> *:first-child",`
 margin-bottom: 12px;
 `)])]),f("top",[d("dots",`
 transform: translateX(-50%);
 top: 12px;
 left: 50%;
 `,[f("line",[d("dot",`
 margin: 0 4px;
 `)])]),d("dot",`
 margin: 0 4px;
 `),d("arrow-group",`
 top: 12px;
 right: 12px;
 `,[I("> *:first-child",`
 margin-right: 12px;
 `)])]),f("bottom",[d("dots",`
 transform: translateX(-50%);
 bottom: 12px;
 left: 50%;
 `,[f("line",[d("dot",`
 margin: 0 4px;
 `)])]),d("dot",`
 margin: 0 4px;
 `),d("arrow-group",`
 bottom: 12px;
 right: 12px;
 `,[I("> *:first-child",`
 margin-right: 12px;
 `)])]),f("fade",[d("slide",`
 position: absolute;
 opacity: 0;
 transition-property: opacity;
 pointer-events: none;
 `,[f("current",`
 opacity: 1;
 pointer-events: auto;
 `)])]),f("card",[d("slides",`
 perspective: 1000px;
 `),d("slide",`
 position: absolute;
 left: 50%;
 opacity: 0;
 transform: translateX(-50%) translateZ(-400px);
 transition-property: opacity, transform;
 `,[f("current",`
 opacity: 1;
 transform: translateX(-50%) translateZ(0);
 z-index: 1;
 `),f("prev",`
 opacity: 0.4;
 transform: translateX(-100%) translateZ(-200px);
 `),f("next",`
 opacity: 0.4;
 transform: translateX(0%) translateZ(-200px);
 `)])])]),rn=["transitionDuration","transitionTimingFunction"],sn=Object.assign(Object.assign({},ve.props),{defaultIndex:{type:Number,default:0},currentIndex:Number,showArrow:Boolean,dotType:{type:String,default:"dot"},dotPlacement:{type:String,default:"bottom"},slidesPerView:{type:[Number,String],default:1},spaceBetween:{type:Number,default:0},centeredSlides:Boolean,direction:{type:String,default:"horizontal"},autoplay:Boolean,interval:{type:Number,default:5e3},loop:{type:Boolean,default:!0},effect:{type:String,default:"slide"},showDots:{type:Boolean,default:!0},trigger:{type:String,default:"click"},transitionStyle:{type:Object,default:()=>({transitionDuration:"300ms"})},transitionProps:Object,draggable:Boolean,prevSlideStyle:[Object,String],nextSlideStyle:[Object,String],touchable:{type:Boolean,default:!0},mousewheel:Boolean,keyboard:Boolean,"onUpdate:currentIndex":Function,onUpdateCurrentIndex:Function});let Re=!1;const gn=Q({name:"Carousel",props:sn,setup(e){const{mergedClsPrefixRef:o,inlineThemeDisabled:a}=G(e),s=j(null),i=j(null),m=j([]),z={value:[]},S=h(()=>e.direction==="vertical"),P=h(()=>S.value?"height":"width"),x=h(()=>S.value?"bottom":"right"),v=h(()=>e.effect==="slide"),p=h(()=>e.loop&&e.slidesPerView===1&&v.value),C=h(()=>e.effect==="custom"),T=h(()=>!v.value||e.centeredSlides?1:e.slidesPerView),A=h(()=>C.value?1:e.slidesPerView),b=h(()=>T.value==="auto"||e.slidesPerView==="auto"&&e.centeredSlides),R=j({width:0,height:0}),k=h(()=>{const{value:t}=m;if(!t.length)return[];const{value:n}=b;if(n)return t.map(y=>Ye(y));const{value:r}=A,{value:u}=R,{value:c}=P;let l=u[c];if(r!=="auto"){const{spaceBetween:y}=e,N=l-(r-1)*y,ue=1/Math.max(1,r);l=N*ue}const g=Object.assign(Object.assign({},u),{[c]:l});return t.map(()=>g)}),D=h(()=>{const{value:t}=k;if(!t.length)return[];const{centeredSlides:n,spaceBetween:r}=e,{value:u}=P,{[u]:c}=R.value;let l=0;return t.map(({[u]:g})=>{let y=l;return n&&(y+=(g-c)/2),l+=g+r,y})}),B=j(!1),O=h(()=>{const{transitionStyle:t}=e;return t?Ee(t,rn):{}}),L=h(()=>C.value?0:Ut(O.value.transitionDuration)),ze=h(()=>{const{value:t}=m;if(!t.length)return[];const n=!(b.value||A.value===1),r=g=>{if(n){const{value:y}=P;return{[y]:`${k.value[g][y]}px`}}};if(C.value)return t.map((g,y)=>r(y));const{effect:u,spaceBetween:c}=e,{value:l}=x;return t.reduce((g,y,N)=>{const ue=Object.assign(Object.assign({},r(N)),{[`margin-${l}`]:`${c}px`});return g.push(ue),B.value&&(u==="fade"||u==="card")&&Object.assign(ue,O.value),g},[])}),_=h(()=>{const{value:t}=T,{length:n}=m.value;if(t!=="auto")return Math.max(n-t,0)+1;{const{value:r}=k,{length:u}=r;if(!u)return n;const{value:c}=D,{value:l}=P,g=R.value[l];let y=r[r.length-1][l],N=u;for(;N>1&&y<g;)N--,y+=c[N]-c[N-1];return de(N+1,1,u)}}),ee=h(()=>Ht(_.value,p.value)),qe=Ce(e.defaultIndex,p.value),he=j(Xe(qe,_.value,p.value)),E=Pt(zt(e,"currentIndex"),he),$=h(()=>Ce(E.value,p.value));function Z(t){var n,r;t=de(t,0,_.value-1);const u=Xe(t,_.value,p.value),{value:c}=E;u!==E.value&&(he.value=u,(n=e["onUpdate:currentIndex"])===null||n===void 0||n.call(e,u,c),(r=e.onUpdateCurrentIndex)===null||r===void 0||r.call(e,u,c))}function te(t=$.value){return Ft(t,_.value,e.loop)}function ne(t=$.value){return Zt(t,_.value,e.loop)}function Je(t){const n=K(t);return n!==null&&te()===n}function Qe(t){const n=K(t);return n!==null&&ne()===n}function ke(t){return $.value===K(t)}function Ge(t){return E.value===t}function Ie(){return te()===null}function De(){return ne()===null}function pe(t){const n=de(Ce(t,p.value),0,_.value);(t!==E.value||n!==$.value)&&Z(n)}function ge(){const t=te();t!==null&&Z(t)}function oe(){const t=ne();t!==null&&Z(t)}function et(){(!V||!p.value)&&ge()}function tt(){(!V||!p.value)&&oe()}let V=!1,X=0;const me=j({});function ae(t,n=0){me.value=Object.assign({},O.value,{transform:S.value?`translateY(${-t}px)`:`translateX(${-t}px)`,transitionDuration:`${n}ms`})}function H(t=0){v.value?xe($.value,t):X!==0&&(!V&&t>0&&(V=!0),ae(X=0,t))}function xe(t,n){const r=Ne(t);r!==X&&n>0&&(V=!0),X=Ne($.value),ae(r,n)}function Ne(t){let n;return t>=_.value-1?n=_e():n=D.value[t]||0,n}function _e(){if(T.value==="auto"){const{value:t}=P,{[t]:n}=R.value,{value:r}=D,u=r[r.length-1];let c;if(u===void 0)c=n;else{const{value:l}=k;c=u+l[l.length-1][t]}return c-n}else{const{value:t}=D;return t[_.value-1]||0}}const U={currentIndexRef:E,to:pe,prev:et,next:tt,isVertical:()=>S.value,isHorizontal:()=>!S.value,isPrev:Je,isNext:Qe,isActive:ke,isPrevDisabled:Ie,isNextDisabled:De,getSlideIndex:K,getSlideStyle:at,addSlide:nt,removeSlide:ot,onCarouselItemClick:rt};qt(U);function nt(t){t&&m.value.push(t)}function ot(t){if(!t)return;const n=K(t);n!==-1&&m.value.splice(n,1)}function K(t){return typeof t=="number"?t:t?m.value.indexOf(t):-1}function at(t){const n=K(t);if(n!==-1){const r=[ze.value[n]],u=U.isPrev(n),c=U.isNext(n);return u&&r.push(e.prevSlideStyle||""),c&&r.push(e.nextSlideStyle||""),Tt(r)}}function rt(t,n){let r=!V&&!le&&!Se;e.effect==="card"&&r&&!ke(t)&&(pe(t),r=!1),r||(n.preventDefault(),n.stopPropagation())}let re=null;function se(){re&&(clearInterval(re),re=null)}function Y(){se(),!e.autoplay||ee.value<2||(re=window.setInterval(oe,e.interval))}let be=0,we=0,M=0,ye=0,le=!1,Se=!1;function $e(t){var n;if(Re||!(!((n=i.value)===null||n===void 0)&&n.contains(Et(t))))return;Re=!0,le=!0,Se=!1,ye=Date.now(),se(),t.type!=="touchstart"&&!t.target.isContentEditable&&t.preventDefault();const r=Ke(t)?t.touches[0]:t;S.value?we=r.clientY:be=r.clientX,e.touchable&&(q("touchmove",document,ie),q("touchend",document,W),q("touchcancel",document,W)),e.draggable&&(q("mousemove",document,ie),q("mouseup",document,W))}function ie(t){const{value:n}=S,{value:r}=P,u=Ke(t)?t.touches[0]:t,c=n?u.clientY-we:u.clientX-be,l=R.value[r];M=de(c,-l,l),t.cancelable&&t.preventDefault(),v.value&&ae(X-M,0)}function W(){const{value:t}=$;let n=t;if(!V&&M!==0&&v.value){const r=X-M,u=[...D.value.slice(0,_.value-1),_e()];let c=null;for(let l=0;l<u.length;l++){const g=Math.abs(u[l]-r);if(c!==null&&c<g)break;c=g,n=l}}if(n===t){const r=Date.now()-ye,{value:u}=P,c=R.value[u];M>c/2||M/r>.4?n=te(t):(M<-c/2||M/r<-.4)&&(n=ne(t))}n!==null&&n!==t?(Se=!0,Z(n),je(()=>{(!p.value||he.value!==E.value)&&H(L.value)})):H(L.value),Ve(),Y()}function Ve(){le&&(Re=!1),le=!1,be=0,we=0,M=0,ye=0,J("touchmove",document,ie),J("touchend",document,W),J("touchcancel",document,W),J("mousemove",document,ie),J("mouseup",document,W)}function st(){if(v.value&&V){const{value:t}=$;xe(t,0)}else Y();v.value&&(me.value.transitionDuration="0ms"),V=!1}function lt(t){if(t.preventDefault(),V)return;let{deltaX:n,deltaY:r}=t;t.shiftKey&&!n&&(n=r);const u=-1,c=1,l=(n||r)>0?c:u;let g=0,y=0;S.value?y=l:g=l;const N=10;(y*r>=N||g*n>=N)&&(l===c&&!De()?oe():l===u&&!Ie()&&ge())}function it(){R.value=Ye(s.value,!0),Y()}function ut(){var t,n;b.value&&((n=(t=k.effect).scheduler)===null||n===void 0||n.call(t),k.effect.run())}function ct(){e.autoplay&&se()}function dt(){e.autoplay&&Y()}Fe(()=>{kt(Y),requestAnimationFrame(()=>B.value=!0)}),Ze(()=>{Ve(),se()}),It(()=>{const{value:t}=m,{value:n}=z,r=new Map,u=l=>r.has(l)?r.get(l):-1;let c=!1;for(let l=0;l<t.length;l++){const g=n.findIndex(y=>y.el===t[l]);g!==l&&(c=!0),r.set(t[l],g)}c&&t.sort((l,g)=>u(l)-u(g))}),ce($,(t,n)=>{if(t!==n)if(Y(),v.value){if(p.value){const{value:r}=_;ee.value>2&&t===r-2&&n===1?t=0:t===1&&n===r-2&&(t=r-1)}xe(t,L.value)}else H()},{immediate:!0}),ce([p,T],()=>void je(()=>{Z($.value)})),ce(D,()=>{v.value&&H()},{deep:!0}),ce(v,t=>{t?H():(V=!1,ae(X=0))});const ft=h(()=>({onTouchstartPassive:e.touchable?$e:void 0,onMousedown:e.draggable?$e:void 0,onWheel:e.mousewheel?lt:void 0})),vt=h(()=>Object.assign(Object.assign({},Ee(U,["to","prev","next","isPrevDisabled","isNextDisabled"])),{total:ee.value,currentIndex:E.value})),ht=h(()=>({total:ee.value,currentIndex:E.value,to:U.to})),pt={getCurrentIndex:()=>E.value,to:pe,prev:ge,next:oe},gt=ve("Carousel","-carousel",an,At,e,o),Te=h(()=>{const{common:{cubicBezierEaseInOut:t},self:{dotSize:n,dotColor:r,dotColorActive:u,dotColorFocus:c,dotLineWidth:l,dotLineWidthActive:g,arrowColor:y}}=gt.value;return{"--n-bezier":t,"--n-dot-color":r,"--n-dot-color-focus":c,"--n-dot-color-active":u,"--n-dot-size":n,"--n-dot-line-width":l,"--n-dot-line-width-active":g,"--n-arrow-color":y}}),F=a?Dt("carousel",void 0,Te,e):void 0;return Object.assign(Object.assign({mergedClsPrefix:o,selfElRef:s,slidesElRef:i,slideVNodes:z,duplicatedable:p,userWantsControl:C,autoSlideSize:b,realIndex:$,slideStyles:ze,translateStyle:me,slidesControlListeners:ft,handleTransitionEnd:st,handleResize:it,handleSlideResize:ut,handleMouseenter:ct,handleMouseleave:dt,isActive:Ge,arrowSlotProps:vt,dotSlotProps:ht},pt),{cssVars:a?void 0:Te,themeClass:F==null?void 0:F.themeClass,onRender:F==null?void 0:F.onRender})},render(){var e;const{mergedClsPrefix:o,showArrow:a,userWantsControl:s,slideStyles:i,dotType:m,dotPlacement:z,slidesControlListeners:S,transitionProps:P={},arrowSlotProps:x,dotSlotProps:v,$slots:{default:p,dots:C,arrow:T}}=this,A=p&&Nt(p())||[];let b=ln(A);return b.length||(b=A.map(R=>w(on,null,{default:()=>We(R)}))),this.duplicatedable&&(b=Wt(b)),this.slideVNodes.value=b,this.autoSlideSize&&(b=b.map(R=>w(Ae,{onResize:this.handleSlideResize},{default:()=>R}))),(e=this.onRender)===null||e===void 0||e.call(this),w("div",Object.assign({ref:"selfElRef",class:[this.themeClass,`${o}-carousel`,this.direction==="vertical"&&`${o}-carousel--vertical`,this.showArrow&&`${o}-carousel--show-arrow`,`${o}-carousel--${z}`,`${o}-carousel--${this.direction}`,`${o}-carousel--${this.effect}`,s&&`${o}-carousel--usercontrol`],style:this.cssVars},S,{onMouseenter:this.handleMouseenter,onMouseleave:this.handleMouseleave}),w(Ae,{onResize:this.handleResize},{default:()=>w("div",{ref:"slidesElRef",class:`${o}-carousel__slides`,role:"listbox",style:this.translateStyle,onTransitionend:this.handleTransitionEnd},s?b.map((R,k)=>w("div",{style:i[k],key:k},_t(w(Vt,Object.assign({},P),{default:()=>R}),[[$t,this.isActive(k)]]))):b)}),this.showDots&&v.total>1&&Me(C,v,()=>[w(Qt,{key:m+z,total:v.total,currentIndex:v.currentIndex,dotType:m,trigger:this.trigger,keyboard:this.keyboard})]),a&&Me(T,x,()=>[w(tn,null)]))}});function ln(e){return e.reduce((o,a)=>(nn(a)&&o.push(a),o),[])}const un=e=>{const{heightSmall:o,heightMedium:a,heightLarge:s,borderRadius:i}=e;return{color:"#eee",colorEnd:"#ddd",borderRadius:i,heightSmall:o,heightMedium:a,heightLarge:s}},cn={name:"Skeleton",common:Mt,self:un},dn=I([He("skeleton",`
 height: 1em;
 width: 100%;
 transition:
 --n-color-start .3s var(--n-bezier),
 --n-color-end .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 animation: 2s skeleton-loading infinite cubic-bezier(0.36, 0, 0.64, 1);
 background-color: var(--n-color-start);
 `),I("@keyframes skeleton-loading",`
 0% {
 background: var(--n-color-start);
 }
 40% {
 background: var(--n-color-end);
 }
 80% {
 background: var(--n-color-start);
 }
 100% {
 background: var(--n-color-start);
 }
 `)]),fn=Object.assign(Object.assign({},ve.props),{text:Boolean,round:Boolean,circle:Boolean,height:[String,Number],width:[String,Number],size:String,repeat:{type:Number,default:1},animated:{type:Boolean,default:!0},sharp:{type:Boolean,default:!0}}),mn=Q({name:"Skeleton",inheritAttrs:!1,props:fn,setup(e){Kt();const{mergedClsPrefixRef:o}=G(e),a=ve("Skeleton","-skeleton",dn,cn,e,o);return{mergedClsPrefix:o,style:h(()=>{var s,i;const m=a.value,{common:{cubicBezierEaseInOut:z}}=m,S=m.self,{color:P,colorEnd:x,borderRadius:v}=S;let p;const{circle:C,sharp:T,round:A,width:b,height:R,size:k,text:D,animated:B}=e;k!==void 0&&(p=S[jt("height",k)]);const O=C?(s=b??R)!==null&&s!==void 0?s:p:b,L=(i=C?b??R:R)!==null&&i!==void 0?i:p;return{display:D?"inline-block":"",verticalAlign:D?"-0.125em":"",borderRadius:C?"50%":A?"4096px":T?"":v,width:typeof O=="number"?Be(O):O,height:typeof L=="number"?Be(L):L,animation:B?"":"none","--n-bezier":z,"--n-color-start":P,"--n-color-end":x}})}},render(){const{repeat:e,style:o,mergedClsPrefix:a,$attrs:s}=this,i=w("div",Bt({class:`${a}-skeleton`,style:o},s));return e>1?w(Lt,null,Ot(e,null).map(m=>[i,`
`])):i}});export{mn as N,gn as a};
