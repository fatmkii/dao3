import{bF as F,bG as M,bH as B,bI as j,bJ as D,bK as te,bL as K,w as z,$ as w,S as i,ag as re,ai as ne,d as $,I as nt,J as He,a5 as Fe,bM as ie,bN as ye,bO as Se,bP as Ce,bd as ot,a0 as W,Y as b,b1 as at,Z as U,a1 as ze,bf as lt,L as it,a7 as Be,V as st,a4 as we,a3 as Ie,q as ut,al as Pe,a8 as ct,b3 as dt,bQ as Ue,af as ht,bR as pt,bS as ft,bT as gt,ae as vt,ac as bt,bU as mt,bV as xt,bh as de,aJ as he,ah as kt}from"./app-CbdLWzt8.js";import{N as wt}from"./Input-DyEBFTwa.js";import{N as yt}from"./InputGroup-ChF4aLXM.js";import{u as St}from"./use-locale-B6bKXE1s.js";function qe(e,t,n){t/=100,n/=100;const r=t*Math.min(n,1-n)+n;return[e,r?(2-2*n/r)*100:0,r*100]}function ge(e,t,n){t/=100,n/=100;const r=n-n*t/2,o=Math.min(r,1-r);return[e,o?(n-r)/o*100:0,r*100]}function H(e,t,n){t/=100,n/=100;let r=(o,l=(o+e/60)%6)=>n-n*t*Math.max(Math.min(l,4-l,1),0);return[r(5)*255,r(3)*255,r(1)*255]}function $e(e,t,n){e/=255,t/=255,n/=255;let r=Math.max(e,t,n),o=r-Math.min(e,t,n),l=o&&(r==e?(t-n)/o:r==t?2+(n-e)/o:4+(e-t)/o);return[60*(l<0?l+6:l),r&&o/r*100,r*100]}function Re(e,t,n){e/=255,t/=255,n/=255;let r=Math.max(e,t,n),o=r-Math.min(e,t,n),l=1-Math.abs(r+r-o-1),s=o&&(r==e?(t-n)/o:r==t?2+(n-e)/o:4+(e-t)/o);return[60*(s<0?s+6:s),l?o/l*100:0,(r+r-o)*50]}function Ae(e,t,n){t/=100,n/=100;let r=t*Math.min(n,1-n),o=(l,s=(l+e/30)%12)=>n-r*Math.max(Math.min(s-3,9-s,1),-1);return[o(0)*255,o(8)*255,o(4)*255]}function Ct(e,t){switch(e[0]){case"hex":return t?"#000000FF":"#000000";case"rgb":return t?"rgba(0, 0, 0, 1)":"rgb(0, 0, 0)";case"hsl":return t?"hsla(0, 0%, 0%, 1)":"hsl(0, 0%, 0%)";case"hsv":return t?"hsva(0, 0%, 0%, 1)":"hsv(0, 0%, 0%)"}return"#000000"}function se(e){return e===null?null:/^ *#/.test(e)?"hex":e.includes("rgb")?"rgb":e.includes("hsl")?"hsl":e.includes("hsv")?"hsv":null}function Ut(e){return e=Math.round(e),e>=360?359:e<0?0:e}function $t(e){return e=Math.round(e*100)/100,e>1?1:e<0?0:e}const Rt={rgb:{hex(e){return F(M(e))},hsl(e){const[t,n,r,o]=M(e);return B([...Re(t,n,r),o])},hsv(e){const[t,n,r,o]=M(e);return j([...$e(t,n,r),o])}},hex:{rgb(e){return D(M(e))},hsl(e){const[t,n,r,o]=M(e);return B([...Re(t,n,r),o])},hsv(e){const[t,n,r,o]=M(e);return j([...$e(t,n,r),o])}},hsl:{hex(e){const[t,n,r,o]=te(e);return F([...Ae(t,n,r),o])},rgb(e){const[t,n,r,o]=te(e);return D([...Ae(t,n,r),o])},hsv(e){const[t,n,r,o]=te(e);return j([...qe(t,n,r),o])}},hsv:{hex(e){const[t,n,r,o]=K(e);return F([...H(t,n,r),o])},rgb(e){const[t,n,r,o]=K(e);return D([...H(t,n,r),o])},hsl(e){const[t,n,r,o]=K(e);return B([...ge(t,n,r),o])}}};function Te(e,t,n){return n=n||se(e),n?n===t?e:Rt[n][t](e):null}const ee="12px",At=12,O="6px",Vt=6,Mt="linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)",Dt=z({name:"HueSlider",props:{clsPrefix:{type:String,required:!0},hue:{type:Number,required:!0},onUpdateHue:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function n(l){t.value&&(re("mousemove",document,r),re("mouseup",document,o),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),q=Ut((l.clientX-f-Vt)/(u-At)*360);e.onUpdateHue(q)}function o(){var l;ne("mousemove",document,r),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:t,handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,style:{height:ee,borderRadius:O}},i("div",{ref:"railRef",style:{boxShadow:"inset 0 0 2px 0 rgba(0, 0, 0, .24)",boxSizing:"border-box",backgroundImage:Mt,height:ee,borderRadius:O,position:"relative"},onMousedown:this.handleMouseDown},i("div",{style:{position:"absolute",left:O,right:O,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc((${this.hue}%) / 359 * 100 - ${O})`,borderRadius:O,width:ee,height:ee}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:`hsl(${this.hue}, 100%, 50%)`,borderRadius:O,width:ee,height:ee}})))))}}),le="12px",zt=12,L="6px",It=z({name:"AlphaSlider",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},alpha:{type:Number,default:0},onUpdateAlpha:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function n(l){!t.value||!e.rgba||(re("mousemove",document,r),re("mouseup",document,o),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,left:f}=s.getBoundingClientRect(),q=(l.clientX-f)/(u-zt);e.onUpdateAlpha($t(q))}function o(){var l;ne("mousemove",document,r),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{railRef:t,railBackgroundImage:$(()=>{const{rgba:l}=e;return l?`linear-gradient(to right, rgba(${l[0]}, ${l[1]}, ${l[2]}, 0) 0%, rgba(${l[0]}, ${l[1]}, ${l[2]}, 1) 100%)`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-slider`,ref:"railRef",style:{height:le,borderRadius:L},onMousedown:this.handleMouseDown},i("div",{style:{borderRadius:L,position:"absolute",left:0,right:0,top:0,bottom:0,overflow:"hidden"}},i("div",{class:`${e}-color-picker-checkboard`}),i("div",{class:`${e}-color-picker-slider__image`,style:{backgroundImage:this.railBackgroundImage}})),this.rgba&&i("div",{style:{position:"absolute",left:L,right:L,top:0,bottom:0}},i("div",{class:`${e}-color-picker-handle`,style:{left:`calc(${this.alpha*100}% - ${L})`,borderRadius:L,width:le,height:le}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:D(this.rgba),borderRadius:L,width:le,height:le}}))))}}),pe="12px",fe="6px",Pt=z({name:"Pallete",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},displayedHue:{type:Number,required:!0},displayedSv:{type:Array,required:!0},onUpdateSV:{type:Function,required:!0},onComplete:Function},setup(e){const t=w(null);function n(l){t.value&&(re("mousemove",document,r),re("mouseup",document,o),r(l))}function r(l){const{value:s}=t;if(!s)return;const{width:u,height:f,left:q,bottom:oe}=s.getBoundingClientRect(),T=(oe-l.clientY)/f,Z=(l.clientX-q)/u,ue=100*(Z>1?1:Z<0?0:Z),X=100*(T>1?1:T<0?0:T);e.onUpdateSV(ue,X)}function o(){var l;ne("mousemove",document,r),ne("mouseup",document,o),(l=e.onComplete)===null||l===void 0||l.call(e)}return{palleteRef:t,handleColor:$(()=>{const{rgba:l}=e;return l?`rgb(${l[0]}, ${l[1]}, ${l[2]})`:""}),handleMouseDown:n}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-pallete`,onMousedown:this.handleMouseDown,ref:"palleteRef"},i("div",{class:`${e}-color-picker-pallete__layer`,style:{backgroundImage:`linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`}}),i("div",{class:`${e}-color-picker-pallete__layer ${e}-color-picker-pallete__layer--shadowed`,style:{backgroundImage:"linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"}}),this.rgba&&i("div",{class:`${e}-color-picker-handle`,style:{width:pe,height:pe,borderRadius:fe,left:`calc(${this.displayedSv[0]}% - ${fe})`,bottom:`calc(${this.displayedSv[1]}% - ${fe})`}},i("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:this.handleColor,borderRadius:fe,width:pe,height:pe}})))}}),Ve=nt("n-color-picker");function _t(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),255)):!1}function Ht(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),360)):!1}function Ft(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),100)):!1}function Bt(e){const t=e.trim();return/^#[0-9a-fA-F]+$/.test(t)?[4,5,7,9].includes(t.length):!1}function qt(e){return/^\d{1,3}\.?\d*%$/.test(e.trim())?Math.max(0,Math.min(parseInt(e)/100,100)):!1}const Tt={paddingSmall:"0 4px"},_e=z({name:"ColorInputUnit",props:{label:{type:String,required:!0},value:{type:[Number,String],default:null},showAlpha:Boolean,onUpdateValue:{type:Function,required:!0}},setup(e){const t=w(""),{themeRef:n}=He(Ve,null);Fe(()=>{t.value=r()});function r(){const{value:s}=e;if(s===null)return"";const{label:u}=e;return u==="HEX"?s:u==="A"?`${Math.floor(s*100)}%`:String(Math.floor(s))}function o(s){t.value=s}function l(s){let u,f;switch(e.label){case"HEX":f=Bt(s),f&&e.onUpdateValue(s),t.value=r();break;case"H":u=Ht(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"S":case"L":case"V":u=Ft(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"A":u=qt(s),u===!1?t.value=r():e.onUpdateValue(u);break;case"R":case"G":case"B":u=_t(s),u===!1?t.value=r():e.onUpdateValue(u);break}}return{mergedTheme:n,inputValue:t,handleInputChange:l,handleInputUpdateValue:o}},render(){const{mergedTheme:e}=this;return i(wt,{size:"small",placeholder:this.label,theme:e.peers.Input,themeOverrides:e.peerOverrides.Input,builtinThemeOverrides:Tt,value:this.inputValue,onUpdateValue:this.handleInputUpdateValue,onChange:this.handleInputChange,style:this.label==="A"?"flex-grow: 1.25;":""})}}),Nt=z({name:"ColorInput",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},modes:{type:Array,required:!0},showAlpha:{type:Boolean,required:!0},value:{type:String,default:null},valueArr:{type:Array,default:null},onUpdateValue:{type:Function,required:!0},onUpdateMode:{type:Function,required:!0}},setup(e){return{handleUnitUpdateValue(t,n){const{showAlpha:r}=e;if(e.mode==="hex"){e.onUpdateValue((r?F:ie)(n));return}let o;switch(e.valueArr===null?o=[0,0,0,0]:o=Array.from(e.valueArr),e.mode){case"hsv":o[t]=n,e.onUpdateValue((r?j:Ce)(o));break;case"rgb":o[t]=n,e.onUpdateValue((r?D:Se)(o));break;case"hsl":o[t]=n,e.onUpdateValue((r?B:ye)(o));break}}}},render(){const{clsPrefix:e,modes:t}=this;return i("div",{class:`${e}-color-picker-input`},i("div",{class:`${e}-color-picker-input__mode`,onClick:this.onUpdateMode,style:{cursor:t.length===1?"":"pointer"}},this.mode.toUpperCase()+(this.showAlpha?"A":"")),i(yt,null,{default:()=>{const{mode:n,valueArr:r,showAlpha:o}=this;if(n==="hex"){let l=null;try{l=r===null?null:(o?F:ie)(r)}catch{}return i(_e,{label:"HEX",showAlpha:o,value:l,onUpdateValue:s=>{this.handleUnitUpdateValue(0,s)}})}return(n+(o?"a":"")).split("").map((l,s)=>i(_e,{label:l.toUpperCase(),value:r===null?null:r[s],onUpdateValue:u=>{this.handleUnitUpdateValue(s,u)}}))}}))}}),Et=z({name:"ColorPickerTrigger",props:{clsPrefix:{type:String,required:!0},value:{type:String,default:null},hsla:{type:Array,default:null},disabled:Boolean,onClick:Function},setup(e){const{colorPickerSlots:t,renderLabelRef:n}=He(Ve,null);return()=>{const{hsla:r,value:o,clsPrefix:l,onClick:s,disabled:u}=e,f=t.label||n.value;return i("div",{class:[`${l}-color-picker-trigger`,u&&`${l}-color-picker-trigger--disabled`],onClick:u?void 0:s},i("div",{class:`${l}-color-picker-trigger__fill`},i("div",{class:`${l}-color-picker-checkboard`}),i("div",{style:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:r?B(r):""}}),o&&r?i("div",{class:`${l}-color-picker-trigger__value`,style:{color:r[2]>50||r[3]<.5?"black":"white"}},f?f(o):o):null))}}});function Ot(e,t){if(t==="hsv"){const[n,r,o,l]=K(e);return D([...H(n,r,o),l])}return e}function Lt(e){const t=document.createElement("canvas").getContext("2d");return t?(t.fillStyle=e,t.fillStyle):"#000000"}const jt=z({name:"ColorPickerSwatches",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},swatches:{type:Array,required:!0},onUpdateColor:{type:Function,required:!0}},setup(e){const t=$(()=>e.swatches.map(l=>{const s=se(l);return{value:l,mode:s,legalValue:Ot(l,s)}}));function n(l){const{mode:s}=e;let{value:u,mode:f}=l;return f||(f="hex",/^[a-zA-Z]+$/.test(u)?u=Lt(u):(ot("color-picker",`color ${u} in swatches is invalid.`),u="#000000")),f===s?u:Te(u,s,f)}function r(l){e.onUpdateColor(n(l))}function o(l,s){l.key==="Enter"&&r(s)}return{parsedSwatchesRef:t,handleSwatchSelect:r,handleSwatchKeyDown:o}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-swatches`},this.parsedSwatchesRef.map(t=>i("div",{class:`${e}-color-picker-swatch`,tabindex:0,onClick:()=>{this.handleSwatchSelect(t)},onKeydown:n=>{this.handleSwatchKeyDown(n,t)}},i("div",{class:`${e}-color-picker-swatch__fill`,style:{background:t.legalValue}}))))}}),Kt=z({name:"ColorPreview",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},color:{type:String,default:null,validator:e=>{const t=se(e);return!!(!e||t&&t!=="hsv")}},onUpdateColor:{type:Function,required:!0}},setup(e){function t(n){var r;const o=n.target.value;(r=e.onUpdateColor)===null||r===void 0||r.call(e,Te(o.toUpperCase(),e.mode,"hex")),n.stopPropagation()}return{handleChange:t}},render(){const{clsPrefix:e}=this;return i("div",{class:`${e}-color-picker-preview__preview`},i("span",{class:`${e}-color-picker-preview__fill`,style:{background:this.color||"#000000"}}),i("input",{class:`${e}-color-picker-preview__input`,type:"color",value:this.color,onChange:this.handleChange}))}}),Zt=W([b("color-picker",`
 display: inline-block;
 box-sizing: border-box;
 height: var(--n-height);
 font-size: var(--n-font-size);
 width: 100%;
 position: relative;
 `),b("color-picker-panel",`
 margin: 4px 0;
 width: 240px;
 font-size: var(--n-panel-font-size);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 `,[at(),b("input",`
 text-align: center;
 `)]),b("color-picker-checkboard",`
 background: white; 
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[W("&::after",`
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 12px 12px;
 background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
 background-repeat: repeat;
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),b("color-picker-slider",`
 margin-bottom: 8px;
 position: relative;
 box-sizing: border-box;
 `,[U("image",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `),W("&::after",`
 content: "";
 position: absolute;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 pointer-events: none;
 `)]),b("color-picker-handle",`
 z-index: 1;
 box-shadow: 0 0 2px 0 rgba(0, 0, 0, .45);
 position: absolute;
 background-color: white;
 overflow: hidden;
 `,[U("fill",`
 box-sizing: border-box;
 border: 2px solid white;
 `)]),b("color-picker-pallete",`
 height: 180px;
 position: relative;
 margin-bottom: 8px;
 cursor: crosshair;
 `,[U("layer",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[ze("shadowed",`
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 `)])]),b("color-picker-preview",`
 display: flex;
 `,[U("sliders",`
 flex: 1 0 auto;
 `),U("preview",`
 position: relative;
 height: 30px;
 width: 30px;
 margin: 0 0 8px 6px;
 border-radius: 50%;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 overflow: hidden;
 `),U("fill",`
 display: block;
 width: 30px;
 height: 30px;
 `),U("input",`
 position: absolute;
 top: 0;
 left: 0;
 width: 30px;
 height: 30px;
 opacity: 0;
 z-index: 1;
 `)]),b("color-picker-input",`
 display: flex;
 align-items: center;
 `,[b("input",`
 flex-grow: 1;
 flex-basis: 0;
 `),U("mode",`
 width: 72px;
 text-align: center;
 `)]),b("color-picker-control",`
 padding: 12px;
 `),b("color-picker-action",`
 display: flex;
 margin-top: -4px;
 border-top: 1px solid var(--n-divider-color);
 padding: 8px 12px;
 justify-content: flex-end;
 `,[b("button","margin-left: 8px;")]),b("color-picker-trigger",`
 border: var(--n-border);
 height: 100%;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 cursor: pointer;
 `,[U("value",`
 white-space: nowrap;
 position: relative;
 `),U("fill",`
 border-radius: var(--n-border-radius);
 position: absolute;
 display: flex;
 align-items: center;
 justify-content: center;
 left: 4px;
 right: 4px;
 top: 4px;
 bottom: 4px;
 `),ze("disabled","cursor: not-allowed"),b("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[W("&::after",`
 --n-block-size: calc((var(--n-height) - 8px) / 3);
 background-size: calc(var(--n-block-size) * 2) calc(var(--n-block-size) * 2);
 background-position: 0 0, 0 var(--n-block-size), var(--n-block-size) calc(-1 * var(--n-block-size)), calc(-1 * var(--n-block-size)) 0px; 
 `)])]),b("color-picker-swatches",`
 display: grid;
 grid-gap: 8px;
 flex-wrap: wrap;
 position: relative;
 grid-template-columns: repeat(auto-fill, 18px);
 margin-top: 10px;
 `,[b("color-picker-swatch",`
 width: 18px;
 height: 18px;
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 8px 8px;
 background-position: 0px 0, 0px 4px, 4px -4px, -4px 0px;
 background-repeat: repeat;
 `,[U("fill",`
 position: relative;
 width: 100%;
 height: 100%;
 border-radius: 3px;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 cursor: pointer;
 `),W("&:focus",`
 outline: none;
 `,[U("fill",[W("&::after",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 background: inherit;
 filter: blur(2px);
 content: "";
 `)])])])])]),Xt=Object.assign(Object.assign({},Be.props),{value:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,defaultValue:String,modes:{type:Array,default:()=>["rgb","hex","hsl"]},placement:{type:String,default:"bottom-start"},to:Ue.propTo,showAlpha:{type:Boolean,default:!0},showPreview:Boolean,swatches:Array,disabled:{type:Boolean,default:void 0},actions:{type:Array,default:null},internalActions:Array,size:String,renderLabel:Function,onComplete:Function,onConfirm:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),Wt=z({name:"ColorPicker",props:Xt,setup(e,{slots:t}){const n=w(null);let r=null;const o=lt(e),{mergedSizeRef:l,mergedDisabledRef:s}=o,{localeRef:u}=St("global"),{mergedClsPrefixRef:f,namespaceRef:q,inlineThemeDisabled:oe}=it(e),T=Be("ColorPicker","-color-picker",Zt,xt,e,f);st(Ve,{themeRef:T,renderLabelRef:we(e,"renderLabel"),colorPickerSlots:t});const Z=w(e.defaultShow),ue=Ie(we(e,"show"),Z);function X(a){const{onUpdateShow:c,"onUpdate:show":h}=e;c&&de(c,a),h&&de(h,a),Z.value=a}const{defaultValue:Me}=e,De=w(Me===void 0?Ct(e.modes,e.showAlpha):Me),x=Ie(we(e,"value"),De),G=w([x.value]),A=w(0),ve=$(()=>se(x.value)),{modes:Ne}=e,R=w(se(x.value)||Ne[0]||"rgb");function Ee(){const{modes:a}=e,{value:c}=R,h=a.findIndex(p=>p===c);~h?R.value=a[(h+1)%a.length]:R.value="rgb"}let y,S,J,Q,I,P,_,C;const ae=$(()=>{const{value:a}=x;if(!a)return null;switch(ve.value){case"hsv":return K(a);case"hsl":return[y,S,J,C]=te(a),[...qe(y,S,J),C];case"rgb":case"hex":return[I,P,_,C]=M(a),[...$e(I,P,_),C]}}),N=$(()=>{const{value:a}=x;if(!a)return null;switch(ve.value){case"rgb":case"hex":return M(a);case"hsv":return[y,S,Q,C]=K(a),[...H(y,S,Q),C];case"hsl":return[y,S,J,C]=te(a),[...Ae(y,S,J),C]}}),be=$(()=>{const{value:a}=x;if(!a)return null;switch(ve.value){case"hsl":return te(a);case"hsv":return[y,S,Q,C]=K(a),[...ge(y,S,Q),C];case"rgb":case"hex":return[I,P,_,C]=M(a),[...Re(I,P,_),C]}}),Oe=$(()=>{switch(R.value){case"rgb":case"hex":return N.value;case"hsv":return ae.value;case"hsl":return be.value}}),ce=w(0),me=w(1),xe=w([0,0]);function Le(a,c){const{value:h}=ae,p=ce.value,g=h?h[3]:1;xe.value=[a,c];const{showAlpha:d}=e;switch(R.value){case"hsv":v((d?j:Ce)([p,a,c,g]),"cursor");break;case"hsl":v((d?B:ye)([...ge(p,a,c),g]),"cursor");break;case"rgb":v((d?D:Se)([...H(p,a,c),g]),"cursor");break;case"hex":v((d?F:ie)([...H(p,a,c),g]),"cursor");break}}function je(a){ce.value=a;const{value:c}=ae;if(!c)return;const[,h,p,g]=c,{showAlpha:d}=e;switch(R.value){case"hsv":v((d?j:Ce)([a,h,p,g]),"cursor");break;case"rgb":v((d?D:Se)([...H(a,h,p),g]),"cursor");break;case"hex":v((d?F:ie)([...H(a,h,p),g]),"cursor");break;case"hsl":v((d?B:ye)([...ge(a,h,p),g]),"cursor");break}}function Ke(a){switch(R.value){case"hsv":[y,S,Q]=ae.value,v(j([y,S,Q,a]),"cursor");break;case"rgb":[I,P,_]=N.value,v(D([I,P,_,a]),"cursor");break;case"hex":[I,P,_]=N.value,v(F([I,P,_,a]),"cursor");break;case"hsl":[y,S,J]=be.value,v(B([y,S,J,a]),"cursor");break}me.value=a}function v(a,c){c==="cursor"?r=a:r=null;const{nTriggerFormChange:h,nTriggerFormInput:p}=o,{onUpdateValue:g,"onUpdate:value":d}=e;g&&de(g,a),d&&de(d,a),h(),p(),De.value=a}function Ze(a){v(a,"input"),kt(Y)}function Y(a=!0){const{value:c}=x;if(c){const{nTriggerFormChange:h,nTriggerFormInput:p}=o,{onComplete:g}=e;g&&g(c);const{value:d}=G,{value:k}=A;a&&(d.splice(k+1,d.length,c),A.value=k+1),h(),p()}}function Xe(){const{value:a}=A;a-1<0||(v(G.value[a-1],"input"),Y(!1),A.value=a-1)}function Ge(){const{value:a}=A;a<0||a+1>=G.value.length||(v(G.value[a+1],"input"),Y(!1),A.value=a+1)}function Je(){v(null,"input"),X(!1)}function Qe(){const{value:a}=x,{onConfirm:c}=e;c&&c(a),X(!1)}const Ye=$(()=>A.value>=1),We=$(()=>{const{value:a}=G;return a.length>1&&A.value<a.length-1});ut(ue,a=>{a||(G.value=[x.value],A.value=0)}),Fe(()=>{if(!(r&&r===x.value)){const{value:a}=ae;a&&(ce.value=a[0],me.value=a[3],xe.value=[a[1],a[2]])}r=null});const ke=$(()=>{const{value:a}=l,{common:{cubicBezierEaseInOut:c},self:{textColor:h,color:p,panelFontSize:g,boxShadow:d,border:k,borderRadius:m,dividerColor:E,[Pe("height",a)]:tt,[Pe("fontSize",a)]:rt}}=T.value;return{"--n-bezier":c,"--n-text-color":h,"--n-color":p,"--n-panel-font-size":g,"--n-font-size":rt,"--n-box-shadow":d,"--n-border":k,"--n-border-radius":m,"--n-height":tt,"--n-divider-color":E}}),V=oe?ct("color-picker",$(()=>l.value[0]),ke,e):void 0;function et(){var a;const{value:c}=N,{value:h}=ce,{internalActions:p,modes:g,actions:d}=e,{value:k}=T,{value:m}=f;return i("div",{class:[`${m}-color-picker-panel`,V==null?void 0:V.themeClass.value],onDragstart:E=>{E.preventDefault()},style:oe?void 0:ke.value},i("div",{class:`${m}-color-picker-control`},i(Pt,{clsPrefix:m,rgba:c,displayedHue:h,displayedSv:xe.value,onUpdateSV:Le,onComplete:Y}),i("div",{class:`${m}-color-picker-preview`},i("div",{class:`${m}-color-picker-preview__sliders`},i(Dt,{clsPrefix:m,hue:h,onUpdateHue:je,onComplete:Y}),e.showAlpha?i(It,{clsPrefix:m,rgba:c,alpha:me.value,onUpdateAlpha:Ke,onComplete:Y}):null),e.showPreview?i(Kt,{clsPrefix:m,mode:R.value,color:N.value&&ie(N.value),onUpdateColor:E=>{v(E,"input")}}):null),i(Nt,{clsPrefix:m,showAlpha:e.showAlpha,mode:R.value,modes:g,onUpdateMode:Ee,value:x.value,valueArr:Oe.value,onUpdateValue:Ze}),((a=e.swatches)===null||a===void 0?void 0:a.length)&&i(jt,{clsPrefix:m,mode:R.value,swatches:e.swatches,onUpdateColor:E=>{v(E,"input")}})),d!=null&&d.length?i("div",{class:`${m}-color-picker-action`},d.includes("confirm")&&i(he,{size:"small",onClick:Qe,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.confirm}),d.includes("clear")&&i(he,{size:"small",onClick:Je,disabled:!x.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.clear})):null,t.action?i("div",{class:`${m}-color-picker-action`},{default:t.action}):p?i("div",{class:`${m}-color-picker-action`},p.includes("undo")&&i(he,{size:"small",onClick:Xe,disabled:!Ye.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.undo}),p.includes("redo")&&i(he,{size:"small",onClick:Ge,disabled:!We.value,theme:k.peers.Button,themeOverrides:k.peerOverrides.Button},{default:()=>u.value.redo})):null)}return{mergedClsPrefix:f,namespace:q,selfRef:n,hsla:be,rgba:N,mergedShow:ue,mergedDisabled:s,isMounted:dt(),adjustedTo:Ue(e),mergedValue:x,handleTriggerClick(){X(!0)},handleClickOutside(a){var c;!((c=n.value)===null||c===void 0)&&c.contains(ht(a))||X(!1)},renderPanel:et,cssVars:oe?void 0:ke,themeClass:V==null?void 0:V.themeClass,onRender:V==null?void 0:V.onRender}},render(){const{$slots:e,mergedClsPrefix:t,onRender:n}=this;return n==null||n(),i("div",{class:[this.themeClass,`${t}-color-picker`],ref:"selfRef",style:this.cssVars},i(pt,null,{default:()=>[i(ft,null,{default:()=>i(Et,{clsPrefix:t,value:this.mergedValue,hsla:this.hsla,disabled:this.mergedDisabled,onClick:this.handleTriggerClick},{label:e.label})}),i(gt,{placement:this.placement,show:this.mergedShow,containerClass:this.namespace,teleportDisabled:this.adjustedTo===Ue.tdkey,to:this.adjustedTo},{default:()=>i(vt,{name:"fade-in-scale-up-transition",appear:this.isMounted},{default:()=>this.mergedShow?bt(this.renderPanel(),[[mt,this.handleClickOutside,void 0,{capture:!0}]]):null})})]}))}});export{Wt as N};
