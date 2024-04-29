function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/Battle-BvrkdLNV.js","assets/app-kheo8X_U.js","assets/app-DNL5EDGQ.css","assets/randomHeads-CJXi9sfl.js","assets/showDialog-ODCPLuVs.js","assets/FInput.vue_vue_type_script_setup_true_lang-B9zJWYt_.js","assets/Input-w7XotX3_.js","assets/use-locale-C7kSl_Yf.js","assets/FInputGroupLabel.vue_vue_type_script_setup_true_lang-B2CX8pL6.js","assets/InputGroup-CySdXqN4.js","assets/InputNumber-C1MWS2b0.js","assets/Add-Kheouh66.js","assets/index-Crq6HWd9.js","assets/_commonjsHelpers-BosuxZz1.js","assets/inputNumberFormat-DaYmlx6U.js","assets/Select-BNwviYZ0.js","assets/Tag-by8YA5ii.js","assets/Grid-Dvmgo34J.js","assets/ColorPicker-BHV1VC2w.js","assets/_createCompounder-CTkwRAlE.js","assets/Ellipsis-WqQDsGo2.js","assets/download-sglA049O.js","assets/emojiData-nGA-8XBz.js","assets/Tabs-CYOp69F9.js","assets/randomHeads-JCDAAN1b.css","assets/forums-tbfEju22.js","assets/Spin-ii7qv40I.js","assets/Battle-i_L_SKTY.css","assets/HongbaoPost-qjSI1bV8.js","assets/HongbaoPost-CdzQ2jUV.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{ak as De,bO as $e,bP as L,bq as T,Y as N,Z as y,a1 as ie,b1 as ze,a0 as Ie,w as S,L as Me,a7 as _e,bQ as Ee,d as W,bl as He,al as M,a8 as Pe,$,S as f,aZ as Se,an as Re,bh as Ae,aY as Be,aO as je,aU as Le,aV as Te,aW as Oe,aT as Fe,bm as We,A as d,F as k,j as u,b6 as Ve,o as Ne,b as qe,au as q,e as le,H as E,f as D,a as s,az as ue,G as _,M as P,z as ge,s as Z,aC as Ge,C as pe,N as G,v as Ue,m as ae,k as he,n as fe,aw as me,bR as Ze,ax as ve}from"./app-kheo8X_U.js";import{r as Je,d as Qe,b as Ke}from"./randomHeads-CJXi9sfl.js";import{s as ce}from"./showDialog-ODCPLuVs.js";import{D as de}from"./Delete-B1YYBuY5.js";const Ye=a=>{const{lineHeight:r,borderRadius:p,fontWeightStrong:R,baseColor:v,dividerColor:b,actionColor:m,textColor1:c,textColor2:g,closeColorHover:x,closeColorPressed:z,closeIconColor:o,closeIconColorHover:A,closeIconColorPressed:h,infoColor:l,successColor:O,warningColor:B,errorColor:F,fontSize:U}=a;return Object.assign(Object.assign({},$e),{fontSize:U,lineHeight:r,titleFontWeight:R,borderRadius:p,border:`1px solid ${b}`,color:m,titleTextColor:c,iconColor:g,contentTextColor:g,closeBorderRadius:p,closeColorHover:x,closeColorPressed:z,closeIconColor:o,closeIconColorHover:A,closeIconColorPressed:h,borderInfo:`1px solid ${L(v,T(l,{alpha:.25}))}`,colorInfo:L(v,T(l,{alpha:.08})),titleTextColorInfo:c,iconColorInfo:l,contentTextColorInfo:g,closeColorHoverInfo:x,closeColorPressedInfo:z,closeIconColorInfo:o,closeIconColorHoverInfo:A,closeIconColorPressedInfo:h,borderSuccess:`1px solid ${L(v,T(O,{alpha:.25}))}`,colorSuccess:L(v,T(O,{alpha:.08})),titleTextColorSuccess:c,iconColorSuccess:O,contentTextColorSuccess:g,closeColorHoverSuccess:x,closeColorPressedSuccess:z,closeIconColorSuccess:o,closeIconColorHoverSuccess:A,closeIconColorPressedSuccess:h,borderWarning:`1px solid ${L(v,T(B,{alpha:.33}))}`,colorWarning:L(v,T(B,{alpha:.08})),titleTextColorWarning:c,iconColorWarning:B,contentTextColorWarning:g,closeColorHoverWarning:x,closeColorPressedWarning:z,closeIconColorWarning:o,closeIconColorHoverWarning:A,closeIconColorPressedWarning:h,borderError:`1px solid ${L(v,T(F,{alpha:.25}))}`,colorError:L(v,T(F,{alpha:.08})),titleTextColorError:c,iconColorError:F,contentTextColorError:g,closeColorHoverError:x,closeColorPressedError:z,closeIconColorError:o,closeIconColorHoverError:A,closeIconColorPressedError:h})},Xe={name:"Alert",common:De,self:Ye},eo=Xe,oo=N("alert",`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[y("border",`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),ie("closable",[N("alert-body",[y("title",`
 padding-right: 24px;
 `)])]),y("icon",{color:"var(--n-icon-color)"}),N("alert-body",{padding:"var(--n-padding)"},[y("title",{color:"var(--n-title-text-color)"}),y("content",{color:"var(--n-content-text-color)"})]),ze({originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.9)"}}),y("icon",`
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `),y("close",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),ie("show-icon",[N("alert-body",{paddingLeft:"calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))"})]),ie("right-adjust",[N("alert-body",{paddingRight:"calc(var(--n-close-size) + var(--n-padding) + 2px)"})]),N("alert-body",`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[y("title",`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[Ie("& +",[y("content",{marginTop:"9px"})])]),y("content",{transition:"color .3s var(--n-bezier)",fontSize:"var(--n-font-size)"})]),y("icon",{transition:"color .3s var(--n-bezier)"})]),to=Object.assign(Object.assign({},_e.props),{title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:"default"},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function}),so=S({name:"Alert",inheritAttrs:!1,props:to,setup(a){const{mergedClsPrefixRef:r,mergedBorderedRef:p,inlineThemeDisabled:R,mergedRtlRef:v}=Me(a),b=_e("Alert","-alert",oo,eo,a,r),m=Ee("Alert",v,r),c=W(()=>{const{common:{cubicBezierEaseInOut:h},self:l}=b.value,{fontSize:O,borderRadius:B,titleFontWeight:F,lineHeight:U,iconSize:X,iconMargin:I,iconMarginRtl:j,closeIconSize:ee,closeBorderRadius:oe,closeSize:J,closeMargin:V,closeMarginRtl:Q,padding:te}=l,{type:w}=a,{left:se,right:re}=He(I);return{"--n-bezier":h,"--n-color":l[M("color",w)],"--n-close-icon-size":ee,"--n-close-border-radius":oe,"--n-close-color-hover":l[M("closeColorHover",w)],"--n-close-color-pressed":l[M("closeColorPressed",w)],"--n-close-icon-color":l[M("closeIconColor",w)],"--n-close-icon-color-hover":l[M("closeIconColorHover",w)],"--n-close-icon-color-pressed":l[M("closeIconColorPressed",w)],"--n-icon-color":l[M("iconColor",w)],"--n-border":l[M("border",w)],"--n-title-text-color":l[M("titleTextColor",w)],"--n-content-text-color":l[M("contentTextColor",w)],"--n-line-height":U,"--n-border-radius":B,"--n-font-size":O,"--n-title-font-weight":F,"--n-icon-size":X,"--n-icon-margin":I,"--n-icon-margin-rtl":j,"--n-close-size":J,"--n-close-margin":V,"--n-close-margin-rtl":Q,"--n-padding":te,"--n-icon-margin-left":se,"--n-icon-margin-right":re}}),g=R?Pe("alert",W(()=>a.type[0]),c,a):void 0,x=$(!0),z=()=>{const{onAfterLeave:h,onAfterHide:l}=a;h&&h(),l&&l()};return{rtlEnabled:m,mergedClsPrefix:r,mergedBordered:p,visible:x,handleCloseClick:()=>{var h;Promise.resolve((h=a.onClose)===null||h===void 0?void 0:h.call(a)).then(l=>{l!==!1&&(x.value=!1)})},handleAfterLeave:()=>{z()},mergedTheme:b,cssVars:R?void 0:c,themeClass:g==null?void 0:g.themeClass,onRender:g==null?void 0:g.onRender}},render(){var a;return(a=this.onRender)===null||a===void 0||a.call(this),f(Se,{onAfterLeave:this.handleAfterLeave},{default:()=>{const{mergedClsPrefix:r,$slots:p}=this,R={class:[`${r}-alert`,this.themeClass,this.closable&&`${r}-alert--closable`,this.showIcon&&`${r}-alert--show-icon`,!this.title&&this.closable&&`${r}-alert--right-adjust`,this.rtlEnabled&&`${r}-alert--rtl`],style:this.cssVars,role:"alert"};return this.visible?f("div",Object.assign({},Re(this.$attrs,R)),this.closable&&f(Ae,{clsPrefix:r,class:`${r}-alert__close`,onClick:this.handleCloseClick}),this.bordered&&f("div",{class:`${r}-alert__border`}),this.showIcon&&f("div",{class:`${r}-alert__icon`,"aria-hidden":"true"},Be(p.icon,()=>[f(je,{clsPrefix:r},{default:()=>{switch(this.type){case"success":return f(Fe,null);case"info":return f(Oe,null);case"warning":return f(Te,null);case"error":return f(Le,null);default:return null}}})])),f("div",{class:[`${r}-alert-body`,this.mergedBordered&&`${r}-alert-body--bordered`]},We(p.header,v=>{const b=v||this.title;return b?f("div",{class:`${r}-alert-body__title`},b):null}),p.default&&f("div",{class:`${r}-alert-body__content`},p))):null}})}}),ro={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 384 512"},no=u("path",{d:"M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148c25.049-31.381 43.63-49.449 82.757-49.449c30.764 0 68.816 19.799 68.816 49.631c0 22.552-18.617 34.134-48.993 51.164c-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271c0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271s-31.075-69.27-69.271-69.27z",fill:"currentColor"},null,-1),io=[no],lo=S({name:"Question",render:function(r,p){return d(),k("svg",ro,io)}}),ao={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},co=u("circle",{fill:"none",stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"48",cx:"256",cy:"256",r:"200"},null,-1),uo=u("path",{stroke:"currentColor","stroke-miterlimit":"10","stroke-width":"48",d:"M114.58 114.58l282.84 282.84",fill:"currentColor"},null,-1),go=[co,uo],po=S({name:"Ban",render:function(r,p){return d(),k("svg",ao,go)}}),ho={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},fo=u("path",{d:"M87.48 380c1.2-4.38-1.43-10.47-3.94-14.86a42.63 42.63 0 0 0-2.54-3.8a199.81 199.81 0 0 1-33-110C47.64 139.09 140.72 48 255.82 48C356.2 48 440 117.54 459.57 209.85a199 199 0 0 1 4.43 41.64c0 112.41-89.49 204.93-204.59 204.93c-18.31 0-43-4.6-56.47-8.37s-26.92-8.77-30.39-10.11a31.14 31.14 0 0 0-11.13-2.07a30.7 30.7 0 0 0-12.08 2.43L81.5 462.78a15.92 15.92 0 0 1-4.66 1.22a9.61 9.61 0 0 1-9.58-9.74a15.85 15.85 0 0 1 .6-3.29z",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32"},null,-1),mo=u("circle",{cx:"160",cy:"256",r:"32",fill:"currentColor"},null,-1),vo=u("circle",{cx:"256",cy:"256",r:"32",fill:"currentColor"},null,-1),Co=u("circle",{cx:"352",cy:"256",r:"32",fill:"currentColor"},null,-1),bo=[fo,mo,vo,Co],_o=S({name:"ChatbubbleEllipsesOutline",render:function(r,p){return d(),k("svg",ho,bo)}}),wo={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},ko=u("circle",{cx:"256",cy:"256",r:"48",fill:"currentColor"},null,-1),xo=u("circle",{cx:"416",cy:"256",r:"48",fill:"currentColor"},null,-1),yo=u("circle",{cx:"96",cy:"256",r:"48",fill:"currentColor"},null,-1),Do=[ko,xo,yo],Ce=S({name:"EllipsisHorizontal",render:function(r,p){return d(),k("svg",wo,Do)}}),$o={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},zo=Ve('<path d="M256 104v56h56a56 56 0 1 0-56-56z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"></path><path d="M256 104v56h-56a56 56 0 1 1 56-56z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"></path><rect x="64" y="160" width="384" height="112" rx="32" ry="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></rect><path d="M416 272v144a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V272" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 160v304"></path>',5),Io=[zo],Mo=S({name:"GiftOutline",render:function(r,p){return d(),k("svg",$o,Io)}}),Eo={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 512 512"},Ho=u("path",{d:"M400 148l-21.12-24.57A191.43 191.43 0 0 0 240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 0 0 181.07-128",fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-miterlimit":"10","stroke-width":"32"},null,-1),Po=u("path",{d:"M464 97.42V208a16 16 0 0 1-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z",fill:"currentColor"},null,-1),So=[Ho,Po],be=S({name:"ReloadOutline",render:function(r,p){return d(),k("svg",Eo,So)}}),Ro={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 12 12"},Ao=u("g",{fill:"none"},[u("path",{d:"M4 4V3a2 2 0 1 1 4 0v1h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1zm1-1v1h2V3a1 1 0 0 0-2 0zm-2 7h6V5H3v5z",fill:"currentColor"})],-1),Bo=[Ao],jo=S({name:"LockClosed12Regular",render:function(r,p){return d(),k("svg",Ro,Bo)}}),Lo=["id","floor"],To={key:0,class:"random-head-container"},Oo=["src"],Fo=u("div",{style:{"margin-left":"auto"}},null,-1),Wo=["innerHTML"],Vo={class:"post-created-at"},No={key:0,class:"post-anti-jingfen"},Jo=S({__name:"PostItem",props:{forumId:{},postData:{},yourPostsList:{default:()=>[]},randomHeadGroupIndex:{default:1},antiJingfen:{type:Boolean,default:!1},noImageMode:{type:Boolean,default:!1},noEmojiMode:{type:Boolean,default:!1},noCustomEmojiMode:{type:Boolean,default:!1},noHeadMode:{type:Boolean,default:!1},noVideoMode:{type:Boolean,default:!1},useUrlMode:{type:Boolean,default:!1},previewMode:{type:Boolean,default:!1}},emits:["showRewardModal","quoteClick","refreshPostsList","adminHandle"],setup(a,{expose:r,emit:p}){const R=me(()=>ve(()=>import("./Battle-BvrkdLNV.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]))),v=me(()=>ve(()=>import("./HongbaoPost-qjSI1bV8.js"),__vite__mapDeps([28,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,29]))),b=$(!1),m=Ne(),c=qe(),g=$(null),x=$(null),z=$(null),o=a,A=W(()=>({maxHeight:K.value===void 0?void 0:K.value+"px"})),h=W(()=>({top:Y.value===void 0?void 0:Y.value+"px"})),l=p,O=W(()=>{const e=[{label:"提示",key:"hint",icon:q(lo,{size:"1.5rem"})},{label:"碎饼",key:"ban",icon:q(po,{size:"1.5rem"})},{label:"封禁",key:"lock",icon:q(jo,{size:"1.5rem"})},{label:"删全",key:"deleteAll",icon:q(de,{size:"1.5rem"})}];return o.postData.is_deleted===0?e.push({label:"删帖",key:"delete",icon:q(de,{size:"1.5rem"})}):e.push({label:"恢复",key:"recovery",icon:q(be,{size:"1.5rem"})}),e});function B(){l("showRewardModal",{floor:o.postData.floor,forumId:o.forumId,threadId:o.postData.thread_id,postId:o.postData.id,postFloorMessage:J.value})}function F(){function e(){const t={binggan:m.binggan,thread_id:o.postData.thread_id,post_id:o.postData.id};Qe(t).then(()=>l("refreshPostsList"))}ce({title:"要删除这个回复吗？",content:"会消费300olo喔",onPositiveClick:()=>{o.postData.hongbao_id!==null?ce({title:"注意",content:"这个回帖有红包。删除后红包将消失，并且olo不退回。是否确认？",onPositiveClick:()=>{e()}}):e()}})}function U(){function e(){const t={binggan:m.binggan,thread_id:o.postData.thread_id,post_id:o.postData.id};Ke(t).then(()=>l("refreshPostsList"))}ce({title:"要恢复这个已删除的回复吗？",content:"会消费300olo喔",onPositiveClick:()=>{e()}})}function X(e){switch(e){case"gift":B();break;case"quote":V();break;default:l("adminHandle",{action:e,postId:o.postData.id});break}}const I=$(!1),j=$();function ee(e){return e.search(/class='emoji[-_]img'/g)!=-1?o.noEmojiMode?"":e:e.search(/class='custom[-_]emoji[-_]img'/g)!=-1?o.noCustomEmojiMode?"":e:o.noImageMode?e.replace(/src/,"origin-src").replace("<img ",'<img src="/img_svg.svg" class="img-svg"'):e}const oe=W(()=>{var t;let e;if(e=o.postData.content.replace(/<img[^>]*>/g,ee).replace(/<script/g,"<**禁止使用script**").replace(/\n/g,"<br>"),(t=m.userData)!=null&&t.binggan.use_pingbici){const n=c.userCustom.pingbiciIngnoreCase?"gi":"g";if(!c.userCustom.hidePingbiciFloor){const i=m.userData.pingbici.content_pingbici;i==null||i.forEach(C=>{new RegExp(C,n).test(e)&&(I.value=!0,j.value="屏蔽词折叠（点击展开）")})}if(o.antiJingfen&&!c.userCustom.hidePingbiciFloor){const i=m.userData.pingbici.fjf_pingbici;i==null||i.forEach(C=>{new RegExp(C,"g").test(o.postData.created_binggan_hash.slice(0,5))&&(I.value=!0,j.value="小尾巴黑名单（点击展开）")})}if(!c.userCustom.hidePingbiciFloor){const i=m.userData.pingbici.fjf_pingbici;i==null||i.forEach(C=>{new RegExp(C,n).test(o.postData.nickname)&&(I.value=!0,j.value="固马黑名单（点击展开）")})}}if(o.noVideoMode&&new RegExp(/<video|<audio|<embed|<iframe/,"g").test(e)&&(I.value=!0,j.value="音视频折叠（点击展开）"),o.yourPostsList&&o.yourPostsList.forEach(n=>{const i=`@№${n}(?![0-9])`,C=new RegExp(i,"g");e=e.replace(C,H=>`<span class="highlight">${H}</span>`)}),o.useUrlMode){let n=function(C){return new RegExp(/.*(png|jpe?g|webp|gif)$/,"i").test(C)?C:`<a href="${C}" target="_blank">${C}</a>`};const i=new RegExp(/(https?:\/\/|www\.)[a-zA-Z_0-9\-@]+(\.\w[a-zA-Z_0-9\-:]+)+(\/[\(\)~#&\-=?\+\%/\.\w]+)?/,"gi");e=e.replace(i,n)}return e}),J=W(()=>{var e;return o.antiJingfen?`№${o.postData.floor} ${o.postData.nickname} ${o.postData.created_at} →${(e=o.postData.created_binggan_hash)==null?void 0:e.slice(0,5)}`:`№${o.postData.floor} ${o.postData.nickname} ${o.postData.created_at}`});function V(){const e=c.userCustom.quoteMax;let t=g.value.getElementsByTagName("details");for(let H of t)H.open=!1;let n=g.value.innerText.split(`
`),i=[];n.forEach((H,ye)=>{H.indexOf("@№")>-1&&i.push(ye)}),i.length>=e&&(n=n.slice(i[i.length-e]+1,n.length));const C="<span class='quote-content'>"+n.join(`
`)+`
@`+J.value+`</span>
`;l("quoteClick",C)}const Q=$();function te(){g.value.querySelectorAll("img").forEach(t=>{t.getAttribute("class")!=="img-svg"&&t.addEventListener("click",n=>{Q.value=t,window.$message.success("要添加至自定义表情包吗？",{render:w,closable:!0})})})}const w=e=>{const{type:t}=e;return f(so,{closable:!1,type:t==="loading"?"default":t,showIcon:!1,style:{boxShadow:"var(--n-box-shadow)",maxWidth:"calc(100vw - 64px)",width:"250px"}},()=>[f("span",{innerText:e.content}),f(fe,{size:"tiny",type:"success",onClick:se},{default:()=>"确定"})])};function se(){var n;const e=m.userData.my_emoji,t=(n=Q.value)==null?void 0:n.getAttribute("src");if(e!==null&&e.includes(t))window.$message.error("已经添加过该表情包了");else{const i={binggan:m.binggan,my_emoji:t};Ze(i).then(()=>m.refreshUserData())}}le(()=>{te()});function re(){g.value.querySelectorAll(".img-svg").forEach(t=>{t.addEventListener("click",n=>{const i=t.getAttribute("src");t.setAttribute("src",""),t.setAttribute("src",t.getAttribute("origin-src")),t.setAttribute("origin-src",i)})})}le(()=>{re()});const ne=$(!1),K=$(),Y=$();function we(){const e=window.getComputedStyle(x.value),t=parseInt(e.lineHeight),n=parseInt(e.height),i=t*16;n>i&&(ne.value=!0,Y.value=i-n,K.value=i)}function ke(){ne.value=!1,Y.value=void 0,K.value=void 0}le(()=>{o.postData.floor!==0&&we()});function xe(){var e;(e=z.value)==null||e.refreshBattleDataHandle()}return r({refreshBattleData:xe}),(e,t)=>(d(),k("div",{class:"post-item",id:"f_"+e.postData.floor,floor:e.postData.floor},[E(s(he),{size:"small",style:ae({paddingRight:s(c).isMobile?"32px":"0px"})},{default:D(()=>[e.noHeadMode?_("",!0):(d(),k("div",To,[u("img",{src:s(Je)[e.randomHeadGroupIndex-1].random_heads[e.postData.random_head],class:ue("head_"+e.postData.random_head)},null,10,Oo)])),j.value!==void 0?(d(),P(s(Ge),{key:1,text:"",onClick:t[0]||(t[0]=n=>I.value=!I.value)},{default:D(()=>[ge(Z(j.value),1)]),_:1})):_("",!0),e.previewMode?_("",!0):(d(),k(pe,{key:2},[Fo,e.postData.is_your_post&&e.postData.is_deleted===0?(d(),P(s(G),{key:0,size:s(c).isMobile?20:24,style:{cursor:"pointer"},onClick:F},{default:D(()=>[E(s(de))]),_:1},8,["size"])):_("",!0),e.postData.is_your_post&&e.postData.is_deleted===1?(d(),P(s(G),{key:1,size:s(c).isMobile?20:24,style:{cursor:"pointer"},onClick:U},{default:D(()=>[E(s(be))]),_:1},8,["size"])):_("",!0),e.postData.is_your_post?_("",!0):(d(),P(s(G),{key:2,size:s(c).isMobile?20:24,style:{cursor:"pointer"},onClick:B},{default:D(()=>[E(s(Mo))]),_:1},8,["size"])),E(s(G),{size:s(c).isMobile?20:24,style:{cursor:"pointer"},onClick:V},{default:D(()=>[E(s(_o))]),_:1},8,["size"]),!b.value&&s(m).checkAdminForums(o.forumId)?(d(),P(s(G),{key:3,size:s(c).isMobile?20:24,style:{cursor:"pointer"},onClick:t[1]||(t[1]=n=>b.value=!0)},{default:D(()=>[E(s(Ce))]),_:1},8,["size"])):_("",!0),b.value&&s(m).checkAdminForums(o.forumId)?(d(),P(s(Ue),{key:4,trigger:"click",options:O.value,onSelect:X,show:b.value,size:s(c).isMobile?"medium":"large",onClickoutside:t[2]||(t[2]=n=>b.value=!1)},{default:D(()=>[E(s(G),{size:s(c).isMobile?20:24,style:{cursor:"pointer"}},{default:D(()=>[E(s(Ce))]),_:1},8,["size"])]),_:1},8,["options","show","size"])):_("",!0)],64))]),_:1},8,["style"]),I.value?_("",!0):(d(),k(pe,{key:0},[u("div",{class:"post-content",ref_key:"postContentContainerDom",ref:x,style:ae([A.value,{"margin-top":"12px","line-height":"28px"}])},[u("span",{innerHTML:oe.value,class:"post-span",ref_key:"postContentDom",ref:g,style:ae(h.value)},null,12,Wo)],4),e.postData.hongbao_data!==null?(d(),P(s(v),{key:0,"hongbao-data":e.postData.hongbao_data,"forum-id":e.forumId,"thread-id":e.postData.thread_id,onRefreshPostsList:t[3]||(t[3]=n=>l("refreshPostsList"))},null,8,["hongbao-data","forum-id","thread-id"])):_("",!0),e.postData.battle_id!==null?(d(),P(s(R),{key:1,"battle-id":e.postData.battle_id,ref_key:"BattleCom",ref:z},null,8,["battle-id"])):_("",!0),E(s(he),{size:[4,0],class:ue(["post-footer",{"system-post":e.postData.created_by_admin===2,"admin-post":e.postData.created_by_admin===1}]),style:{"margin-top":"12px"}},{default:D(()=>{var n;return[u("span",{depth:3,class:"post-footer-text",onClick:V,style:{cursor:"pointer"}},Z("№"+e.postData.floor),1),u("span",{class:"post-nick-name",onClick:V,style:{cursor:"pointer"}},Z(e.postData.nickname),1),u("span",Vo,Z(e.postData.created_at),1),e.antiJingfen?(d(),k("span",No," →"+Z((n=e.postData.created_binggan_hash)==null?void 0:n.slice(0,5)),1)):_("",!0),ne.value?(d(),P(s(fe),{key:1,size:"tiny",onClick:ke},{default:D(()=>[ge("展开限高")]),_:1})):_("",!0)]}),_:1},8,["class"])],64))],8,Lo))}});export{Ce as D,so as N,Jo as _};
