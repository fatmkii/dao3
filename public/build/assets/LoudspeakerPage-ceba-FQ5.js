import{w as F,$ as m,e as E,b as P,h as R,A as i,M as p,p as t,H as a,n as e,t as L,z as d,ax as W,ay as h,b0 as G,aw as J,az as T,X as K,_ as X,aE as B,y as j,a9 as V,J as M,x as S,K as Y,L as Z,E as x,T as ee,O as ae,bv as te,D as le,v as w,F as se,Q as oe,I as ue,bj as ne,N as de,al as re,am as ie}from"./vendor-CYaCwXn6.js";import{n as ve}from"./admin-C0fGywkY.js";import{n as fe}from"./globalSetting-BPSfPbNU.js";import{n as pe,l as me,_ as ce,r as ge}from"./loudspeaker-BeYVDQJt.js";import{u as O,a as Q,b as U,c as A,_ as ye}from"./app-BXWHXXCx.js";import{D as _e}from"./Delete-DKLSUOmn.js";const be=x("div",null,[d(" 价格暂定为5000个olo（每天）"),x("br"),d(" 禁止发布辱骂、诅咒、黑锦鲤等方面情绪。 ")],-1),ke=F({__name:"NewLoudspeakerModal",emits:["refreshLoudspeaker"],setup(D,{expose:_,emit:b}){const k=O(),N=Q(),c=m(null),s=m({subId:"1",content:void 0,color:void 0,threadId:void 0,days:1,effectiveDate:E.tz().format("YYYY-MM-DD HH:mm:ss")}),v=m(!1),f=P(()=>({id:1,sub_id:1,content:s.value.content||"（这里是预览）",color:s.value.color||null,thread_id:null,effective_date:s.value.effectiveDate,expire_date:s.value.effectiveDate,created_at:s.value.effectiveDate,is_your_loudspeaker:!0})),I={effectiveDate:{required:!0,message:"请选择生效日期和时间"},days:{required:!0,message:"请填写生效天数",type:"number"},content:{required:!0,message:"请填写内容"},color:{required:!1},threadId:{required:!1},subId:{required:!1}},r=m(!1);function q(){r.value=!0}_({show:q});const H=b,{loading:g,send:z}=R(y=>pe(y),{immediate:!1});function C(){var y;(y=c.value)==null||y.validate(o=>{if(o)window.$message.error("请确认信息填写完整");else{const l={binggan:N.binggan,sub_id:s.value.subId,content:s.value.content,color:v?s.value.color:void 0,thread_id:s.value.threadId,effective_date:s.value.effectiveDate,days:s.value.days};z(l).then(()=>{H("refreshLoudspeaker"),r.value=!1})}})}return(y,o)=>(i(),p(e(Z),{show:r.value,"onUpdate:show":o[9]||(o[9]=l=>r.value=l),"display-directive":"if"},{default:t(()=>[a(e(Y),{style:M({maxWidth:e(k).modalMaxWidth}),title:"发布大喇叭",closable:"",onClose:o[8]||(o[8]=l=>r.value=!1),size:"small"},{action:t(()=>[a(e(L),{justify:"end"},{default:t(()=>[a(e(U),{type:"primary",disable:e(g),loading:e(g),onClick:C},{default:t(()=>[d("发布")]),_:1},8,["disable","loading"]),a(e(U),{onClick:o[7]||(o[7]=l=>r.value=!1)},{default:t(()=>[d("关闭")]),_:1})]),_:1})]),default:t(()=>[be,a(e(W),{ref_key:"formRef",ref:c,model:s.value,"label-placement":"left","label-width":"auto",rules:I,size:e(k).isMobile?"small":"medium",style:{"margin-top":"10px"}},{default:t(()=>[a(e(h),{label:"生效时间",path:"effectiveDate"},{default:t(()=>[a(e(G),{"formatted-value":s.value.effectiveDate,"onUpdate:formattedValue":o[0]||(o[0]=l=>s.value.effectiveDate=l),"value-format":"yyyy-MM-dd HH:mm:ss",type:"datetime",size:e(k).isMobile?"small":"medium"},null,8,["formatted-value","size"])]),_:1}),a(e(h),{label:"生效天数",path:"days"},{default:t(()=>[a(e(J),{value:s.value.days,"onUpdate:value":o[1]||(o[1]=l=>s.value.days=l),max:3,min:1,step:1,placeholder:"1-3天"},null,8,["value"])]),_:1}),a(e(h),{label:"内容",path:"content"},{default:t(()=>[a(e(A),{placeholder:"最多100字",type:"textarea",maxlength:"100","show-count":"",autosize:{minRows:3,maxRows:5},value:s.value.content,"onUpdate:value":o[2]||(o[2]=l=>s.value.content=l)},null,8,["value"])]),_:1}),a(e(h),{label:"设定颜色",path:"color"},{default:t(()=>[a(e(T),{value:v.value,"onUpdate:value":o[3]||(o[3]=l=>v.value=l)},null,8,["value"]),K(a(e(B),{value:s.value.color,"onUpdate:value":o[4]||(o[4]=l=>s.value.color=l),modes:["hex"],"show-alpha":!1,style:{"max-width":"7rem","margin-left":"12px"}},null,8,["value"]),[[X,v.value]])]),_:1}),a(e(h),{label:"链接主题",path:"threadId"},{default:t(()=>[a(e(A),{value:s.value.threadId,"onUpdate:value":o[5]||(o[5]=l=>s.value.threadId=l),placeholder:"主题网址的ID（可留空）"},null,8,["value"])]),_:1}),e(N).admin.isSuperAdmin?(i(),p(e(h),{key:0,label:"设为置顶",path:"subId"},{default:t(()=>[a(e(T),{"onUpdate:value":o[6]||(o[6]=l=>s.value.subId=l),"checked-value":10,"unchecked-value":"1"})]),_:1})):j("",!0)]),_:1},8,["model","size"]),(i(),p(V(f.value.thread_id?"router-link":"span"),{style:M({color:f.value.color}),to:f.value.thread_id!==null?`/thread/${f.value.thread_id}/1`:void 0},{default:t(()=>[d(S(f.value.content),1)]),_:1},8,["style","to"]))]),_:1},8,["style"])]),_:1},8,["show"]))}}),he=D=>(re("data-v-6a40bb60"),D=D(),ie(),D),we=he(()=>x("div",{style:{"margin-left":"auto"}},null,-1)),xe=F({__name:"LoudspeakerPage",setup(D){ae(l=>({a288916a:e(N).textColor1}));const _=Q(),b=O(),k=m(),N=ee();document.title="大喇叭";const c=m(),s=m(!1),v=m(1),f=m(30),I=P(()=>(v.value-1)*f.value),r={binggan:_.binggan,mode:"all"},{loading:q,data:H,send:g}=R(l=>me(l),{immediate:!1,initialData:[]});g(r);const z=P(()=>H.value.filter(l=>!(s.value&&!l.is_your_loudspeaker||c.value&&!E.tz(c.value).isSame(l.effective_date,"day")))),{data:C}=R(fe);function y(l){const n={title:"强制删除大喇叭",closable:!1,content:"要强制删除这个大喇叭吗？这是管理员功能。",positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{ve({binggan:_.binggan,loudspeaker_id:l}).then(()=>g(r))}};window.$dialog.warning(n)}function o(l){const n={title:"撤回大喇叭",closable:!1,content:"要撤回这个大喇叭吗？花费的奥利奥不会退回喔",positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{ge({binggan:_.binggan,loudspeaker_id:l}).then(()=>g(r))}};window.$dialog.warning(n)}return(l,n)=>(i(),p(e(L),{vertical:"",style:{"margin-top":"8px"}},{default:t(()=>[a(e(L),{size:"small",align:"center"},{default:t(()=>[x("img",{style:M({height:e(b).isMobile?"48px":"64px"}),src:"/ui/miku-loudspeaker.png"},null,4),a(e(te),{style:M({fontSize:e(b).isMobile?"16px":"20px"}),gradient:{from:"#7fcab9",to:"#99b1c5"}},{default:t(()=>[d(" 爱乃是盲目～🎵 ")]),_:1},8,["style"]),a(e(le),{placement:"bottom",trigger:"hover",disabled:e(C)},{trigger:t(()=>[a(e(U),{type:"primary",disabled:!e(C),onClick:n[0]||(n[0]=u=>{var $;return($=k.value)==null?void 0:$.show()}),style:{"margin-left":"auto"}},{default:t(()=>[d("发布大喇叭")]),_:1},8,["disabled"])]),default:t(()=>[a(e(w),null,{default:t(()=>[d("嗷！目前暂停发布大喇叭…… ")]),_:1})]),_:1},8,["disabled"])]),_:1}),a(e(L),{size:"small",justify:"end",align:"center"},{default:t(()=>[a(e(w),null,{default:t(()=>[d("只看自己")]),_:1}),a(e(T),{value:s.value,"onUpdate:value":n[1]||(n[1]=u=>s.value=u)},null,8,["value"]),a(e(G),{"formatted-value":c.value,"onUpdate:formattedValue":n[2]||(n[2]=u=>c.value=u),"value-format":"yyyy-MM-dd",type:"date",clearable:"",placeholder:"筛选生效日期",size:e(b).isMobile?"small":"medium"},null,8,["formatted-value","size"])]),_:1}),a(ce,{page:v.value,"onUpdate:page":[n[3]||(n[3]=u=>v.value=u),n[4]||(n[4]=u=>v.value=u)],"last-page":Math.ceil(z.value.length/f.value),style:{"margin-right":"auto"}},null,8,["page","last-page"]),z.value.length>0?(i(!0),se(ue,{key:0},oe(z.value.slice(I.value,I.value+f.value),u=>(i(),p(e(Y),{key:u.id,size:"small",bordered:!0,class:"loudspeaker-card"},{default:t(()=>[(i(),p(V(u.thread_id?"router-link":"span"),{style:M({color:u.color}),to:u.thread_id!==null?`/thread/${u.thread_id}/1`:void 0},{default:t(()=>[d(S(u.content),1)]),_:2},1032,["style","to"])),a(e(L),{size:"small"},{default:t(()=>[x("span",null,[a(e(w),{depth:3},{default:t(()=>[d("生效：")]),_:1}),a(e(w),null,{default:t(()=>[d(S(u.effective_date),1)]),_:2},1024)]),x("span",null,[a(e(w),{depth:3},{default:t(()=>[d("到期：")]),_:1}),a(e(w),null,{default:t(()=>[d(S(u.expire_date),1)]),_:2},1024)]),we,u.is_your_loudspeaker?(i(),p(e(de),{key:0,size:e(b).isMobile?20:24,style:{cursor:"pointer"},onClick:$=>o(u.id)},{default:t(()=>[a(e(_e))]),_:2},1032,["size","onClick"])):j("",!0),e(_).admin.isNormalAdmin?(i(),p(e(U),{key:1,size:"tiny",type:"warning",onClick:$=>y(u.id)},{default:t(()=>[d("强制删除")]),_:2},1032,["onClick"])):j("",!0)]),_:2},1024)]),_:2},1024))),128)):(i(),p(e(ne),{key:1})),a(ke,{ref_key:"NewLoudspeakerModalCom",ref:k,onRefreshLoudspeaker:n[5]||(n[5]=u=>e(g)(r))},null,512)]),_:1}))}}),Ce=ye(xe,[["__scopeId","data-v-6a40bb60"]]);export{Ce as default};
