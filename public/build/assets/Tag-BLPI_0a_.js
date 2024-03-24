import{aj as co,cK as no,aq as o,X as so,a0 as p,Y as x,bz as I,Z as z,w as to,$ as io,K as ho,a6 as K,V as go,a3 as bo,as as Co,d as L,ak as d,at as vo,a7 as uo,cL as N,aC as V,S as y,av as po,E as fo,bq as ko}from"./app-CKeLOz7-.js";const mo=a=>{const{textColor2:h,primaryColorHover:r,primaryColorPressed:f,primaryColor:c,infoColor:i,successColor:s,warningColor:n,errorColor:t,baseColor:k,borderColor:m,opacityDisabled:g,tagColor:v,closeIconColor:e,closeIconColorHover:l,closeIconColorPressed:u,borderRadiusSmall:b,fontSizeMini:C,fontSizeTiny:S,fontSizeSmall:B,fontSizeMedium:$,heightMini:H,heightTiny:R,heightSmall:M,heightMedium:T,closeColorHover:E,closeColorPressed:w,buttonColor2Hover:_,buttonColor2Pressed:W,fontWeightStrong:j}=a;return Object.assign(Object.assign({},no),{closeBorderRadius:b,heightTiny:H,heightSmall:R,heightMedium:M,heightLarge:T,borderRadius:b,opacityDisabled:g,fontSizeTiny:C,fontSizeSmall:S,fontSizeMedium:B,fontSizeLarge:$,fontWeightStrong:j,textColorCheckable:h,textColorHoverCheckable:h,textColorPressedCheckable:h,textColorChecked:k,colorCheckable:"#0000",colorHoverCheckable:_,colorPressedCheckable:W,colorChecked:c,colorCheckedHover:r,colorCheckedPressed:f,border:`1px solid ${m}`,textColor:h,color:v,colorBordered:"rgb(250, 250, 252)",closeIconColor:e,closeIconColorHover:l,closeIconColorPressed:u,closeColorHover:E,closeColorPressed:w,borderPrimary:`1px solid ${o(c,{alpha:.3})}`,textColorPrimary:c,colorPrimary:o(c,{alpha:.12}),colorBorderedPrimary:o(c,{alpha:.1}),closeIconColorPrimary:c,closeIconColorHoverPrimary:c,closeIconColorPressedPrimary:c,closeColorHoverPrimary:o(c,{alpha:.12}),closeColorPressedPrimary:o(c,{alpha:.18}),borderInfo:`1px solid ${o(i,{alpha:.3})}`,textColorInfo:i,colorInfo:o(i,{alpha:.12}),colorBorderedInfo:o(i,{alpha:.1}),closeIconColorInfo:i,closeIconColorHoverInfo:i,closeIconColorPressedInfo:i,closeColorHoverInfo:o(i,{alpha:.12}),closeColorPressedInfo:o(i,{alpha:.18}),borderSuccess:`1px solid ${o(s,{alpha:.3})}`,textColorSuccess:s,colorSuccess:o(s,{alpha:.12}),colorBorderedSuccess:o(s,{alpha:.1}),closeIconColorSuccess:s,closeIconColorHoverSuccess:s,closeIconColorPressedSuccess:s,closeColorHoverSuccess:o(s,{alpha:.12}),closeColorPressedSuccess:o(s,{alpha:.18}),borderWarning:`1px solid ${o(n,{alpha:.35})}`,textColorWarning:n,colorWarning:o(n,{alpha:.15}),colorBorderedWarning:o(n,{alpha:.12}),closeIconColorWarning:n,closeIconColorHoverWarning:n,closeIconColorPressedWarning:n,closeColorHoverWarning:o(n,{alpha:.12}),closeColorPressedWarning:o(n,{alpha:.18}),borderError:`1px solid ${o(t,{alpha:.23})}`,textColorError:t,colorError:o(t,{alpha:.1}),colorBorderedError:o(t,{alpha:.08}),closeIconColorError:t,closeIconColorHoverError:t,closeIconColorPressedError:t,closeColorHoverError:o(t,{alpha:.12}),closeColorPressedError:o(t,{alpha:.18})})},xo={name:"Tag",common:co,self:mo},yo=xo,Po={color:Object,type:{type:String,default:"default"},round:Boolean,size:{type:String,default:"medium"},closable:Boolean,disabled:{type:Boolean,default:void 0}},Io=so("tag",`
 --n-close-margin: var(--n-close-margin-top) var(--n-close-margin-right) var(--n-close-margin-bottom) var(--n-close-margin-left);
 white-space: nowrap;
 position: relative;
 box-sizing: border-box;
 cursor: default;
 display: inline-flex;
 align-items: center;
 flex-wrap: nowrap;
 padding: var(--n-padding);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition: 
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 line-height: 1;
 height: var(--n-height);
 font-size: var(--n-font-size);
`,[p("strong",`
 font-weight: var(--n-font-weight-strong);
 `),x("border",`
 pointer-events: none;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 border: var(--n-border);
 transition: border-color .3s var(--n-bezier);
 `),x("icon",`
 display: flex;
 margin: 0 4px 0 0;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 font-size: var(--n-avatar-size-override);
 `),x("avatar",`
 display: flex;
 margin: 0 6px 0 0;
 `),x("close",`
 margin: var(--n-close-margin);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),p("round",`
 padding: 0 calc(var(--n-height) / 3);
 border-radius: calc(var(--n-height) / 2);
 `,[x("icon",`
 margin: 0 4px 0 calc((var(--n-height) - 8px) / -2);
 `),x("avatar",`
 margin: 0 6px 0 calc((var(--n-height) - 8px) / -2);
 `),p("closable",`
 padding: 0 calc(var(--n-height) / 4) 0 calc(var(--n-height) / 3);
 `)]),p("icon, avatar",[p("round",`
 padding: 0 calc(var(--n-height) / 3) 0 calc(var(--n-height) / 2);
 `)]),p("disabled",`
 cursor: not-allowed !important;
 opacity: var(--n-opacity-disabled);
 `),p("checkable",`
 cursor: pointer;
 box-shadow: none;
 color: var(--n-text-color-checkable);
 background-color: var(--n-color-checkable);
 `,[I("disabled",[z("&:hover","background-color: var(--n-color-hover-checkable);",[I("checked","color: var(--n-text-color-hover-checkable);")]),z("&:active","background-color: var(--n-color-pressed-checkable);",[I("checked","color: var(--n-text-color-pressed-checkable);")])]),p("checked",`
 color: var(--n-text-color-checked);
 background-color: var(--n-color-checked);
 `,[I("disabled",[z("&:hover","background-color: var(--n-color-checked-hover);"),z("&:active","background-color: var(--n-color-checked-pressed);")])])])]),zo=Object.assign(Object.assign(Object.assign({},K.props),Po),{bordered:{type:Boolean,default:void 0},checked:Boolean,checkable:Boolean,strong:Boolean,triggerClickOnClose:Boolean,onClose:[Array,Function],onMouseenter:Function,onMouseleave:Function,"onUpdate:checked":Function,onUpdateChecked:Function,internalCloseFocusable:{type:Boolean,default:!0},internalCloseIsButtonTag:{type:Boolean,default:!0},onCheckedChange:Function}),So=fo("n-tag"),$o=to({name:"Tag",props:zo,setup(a){const h=io(null),{mergedBorderedRef:r,mergedClsPrefixRef:f,inlineThemeDisabled:c,mergedRtlRef:i}=ho(a),s=K("Tag","-tag",Io,yo,a,f);go(So,{roundRef:bo(a,"round")});function n(e){if(!a.disabled&&a.checkable){const{checked:l,onCheckedChange:u,onUpdateChecked:b,"onUpdate:checked":C}=a;b&&b(!l),C&&C(!l),u&&u(!l)}}function t(e){if(a.triggerClickOnClose||e.stopPropagation(),!a.disabled){const{onClose:l}=a;l&&ko(l,e)}}const k={setTextContent(e){const{value:l}=h;l&&(l.textContent=e)}},m=Co("Tag",i,f),g=L(()=>{const{type:e,size:l,color:{color:u,textColor:b}={}}=a,{common:{cubicBezierEaseInOut:C},self:{padding:S,closeMargin:B,borderRadius:$,opacityDisabled:H,textColorCheckable:R,textColorHoverCheckable:M,textColorPressedCheckable:T,textColorChecked:E,colorCheckable:w,colorHoverCheckable:_,colorPressedCheckable:W,colorChecked:j,colorCheckedHover:U,colorCheckedPressed:D,closeBorderRadius:q,fontWeightStrong:A,[d("colorBordered",e)]:Q,[d("closeSize",l)]:X,[d("closeIconSize",l)]:Y,[d("fontSize",l)]:Z,[d("height",l)]:O,[d("color",e)]:G,[d("textColor",e)]:J,[d("border",e)]:oo,[d("closeIconColor",e)]:F,[d("closeIconColorHover",e)]:eo,[d("closeIconColorPressed",e)]:ro,[d("closeColorHover",e)]:lo,[d("closeColorPressed",e)]:ao}}=s.value,P=vo(B);return{"--n-font-weight-strong":A,"--n-avatar-size-override":`calc(${O} - 8px)`,"--n-bezier":C,"--n-border-radius":$,"--n-border":oo,"--n-close-icon-size":Y,"--n-close-color-pressed":ao,"--n-close-color-hover":lo,"--n-close-border-radius":q,"--n-close-icon-color":F,"--n-close-icon-color-hover":eo,"--n-close-icon-color-pressed":ro,"--n-close-icon-color-disabled":F,"--n-close-margin-top":P.top,"--n-close-margin-right":P.right,"--n-close-margin-bottom":P.bottom,"--n-close-margin-left":P.left,"--n-close-size":X,"--n-color":u||(r.value?Q:G),"--n-color-checkable":w,"--n-color-checked":j,"--n-color-checked-hover":U,"--n-color-checked-pressed":D,"--n-color-hover-checkable":_,"--n-color-pressed-checkable":W,"--n-font-size":Z,"--n-height":O,"--n-opacity-disabled":H,"--n-padding":S,"--n-text-color":b||J,"--n-text-color-checkable":R,"--n-text-color-checked":E,"--n-text-color-hover-checkable":M,"--n-text-color-pressed-checkable":T}}),v=c?uo("tag",L(()=>{let e="";const{type:l,size:u,color:{color:b,textColor:C}={}}=a;return e+=l[0],e+=u[0],b&&(e+=`a${N(b)}`),C&&(e+=`b${N(C)}`),r.value&&(e+="c"),e}),g,a):void 0;return Object.assign(Object.assign({},k),{rtlEnabled:m,mergedClsPrefix:f,contentRef:h,mergedBordered:r,handleClick:n,handleCloseClick:t,cssVars:c?void 0:g,themeClass:v==null?void 0:v.themeClass,onRender:v==null?void 0:v.onRender})},render(){var a,h;const{mergedClsPrefix:r,rtlEnabled:f,closable:c,color:{borderColor:i}={},round:s,onRender:n,$slots:t}=this;n==null||n();const k=V(t.avatar,g=>g&&y("div",{class:`${r}-tag__avatar`},g)),m=V(t.icon,g=>g&&y("div",{class:`${r}-tag__icon`},g));return y("div",{class:[`${r}-tag`,this.themeClass,{[`${r}-tag--rtl`]:f,[`${r}-tag--strong`]:this.strong,[`${r}-tag--disabled`]:this.disabled,[`${r}-tag--checkable`]:this.checkable,[`${r}-tag--checked`]:this.checkable&&this.checked,[`${r}-tag--round`]:s,[`${r}-tag--avatar`]:k,[`${r}-tag--icon`]:m,[`${r}-tag--closable`]:c}],style:this.cssVars,onClick:this.handleClick,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},m||k,y("span",{class:`${r}-tag__content`,ref:"contentRef"},(h=(a=this.$slots).default)===null||h===void 0?void 0:h.call(a)),!this.checkable&&c?y(po,{clsPrefix:r,class:`${r}-tag__close`,disabled:this.disabled,onClick:this.handleCloseClick,focusable:this.internalCloseFocusable,round:s,isButtonTag:this.internalCloseIsButtonTag,absolute:!0}):null,!this.checkable&&this.mergedBordered?y("div",{class:`${r}-tag__border`,style:{borderColor:i}}):null)}});export{$o as N};
