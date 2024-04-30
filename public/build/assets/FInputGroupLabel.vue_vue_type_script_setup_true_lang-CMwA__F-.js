import{a0 as C,a1 as _,w as h,T as S,a9 as m,d as l,an as p,aa as y,S as g,bY as B,b as L,bZ as R,A as w,M as I,bv as T,Q as $,ap as k,a as G,f as P,b_ as j}from"./app-DNiDbruX.js";const M=C("input-group-label",`
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
 `)]),O=Object.assign(Object.assign({},m.props),{size:{type:String,default:"medium"},bordered:{type:Boolean,default:void 0}}),V=h({name:"InputGroupLabel",props:O,setup(e){const{mergedBorderedRef:n,mergedClsPrefixRef:r,inlineThemeDisabled:o}=S(e),u=m("Input","-input-group-label",M,B,e,r),a=l(()=>{const{size:t}=e,{common:{cubicBezierEaseInOut:d},self:{groupLabelColor:b,borderRadius:i,groupLabelTextColor:c,lineHeight:f,groupLabelBorder:v,[p("fontSize",t)]:z,[p("height",t)]:x}}=u.value;return{"--n-bezier":d,"--n-group-label-color":b,"--n-group-label-border":v,"--n-border-radius":i,"--n-group-label-text-color":c,"--n-font-size":z,"--n-line-height":f,"--n-height":x}}),s=o?y("input-group-label",l(()=>e.size[0]),a,e):void 0;return{mergedClsPrefix:r,mergedBordered:n,cssVars:o?void 0:a,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){var e,n,r;const{mergedClsPrefix:o}=this;return(e=this.onRender)===null||e===void 0||e.call(this),g("div",{class:[`${o}-input-group-label`,this.themeClass],style:this.cssVars},(r=(n=this.$slots).default)===null||r===void 0?void 0:r.call(n),this.mergedBordered?g("div",{class:`${o}-input-group-label__border`}):null)}}),A=h({__name:"FInputGroupLabel",props:{round:{type:Boolean,default:!0},autoSize:{type:Boolean,default:!1}},setup(e){const n=L(),r=R(),o=e,u=o.round?{"border-bottom-left-radius":"17px","border-top-left-radius":"17px"}:void 0,a=l(()=>({...r,style:u})),s=l(()=>o.autoSize&&n.isMobile?"small":"medium");return(t,d)=>(w(),I(G(V),k({size:s.value},a.value),T({_:2},[$(t.$slots,(b,i,c)=>({name:i,fn:P(()=>[j(t.$slots,i)])}))]),1040,["size"]))}});export{A as _};
