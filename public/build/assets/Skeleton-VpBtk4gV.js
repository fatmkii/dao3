import{y as xt,B as bt,D as wt,W as Fe,V as yt,E as St,I as Ct,J as Pt,w as Q,K as G,$ as j,L as Rt,S as w,P as zt,d as h,e as Ze,T as He,X as Ue,Y as d,Z as I,a0 as f,a1 as Ee,a2 as kt,a3 as It,a4 as Dt,a5 as Nt,q as ce,a6 as ve,a7 as Vt,a8 as _t,a9 as Ae,aa as Me,ab as $t,ac as Tt,ad as Et,m as At,ae as Mt,af as q,ag as je,ah as J,ai as jt,aj as Bt,ak as Ot,al as Be,am as Lt,an as Xt,C as Kt}from"./app-CKeLOz7-.js";import{c as Yt}from"./_createCompounder-QXOQu3qV.js";let Oe=!1;function Wt(){if(xt&&window.CSS&&!Oe&&(Oe=!0,"registerProperty"in(window==null?void 0:window.CSS)))try{CSS.registerProperty({name:"--n-color-start",syntax:"<color>",inherits:!1,initialValue:"#0000"}),CSS.registerProperty({name:"--n-color-end",syntax:"<color>",inherits:!1,initialValue:"#0000"})}catch{}}function Ft(e){return bt(wt(e).toLowerCase())}var Le=Yt(function(e,o,a){return o=o.toLowerCase(),e+(a?Ft(o):o)});function Zt(e){const{length:o}=e;return o>1&&(e.push(Xe(e[0],0,"append")),e.unshift(Xe(e[o-1],o-1,"prepend"))),e}function Xe(e,o,a){return Fe(e,{key:`carousel-item-duplicate-${o}-${a}`})}function Ke(e,o,a){return o===1?0:a?e===0?o-3:e===o-1?0:e-1:e}function Ce(e,o){return o?e+1:e}function Ht(e,o,a){return e<0?null:e===0?a?o-1:null:e-1}function Ut(e,o,a){return e>o-1?null:e===o-1?a?0:null:e+1}function qt(e,o){return o&&e>3?e-2:e}function Ye(e){return window.TouchEvent&&e instanceof window.TouchEvent}function We(e,o){let{offsetWidth:a,offsetHeight:s}=e;if(o){const l=getComputedStyle(e);a=a-parseFloat(l.getPropertyValue("padding-left"))-parseFloat(l.getPropertyValue("padding-right")),s=s-parseFloat(l.getPropertyValue("padding-top"))-parseFloat(l.getPropertyValue("padding-bottom"))}return{width:a,height:s}}function de(e,o,a){return e<o?o:e>a?a:e}function Jt(e){if(e===void 0)return 0;if(typeof e=="number")return e;const o=/^((\d+)?\.?\d+?)(ms|s)?$/,a=e.match(o);if(a){const[,s,,l="ms"]=a;return Number(s)*(l==="ms"?1:1e3)}return 0}const qe=St("n-carousel-methods"),Qt=e=>{yt(qe,e)},Re=(e="unknown",o="component")=>{const a=Ct(qe);return a||Pt(e,`\`${o}\` must be placed inside \`n-carousel\`.`),a},Gt={total:{type:Number,default:0},currentIndex:{type:Number,default:0},dotType:{type:String,default:"dot"},trigger:{type:String,default:"click"},keyboard:Boolean},en=Q({name:"CarouselDots",props:Gt,setup(e){const{mergedClsPrefixRef:o}=G(e),a=j([]),s=Re();function l(x,v){switch(x.key){case"Enter":case" ":x.preventDefault(),s.to(v);return}e.keyboard&&S(x)}function m(x){e.trigger==="hover"&&s.to(x)}function z(x){e.trigger==="click"&&s.to(x)}function S(x){var v;if(x.shiftKey||x.altKey||x.ctrlKey||x.metaKey)return;const p=(v=document.activeElement)===null||v===void 0?void 0:v.nodeName.toLowerCase();if(p==="input"||p==="textarea")return;const{code:C}=x,T=C==="PageUp"||C==="ArrowUp",A=C==="PageDown"||C==="ArrowDown",b=C==="PageUp"||C==="ArrowRight",P=C==="PageDown"||C==="ArrowLeft",k=s.isVertical(),D=k?T:b,B=k?A:P;!D&&!B||(x.preventDefault(),D&&!s.isNextDisabled()?(s.next(),R(s.currentIndexRef.value)):B&&!s.isPrevDisabled()&&(s.prev(),R(s.currentIndexRef.value)))}function R(x){var v;(v=a.value[x])===null||v===void 0||v.focus()}return Rt(()=>a.value.length=0),{mergedClsPrefix:o,dotEls:a,handleKeydown:l,handleMouseenter:m,handleClick:z}},render(){const{mergedClsPrefix:e,dotEls:o}=this;return w("div",{class:[`${e}-carousel__dots`,`${e}-carousel__dots--${this.dotType}`],role:"tablist"},zt(this.total,a=>{const s=a===this.currentIndex;return w("div",{"aria-selected":s,ref:l=>o.push(l),role:"button",tabindex:"0",class:[`${e}-carousel__dot`,s&&`${e}-carousel__dot--active`],key:a,onClick:()=>{this.handleClick(a)},onMouseenter:()=>{this.handleMouseenter(a)},onKeydown:l=>{this.handleKeydown(l,a)}})}))}}),tn=w("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},w("g",{fill:"none"},w("path",{d:"M10.26 3.2a.75.75 0 0 1 .04 1.06L6.773 8l3.527 3.74a.75.75 0 1 1-1.1 1.02l-4-4.25a.75.75 0 0 1 0-1.02l4-4.25a.75.75 0 0 1 1.06-.04z",fill:"currentColor"}))),nn=w("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},w("g",{fill:"none"},w("path",{d:"M5.74 3.2a.75.75 0 0 0-.04 1.06L9.227 8L5.7 11.74a.75.75 0 1 0 1.1 1.02l4-4.25a.75.75 0 0 0 0-1.02l-4-4.25a.75.75 0 0 0-1.06-.04z",fill:"currentColor"}))),on=Q({name:"CarouselArrow",setup(e){const{mergedClsPrefixRef:o}=G(e),{isVertical:a,isPrevDisabled:s,isNextDisabled:l,prev:m,next:z}=Re();return{mergedClsPrefix:o,isVertical:a,isPrevDisabled:s,isNextDisabled:l,prev:m,next:z}},render(){const{mergedClsPrefix:e}=this;return w("div",{class:`${e}-carousel__arrow-group`},w("div",{class:[`${e}-carousel__arrow`,this.isPrevDisabled()&&`${e}-carousel__arrow--disabled`],role:"button",onClick:this.prev},tn),w("div",{class:[`${e}-carousel__arrow`,this.isNextDisabled()&&`${e}-carousel__arrow--disabled`],role:"button",onClick:this.next},nn))}}),fe="CarouselItem",an=e=>{var o;return((o=e.type)===null||o===void 0?void 0:o.name)===fe},rn=Q({name:fe,setup(e){const{mergedClsPrefixRef:o}=G(e),a=Re(Le(fe),`n-${Le(fe)}`),s=j(),l=h(()=>{const{value:v}=s;return v?a.getSlideIndex(v):-1}),m=h(()=>a.isPrev(l.value)),z=h(()=>a.isNext(l.value)),S=h(()=>a.isActive(l.value)),R=h(()=>a.getSlideStyle(l.value));Ze(()=>{a.addSlide(s.value)}),He(()=>{a.removeSlide(s.value)});function x(v){const{value:p}=l;p!==void 0&&(a==null||a.onCarouselItemClick(p,v))}return{mergedClsPrefix:o,selfElRef:s,isPrev:m,isNext:z,isActive:S,index:l,style:R,handleClick:x}},render(){var e;const{$slots:o,mergedClsPrefix:a,isPrev:s,isNext:l,isActive:m,index:z,style:S}=this,R=[`${a}-carousel__slide`,{[`${a}-carousel__slide--current`]:m,[`${a}-carousel__slide--prev`]:s,[`${a}-carousel__slide--next`]:l}];return w("div",{ref:"selfElRef",class:R,role:"option",tabindex:"-1","data-index":z,"aria-hidden":!m,style:S,onClickCapture:this.handleClick},(e=o.default)===null||e===void 0?void 0:e.call(o,{isPrev:s,isNext:l,isActive:m,index:z}))}}),sn=Ue("carousel",`
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
 `)])])]),ln=["transitionDuration","transitionTimingFunction"],un=Object.assign(Object.assign({},ve.props),{defaultIndex:{type:Number,default:0},currentIndex:Number,showArrow:Boolean,dotType:{type:String,default:"dot"},dotPlacement:{type:String,default:"bottom"},slidesPerView:{type:[Number,String],default:1},spaceBetween:{type:Number,default:0},centeredSlides:Boolean,direction:{type:String,default:"horizontal"},autoplay:Boolean,interval:{type:Number,default:5e3},loop:{type:Boolean,default:!0},effect:{type:String,default:"slide"},showDots:{type:Boolean,default:!0},trigger:{type:String,default:"click"},transitionStyle:{type:Object,default:()=>({transitionDuration:"300ms"})},transitionProps:Object,draggable:Boolean,prevSlideStyle:[Object,String],nextSlideStyle:[Object,String],touchable:{type:Boolean,default:!0},mousewheel:Boolean,keyboard:Boolean,"onUpdate:currentIndex":Function,onUpdateCurrentIndex:Function});let Pe=!1;const mn=Q({name:"Carousel",props:un,setup(e){const{mergedClsPrefixRef:o,inlineThemeDisabled:a}=G(e),s=j(null),l=j(null),m=j([]),z={value:[]},S=h(()=>e.direction==="vertical"),R=h(()=>S.value?"height":"width"),x=h(()=>S.value?"bottom":"right"),v=h(()=>e.effect==="slide"),p=h(()=>e.loop&&e.slidesPerView===1&&v.value),C=h(()=>e.effect==="custom"),T=h(()=>!v.value||e.centeredSlides?1:e.slidesPerView),A=h(()=>C.value?1:e.slidesPerView),b=h(()=>T.value==="auto"||e.slidesPerView==="auto"&&e.centeredSlides),P=j({width:0,height:0}),k=h(()=>{const{value:t}=m;if(!t.length)return[];const{value:n}=b;if(n)return t.map(y=>We(y));const{value:r}=A,{value:u}=P,{value:c}=R;let i=u[c];if(r!=="auto"){const{spaceBetween:y}=e,N=i-(r-1)*y,ue=1/Math.max(1,r);i=N*ue}const g=Object.assign(Object.assign({},u),{[c]:i});return t.map(()=>g)}),D=h(()=>{const{value:t}=k;if(!t.length)return[];const{centeredSlides:n,spaceBetween:r}=e,{value:u}=R,{[u]:c}=P.value;let i=0;return t.map(({[u]:g})=>{let y=i;return n&&(y+=(g-c)/2),i+=g+r,y})}),B=j(!1),O=h(()=>{const{transitionStyle:t}=e;return t?Ee(t,ln):{}}),L=h(()=>C.value?0:Jt(O.value.transitionDuration)),ze=h(()=>{const{value:t}=m;if(!t.length)return[];const n=!(b.value||A.value===1),r=g=>{if(n){const{value:y}=R;return{[y]:`${k.value[g][y]}px`}}};if(C.value)return t.map((g,y)=>r(y));const{effect:u,spaceBetween:c}=e,{value:i}=x;return t.reduce((g,y,N)=>{const ue=Object.assign(Object.assign({},r(N)),{[`margin-${i}`]:`${c}px`});return g.push(ue),B.value&&(u==="fade"||u==="card")&&Object.assign(ue,O.value),g},[])}),V=h(()=>{const{value:t}=T,{length:n}=m.value;if(t!=="auto")return Math.max(n-t,0)+1;{const{value:r}=k,{length:u}=r;if(!u)return n;const{value:c}=D,{value:i}=R,g=P.value[i];let y=r[r.length-1][i],N=u;for(;N>1&&y<g;)N--,y+=c[N]-c[N-1];return de(N+1,1,u)}}),ee=h(()=>qt(V.value,p.value)),Je=Ce(e.defaultIndex,p.value),he=j(Ke(Je,V.value,p.value)),E=kt(It(e,"currentIndex"),he),_=h(()=>Ce(E.value,p.value));function Z(t){var n,r;t=de(t,0,V.value-1);const u=Ke(t,V.value,p.value),{value:c}=E;u!==E.value&&(he.value=u,(n=e["onUpdate:currentIndex"])===null||n===void 0||n.call(e,u,c),(r=e.onUpdateCurrentIndex)===null||r===void 0||r.call(e,u,c))}function te(t=_.value){return Ht(t,V.value,e.loop)}function ne(t=_.value){return Ut(t,V.value,e.loop)}function Qe(t){const n=K(t);return n!==null&&te()===n}function Ge(t){const n=K(t);return n!==null&&ne()===n}function ke(t){return _.value===K(t)}function et(t){return E.value===t}function Ie(){return te()===null}function De(){return ne()===null}function pe(t){const n=de(Ce(t,p.value),0,V.value);(t!==E.value||n!==_.value)&&Z(n)}function ge(){const t=te();t!==null&&Z(t)}function oe(){const t=ne();t!==null&&Z(t)}function tt(){(!$||!p.value)&&ge()}function nt(){(!$||!p.value)&&oe()}let $=!1,X=0;const me=j({});function ae(t,n=0){me.value=Object.assign({},O.value,{transform:S.value?`translateY(${-t}px)`:`translateX(${-t}px)`,transitionDuration:`${n}ms`})}function H(t=0){v.value?xe(_.value,t):X!==0&&(!$&&t>0&&($=!0),ae(X=0,t))}function xe(t,n){const r=Ne(t);r!==X&&n>0&&($=!0),X=Ne(_.value),ae(r,n)}function Ne(t){let n;return t>=V.value-1?n=Ve():n=D.value[t]||0,n}function Ve(){if(T.value==="auto"){const{value:t}=R,{[t]:n}=P.value,{value:r}=D,u=r[r.length-1];let c;if(u===void 0)c=n;else{const{value:i}=k;c=u+i[i.length-1][t]}return c-n}else{const{value:t}=D;return t[V.value-1]||0}}const U={currentIndexRef:E,to:pe,prev:tt,next:nt,isVertical:()=>S.value,isHorizontal:()=>!S.value,isPrev:Qe,isNext:Ge,isActive:ke,isPrevDisabled:Ie,isNextDisabled:De,getSlideIndex:K,getSlideStyle:rt,addSlide:ot,removeSlide:at,onCarouselItemClick:st};Qt(U);function ot(t){t&&m.value.push(t)}function at(t){if(!t)return;const n=K(t);n!==-1&&m.value.splice(n,1)}function K(t){return typeof t=="number"?t:t?m.value.indexOf(t):-1}function rt(t){const n=K(t);if(n!==-1){const r=[ze.value[n]],u=U.isPrev(n),c=U.isNext(n);return u&&r.push(e.prevSlideStyle||""),c&&r.push(e.nextSlideStyle||""),At(r)}}function st(t,n){let r=!$&&!ie&&!Se;e.effect==="card"&&r&&!ke(t)&&(pe(t),r=!1),r||(n.preventDefault(),n.stopPropagation())}let re=null;function se(){re&&(clearInterval(re),re=null)}function Y(){se(),!e.autoplay||ee.value<2||(re=window.setInterval(oe,e.interval))}let be=0,we=0,M=0,ye=0,ie=!1,Se=!1;function _e(t){var n;if(Pe||!(!((n=l.value)===null||n===void 0)&&n.contains(Mt(t))))return;Pe=!0,ie=!0,Se=!1,ye=Date.now(),se(),t.type!=="touchstart"&&!t.target.isContentEditable&&t.preventDefault();const r=Ye(t)?t.touches[0]:t;S.value?we=r.clientY:be=r.clientX,e.touchable&&(q("touchmove",document,le),q("touchend",document,W),q("touchcancel",document,W)),e.draggable&&(q("mousemove",document,le),q("mouseup",document,W))}function le(t){const{value:n}=S,{value:r}=R,u=Ye(t)?t.touches[0]:t,c=n?u.clientY-we:u.clientX-be,i=P.value[r];M=de(c,-i,i),t.cancelable&&t.preventDefault(),v.value&&ae(X-M,0)}function W(){const{value:t}=_;let n=t;if(!$&&M!==0&&v.value){const r=X-M,u=[...D.value.slice(0,V.value-1),Ve()];let c=null;for(let i=0;i<u.length;i++){const g=Math.abs(u[i]-r);if(c!==null&&c<g)break;c=g,n=i}}if(n===t){const r=Date.now()-ye,{value:u}=R,c=P.value[u];M>c/2||M/r>.4?n=te(t):(M<-c/2||M/r<-.4)&&(n=ne(t))}n!==null&&n!==t?(Se=!0,Z(n),je(()=>{(!p.value||he.value!==E.value)&&H(L.value)})):H(L.value),$e(),Y()}function $e(){ie&&(Pe=!1),ie=!1,be=0,we=0,M=0,ye=0,J("touchmove",document,le),J("touchend",document,W),J("touchcancel",document,W),J("mousemove",document,le),J("mouseup",document,W)}function it(){if(v.value&&$){const{value:t}=_;xe(t,0)}else Y();v.value&&(me.value.transitionDuration="0ms"),$=!1}function lt(t){if(t.preventDefault(),$)return;let{deltaX:n,deltaY:r}=t;t.shiftKey&&!n&&(n=r);const u=-1,c=1,i=(n||r)>0?c:u;let g=0,y=0;S.value?y=i:g=i;const N=10;(y*r>=N||g*n>=N)&&(i===c&&!De()?oe():i===u&&!Ie()&&ge())}function ut(){P.value=We(s.value,!0),Y()}function ct(){var t,n;b.value&&((n=(t=k.effect).scheduler)===null||n===void 0||n.call(t),k.effect.run())}function dt(){e.autoplay&&se()}function ft(){e.autoplay&&Y()}Ze(()=>{Dt(Y),requestAnimationFrame(()=>B.value=!0)}),He(()=>{$e(),se()}),Nt(()=>{const{value:t}=m,{value:n}=z,r=new Map,u=i=>r.has(i)?r.get(i):-1;let c=!1;for(let i=0;i<t.length;i++){const g=n.findIndex(y=>y.el===t[i]);g!==i&&(c=!0),r.set(t[i],g)}c&&t.sort((i,g)=>u(i)-u(g))}),ce(_,(t,n)=>{if(t!==n)if(Y(),v.value){if(p.value){const{value:r}=V;ee.value>2&&t===r-2&&n===1?t=0:t===1&&n===r-2&&(t=r-1)}xe(t,L.value)}else H()},{immediate:!0}),ce([p,T],()=>void je(()=>{Z(_.value)})),ce(D,()=>{v.value&&H()},{deep:!0}),ce(v,t=>{t?H():($=!1,ae(X=0))});const vt=h(()=>({onTouchstartPassive:e.touchable?_e:void 0,onMousedown:e.draggable?_e:void 0,onWheel:e.mousewheel?lt:void 0})),ht=h(()=>Object.assign(Object.assign({},Ee(U,["to","prev","next","isPrevDisabled","isNextDisabled"])),{total:ee.value,currentIndex:E.value})),pt=h(()=>({total:ee.value,currentIndex:E.value,to:U.to})),gt={getCurrentIndex:()=>E.value,to:pe,prev:ge,next:oe},mt=ve("Carousel","-carousel",sn,jt,e,o),Te=h(()=>{const{common:{cubicBezierEaseInOut:t},self:{dotSize:n,dotColor:r,dotColorActive:u,dotColorFocus:c,dotLineWidth:i,dotLineWidthActive:g,arrowColor:y}}=mt.value;return{"--n-bezier":t,"--n-dot-color":r,"--n-dot-color-focus":c,"--n-dot-color-active":u,"--n-dot-size":n,"--n-dot-line-width":i,"--n-dot-line-width-active":g,"--n-arrow-color":y}}),F=a?Vt("carousel",void 0,Te,e):void 0;return Object.assign(Object.assign({mergedClsPrefix:o,selfElRef:s,slidesElRef:l,slideVNodes:z,duplicatedable:p,userWantsControl:C,autoSlideSize:b,realIndex:_,slideStyles:ze,translateStyle:me,slidesControlListeners:vt,handleTransitionEnd:it,handleResize:ut,handleSlideResize:ct,handleMouseenter:dt,handleMouseleave:ft,isActive:et,arrowSlotProps:ht,dotSlotProps:pt},gt),{cssVars:a?void 0:Te,themeClass:F==null?void 0:F.themeClass,onRender:F==null?void 0:F.onRender})},render(){var e;const{mergedClsPrefix:o,showArrow:a,userWantsControl:s,slideStyles:l,dotType:m,dotPlacement:z,slidesControlListeners:S,transitionProps:R={},arrowSlotProps:x,dotSlotProps:v,$slots:{default:p,dots:C,arrow:T}}=this,A=p&&_t(p())||[];let b=cn(A);return b.length||(b=A.map(P=>w(rn,null,{default:()=>Fe(P)}))),this.duplicatedable&&(b=Zt(b)),this.slideVNodes.value=b,this.autoSlideSize&&(b=b.map(P=>w(Ae,{onResize:this.handleSlideResize},{default:()=>P}))),(e=this.onRender)===null||e===void 0||e.call(this),w("div",Object.assign({ref:"selfElRef",class:[this.themeClass,`${o}-carousel`,this.direction==="vertical"&&`${o}-carousel--vertical`,this.showArrow&&`${o}-carousel--show-arrow`,`${o}-carousel--${z}`,`${o}-carousel--${this.direction}`,`${o}-carousel--${this.effect}`,s&&`${o}-carousel--usercontrol`],style:this.cssVars},S,{onMouseenter:this.handleMouseenter,onMouseleave:this.handleMouseleave}),w(Ae,{onResize:this.handleResize},{default:()=>w("div",{ref:"slidesElRef",class:`${o}-carousel__slides`,role:"listbox",style:this.translateStyle,onTransitionend:this.handleTransitionEnd},s?b.map((P,k)=>w("div",{style:l[k],key:k},$t(w(Et,Object.assign({},R),{default:()=>P}),[[Tt,this.isActive(k)]]))):b)}),this.showDots&&v.total>1&&Me(C,v,()=>[w(en,{key:m+z,total:v.total,currentIndex:v.currentIndex,dotType:m,trigger:this.trigger,keyboard:this.keyboard})]),a&&Me(T,x,()=>[w(on,null)]))}});function cn(e){return e.reduce((o,a)=>(an(a)&&o.push(a),o),[])}const dn=e=>{const{heightSmall:o,heightMedium:a,heightLarge:s,borderRadius:l}=e;return{color:"#eee",colorEnd:"#ddd",borderRadius:l,heightSmall:o,heightMedium:a,heightLarge:s}},fn={name:"Skeleton",common:Bt,self:dn},vn=I([Ue("skeleton",`
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
 `)]),hn=Object.assign(Object.assign({},ve.props),{text:Boolean,round:Boolean,circle:Boolean,height:[String,Number],width:[String,Number],size:String,repeat:{type:Number,default:1},animated:{type:Boolean,default:!0},sharp:{type:Boolean,default:!0}}),xn=Q({name:"Skeleton",inheritAttrs:!1,props:hn,setup(e){Wt();const{mergedClsPrefixRef:o}=G(e),a=ve("Skeleton","-skeleton",vn,fn,e,o);return{mergedClsPrefix:o,style:h(()=>{var s,l;const m=a.value,{common:{cubicBezierEaseInOut:z}}=m,S=m.self,{color:R,colorEnd:x,borderRadius:v}=S;let p;const{circle:C,sharp:T,round:A,width:b,height:P,size:k,text:D,animated:B}=e;k!==void 0&&(p=S[Ot("height",k)]);const O=C?(s=b??P)!==null&&s!==void 0?s:p:b,L=(l=C?b??P:P)!==null&&l!==void 0?l:p;return{display:D?"inline-block":"",verticalAlign:D?"-0.125em":"",borderRadius:C?"50%":A?"4096px":T?"":v,width:typeof O=="number"?Be(O):O,height:typeof L=="number"?Be(L):L,animation:B?"":"none","--n-bezier":z,"--n-color-start":R,"--n-color-end":x}})}},render(){const{repeat:e,style:o,mergedClsPrefix:a,$attrs:s}=this,l=w("div",Lt({class:`${a}-skeleton`,style:o},s));return e>1?w(Kt,null,Xt(e,null).map(m=>[l,`
`])):l}});export{xn as N,mn as a};
