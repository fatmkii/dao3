import{bK as V,D as N,w,bc as B,$ as C,d as F,e as D,a5 as H,A as j,F as U,j as i,o as O,b as E,M as L,f as l,H as s,a as e,k as _,h as m,z as h,m as p,s as k,N as P,i as q}from"./app-BYB32yAm.js";import{c as G}from"./copyToClipboard-BvCi2fuT.js";import{t as I}from"./Tabs-D1dnVlrx.js";var S=1/0,K=17976931348623157e292;function X(t){if(!t)return t===0?t:0;if(t=I(t),t===S||t===-S){var o=t<0?-1:1;return o*K}return t===t?t:0}function Y(t){var o=X(t),n=o%1;return o===o?n?o-n:o:0}var J=V.isFinite,Q=Math.min;function W(t){var o=Math[t];return function(n,a){if(n=I(n),a=a==null?0:Q(Y(a),292),a&&J(n)){var c=(N(n)+"e").split("e"),d=o(c[0]+"e"+(+c[1]+a));return c=(N(d)+"e").split("e"),+(c[0]+"e"+(+c[1]-a))}return o(n)}}var Z=W("round");const tt=t=>1-Math.pow(1-t,5);function et(t){const{from:o,to:n,duration:a,onUpdate:c,onFinish:d}=t,f=()=>{const g=performance.now(),v=Math.min(g-u,a),b=o+(n-o)*tt(v/a);if(v===a){d();return}c(b),requestAnimationFrame(f)},u=performance.now();f()}const nt={to:{type:Number,default:0},precision:{type:Number,default:0},showSeparator:Boolean,locale:String,from:{type:Number,default:0},active:{type:Boolean,default:!0},duration:{type:Number,default:2e3},onFinish:Function},z=w({name:"NumberAnimation",props:nt,setup(t){const{localeRef:o}=B("name"),{duration:n}=t,a=C(t.from),c=F(()=>{const{locale:r}=t;return r!==void 0?r:o.value});let d=!1;const f=r=>{a.value=r},u=()=>{var r;a.value=t.to,d=!1,(r=t.onFinish)===null||r===void 0||r.call(t)},g=(r=t.from,y=t.to)=>{d=!0,a.value=t.from,r!==y&&et({from:r,to:y,duration:n,onUpdate:f,onFinish:u})},v=F(()=>{var r;const x=Z(a.value,t.precision).toFixed(t.precision).split("."),M=new Intl.NumberFormat(c.value),$=(r=M.formatToParts(.5).find(R=>R.type==="decimal"))===null||r===void 0?void 0:r.value,A=t.showSeparator?M.format(Number(x[0])):x[0],T=x[1];return{integer:A,decimal:T,decimalSeparator:$}});function b(){d||g()}return D(()=>{H(()=>{t.active&&g()})}),Object.assign({formattedValue:v},{play:b})},render(){const{formattedValue:{integer:t,decimal:o,decimalSeparator:n}}=this;return[t,o?n:null,o]}}),ot={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},at=i("rect",{x:"128",y:"128",width:"336",height:"336",rx:"57",ry:"57",fill:"none",stroke:"currentColor","stroke-linejoin":"round","stroke-width":"32"},null,-1),it=i("path",{d:"M383.5 128l.5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"32"},null,-1),st=[at,it],rt=w({name:"CopyOutline",render:function(o,n){return j(),U("svg",ot,st)}}),lt=i("img",{src:"https://oss.cpttmm.com/xhg_other/icon_binggan.png",style:{"max-height":"40px"}},null,-1),ut={style:{display:"flex","align-items":"center",gap:"4px"}},ct=i("img",{src:"https://oss.cpttmm.com/xhg_other/icon_binggan_lv.png",style:{"max-height":"40px"}},null,-1),dt=i("img",{src:"https://oss.cpttmm.com/xhg_other/icon_olo.png",style:{"max-height":"40px"}},null,-1),mt=i("img",{src:"https://oss.cpttmm.com/xhg_other/icon_bank_olo.png",style:{"max-height":"40px"}},null,-1),vt=w({__name:"UserCard",setup(t){const o=O(),n=E(),a=C(!0);function c(){G(o.binggan),window.$message.success("已将饼干复制到粘贴板，请保存好喔！")}return(d,f)=>(j(),L(e(q),{hoverable:"",size:"small"},{default:l(()=>[s(e(_),{justify:"space-around",vertical:e(n).isMobile,size:e(n).isMobile?"small":"medium"},{default:l(()=>[s(e(_),{vertical:!e(n).isMobile,align:"start"},{default:l(()=>[lt,i("div",null,[i("div",null,[s(e(m),{depth:3},{default:l(()=>[h("我的饼干")]),_:1})]),i("div",ut,[s(e(m),{depth:2,style:p({fontSize:e(n).isMobile?"0.875rem":"1rem",cursor:a.value?"pointer":"auto"}),onClick:f[0]||(f[0]=u=>a.value=!1)},{default:l(()=>[h(k(a.value?"*点击显示*":e(o).binggan),1)]),_:1},8,["style"]),s(e(P),{size:e(n).isMobile?18:20},{default:l(()=>[s(e(rt),{style:{cursor:"pointer"},onClick:c})]),_:1},8,["size"])])])]),_:1},8,["vertical"]),s(e(_),{vertical:!e(n).isMobile,align:"start"},{default:l(()=>[ct,i("div",null,[i("div",null,[s(e(m),{depth:3},{default:l(()=>[h("饼干等级")]),_:1})]),i("div",null,[s(e(m),{depth:2,style:p({fontSize:e(n).isMobile?"0.875rem":"1rem"})},{default:l(()=>{var u;return[h(k((u=e(o).userData)==null?void 0:u.binggan.user_lv),1)]}),_:1},8,["style"])])])]),_:1},8,["vertical"]),s(e(_),{vertical:!e(n).isMobile,align:"start"},{default:l(()=>[dt,i("div",null,[i("div",null,[s(e(m),{depth:3},{default:l(()=>[h("奥利奥")]),_:1})]),i("div",null,[s(e(m),{depth:2,style:p({fontSize:e(n).isMobile?"0.875rem":"1rem"})},{default:l(()=>{var u;return[s(e(z),{from:0,to:(u=e(o).userData)==null?void 0:u.binggan.coin,"show-separator":"",duration:2e3},null,8,["to"])]}),_:1},8,["style"])])])]),_:1},8,["vertical"]),s(e(_),{vertical:!e(n).isMobile,align:"start"},{default:l(()=>[mt,i("div",null,[i("div",null,[s(e(m),{depth:3},{default:l(()=>[h("粮仓奥利奥")]),_:1})]),i("div",null,[s(e(m),{depth:2,style:p({fontSize:e(n).isMobile?"0.875rem":"1rem"})},{default:l(()=>{var u;return[s(e(z),{from:0,to:(u=e(o).userData)==null?void 0:u.binggan.coin_in_bank,"show-separator":"",duration:2e3},null,8,["to"])]}),_:1},8,["style"])])])]),_:1},8,["vertical"])]),_:1},8,["vertical","size"])]),_:1}))}});export{vt as default};
