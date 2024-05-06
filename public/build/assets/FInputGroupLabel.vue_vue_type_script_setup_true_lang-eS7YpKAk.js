var B=Object.defineProperty,L=Object.defineProperties;var R=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var w=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var g=(e,r,o)=>r in e?B(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,h=(e,r)=>{for(var o in r||(r={}))w.call(r,o)&&g(e,o,r[o]);if(p)for(var o of p(r))I.call(r,o)&&g(e,o,r[o]);return e},m=(e,r)=>L(e,R(r));import{a0 as T,a1 as $,w as z,T as k,a9 as x,d as l,an as f,aa as G,S as v,bY as P,b as j,bZ as M,A as O,M as V,bv as Z,Q as A,ap as E,a as F,f as H,b_ as Q}from"./app-BfTmtkkR.js";const Y=T("input-group-label",`
 position: relative;
 user-select: none;
 -webkit-user-select: none;
 box-sizing: border-box;
 padding: 0 12px;
 display: inline-block;
 border-radius: var(--n-border-radius);
 background-color: var(--n-group-label-color);
 color: var(--n-group-label-text-color);
 font-size: var(--n-font-size);
 line-height: var(--n-height);
 height: var(--n-height);
 flex-shrink: 0;
 white-space: nowrap;
 transition: 
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
`,[$("border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-group-label-border);
 transition: border-color .3s var(--n-bezier);
 `)]),D=Object.assign(Object.assign({},x.props),{size:{type:String,default:"medium"},bordered:{type:Boolean,default:void 0}}),K=z({name:"InputGroupLabel",props:D,setup(e){const{mergedBorderedRef:r,mergedClsPrefixRef:o,inlineThemeDisabled:s}=k(e),u=x("Input","-input-group-label",Y,P,e,o),a=l(()=>{const{size:t}=e,{common:{cubicBezierEaseInOut:d},self:{groupLabelColor:b,borderRadius:i,groupLabelTextColor:c,lineHeight:C,groupLabelBorder:_,[f("fontSize",t)]:S,[f("height",t)]:y}}=u.value;return{"--n-bezier":d,"--n-group-label-color":b,"--n-group-label-border":_,"--n-border-radius":i,"--n-group-label-text-color":c,"--n-font-size":S,"--n-line-height":C,"--n-height":y}}),n=s?G("input-group-label",l(()=>e.size[0]),a,e):void 0;return{mergedClsPrefix:o,mergedBordered:r,cssVars:s?void 0:a,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e,r,o;const{mergedClsPrefix:s}=this;return(e=this.onRender)===null||e===void 0||e.call(this),v("div",{class:[`${s}-input-group-label`,this.themeClass],style:this.cssVars},(o=(r=this.$slots).default)===null||o===void 0?void 0:o.call(r),this.mergedBordered?v("div",{class:`${s}-input-group-label__border`}):null)}}),J=z({__name:"FInputGroupLabel",props:{round:{type:Boolean,default:!0},autoSize:{type:Boolean,default:!1}},setup(e){const r=j(),o=M(),s=e,u=s.round?{"border-bottom-left-radius":"17px","border-top-left-radius":"17px"}:void 0,a=l(()=>m(h({},o),{style:u})),n=l(()=>s.autoSize&&r.isMobile?"small":"medium");return(t,d)=>(O(),V(F(K),E({size:n.value},a.value),Z({_:2},[A(t.$slots,(b,i,c)=>({name:i,fn:H(()=>[Q(t.$slots,i)])}))]),1040,["size"]))}});export{J as _};
