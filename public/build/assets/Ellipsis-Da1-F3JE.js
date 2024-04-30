import{w as y,T as P,a9 as v,$ as c,d as m,S as f,ay as $,cm as E,aJ as L,a0 as M,aM as _,a3 as O,cn as N,av as B,co as D,ap as I}from"./app-DNiDbruX.js";const H=Object.assign(Object.assign({},E),v.props),A=y({name:"Tooltip",props:H,__popover__:!0,setup(s){const{mergedClsPrefixRef:l}=P(s),o=v("Tooltip","-tooltip",void 0,L,s,l),n=c(null);return Object.assign(Object.assign({},{syncPosition(){n.value.syncPosition()},setShow(d){n.value.setShow(d)}}),{popoverRef:n,mergedTheme:o,popoverThemeOverrides:m(()=>o.value.self)})},render(){const{mergedTheme:s,internalExtraClass:l}=this;return f($,Object.assign(Object.assign({},this.$props),{theme:s.peers.Popover,themeOverrides:s.peerOverrides.Popover,builtinThemeOverrides:this.popoverThemeOverrides,internalExtraClass:l.concat("tooltip"),ref:"popoverRef"}),this.$slots)}}),F=M("ellipsis",{overflow:"hidden"},[_("line-clamp",`
 white-space: nowrap;
 display: inline-block;
 vertical-align: bottom;
 max-width: 100%;
 `),O("line-clamp",`
 display: -webkit-inline-box;
 -webkit-box-orient: vertical;
 `),O("cursor-pointer",`
 cursor: pointer;
 `)]);function w(s){return`${s}-ellipsis--line-clamp`}function R(s,l){return`${s}-ellipsis--cursor-${l}`}const J=Object.assign(Object.assign({},v.props),{expandTrigger:String,lineClamp:[Number,String],tooltip:{type:[Boolean,Object],default:!0}}),q=y({name:"Ellipsis",inheritAttrs:!1,props:J,setup(s,{slots:l,attrs:o}){const n=N(),a=v("Ellipsis","-ellipsis",F,D,s,n),d=c(null),h=c(null),g=c(null),p=c(!1),b=m(()=>{const{lineClamp:e}=s,{value:t}=p;return e!==void 0?{textOverflow:"","-webkit-line-clamp":t?"":e}:{textOverflow:t?"":"ellipsis","-webkit-line-clamp":""}});function T(){let e=!1;const{value:t}=p;if(t)return!0;const{value:i}=d;if(i){const{lineClamp:r}=s;if(S(i),r!==void 0)e=i.scrollHeight<=i.offsetHeight;else{const{value:x}=h;x&&(e=x.getBoundingClientRect().width<=i.getBoundingClientRect().width)}j(i,e)}return e}const C=m(()=>s.expandTrigger==="click"?()=>{var e;const{value:t}=p;t&&((e=g.value)===null||e===void 0||e.setShow(!1)),p.value=!t}:void 0);B(()=>{var e;s.tooltip&&((e=g.value)===null||e===void 0||e.setShow(!1))});const k=()=>f("span",Object.assign({},I(o,{class:[`${n.value}-ellipsis`,s.lineClamp!==void 0?w(n.value):void 0,s.expandTrigger==="click"?R(n.value,"pointer"):void 0],style:b.value}),{ref:"triggerRef",onClick:C.value,onMouseenter:s.expandTrigger==="click"?T:void 0}),s.lineClamp?l:f("span",{ref:"triggerInnerRef"},l));function S(e){if(!e)return;const t=b.value,i=w(n.value);s.lineClamp!==void 0?u(e,i,"add"):u(e,i,"remove");for(const r in t)e.style[r]!==t[r]&&(e.style[r]=t[r])}function j(e,t){const i=R(n.value,"pointer");s.expandTrigger==="click"&&!t?u(e,i,"add"):u(e,i,"remove")}function u(e,t,i){i==="add"?e.classList.contains(t)||e.classList.add(t):e.classList.contains(t)&&e.classList.remove(t)}return{mergedTheme:a,triggerRef:d,triggerInnerRef:h,tooltipRef:g,handleClick:C,renderTrigger:k,getTooltipDisabled:T}},render(){var s;const{tooltip:l,renderTrigger:o,$slots:n}=this;if(l){const{mergedTheme:a}=this;return f(A,Object.assign({ref:"tooltipRef",placement:"top"},l,{getDisabled:this.getTooltipDisabled,theme:a.peers.Tooltip,themeOverrides:a.peerOverrides.Tooltip}),{trigger:o,default:(s=n.tooltip)!==null&&s!==void 0?s:n.default})}else return o()}});export{q as N,A as a,R as b,w as c,J as e,F as s};
