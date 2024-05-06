import{af as L,cE as q,d as S,$ as C,Z as W,K as F,w as O,L as Z,ao as $,S as E,aS as z,T as Y,a$ as B,e as H,V as J,a6 as I,aG as U,ap as V,ac as K,aQ as ee,ab as te,ct as se,W as j}from"./app-DfuiwjtQ.js";function ne(e){if(typeof e=="number")return{"":e.toString()};const t={};return e.split(/ +/).forEach(i=>{if(i==="")return;const[n,s]=i.split(":");s===void 0?t[""]=n:t[n]=s}),t}function _(e,t){var i;if(e==null)return;const n=ne(e);if(t===void 0)return n[""];if(typeof t=="string")return(i=n[t])!==null&&i!==void 0?i:n[""];if(Array.isArray(t)){for(let s=t.length-1;s>=0;--s){const r=t[s];if(r in n)return n[r]}return n[""]}else{let s,r=-1;return Object.keys(n).forEach(o=>{const l=Number(o);!Number.isNaN(l)&&t>=l&&l>=r&&(r=l,s=n[o])}),s}}function ie(e){var t;const i=(t=e.dirs)===null||t===void 0?void 0:t.find(({dir:n})=>n===L);return!!(i&&i.value===!1)}const re={xs:0,s:640,m:1024,l:1280,xl:1536,"2xl":1920};function ae(e){return`(min-width: ${e}px)`}const N={};function oe(e=re){if(!q)return S(()=>[]);if(typeof window.matchMedia!="function")return S(()=>[]);const t=C({}),i=Object.keys(e),n=(s,r)=>{s.matches?t.value[r]=!0:t.value[r]=!1};return i.forEach(s=>{const r=e[s];let o,l;N[r]===void 0?(o=window.matchMedia(ae(r)),o.addEventListener?o.addEventListener("change",d=>{l.forEach(f=>{f(d,s)})}):o.addListener&&o.addListener(d=>{l.forEach(f=>{f(d,s)})}),l=new Set,N[r]={mql:o,cbs:l}):(o=N[r].mql,l=N[r].cbs),l.add(n),o.matches&&l.forEach(d=>{d(o,s)})}),W(()=>{i.forEach(s=>{const{cbs:r}=N[e[s]];r.has(n)&&r.delete(n)})}),S(()=>{const{value:s}=t;return i.filter(r=>s[r])})}const T=1,Q=F("n-grid"),P=1,le={span:{type:[Number,String],default:P},offset:{type:[Number,String],default:0},suffix:Boolean,privateOffset:Number,privateSpan:Number,privateColStart:Number,privateShow:{type:Boolean,default:!0}},pe=O({__GRID_ITEM__:!0,name:"GridItem",alias:["Gi"],props:le,setup(){const{isSsrRef:e,xGapRef:t,itemStyleRef:i,overflowRef:n,layoutShiftDisabledRef:s}=Z(Q),r=z();return{overflow:n,itemStyle:i,layoutShiftDisabled:s,mergedXGap:S(()=>$(t.value||0)),deriveStyle:()=>{e.value;const{privateSpan:o=P,privateShow:l=!0,privateColStart:d=void 0,privateOffset:f=0}=r.vnode.props,{value:x}=t,y=$(x||0);return{display:l?"":"none",gridColumn:`${d??`span ${o}`} / span ${o}`,marginLeft:f?`calc((100% - (${o} - 1) * ${y}) / ${o} * ${f} + ${y} * ${f})`:""}}}},render(){var e,t;if(this.layoutShiftDisabled){const{span:i,offset:n,mergedXGap:s}=this;return E("div",{style:{gridColumn:`span ${i} / span ${i}`,marginLeft:n?`calc((100% - (${i} - 1) * ${s}) / ${i} * ${n} + ${s} * ${n})`:""}},this.$slots)}return E("div",{style:[this.itemStyle,this.deriveStyle()]},(t=(e=this.$slots).default)===null||t===void 0?void 0:t.call(e,{overflow:this.overflow}))}}),fe={xs:0,s:640,m:1024,l:1280,xl:1536,xxl:1920},X=24,A="__ssr__",ue={layoutShiftDisabled:Boolean,responsive:{type:[String,Boolean],default:"self"},cols:{type:[Number,String],default:X},itemResponsive:Boolean,collapsed:Boolean,collapsedRows:{type:Number,default:1},itemStyle:[Object,String],xGap:{type:[Number,String],default:0},yGap:{type:[Number,String],default:0}},ce=O({name:"Grid",inheritAttrs:!1,props:ue,setup(e){const{mergedClsPrefixRef:t,mergedBreakpointsRef:i}=Y(e),n=/^\d+$/,s=C(void 0),r=oe((i==null?void 0:i.value)||fe),o=B(()=>!!(e.itemResponsive||!n.test(e.cols.toString())||!n.test(e.xGap.toString())||!n.test(e.yGap.toString()))),l=S(()=>{if(o.value)return e.responsive==="self"?s.value:r.value}),d=B(()=>{var u;return(u=Number(_(e.cols.toString(),l.value)))!==null&&u!==void 0?u:X}),f=B(()=>_(e.xGap.toString(),l.value)),x=B(()=>_(e.yGap.toString(),l.value)),y=u=>{s.value=u.contentRect.width},v=u=>{ee(y,u)},R=C(!1),g=S(()=>{if(e.responsive==="self")return v}),p=C(!1),h=C();return H(()=>{const{value:u}=h;u&&u.hasAttribute(A)&&(u.removeAttribute(A),p.value=!0)}),J(Q,{layoutShiftDisabledRef:I(e,"layoutShiftDisabled"),isSsrRef:p,itemStyleRef:I(e,"itemStyle"),xGapRef:f,overflowRef:R}),{isSsr:!U,contentEl:h,mergedClsPrefix:t,style:S(()=>e.layoutShiftDisabled?{width:"100%",display:"grid",gridTemplateColumns:`repeat(${e.cols}, minmax(0, 1fr))`,columnGap:$(e.xGap),rowGap:$(e.yGap)}:{width:"100%",display:"grid",gridTemplateColumns:`repeat(${d.value}, minmax(0, 1fr))`,columnGap:$(f.value),rowGap:$(x.value)}),isResponsive:o,responsiveQuery:l,responsiveCols:d,handleResize:g,overflow:R}},render(){if(this.layoutShiftDisabled)return E("div",V({ref:"contentEl",class:`${this.mergedClsPrefix}-grid`,style:this.style},this.$attrs),this.$slots);const e=()=>{var t,i,n,s,r,o,l;this.overflow=!1;const d=te(se(this)),f=[],{collapsed:x,collapsedRows:y,responsiveCols:v,responsiveQuery:R}=this;d.forEach(a=>{var G,m,c,b,D;if(((G=a==null?void 0:a.type)===null||G===void 0?void 0:G.__GRID_ITEM__)!==!0)return;if(ie(a)){const w=j(a);w.props?w.props.privateShow=!1:w.props={privateShow:!1},f.push({child:w,rawChildSpan:0});return}a.dirs=((m=a.dirs)===null||m===void 0?void 0:m.filter(({dir:w})=>w!==L))||null,((c=a.dirs)===null||c===void 0?void 0:c.length)===0&&(a.dirs=null);const M=j(a),k=Number((D=_((b=M.props)===null||b===void 0?void 0:b.span,R))!==null&&D!==void 0?D:T);k!==0&&f.push({child:M,rawChildSpan:k})});let g=0;const p=(t=f[f.length-1])===null||t===void 0?void 0:t.child;if(p!=null&&p.props){const a=(i=p.props)===null||i===void 0?void 0:i.suffix;a!==void 0&&a!==!1&&(g=Number((s=_((n=p.props)===null||n===void 0?void 0:n.span,R))!==null&&s!==void 0?s:T),p.props.privateSpan=g,p.props.privateColStart=v+1-g,p.props.privateShow=(r=p.props.privateShow)!==null&&r!==void 0?r:!0)}let h=0,u=!1;for(const{child:a,rawChildSpan:G}of f){if(u&&(this.overflow=!0),!u){const m=Number((l=_((o=a.props)===null||o===void 0?void 0:o.offset,R))!==null&&l!==void 0?l:0),c=Math.min(G+m,v);if(a.props?(a.props.privateSpan=c,a.props.privateOffset=m):a.props={privateSpan:c,privateOffset:m},x){const b=h%v;c+b>v&&(h+=v-b),c+h+g>y*v?u=!0:h+=c}}u&&(a.props?a.props.privateShow!==!0&&(a.props.privateShow=!1):a.props={privateShow:!1})}return E("div",V({ref:"contentEl",class:`${this.mergedClsPrefix}-grid`,style:this.style,[A]:this.isSsr||void 0},this.$attrs),f.map(({child:a})=>a))};return this.isResponsive&&this.responsive==="self"?E(K,{onResize:this.handleResize},{default:e}):e()}});export{pe as N,ce as a};