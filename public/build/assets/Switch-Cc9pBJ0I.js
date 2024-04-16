import{ak as se,c$ as ce,ar as de,Y as U,Z as t,ba as A,a0 as j,a1 as l,a_ as H,w as ue,L as he,a7 as I,bb as be,$ as K,a4 as fe,a3 as ve,d as z,al as w,am as L,bu as s,a8 as ge,d0 as M,S as i,aD as m,b8 as we,cx as me,bd as O}from"./app-Cg2-RClK.js";const pe=e=>{const{primaryColor:c,opacityDisabled:f,borderRadius:n,textColor3:r}=e;return Object.assign(Object.assign({},ce),{iconColor:r,textColor:"white",loadingColor:c,opacityDisabled:f,railColor:"rgba(0, 0, 0, .14)",railColorActive:c,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:n,railBorderRadiusMedium:n,railBorderRadiusLarge:n,buttonBorderRadiusSmall:n,buttonBorderRadiusMedium:n,buttonBorderRadiusLarge:n,boxShadowFocus:`0 0 0 2px ${de(c,{alpha:.2})}`})},ye={name:"Switch",common:se,self:pe},xe=ye,ke=U("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[t("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),t("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),t("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),U("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[A({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),t("checked, unchecked",`
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
 `),t("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),t("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),j("&:focus",[t("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),l("round",[t("rail","border-radius: calc(var(--n-rail-height) / 2);",[t("button","border-radius: calc(var(--n-button-height) / 2);")])]),H("disabled",[H("icon",[l("rubber-band",[l("pressed",[t("rail",[t("button","max-width: var(--n-button-width-pressed);")])]),t("rail",[j("&:active",[t("button","max-width: var(--n-button-width-pressed);")])]),l("active",[l("pressed",[t("rail",[t("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),t("rail",[j("&:active",[t("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),l("active",[t("rail",[t("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),t("rail",`
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
 `,[t("button-icon",`
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
 `,[A()]),t("button",`
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
 `)]),l("active",[t("rail","background-color: var(--n-rail-color-active);")]),l("loading",[t("rail",`
 cursor: wait;
 `)]),l("disabled",[t("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),Se=Object.assign(Object.assign({},I.props),{size:{type:String,default:"medium"},value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},onChange:[Function,Array]});let $;const $e=ue({name:"Switch",props:Se,setup(e){$===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?$=CSS.supports("width","max(1px)"):$=!1:$=!0);const{mergedClsPrefixRef:c,inlineThemeDisabled:f}=he(e),n=I("Switch","-switch",ke,xe,e,c),r=be(e),{mergedSizeRef:x,mergedDisabledRef:v}=r,k=K(e.defaultValue),B=fe(e,"value"),g=ve(B,k),S=z(()=>g.value===e.checkedValue),p=K(!1),o=K(!1),d=z(()=>{const{railStyle:a}=e;if(a)return a({focused:o.value,checked:S.value})});function u(a){const{"onUpdate:value":R,onChange:_,onUpdateValue:V}=e,{nTriggerFormInput:F,nTriggerFormChange:T}=r;R&&O(R,a),V&&O(V,a),_&&O(_,a),k.value=a,F(),T()}function E(){const{nTriggerFormFocus:a}=r;a()}function Y(){const{nTriggerFormBlur:a}=r;a()}function X(){e.loading||v.value||(g.value!==e.checkedValue?u(e.checkedValue):u(e.uncheckedValue))}function Q(){o.value=!0,E()}function Z(){o.value=!1,Y(),p.value=!1}function q(a){e.loading||v.value||a.key===" "&&(g.value!==e.checkedValue?u(e.checkedValue):u(e.uncheckedValue),p.value=!1)}function G(a){e.loading||v.value||a.key===" "&&(a.preventDefault(),p.value=!0)}const P=z(()=>{const{value:a}=x,{self:{opacityDisabled:R,railColor:_,railColorActive:V,buttonBoxShadow:F,buttonColor:T,boxShadowFocus:J,loadingColor:ee,textColor:te,iconColor:ae,[w("buttonHeight",a)]:h,[w("buttonWidth",a)]:oe,[w("buttonWidthPressed",a)]:ie,[w("railHeight",a)]:b,[w("railWidth",a)]:C,[w("railBorderRadius",a)]:ne,[w("buttonBorderRadius",a)]:re},common:{cubicBezierEaseInOut:le}}=n.value;let D,N,W;return $?(D=`calc((${b} - ${h}) / 2)`,N=`max(${b}, ${h})`,W=`max(${C}, calc(${C} + ${h} - ${b}))`):(D=L((s(b)-s(h))/2),N=L(Math.max(s(b),s(h))),W=s(b)>s(h)?C:L(s(C)+s(h)-s(b))),{"--n-bezier":le,"--n-button-border-radius":re,"--n-button-box-shadow":F,"--n-button-color":T,"--n-button-width":oe,"--n-button-width-pressed":ie,"--n-button-height":h,"--n-height":N,"--n-offset":D,"--n-opacity-disabled":R,"--n-rail-border-radius":ne,"--n-rail-color":_,"--n-rail-color-active":V,"--n-rail-height":b,"--n-rail-width":C,"--n-width":W,"--n-box-shadow-focus":J,"--n-loading-color":ee,"--n-text-color":te,"--n-icon-color":ae}}),y=f?ge("switch",z(()=>x.value[0]),P,e):void 0;return{handleClick:X,handleBlur:Z,handleFocus:Q,handleKeyup:q,handleKeydown:G,mergedRailStyle:d,pressed:p,mergedClsPrefix:c,mergedValue:g,checked:S,mergedDisabled:v,cssVars:f?void 0:P,themeClass:y==null?void 0:y.themeClass,onRender:y==null?void 0:y.onRender}},render(){const{mergedClsPrefix:e,mergedDisabled:c,checked:f,mergedRailStyle:n,onRender:r,$slots:x}=this;r==null||r();const{checked:v,unchecked:k,icon:B,"checked-icon":g,"unchecked-icon":S}=x,p=!(M(B)&&M(g)&&M(S));return i("div",{role:"switch","aria-checked":f,class:[`${e}-switch`,this.themeClass,p&&`${e}-switch--icon`,f&&`${e}-switch--active`,c&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},i("div",{class:`${e}-switch__rail`,"aria-hidden":"true",style:n},m(v,o=>m(k,d=>o||d?i("div",{"aria-hidden":!0,class:`${e}-switch__children-placeholder`},i("div",{class:`${e}-switch__rail-placeholder`},i("div",{class:`${e}-switch__button-placeholder`}),o),i("div",{class:`${e}-switch__rail-placeholder`},i("div",{class:`${e}-switch__button-placeholder`}),d)):null)),i("div",{class:`${e}-switch__button`},m(B,o=>m(g,d=>m(S,u=>i(we,null,{default:()=>this.loading?i(me,{key:"loading",clsPrefix:e,strokeWidth:20}):this.checked&&(d||o)?i("div",{class:`${e}-switch__button-icon`,key:d?"checked-icon":"icon"},d||o):!this.checked&&(u||o)?i("div",{class:`${e}-switch__button-icon`,key:u?"unchecked-icon":"icon"},u||o):null})))),m(v,o=>o&&i("div",{key:"checked",class:`${e}-switch__checked`},o)),m(k,o=>o&&i("div",{key:"unchecked",class:`${e}-switch__unchecked`},o)))))}});export{$e as N};
