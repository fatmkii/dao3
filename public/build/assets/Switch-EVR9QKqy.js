import{w as ye,S as o,a$ as He,ak as Fe,c9 as je,bZ as Ke,ca as We,ar as Ge,a0 as le,Y as se,L as Me,a7 as ue,bf as _e,$ as T,a4 as Te,a3 as De,bb as E,q as Xe,at as Ye,d as ie,bG as Ze,aD as $,ag as Ve,ax as Be,ay as Se,cb as Re,bh as F,ah as qe,Z as l,be as ke,a1 as I,b2 as Ce,al as H,am as ge,bx as N,a8 as Qe,cc as pe,bc as Je,aS as et}from"./app-B4DzAUIj.js";import{u as tt}from"./use-locale-B4ZjmQ99.js";import{N as nt}from"./Input-D-cuxZic.js";import{A as it}from"./Add-loLTCSkp.js";const rt=ye({name:"Remove",render(){return o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},o("line",{x1:"400",y1:"256",x2:"112",y2:"256",style:`
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 32px;
      `}))}}),at=e=>{const{textColorDisabled:a}=e;return{iconColorDisabled:a}},ot=He({name:"InputNumber",common:Fe,peers:{Button:je,Input:Ke},self:at}),lt=ot,st=e=>{const{primaryColor:a,opacityDisabled:f,borderRadius:h,textColor3:s}=e;return Object.assign(Object.assign({},We),{iconColor:s,textColor:"white",loadingColor:a,opacityDisabled:f,railColor:"rgba(0, 0, 0, .14)",railColorActive:a,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:h,railBorderRadiusMedium:h,railBorderRadiusLarge:h,buttonBorderRadiusSmall:h,buttonBorderRadiusMedium:h,buttonBorderRadiusLarge:h,boxShadowFocus:`0 0 0 2px ${Ge(a,{alpha:.2})}`})},ut={name:"Switch",common:Fe,self:st},dt=ut;function ct(e){return e==null||typeof e=="string"&&e.trim()===""?null:Number(e)}function ft(e){return e.includes(".")&&(/^(-)?\d+.*(\.|0)$/.test(e)||/^\.\d+$/.test(e))}function we(e){return e==null?!0:!Number.isNaN(e)}function Ie(e,a){return e==null?"":a===void 0?String(e):e.toFixed(a)}function xe(e){if(e===null)return null;if(typeof e=="number")return e;{const a=Number(e);return Number.isNaN(a)?null:a}}const ht=le([se("input-number-suffix",`
 display: inline-block;
 margin-right: 10px;
 `),se("input-number-prefix",`
 display: inline-block;
 margin-left: 10px;
 `)]),Ne=800,$e=100,vt=Object.assign(Object.assign({},ue.props),{autofocus:Boolean,loading:{type:Boolean,default:void 0},placeholder:String,defaultValue:{type:Number,default:null},value:Number,step:{type:[Number,String],default:1},min:[Number,String],max:[Number,String],size:String,disabled:{type:Boolean,default:void 0},validator:Function,bordered:{type:Boolean,default:void 0},showButton:{type:Boolean,default:!0},buttonPlacement:{type:String,default:"right"},inputProps:Object,readonly:Boolean,clearable:Boolean,keyboard:{type:Object,default:{}},updateValueOnInput:{type:Boolean,default:!0},parse:Function,format:Function,precision:Number,status:String,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onFocus:[Function,Array],onBlur:[Function,Array],onClear:[Function,Array],onChange:[Function,Array]}),yt=ye({name:"InputNumber",props:vt,setup(e){const{mergedBorderedRef:a,mergedClsPrefixRef:f,mergedRtlRef:h}=Me(e),s=ue("InputNumber","-input-number",ht,lt,e,f),{localeRef:v}=tt("InputNumber"),b=_e(e),{mergedSizeRef:D,mergedDisabledRef:j,mergedStatusRef:S}=b,c=T(null),R=T(null),u=T(null),m=T(e.defaultValue),x=Te(e,"value"),p=De(x,m),k=T(""),Y=t=>{const n=String(t).split(".")[1];return n?n.length:0},de=t=>{const n=[e.min,e.max,e.step,t].map(r=>r===void 0?0:Y(r));return Math.max(...n)},ce=E(()=>{const{placeholder:t}=e;return t!==void 0?t:v.value.placeholder}),K=E(()=>{const t=xe(e.step);return t!==null?t===0?1:Math.abs(t):1}),re=E(()=>{const t=xe(e.min);return t!==null?t:null}),Z=E(()=>{const t=xe(e.max);return t!==null?t:null}),g=t=>{const{value:n}=p;if(t===n){w();return}const{"onUpdate:value":r,onUpdateValue:d,onChange:B}=e,{nTriggerFormInput:C,nTriggerFormChange:X}=b;B&&F(B,t),d&&F(d,t),r&&F(r,t),m.value=t,C(),X()},i=({offset:t,doUpdateIfValid:n,fixPrecision:r,isInputing:d})=>{const{value:B}=k;if(d&&ft(B))return!1;const C=(e.parse||ct)(B);if(C===null)return n&&g(null),null;if(we(C)){const X=Y(C),{precision:te}=e;if(te!==void 0&&te<X&&!r)return!1;let _=parseFloat((C+t).toFixed(te??de(C)));if(we(_)){const{value:be}=Z,{value:me}=re;if(be!==null&&_>be){if(!n||d)return!1;_=be}if(me!==null&&_<me){if(!n||d)return!1;_=me}return e.validator&&!e.validator(_)?!1:(n&&g(_),_)}}return!1},w=()=>{const{value:t}=p;if(we(t)){const{format:n,precision:r}=e;n?k.value=n(t):t===null||r===void 0||Y(t)>r?k.value=Ie(t,void 0):k.value=Ie(t,r)}else k.value=String(t)};w();const W=E(()=>i({offset:0,doUpdateIfValid:!1,isInputing:!1,fixPrecision:!1})===!1),M=E(()=>{const{value:t}=p;if(e.validator&&t===null)return!1;const{value:n}=K;return i({offset:-n,doUpdateIfValid:!1,isInputing:!1,fixPrecision:!1})!==!1}),P=E(()=>{const{value:t}=p;if(e.validator&&t===null)return!1;const{value:n}=K;return i({offset:+n,doUpdateIfValid:!1,isInputing:!1,fixPrecision:!1})!==!1});function q(t){const{onFocus:n}=e,{nTriggerFormFocus:r}=b;n&&F(n,t),r()}function fe(t){var n,r;if(t.target===((n=c.value)===null||n===void 0?void 0:n.wrapperElRef))return;const d=i({offset:0,doUpdateIfValid:!0,isInputing:!1,fixPrecision:!0});if(d!==!1){const X=(r=c.value)===null||r===void 0?void 0:r.inputElRef;X&&(X.value=String(d||"")),p.value===d&&w()}else w();const{onBlur:B}=e,{nTriggerFormBlur:C}=b;B&&F(B,t),C(),qe(()=>{w()})}function he(t){const{onClear:n}=e;n&&F(n,t)}function Q(){const{value:t}=P;if(!t){L();return}const{value:n}=p;if(n===null)e.validator||g(ae());else{const{value:r}=K;i({offset:r,doUpdateIfValid:!0,isInputing:!1,fixPrecision:!0})}}function J(){const{value:t}=M;if(!t){U();return}const{value:n}=p;if(n===null)e.validator||g(ae());else{const{value:r}=K;i({offset:-r,doUpdateIfValid:!0,isInputing:!1,fixPrecision:!0})}}const y=q,ve=fe;function ae(){if(e.validator)return null;const{value:t}=re,{value:n}=Z;return t!==null?Math.max(0,t):n!==null?Math.min(0,n):0}function V(t){he(t),g(null)}function O(t){var n,r,d;!((n=u.value)===null||n===void 0)&&n.$el.contains(t.target)&&t.preventDefault(),!((r=R.value)===null||r===void 0)&&r.$el.contains(t.target)&&t.preventDefault(),(d=c.value)===null||d===void 0||d.activate()}let A=null,z=null,G=null;function U(){G&&(window.clearTimeout(G),G=null),A&&(window.clearInterval(A),A=null)}function L(){oe&&(window.clearTimeout(oe),oe=null),z&&(window.clearInterval(z),z=null)}function ee(){U(),G=window.setTimeout(()=>{A=window.setInterval(()=>{J()},$e)},Ne),Ve("mouseup",document,U,{once:!0})}let oe=null;function Pe(){L(),oe=window.setTimeout(()=>{z=window.setInterval(()=>{Q()},$e)},Ne),Ve("mouseup",document,L,{once:!0})}const Oe=()=>{z||Q()},Ae=()=>{A||J()};function ze(t){var n,r;if(t.key==="Enter"){if(t.target===((n=c.value)===null||n===void 0?void 0:n.wrapperElRef))return;i({offset:0,doUpdateIfValid:!0,isInputing:!1,fixPrecision:!0})!==!1&&((r=c.value)===null||r===void 0||r.deactivate())}else if(t.key==="ArrowUp"){if(!P.value||e.keyboard.ArrowUp===!1)return;t.preventDefault(),i({offset:0,doUpdateIfValid:!0,isInputing:!1,fixPrecision:!0})!==!1&&Q()}else if(t.key==="ArrowDown"){if(!M.value||e.keyboard.ArrowDown===!1)return;t.preventDefault(),i({offset:0,doUpdateIfValid:!0,isInputing:!1,fixPrecision:!0})!==!1&&J()}}function Ue(t){k.value=t,e.updateValueOnInput&&!e.format&&!e.parse&&e.precision===void 0&&i({offset:0,doUpdateIfValid:!0,isInputing:!0,fixPrecision:!1})}Xe(p,()=>{w()});const Le={focus:()=>{var t;return(t=c.value)===null||t===void 0?void 0:t.focus()},blur:()=>{var t;return(t=c.value)===null||t===void 0?void 0:t.blur()},select:()=>{var t;return(t=c.value)===null||t===void 0?void 0:t.select()}},Ee=Ye("InputNumber",h,f);return Object.assign(Object.assign({},Le),{rtlEnabled:Ee,inputInstRef:c,minusButtonInstRef:R,addButtonInstRef:u,mergedClsPrefix:f,mergedBordered:a,uncontrolledValue:m,mergedValue:p,mergedPlaceholder:ce,displayedValueInvalid:W,mergedSize:D,mergedDisabled:j,displayedValue:k,addable:P,minusable:M,mergedStatus:S,handleFocus:y,handleBlur:ve,handleClear:V,handleMouseDown:O,handleAddClick:Oe,handleMinusClick:Ae,handleAddMousedown:Pe,handleMinusMousedown:ee,handleKeyDown:ze,handleUpdateDisplayedValue:Ue,mergedTheme:s,inputThemeOverrides:{paddingSmall:"0 8px 0 10px",paddingMedium:"0 8px 0 12px",paddingLarge:"0 8px 0 14px"},buttonThemeOverrides:ie(()=>{const{self:{iconColorDisabled:t}}=s.value,[n,r,d,B]=Ze(t);return{textColorTextDisabled:`rgb(${n}, ${r}, ${d})`,opacityDisabled:`${B}`}})})},render(){const{mergedClsPrefix:e,$slots:a}=this,f=()=>o(Re,{text:!0,disabled:!this.minusable||this.mergedDisabled||this.readonly,focusable:!1,theme:this.mergedTheme.peers.Button,themeOverrides:this.mergedTheme.peerOverrides.Button,builtinThemeOverrides:this.buttonThemeOverrides,onClick:this.handleMinusClick,onMousedown:this.handleMinusMousedown,ref:"minusButtonInstRef"},{icon:()=>Be(a["minus-icon"],()=>[o(Se,{clsPrefix:e},{default:()=>o(rt,null)})])}),h=()=>o(Re,{text:!0,disabled:!this.addable||this.mergedDisabled||this.readonly,focusable:!1,theme:this.mergedTheme.peers.Button,themeOverrides:this.mergedTheme.peerOverrides.Button,builtinThemeOverrides:this.buttonThemeOverrides,onClick:this.handleAddClick,onMousedown:this.handleAddMousedown,ref:"addButtonInstRef"},{icon:()=>Be(a["add-icon"],()=>[o(Se,{clsPrefix:e},{default:()=>o(it,null)})])});return o("div",{class:[`${e}-input-number`,this.rtlEnabled&&`${e}-input-number--rtl`]},o(nt,{ref:"inputInstRef",autofocus:this.autofocus,status:this.mergedStatus,bordered:this.mergedBordered,loading:this.loading,value:this.displayedValue,onUpdateValue:this.handleUpdateDisplayedValue,theme:this.mergedTheme.peers.Input,themeOverrides:this.mergedTheme.peerOverrides.Input,builtinThemeOverrides:this.inputThemeOverrides,size:this.mergedSize,placeholder:this.mergedPlaceholder,disabled:this.mergedDisabled,readonly:this.readonly,textDecoration:this.displayedValueInvalid?"line-through":void 0,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onClear:this.handleClear,clearable:this.clearable,inputProps:this.inputProps,internalLoadingBeforeSuffix:!0},{prefix:()=>{var s;return this.showButton&&this.buttonPlacement==="both"?[f(),$(a.prefix,v=>v?o("span",{class:`${e}-input-number-prefix`},v):null)]:(s=a.prefix)===null||s===void 0?void 0:s.call(a)},suffix:()=>{var s;return this.showButton?[$(a.suffix,v=>v?o("span",{class:`${e}-input-number-suffix`},v):null),this.buttonPlacement==="right"?f():null,h()]:(s=a.suffix)===null||s===void 0?void 0:s.call(a)}}))}}),bt=se("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[l("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),l("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),l("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),se("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[ke({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),l("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),l("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),l("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),le("&:focus",[l("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),I("round",[l("rail","border-radius: calc(var(--n-rail-height) / 2);",[l("button","border-radius: calc(var(--n-button-height) / 2);")])]),Ce("disabled",[Ce("icon",[I("rubber-band",[I("pressed",[l("rail",[l("button","max-width: var(--n-button-width-pressed);")])]),l("rail",[le("&:active",[l("button","max-width: var(--n-button-width-pressed);")])]),I("active",[I("pressed",[l("rail",[l("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),l("rail",[le("&:active",[l("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),I("active",[l("rail",[l("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),l("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[l("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[ke()]),l("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),I("active",[l("rail","background-color: var(--n-rail-color-active);")]),I("loading",[l("rail",`
 cursor: wait;
 `)]),I("disabled",[l("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),mt=Object.assign(Object.assign({},ue.props),{size:{type:String,default:"medium"},value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},onChange:[Function,Array]});let ne;const Vt=ye({name:"Switch",props:mt,setup(e){ne===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?ne=CSS.supports("width","max(1px)"):ne=!1:ne=!0);const{mergedClsPrefixRef:a,inlineThemeDisabled:f}=Me(e),h=ue("Switch","-switch",bt,dt,e,a),s=_e(e),{mergedSizeRef:v,mergedDisabledRef:b}=s,D=T(e.defaultValue),j=Te(e,"value"),S=De(j,D),c=ie(()=>S.value===e.checkedValue),R=T(!1),u=T(!1),m=ie(()=>{const{railStyle:i}=e;if(i)return i({focused:u.value,checked:c.value})});function x(i){const{"onUpdate:value":w,onChange:W,onUpdateValue:M}=e,{nTriggerFormInput:P,nTriggerFormChange:q}=s;w&&F(w,i),M&&F(M,i),W&&F(W,i),D.value=i,P(),q()}function p(){const{nTriggerFormFocus:i}=s;i()}function k(){const{nTriggerFormBlur:i}=s;i()}function Y(){e.loading||b.value||(S.value!==e.checkedValue?x(e.checkedValue):x(e.uncheckedValue))}function de(){u.value=!0,p()}function ce(){u.value=!1,k(),R.value=!1}function K(i){e.loading||b.value||i.key===" "&&(S.value!==e.checkedValue?x(e.checkedValue):x(e.uncheckedValue),R.value=!1)}function re(i){e.loading||b.value||i.key===" "&&(i.preventDefault(),R.value=!0)}const Z=ie(()=>{const{value:i}=v,{self:{opacityDisabled:w,railColor:W,railColorActive:M,buttonBoxShadow:P,buttonColor:q,boxShadowFocus:fe,loadingColor:he,textColor:Q,iconColor:J,[H("buttonHeight",i)]:y,[H("buttonWidth",i)]:ve,[H("buttonWidthPressed",i)]:ae,[H("railHeight",i)]:V,[H("railWidth",i)]:O,[H("railBorderRadius",i)]:A,[H("buttonBorderRadius",i)]:z},common:{cubicBezierEaseInOut:G}}=h.value;let U,L,ee;return ne?(U=`calc((${V} - ${y}) / 2)`,L=`max(${V}, ${y})`,ee=`max(${O}, calc(${O} + ${y} - ${V}))`):(U=ge((N(V)-N(y))/2),L=ge(Math.max(N(V),N(y))),ee=N(V)>N(y)?O:ge(N(O)+N(y)-N(V))),{"--n-bezier":G,"--n-button-border-radius":z,"--n-button-box-shadow":P,"--n-button-color":q,"--n-button-width":ve,"--n-button-width-pressed":ae,"--n-button-height":y,"--n-height":L,"--n-offset":U,"--n-opacity-disabled":w,"--n-rail-border-radius":A,"--n-rail-color":W,"--n-rail-color-active":M,"--n-rail-height":V,"--n-rail-width":O,"--n-width":ee,"--n-box-shadow-focus":fe,"--n-loading-color":he,"--n-text-color":Q,"--n-icon-color":J}}),g=f?Qe("switch",ie(()=>v.value[0]),Z,e):void 0;return{handleClick:Y,handleBlur:ce,handleFocus:de,handleKeyup:K,handleKeydown:re,mergedRailStyle:m,pressed:R,mergedClsPrefix:a,mergedValue:S,checked:c,mergedDisabled:b,cssVars:f?void 0:Z,themeClass:g==null?void 0:g.themeClass,onRender:g==null?void 0:g.onRender}},render(){const{mergedClsPrefix:e,mergedDisabled:a,checked:f,mergedRailStyle:h,onRender:s,$slots:v}=this;s==null||s();const{checked:b,unchecked:D,icon:j,"checked-icon":S,"unchecked-icon":c}=v,R=!(pe(j)&&pe(S)&&pe(c));return o("div",{role:"switch","aria-checked":f,class:[`${e}-switch`,this.themeClass,R&&`${e}-switch--icon`,f&&`${e}-switch--active`,a&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},o("div",{class:`${e}-switch__rail`,"aria-hidden":"true",style:h},$(b,u=>$(D,m=>u||m?o("div",{"aria-hidden":!0,class:`${e}-switch__children-placeholder`},o("div",{class:`${e}-switch__rail-placeholder`},o("div",{class:`${e}-switch__button-placeholder`}),u),o("div",{class:`${e}-switch__rail-placeholder`},o("div",{class:`${e}-switch__button-placeholder`}),m)):null)),o("div",{class:`${e}-switch__button`},$(j,u=>$(S,m=>$(c,x=>o(Je,null,{default:()=>this.loading?o(et,{key:"loading",clsPrefix:e,strokeWidth:20}):this.checked&&(m||u)?o("div",{class:`${e}-switch__button-icon`,key:m?"checked-icon":"icon"},m||u):!this.checked&&(x||u)?o("div",{class:`${e}-switch__button-icon`,key:x?"unchecked-icon":"icon"},x||u):null})))),$(b,u=>u&&o("div",{key:"checked",class:`${e}-switch__checked`},u)),$(D,u=>u&&o("div",{key:"unchecked",class:`${e}-switch__unchecked`},u)))))}});export{yt as N,Vt as a};
