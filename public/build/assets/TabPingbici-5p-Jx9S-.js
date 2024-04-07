import{cV as ee,aV as te,w as J,L as q,a7 as N,at as ae,d as P,al as ne,cW as ie,bu as K,a9 as se,c5 as le,S as I,cX as re,aW as oe,ak as ue,bY as ce,c0 as de,Y,bb as pe,$ as F,a4 as ge,a3 as me,a8 as fe,aJ as ve,ay as be,ah as he,bd as U,o as ye,b as Ce,q as Se,c as xe,cY as _e,A as Te,M as ze,f as s,H as u,a,i as k,n as A,z as w,h as L,k as G,bh as W,j as O}from"./app-Cahd4heJ.js";import{t as Re,N as we,c as Ie}from"./Tag-B6lunYxN.js";import{u as Fe}from"./use-locale-CdocJC-f.js";import{s as De}from"./prop-DfVitj0l.js";import{N as je}from"./Input-aAiFs8iv.js";import{A as Be}from"./Add-CAja_MaD.js";import{N as E}from"./Switch-BN8AzDPG.js";const Ve=()=>ee,Oe={name:"Space",self:Ve},Q=Oe;let M;const $e=()=>{if(!te)return!0;if(M===void 0){const e=document.createElement("div");e.style.display="flex",e.style.flexDirection="column",e.style.rowGap="1px",e.appendChild(document.createElement("div")),e.appendChild(document.createElement("div")),document.body.appendChild(e);const n=e.scrollHeight===1;return document.body.removeChild(e),M=n}return M},Pe=Object.assign(Object.assign({},N.props),{align:String,justify:{type:String,default:"start"},inline:Boolean,vertical:Boolean,reverse:Boolean,size:{type:[String,Number,Array],default:"medium"},wrapItem:{type:Boolean,default:!0},itemClass:String,itemStyle:[String,Object],wrap:{type:Boolean,default:!0},internalUseGap:{type:Boolean,default:void 0}}),Ae=J({name:"Space",props:Pe,setup(e){const{mergedClsPrefixRef:n,mergedRtlRef:g}=q(e),l=N("Space","-space",void 0,Q,e,n),r=ae("Space",g,n);return{useGap:$e(),rtlEnabled:r,mergedClsPrefix:n,margin:P(()=>{const{size:i}=e;if(Array.isArray(i))return{horizontal:i[0],vertical:i[1]};if(typeof i=="number")return{horizontal:i,vertical:i};const{self:{[ne("gap",i)]:b}}=l.value,{row:p,col:h}=ie(b);return{horizontal:K(h),vertical:K(p)}})}},render(){const{vertical:e,reverse:n,align:g,inline:l,justify:r,itemClass:i,itemStyle:b,margin:p,wrap:h,mergedClsPrefix:S,rtlEnabled:d,useGap:t,wrapItem:o,internalUseGap:_}=this,T=se(le(this),!1);if(!T.length)return null;const j=`${p.horizontal}px`,z=`${p.horizontal/2}px`,B=`${p.vertical}px`,y=`${p.vertical/2}px`,x=T.length-1,C=r.startsWith("space-");return I("div",{role:"none",class:[`${S}-space`,d&&`${S}-space--rtl`],style:{display:l?"inline-flex":"flex",flexDirection:e&&!n?"column":e&&n?"column-reverse":!e&&n?"row-reverse":"row",justifyContent:["start","end"].includes(r)?"flex-"+r:r,flexWrap:!h||e?"nowrap":"wrap",marginTop:t||e?"":`-${y}`,marginBottom:t||e?"":`-${y}`,alignItems:g,gap:t?`${p.vertical}px ${p.horizontal}px`:""}},!o&&(t||_)?T:T.map((D,f)=>D.type===re?D:I("div",{role:"none",class:i,style:[b,{maxWidth:"100%"},t?"":e?{marginBottom:f!==x?B:""}:d?{marginLeft:C?r==="space-between"&&f===x?"":z:f!==x?j:"",marginRight:C?r==="space-between"&&f===0?"":z:"",paddingTop:y,paddingBottom:y}:{marginRight:C?r==="space-between"&&f===x?"":z:f!==x?j:"",marginLeft:C?r==="space-between"&&f===0?"":z:"",paddingTop:y,paddingBottom:y}]},D)))}}),Le=oe({name:"DynamicTags",common:ue,peers:{Input:ce,Button:de,Tag:Re,Space:Q},self(){return{inputWidth:"64px"}}}),Ne=Le,Ue=Y("dynamic-tags",[Y("input",{minWidth:"var(--n-input-width)"})]),ke=Object.assign(Object.assign(Object.assign({},N.props),Ie),{size:{type:String,default:"medium"},closable:{type:Boolean,default:!0},defaultValue:{type:Array,default:()=>[]},value:Array,inputClass:String,inputStyle:[String,Object],inputProps:Object,max:Number,tagClass:String,tagStyle:[String,Object],renderTag:Function,onCreate:{type:Function,default:e=>e},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onChange:[Function,Array]}),H=J({name:"DynamicTags",props:ke,setup(e){const{mergedClsPrefixRef:n,inlineThemeDisabled:g}=q(e),{localeRef:l}=Fe("DynamicTags"),r=pe(e),{mergedDisabledRef:i}=r,b=F(""),p=F(!1),h=F(!0),S=F(null),d=N("DynamicTags","-dynamic-tags",Ue,Ne,e,n),t=F(e.defaultValue),o=ge(e,"value"),_=me(o,t),T=P(()=>l.value.add),j=P(()=>De(e.size)),z=P(()=>i.value||!!e.max&&_.value.length>=e.max);function B(c){const{onChange:m,"onUpdate:value":v,onUpdateValue:V}=e,{nTriggerFormInput:X,nTriggerFormChange:Z}=r;m&&U(m,c),V&&U(V,c),v&&U(v,c),t.value=c,X(),Z()}function y(c){const m=_.value.slice(0);m.splice(c,1),B(m)}function x(c){switch(c.key){case"Enter":C()}}function C(c){const m=c??b.value;if(m){const v=_.value.slice(0);v.push(e.onCreate(m)),B(v)}p.value=!1,h.value=!0,b.value=""}function D(){C()}function f(){p.value=!0,he(()=>{var c;(c=S.value)===null||c===void 0||c.focus(),h.value=!1})}const $=P(()=>{const{self:{inputWidth:c}}=d.value;return{"--n-input-width":c}}),R=g?fe("dynamic-tags",void 0,$,e):void 0;return{mergedClsPrefix:n,inputInstRef:S,localizedAdd:T,inputSize:j,inputValue:b,showInput:p,inputForceFocused:h,mergedValue:_,mergedDisabled:i,triggerDisabled:z,handleInputKeyDown:x,handleAddClick:f,handleInputBlur:D,handleCloseClick:y,handleInputConfirm:C,mergedTheme:d,cssVars:g?void 0:$,themeClass:R==null?void 0:R.themeClass,onRender:R==null?void 0:R.onRender}},render(){const{mergedTheme:e,cssVars:n,mergedClsPrefix:g,onRender:l,renderTag:r}=this;return l==null||l(),I(Ae,{class:[`${g}-dynamic-tags`,this.themeClass],size:"small",style:n,theme:e.peers.Space,themeOverrides:e.peerOverrides.Space,itemStyle:"display: flex;"},{default:()=>{const{mergedTheme:i,tagClass:b,tagStyle:p,type:h,round:S,size:d,color:t,closable:o,mergedDisabled:_,showInput:T,inputValue:j,inputClass:z,inputStyle:B,inputSize:y,inputForceFocused:x,triggerDisabled:C,handleInputKeyDown:D,handleInputBlur:f,handleAddClick:$,handleCloseClick:R,handleInputConfirm:c,$slots:m}=this;return this.mergedValue.map((v,V)=>r?r(v,V):I(we,{key:V,theme:i.peers.Tag,themeOverrides:i.peerOverrides.Tag,class:b,style:p,type:h,round:S,size:d,color:t,closable:o,disabled:_,onClose:()=>{R(V)}},{default:()=>typeof v=="string"?v:v.label})).concat(T?m.input?m.input({submit:c,deactivate:f}):I(je,Object.assign({placeholder:"",size:y,style:B,class:z,autosize:!0},this.inputProps,{ref:"inputInstRef",value:j,onUpdateValue:v=>{this.inputValue=v},theme:i.peers.Input,themeOverrides:i.peerOverrides.Input,onKeydown:D,onBlur:f,internalForceFocus:x})):m.trigger?m.trigger({activate:$,disabled:C}):I(ve,{dashed:!0,disabled:C,theme:i.peers.Button,themeOverrides:i.peerOverrides.Button,size:y,onClick:$},{icon:()=>I(be,{clsPrefix:g},{default:()=>I(Be,null)})}))}})}}),Ge=O("span",null,"这个保存在本地，不用点提交",-1),We=O("span",null,"这个保存在本地，不用点提交",-1),Ee=O("span",null,"关闭屏蔽词功能，可以提升一点性能",-1),Xe=J({__name:"TabPingbici",setup(e){const n=ye(),g=Ce();F(null);const l=F({content_pingbici:[],title_pingbici:[],fjf_pingbici:[]}),r=F(n.userData.binggan.use_pingbici);n.userLoginStatus===!0&&(l.value=n.userData.pingbici,r.value=n.userData.binggan.use_pingbici),Se(()=>n.userDataLoading,d=>{d===!1&&(l.value=n.userData.pingbici,r.value=n.userData.binggan.use_pingbici)});function i(d){l.value[d]=l.value[d].filter((t,o)=>l.value[d].indexOf(t)===o)}function b(){const d={binggan:n.binggan,use_pingbici:r.value,...l.value};h(d)}const{loading:p,send:h,onSuccess:S}=xe(d=>_e(d),{immediate:!1,initialData:[]});return S(()=>n.refreshUserData()),(d,t)=>(Te(),ze(a(G),{vertical:""},{default:s(()=>[u(a(k),{title:"标题屏蔽词",size:"small"},{"header-extra":s(()=>[u(a(A),{onClick:t[1]||(t[1]=o=>i("title_pingbici"))},{default:s(()=>[w("去重")]),_:1})]),default:s(()=>[u(a(H),{value:l.value.title_pingbici,"onUpdate:value":t[0]||(t[0]=o=>l.value.title_pingbici=o)},null,8,["value"])]),_:1}),u(a(k),{title:"内容屏蔽词",size:"small"},{"header-extra":s(()=>[u(a(A),{onClick:t[3]||(t[3]=o=>i("content_pingbici"))},{default:s(()=>[w("去重")]),_:1})]),default:s(()=>[u(a(H),{value:l.value.content_pingbici,"onUpdate:value":t[2]||(t[2]=o=>l.value.content_pingbici=o)},null,8,["value"])]),_:1}),u(a(k),{title:"FJF小尾巴和固马屏蔽词",size:"small"},{"header-extra":s(()=>[u(a(A),{onClick:t[5]||(t[5]=o=>i("fjf_pingbici"))},{default:s(()=>[w("去重")]),_:1})]),default:s(()=>[u(a(H),{value:l.value.fjf_pingbici,"onUpdate:value":t[4]||(t[4]=o=>l.value.fjf_pingbici=o)},null,8,["value"]),u(a(L),{depth:3,style:{"font-size":"0.875rem"}},{default:s(()=>[w("注意：同一个饼干在不同FJF主题中，小尾巴会改变")]),_:1})]),_:1}),u(a(G),{align:"center",justify:"start"},{default:s(()=>[u(a(W),{trigger:"hover"},{trigger:s(()=>[O("div",null,[u(a(E),{value:a(g).userCustom.hidePingbiciFloor,"onUpdate:value":t[6]||(t[6]=o=>a(g).userCustom.hidePingbiciFloor=o)},null,8,["value"]),u(a(L),{style:{"margin-left":"6px"}},{default:s(()=>[w("完全隐藏楼层 ")]),_:1})])]),default:s(()=>[Ge]),_:1}),u(a(W),{trigger:"hover"},{trigger:s(()=>[O("div",null,[u(a(E),{value:a(g).userCustom.pingbiciIngnoreCase,"onUpdate:value":t[7]||(t[7]=o=>a(g).userCustom.pingbiciIngnoreCase=o)},null,8,["value"]),u(a(L),{style:{"margin-left":"6px"}},{default:s(()=>[w("忽略大小写 ")]),_:1})])]),default:s(()=>[We]),_:1})]),_:1}),u(a(G),{align:"center",justify:"end"},{default:s(()=>[u(a(W),{trigger:"hover"},{trigger:s(()=>[O("div",null,[u(a(E),{value:r.value,"onUpdate:value":t[8]||(t[8]=o=>r.value=o)},null,8,["value"]),u(a(L),{style:{"margin-left":"6px"}},{default:s(()=>[w("启用 ")]),_:1})])]),default:s(()=>[Ee]),_:1}),u(a(A),{type:"primary",onClick:b,loading:a(p),disabled:a(p)},{default:s(()=>[w("提交")]),_:1},8,["loading","disabled"])]),_:1})]),_:1}))}});export{Xe as default};
