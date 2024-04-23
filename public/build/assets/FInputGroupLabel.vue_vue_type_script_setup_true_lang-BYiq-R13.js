import{Y as C,Z as _,w as h,L as S,a7 as m,d as l,al as p,a8 as y,S as g,bX as B,b as L,bY as R,A as w,M as I,bt as $,Q as k,an as G,a as P,f as T,bZ as Z}from"./app-DZn8TC2l.js";const j=C("input-group-label",`
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
`,[_("border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-group-label-border);
 transition: border-color .3s var(--n-bezier);
 `)]),M=Object.assign(Object.assign({},m.props),{size:{type:String,default:"medium"},bordered:{type:Boolean,default:void 0}}),O=h({name:"InputGroupLabel",props:M,setup(e){const{mergedBorderedRef:t,mergedClsPrefixRef:r,inlineThemeDisabled:o}=S(e),u=m("Input","-input-group-label",j,B,e,r),a=l(()=>{const{size:n}=e,{common:{cubicBezierEaseInOut:d},self:{groupLabelColor:b,borderRadius:i,groupLabelTextColor:c,lineHeight:f,groupLabelBorder:v,[p("fontSize",n)]:z,[p("height",n)]:x}}=u.value;return{"--n-bezier":d,"--n-group-label-color":b,"--n-group-label-border":v,"--n-border-radius":i,"--n-group-label-text-color":c,"--n-font-size":z,"--n-line-height":f,"--n-height":x}}),s=o?y("input-group-label",l(()=>e.size[0]),a,e):void 0;return{mergedClsPrefix:r,mergedBordered:t,cssVars:o?void 0:a,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){var e,t,r;const{mergedClsPrefix:o}=this;return(e=this.onRender)===null||e===void 0||e.call(this),g("div",{class:[`${o}-input-group-label`,this.themeClass],style:this.cssVars},(r=(t=this.$slots).default)===null||r===void 0?void 0:r.call(t),this.mergedBordered?g("div",{class:`${o}-input-group-label__border`}):null)}}),Y=h({__name:"FInputGroupLabel",props:{round:{type:Boolean,default:!0},autoSize:{type:Boolean,default:!1}},setup(e){const t=L(),r=R(),o=e,u=o.round?{"border-bottom-left-radius":"17px","border-top-left-radius":"17px"}:void 0,a=l(()=>({...r,style:u})),s=l(()=>o.autoSize&&t.isMobile?"small":"medium");return(n,d)=>(w(),I(P(O),G({size:s.value},a.value),$({_:2},[k(n.$slots,(b,i,c)=>({name:i,fn:T(()=>[Z(n.$slots,i)])}))]),1040,["size"]))}});export{Y as _};
