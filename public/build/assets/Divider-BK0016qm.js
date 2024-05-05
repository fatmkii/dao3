import{a0 as p,aL as c,a1 as l,a3 as r,w as f,T as u,a9 as v,d as b,aa as x,S as d,C,c2 as w}from"./app-Da7oLsYJ.js";const $=p("divider",`
 position: relative;
 display: flex;
 width: 100%;
 box-sizing: border-box;
 font-size: 16px;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
`,[c("vertical",`
 margin-top: 24px;
 margin-bottom: 24px;
 `,[c("no-title",`
 display: flex;
 align-items: center;
 `)]),l("title",`
 display: flex;
 align-items: center;
 margin-left: 12px;
 margin-right: 12px;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 `),r("title-position-left",[l("line",[r("left",{width:"28px"})])]),r("title-position-right",[l("line",[r("right",{width:"28px"})])]),r("dashed",[l("line",`
 background-color: #0000;
 height: 0px;
 width: 100%;
 border-style: dashed;
 border-width: 1px 0 0;
 `)]),r("vertical",`
 display: inline-block;
 height: 1em;
 margin: 0 8px;
 vertical-align: middle;
 width: 1px;
 `),l("line",`
 border: none;
 transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier);
 height: 1px;
 width: 100%;
 margin: 0;
 `),c("dashed",[l("line",{backgroundColor:"var(--n-color)"})]),r("dashed",[l("line",{borderColor:"var(--n-color)"})]),r("vertical",{backgroundColor:"var(--n-color)"})]),_=Object.assign(Object.assign({},v.props),{titlePlacement:{type:String,default:"center"},dashed:Boolean,vertical:Boolean}),z=f({name:"Divider",props:_,setup(t){const{mergedClsPrefixRef:n,inlineThemeDisabled:o}=u(t),s=v("Divider","-divider",$,w,t,n),a=b(()=>{const{common:{cubicBezierEaseInOut:e},self:{color:h,textColor:g,fontWeight:m}}=s.value;return{"--n-bezier":e,"--n-color":h,"--n-text-color":g,"--n-font-weight":m}}),i=o?x("divider",void 0,a,t):void 0;return{mergedClsPrefix:n,cssVars:o?void 0:a,themeClass:i==null?void 0:i.themeClass,onRender:i==null?void 0:i.onRender}},render(){var t;const{$slots:n,titlePlacement:o,vertical:s,dashed:a,cssVars:i,mergedClsPrefix:e}=this;return(t=this.onRender)===null||t===void 0||t.call(this),d("div",{role:"separator",class:[`${e}-divider`,this.themeClass,{[`${e}-divider--vertical`]:s,[`${e}-divider--no-title`]:!n.default,[`${e}-divider--dashed`]:a,[`${e}-divider--title-position-${o}`]:n.default&&o}],style:i},s?null:d("div",{class:`${e}-divider__line ${e}-divider__line--left`}),!s&&n.default?d(C,null,d("div",{class:`${e}-divider__title`},this.$slots),d("div",{class:`${e}-divider__line ${e}-divider__line--right`})):null)}});export{z as N};
