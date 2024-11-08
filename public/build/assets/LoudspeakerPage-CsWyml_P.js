import{w as F,$ as v,e as E,h as P,A as m,M as g,p as t,H as a,n as e,t as N,z as d,ax as Q,ay as x,b0 as G,aw as W,az as R,X as J,_ as K,aE as X,y as T,J as S,K as V,L as B,E as z,T as Z,b as q,O as ee,bv as ae,D as te,v as h,F as le,Q as se,I as oe,bj as ne,a9 as ue,x as H,N as de,al as re,am as ie}from"./vendor-CYaCwXn6.js";import{m as fe}from"./admin-um7trF-J.js";import{n as me}from"./globalSetting-CGilNwRA.js";import{n as ve,l as pe,_ as ge,r as ce}from"./loudspeaker-D4ojXFUO.js";import{u as Y,a as O,b as U,c as A,_ as ye}from"./app-DiIsNjHy.js";import{D as be}from"./Delete-DKLSUOmn.js";const _e=z("div",null,[d(" 价格暂定为5000个olo（每天）"),z("br"),d(" 禁止发布辱骂、诅咒、黑锦鲤等方面情绪。 ")],-1),ke=F({__name:"NewLoudspeakerModal",emits:["refreshLoudspeaker"],setup(L,{expose:y,emit:b}){const _=Y(),I=O(),c=v(null),s=v({subId:"1",content:void 0,color:void 0,threadId:void 0,days:1,effectiveDate:E.tz().format("YYYY-MM-DD HH:mm:ss")}),i=v(!1),M={effectiveDate:{required:!0,message:"请选择生效日期和时间"},days:{required:!0,message:"请填写生效天数",type:"number"},content:{required:!0,message:"请填写内容"},color:{required:!1},threadId:{required:!1},subId:{required:!1}},f=v(!1);function k(){f.value=!0}y({show:k});const j=b,{loading:C,send:w}=P(p=>ve(p),{immediate:!1});function D(){var p;(p=c.value)==null||p.validate(l=>{if(l)window.$message.error("请确认信息填写完整");else{const o={binggan:I.binggan,sub_id:s.value.subId,content:s.value.content,color:i?s.value.color:void 0,thread_id:s.value.threadId,effective_date:s.value.effectiveDate,days:s.value.days};w(o).then(()=>{j("refreshLoudspeaker"),f.value=!1})}})}return(p,l)=>(m(),g(e(B),{show:f.value,"onUpdate:show":l[9]||(l[9]=o=>f.value=o),"display-directive":"if"},{default:t(()=>[a(e(V),{style:S({maxWidth:e(_).modalMaxWidth}),title:"发布大喇叭",closable:"",onClose:l[8]||(l[8]=o=>f.value=!1),size:"small"},{action:t(()=>[a(e(N),{justify:"end"},{default:t(()=>[a(e(U),{type:"primary",disable:e(C),loading:e(C),onClick:D},{default:t(()=>[d("发布")]),_:1},8,["disable","loading"]),a(e(U),{onClick:l[7]||(l[7]=o=>f.value=!1)},{default:t(()=>[d("关闭")]),_:1})]),_:1})]),default:t(()=>[_e,a(e(Q),{ref_key:"formRef",ref:c,model:s.value,"label-placement":"left","label-width":"auto",rules:M,size:e(_).isMobile?"small":"medium",style:{"margin-top":"10px"}},{default:t(()=>[a(e(x),{label:"生效时间",path:"effectiveDate"},{default:t(()=>[a(e(G),{"formatted-value":s.value.effectiveDate,"onUpdate:formattedValue":l[0]||(l[0]=o=>s.value.effectiveDate=o),"value-format":"yyyy-MM-dd HH:mm:ss",type:"datetime",size:e(_).isMobile?"small":"medium"},null,8,["formatted-value","size"])]),_:1}),a(e(x),{label:"生效天数",path:"days"},{default:t(()=>[a(e(W),{value:s.value.days,"onUpdate:value":l[1]||(l[1]=o=>s.value.days=o),max:3,min:1,step:1,placeholder:"1-3天"},null,8,["value"])]),_:1}),a(e(x),{label:"内容",path:"content"},{default:t(()=>[a(e(A),{placeholder:"最多100字",type:"textarea",maxlength:"100","show-count":"",autosize:{minRows:3,maxRows:5},value:s.value.content,"onUpdate:value":l[2]||(l[2]=o=>s.value.content=o)},null,8,["value"])]),_:1}),a(e(x),{label:"设定颜色",path:"color"},{default:t(()=>[a(e(R),{value:i.value,"onUpdate:value":l[3]||(l[3]=o=>i.value=o)},null,8,["value"]),J(a(e(X),{value:s.value.color,"onUpdate:value":l[4]||(l[4]=o=>s.value.color=o),modes:["hex"],"show-alpha":!1,style:{"max-width":"7rem","margin-left":"12px"}},null,8,["value"]),[[K,i.value]])]),_:1}),a(e(x),{label:"链接主题",path:"threadId"},{default:t(()=>[a(e(A),{value:s.value.threadId,"onUpdate:value":l[5]||(l[5]=o=>s.value.threadId=o),placeholder:"主题网址的ID（可留空）"},null,8,["value"])]),_:1}),e(I).admin.isSuperAdmin?(m(),g(e(x),{key:0,label:"设为置顶",path:"subId"},{default:t(()=>[a(e(R),{"onUpdate:value":l[6]||(l[6]=o=>s.value.subId=o),"checked-value":10,"unchecked-value":"1"})]),_:1})):T("",!0)]),_:1},8,["model","size"])]),_:1},8,["style"])]),_:1},8,["show"]))}}),we=L=>(re("data-v-6a40bb60"),L=L(),ie(),L),xe=we(()=>z("div",{style:{"margin-left":"auto"}},null,-1)),he=F({__name:"LoudspeakerPage",setup(L){ee(r=>({a288916a:e(I).textColor1}));const y=O(),b=Y(),_=v(),I=Z();document.title="大喇叭";const c=v(),s=v(!1),i=v(1),M=v(30),f=q(()=>(i.value-1)*M.value),k={binggan:y.binggan,mode:"all"},{loading:j,data:C,send:w}=P(r=>pe(r),{immediate:!1,initialData:[]});w(k);const D=q(()=>C.value.filter(r=>!(s.value&&!r.is_your_loudspeaker||c.value&&!E.tz(c.value).isSame(r.effective_date,"day")))),{data:p}=P(me);function l(r){const u={title:"强制删除大喇叭",closable:!1,content:"要强制删除这个大喇叭吗？这是管理员功能。",positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{fe({binggan:y.binggan,loudspeaker_id:r}).then(()=>w(k))}};window.$dialog.warning(u)}function o(r){const u={title:"撤回大喇叭",closable:!1,content:"要撤回这个大喇叭吗？花费的奥利奥不会退回喔",positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{ce({binggan:y.binggan,loudspeaker_id:r}).then(()=>w(k))}};window.$dialog.warning(u)}return(r,u)=>(m(),g(e(N),{vertical:"",style:{"margin-top":"8px"}},{default:t(()=>[a(e(N),{size:"small",align:"center"},{default:t(()=>[z("img",{style:S({height:e(b).isMobile?"48px":"64px"}),src:"/ui/miku-loudspeaker.png"},null,4),a(e(ae),{style:S({fontSize:e(b).isMobile?"16px":"20px"}),gradient:{from:"#7fcab9",to:"#99b1c5"}},{default:t(()=>[d(" 爱乃是盲目～🎵 ")]),_:1},8,["style"]),a(e(te),{placement:"bottom",trigger:"hover",disabled:e(p)},{trigger:t(()=>[a(e(U),{type:"primary",disabled:!e(p),onClick:u[0]||(u[0]=n=>{var $;return($=_.value)==null?void 0:$.show()}),style:{"margin-left":"auto"}},{default:t(()=>[d("发布大喇叭")]),_:1},8,["disabled"])]),default:t(()=>[a(e(h),null,{default:t(()=>[d("嗷！目前暂停发布大喇叭…… ")]),_:1})]),_:1},8,["disabled"])]),_:1}),a(e(N),{size:"small",justify:"end",align:"center"},{default:t(()=>[a(e(h),null,{default:t(()=>[d("只看自己")]),_:1}),a(e(R),{value:s.value,"onUpdate:value":u[1]||(u[1]=n=>s.value=n)},null,8,["value"]),a(e(G),{"formatted-value":c.value,"onUpdate:formattedValue":u[2]||(u[2]=n=>c.value=n),"value-format":"yyyy-MM-dd",type:"date",clearable:"",placeholder:"筛选生效日期",size:e(b).isMobile?"small":"medium"},null,8,["formatted-value","size"])]),_:1}),a(ge,{page:i.value,"onUpdate:page":[u[3]||(u[3]=n=>i.value=n),u[4]||(u[4]=n=>i.value=n)],"last-page":Math.ceil(D.value.length/M.value),style:{"margin-right":"auto"}},null,8,["page","last-page"]),D.value.length>0?(m(!0),le(oe,{key:0},se(D.value.slice(f.value,f.value+M.value),n=>(m(),g(e(V),{key:n.id,size:"small",bordered:!0,class:"loudspeaker-card"},{default:t(()=>[(m(),g(ue(n.thread_id?"router-link":"span"),{style:S({color:n.color}),to:n.thread_id!==null?`/thread/${n.thread_id}/1`:void 0},{default:t(()=>[d(H(n.content),1)]),_:2},1032,["style","to"])),a(e(N),{size:"small"},{default:t(()=>[z("span",null,[a(e(h),{depth:3},{default:t(()=>[d("生效：")]),_:1}),a(e(h),null,{default:t(()=>[d(H(n.effective_date),1)]),_:2},1024)]),z("span",null,[a(e(h),{depth:3},{default:t(()=>[d("到期：")]),_:1}),a(e(h),null,{default:t(()=>[d(H(n.expire_date),1)]),_:2},1024)]),xe,n.is_your_loudspeaker?(m(),g(e(de),{key:0,size:e(b).isMobile?20:24,style:{cursor:"pointer"},onClick:$=>o(n.id)},{default:t(()=>[a(e(be))]),_:2},1032,["size","onClick"])):T("",!0),e(y).admin.isNormalAdmin?(m(),g(e(U),{key:1,size:"tiny",type:"warning",onClick:$=>l(n.id)},{default:t(()=>[d("强制删除")]),_:2},1032,["onClick"])):T("",!0)]),_:2},1024)]),_:2},1024))),128)):(m(),g(e(ne),{key:1})),a(ke,{ref_key:"NewLoudspeakerModalCom",ref:_,onRefreshLoudspeaker:u[5]||(u[5]=n=>e(w)(k))},null,512)]),_:1}))}}),Ce=ye(he,[["__scopeId","data-v-6a40bb60"]]);export{Ce as default};
