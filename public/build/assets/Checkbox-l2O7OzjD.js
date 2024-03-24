import{S as s,E as se,w as _,K as E,bi as j,$ as N,d as B,a2 as H,V as be,a3 as P,bq as i,Z as h,X as a,a0 as S,Y as C,bE as ue,cj as he,ck as fe,I as ve,bv as ke,a6 as V,as as xe,ak as K,a7 as ge,b1 as me,aC as pe,bH as Ce,af as ye,cM as we}from"./app-D_NcfV-1.js";const Re=s("svg",{viewBox:"0 0 64 64",class:"check-icon"},s("path",{d:"M50.42,16.76L22.34,39.45l-8.1-11.46c-1.12-1.58-3.3-1.96-4.88-0.84c-1.58,1.12-1.95,3.3-0.84,4.88l10.26,14.51  c0.56,0.79,1.42,1.31,2.38,1.45c0.16,0.02,0.32,0.03,0.48,0.03c0.8,0,1.57-0.27,2.2-0.78l30.99-25.03c1.5-1.21,1.74-3.42,0.52-4.92  C54.13,15.78,51.93,15.55,50.42,16.76z"})),ze=s("svg",{viewBox:"0 0 100 100",class:"line-icon"},s("path",{d:"M80.2,55.5H21.4c-2.8,0-5.1-2.5-5.1-5.5l0,0c0-3,2.3-5.5,5.1-5.5h58.7c2.8,0,5.1,2.5,5.1,5.5l0,0C85.2,53.1,82.9,55.5,80.2,55.5z"})),G=se("n-checkbox-group"),Se={min:Number,max:Number,size:String,value:Array,defaultValue:{type:Array,default:null},disabled:{type:Boolean,default:void 0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onChange:[Function,Array]},Me=_({name:"CheckboxGroup",props:Se,setup(o){const{mergedClsPrefixRef:y}=E(o),m=j(o),{mergedSizeRef:w,mergedDisabledRef:T}=m,b=N(o.defaultValue),R=B(()=>o.value),u=H(R,b),c=B(()=>{var f;return((f=u.value)===null||f===void 0?void 0:f.length)||0}),n=B(()=>Array.isArray(u.value)?new Set(u.value):new Set);function I(f,r){const{nTriggerFormInput:p,nTriggerFormChange:v}=m,{onChange:l,"onUpdate:value":k,onUpdateValue:x}=o;if(Array.isArray(u.value)){const t=Array.from(u.value),A=t.findIndex(F=>F===r);f?~A||(t.push(r),x&&i(x,t,{actionType:"check",value:r}),k&&i(k,t,{actionType:"check",value:r}),p(),v(),b.value=t,l&&i(l,t)):~A&&(t.splice(A,1),x&&i(x,t,{actionType:"uncheck",value:r}),k&&i(k,t,{actionType:"uncheck",value:r}),l&&i(l,t),b.value=t,p(),v())}else f?(x&&i(x,[r],{actionType:"check",value:r}),k&&i(k,[r],{actionType:"check",value:r}),l&&i(l,[r]),b.value=[r],p(),v()):(x&&i(x,[],{actionType:"uncheck",value:r}),k&&i(k,[],{actionType:"uncheck",value:r}),l&&i(l,[]),b.value=[],p(),v())}return be(G,{checkedCountRef:c,maxRef:P(o,"max"),minRef:P(o,"min"),valueSetRef:n,disabledRef:T,mergedSizeRef:w,toggleCheckbox:I}),{mergedClsPrefix:y}},render(){return s("div",{class:`${this.mergedClsPrefix}-checkbox-group`,role:"group"},this.$slots)}}),Te=h([a("checkbox",`
 font-size: var(--n-font-size);
 outline: none;
 cursor: pointer;
 display: inline-flex;
 flex-wrap: nowrap;
 align-items: flex-start;
 word-break: break-word;
 line-height: var(--n-size);
 --n-merged-color-table: var(--n-color-table);
 `,[S("show-label","line-height: var(--n-label-line-height);"),h("&:hover",[a("checkbox-box",[C("border","border: var(--n-border-checked);")])]),h("&:focus:not(:active)",[a("checkbox-box",[C("border",`
 border: var(--n-border-focus);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),S("inside-table",[a("checkbox-box",`
 background-color: var(--n-merged-color-table);
 `)]),S("checked",[a("checkbox-box",`
 background-color: var(--n-color-checked);
 `,[a("checkbox-icon",[h(".check-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),S("indeterminate",[a("checkbox-box",[a("checkbox-icon",[h(".check-icon",`
 opacity: 0;
 transform: scale(.5);
 `),h(".line-icon",`
 opacity: 1;
 transform: scale(1);
 `)])])]),S("checked, indeterminate",[h("&:focus:not(:active)",[a("checkbox-box",[C("border",`
 border: var(--n-border-checked);
 box-shadow: var(--n-box-shadow-focus);
 `)])]),a("checkbox-box",`
 background-color: var(--n-color-checked);
 border-left: 0;
 border-top: 0;
 `,[C("border",{border:"var(--n-border-checked)"})])]),S("disabled",{cursor:"not-allowed"},[S("checked",[a("checkbox-box",`
 background-color: var(--n-color-disabled-checked);
 `,[C("border",{border:"var(--n-border-disabled-checked)"}),a("checkbox-icon",[h(".check-icon, .line-icon",{fill:"var(--n-check-mark-color-disabled-checked)"})])])]),a("checkbox-box",`
 background-color: var(--n-color-disabled);
 `,[C("border",`
 border: var(--n-border-disabled);
 `),a("checkbox-icon",[h(".check-icon, .line-icon",`
 fill: var(--n-check-mark-color-disabled);
 `)])]),C("label",`
 color: var(--n-text-color-disabled);
 `)]),a("checkbox-box-wrapper",`
 position: relative;
 width: var(--n-size);
 flex-shrink: 0;
 flex-grow: 0;
 user-select: none;
 -webkit-user-select: none;
 `),a("checkbox-box",`
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 height: var(--n-size);
 width: var(--n-size);
 display: inline-block;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 background-color: var(--n-color);
 transition: background-color 0.3s var(--n-bezier);
 `,[C("border",`
 transition:
 border-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border: var(--n-border);
 `),a("checkbox-icon",`
 display: flex;
 align-items: center;
 justify-content: center;
 position: absolute;
 left: 1px;
 right: 1px;
 top: 1px;
 bottom: 1px;
 `,[h(".check-icon, .line-icon",`
 width: 100%;
 fill: var(--n-check-mark-color);
 opacity: 0;
 transform: scale(0.5);
 transform-origin: center;
 transition:
 fill 0.3s var(--n-bezier),
 transform 0.3s var(--n-bezier),
 opacity 0.3s var(--n-bezier),
 border-color 0.3s var(--n-bezier);
 `),ue({left:"1px",top:"1px"})])]),C("label",`
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 padding: var(--n-label-padding);
 font-weight: var(--n-label-font-weight);
 `,[h("&:empty",{display:"none"})])]),he(a("checkbox",`
 --n-merged-color-table: var(--n-color-table-modal);
 `)),fe(a("checkbox",`
 --n-merged-color-table: var(--n-color-table-popover);
 `))]),De=Object.assign(Object.assign({},V.props),{size:String,checked:{type:[Boolean,String,Number],default:void 0},defaultChecked:{type:[Boolean,String,Number],default:!1},value:[String,Number],disabled:{type:Boolean,default:void 0},indeterminate:Boolean,label:String,focusable:{type:Boolean,default:!0},checkedValue:{type:[Boolean,String,Number],default:!0},uncheckedValue:{type:[Boolean,String,Number],default:!1},"onUpdate:checked":[Function,Array],onUpdateChecked:[Function,Array],privateInsideTable:Boolean,onChange:[Function,Array]}),Ie=_({name:"Checkbox",props:De,setup(o){const y=N(null),{mergedClsPrefixRef:m,inlineThemeDisabled:w,mergedRtlRef:T}=E(o),b=j(o,{mergedSize(e){const{size:g}=o;if(g!==void 0)return g;if(c){const{value:d}=c.mergedSizeRef;if(d!==void 0)return d}if(e){const{mergedSize:d}=e;if(d!==void 0)return d.value}return"medium"},mergedDisabled(e){const{disabled:g}=o;if(g!==void 0)return g;if(c){if(c.disabledRef.value)return!0;const{maxRef:{value:d},checkedCountRef:z}=c;if(d!==void 0&&z.value>=d&&!r.value)return!0;const{minRef:{value:$}}=c;if($!==void 0&&z.value<=$&&r.value)return!0}return e?e.disabled.value:!1}}),{mergedDisabledRef:R,mergedSizeRef:u}=b,c=ve(G,null),n=N(o.defaultChecked),I=P(o,"checked"),f=H(I,n),r=ke(()=>{if(c){const e=c.valueSetRef.value;return e&&o.value!==void 0?e.has(o.value):!1}else return f.value===o.checkedValue}),p=V("Checkbox","-checkbox",Te,we,o,m);function v(e){if(c&&o.value!==void 0)c.toggleCheckbox(!r.value,o.value);else{const{onChange:g,"onUpdate:checked":d,onUpdateChecked:z}=o,{nTriggerFormInput:$,nTriggerFormChange:U}=b,M=r.value?o.uncheckedValue:o.checkedValue;d&&i(d,M,e),z&&i(z,M,e),g&&i(g,M,e),$(),U(),n.value=M}}function l(e){R.value||v(e)}function k(e){if(!R.value)switch(e.key){case" ":case"Enter":v(e)}}function x(e){switch(e.key){case" ":e.preventDefault()}}const t={focus:()=>{var e;(e=y.value)===null||e===void 0||e.focus()},blur:()=>{var e;(e=y.value)===null||e===void 0||e.blur()}},A=xe("Checkbox",T,m),F=B(()=>{const{value:e}=u,{common:{cubicBezierEaseInOut:g},self:{borderRadius:d,color:z,colorChecked:$,colorDisabled:U,colorTableHeader:M,colorTableHeaderModal:L,colorTableHeaderPopover:O,checkMarkColor:W,checkMarkColorDisabled:Y,border:q,borderFocus:Q,borderDisabled:X,borderChecked:Z,boxShadowFocus:J,textColor:ee,textColorDisabled:oe,checkMarkColorDisabledChecked:re,colorDisabledChecked:ae,borderDisabledChecked:ne,labelPadding:ce,labelLineHeight:le,labelFontWeight:ie,[K("fontSize",e)]:te,[K("size",e)]:de}}=p.value;return{"--n-label-line-height":le,"--n-label-font-weight":ie,"--n-size":de,"--n-bezier":g,"--n-border-radius":d,"--n-border":q,"--n-border-checked":Z,"--n-border-focus":Q,"--n-border-disabled":X,"--n-border-disabled-checked":ne,"--n-box-shadow-focus":J,"--n-color":z,"--n-color-checked":$,"--n-color-table":M,"--n-color-table-modal":L,"--n-color-table-popover":O,"--n-color-disabled":U,"--n-color-disabled-checked":ae,"--n-text-color":ee,"--n-text-color-disabled":oe,"--n-check-mark-color":W,"--n-check-mark-color-disabled":Y,"--n-check-mark-color-disabled-checked":re,"--n-font-size":te,"--n-label-padding":ce}}),D=w?ge("checkbox",B(()=>u.value[0]),F,o):void 0;return Object.assign(b,t,{rtlEnabled:A,selfRef:y,mergedClsPrefix:m,mergedDisabled:R,renderedChecked:r,mergedTheme:p,labelId:me(),handleClick:l,handleKeyUp:k,handleKeyDown:x,cssVars:w?void 0:F,themeClass:D==null?void 0:D.themeClass,onRender:D==null?void 0:D.onRender})},render(){var o;const{$slots:y,renderedChecked:m,mergedDisabled:w,indeterminate:T,privateInsideTable:b,cssVars:R,labelId:u,label:c,mergedClsPrefix:n,focusable:I,handleKeyUp:f,handleKeyDown:r,handleClick:p}=this;(o=this.onRender)===null||o===void 0||o.call(this);const v=pe(y.default,l=>c||l?s("span",{class:`${n}-checkbox__label`,id:u},c||l):null);return s("div",{ref:"selfRef",class:[`${n}-checkbox`,this.themeClass,this.rtlEnabled&&`${n}-checkbox--rtl`,m&&`${n}-checkbox--checked`,w&&`${n}-checkbox--disabled`,T&&`${n}-checkbox--indeterminate`,b&&`${n}-checkbox--inside-table`,v&&`${n}-checkbox--show-label`],tabindex:w||!I?void 0:0,role:"checkbox","aria-checked":T?"mixed":m,"aria-labelledby":u,style:R,onKeyup:f,onKeydown:r,onClick:p,onMousedown:()=>{ye("selectstart",window,l=>{l.preventDefault()},{once:!0})}},s("div",{class:`${n}-checkbox-box-wrapper`}," ",s("div",{class:`${n}-checkbox-box`},s(Ce,null,{default:()=>this.indeterminate?s("div",{key:"indeterminate",class:`${n}-checkbox-icon`},ze):s("div",{key:"check",class:`${n}-checkbox-icon`},Re)}),s("div",{class:`${n}-checkbox-box__border`}))),v)}});export{Me as N,Ie as a};
