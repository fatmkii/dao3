import{w as g,o as k,b as N,aU as I,g as w,$ as U,d as T,q as O,A as c,M as b,f as u,H as a,a as e,h as A,z as h,G as E,ac as R,ad as W,s as M,aY as D,c as L,U as Y,x as K,m as Q,k as X}from"./app-BStV-yuR.js";import{u as Z,n as ee,s as ae}from"./showDialog-Dhokymw5.js";import{u as x}from"./forums-DPJEWvF1.js";import{r as te,i as le,b as oe,_ as ue}from"./randomHeads-BpYbJFey.js";import{s as j}from"./subtitles-DW7M559j.js";import{N as q,a as se}from"./Grid-BUEESWZB.js";import{N as V,a as P,b as re}from"./Tabs-DcvONM7_.js";import{b as v,c as S,N as ne,a as ie}from"./Switch-CRH8FpWK.js";import{N as J}from"./Select-B9C_qx_7.js";import{N as de}from"./ColorPicker-fw76NfCx.js";import{N as me}from"./Ellipsis-B5wa2nlR.js";import{N as pe}from"./Tag-CCZNyJlJ.js";import"./FInput.vue_vue_type_script_setup_true_lang-CahVe4p0.js";import"./Input-Bj8i2T-n.js";import"./use-locale-B7_UWEDL.js";import"./index-CaBt8hLI.js";import"./_commonjsHelpers-BosuxZz1.js";import"./InputGroup-DI3YYP7S.js";import"./Add-vXYQIfAu.js";import"./_createCompounder-PGW1s4Ww.js";import"./download-sglA049O.js";import"./emojiData-a0Hcov0e.js";const fe=g({__name:"TabCommon",props:{forumId:{}},setup(y,{expose:i}){const n=k(),d=N(),r=x();I(),w();const m=y,t=U({subtitle:"[闲聊]",nissinTime:1,antiJingfen:!1,randomHeadsGroup:1,canBattle:!0,titleColor:"#212529",lockedByCoin:null,isPrivate:!1,subId:10}),H=T(()=>n.checkAdminForums(m.forumId)?j:j.filter(l=>!l.includes("[公告]"))),p=T(()=>H.value.map(l=>({value:l,label:l})));O(()=>t.value.isPrivate,l=>{l&&(t.value.subtitle="[私密]")});const $=T(()=>{var o;switch((o=r.forumData(m.forumId))==null?void 0:o.is_nissin){case 0:return[{value:1,label:"本小岛不日清"}];case 1:return[{value:1,label:"本小岛固定8点日清"}];case 2:return[{value:1,label:"24小时"},{value:2,label:"48小时"},{value:3,label:"72小时"},{value:7,label:"一周"},{value:1095,label:"长期"}];default:return[]}}),G=T(()=>{var o;switch((o=r.forumData(m.forumId))==null?void 0:o.is_nissin){case 0:return!0;case 1:return!0;case 2:return!1;default:return!0}}),z=T(()=>te.map(l=>({value:l.id,label:l.name})));O(()=>r.forumsDataLoading,l=>{if(l===!1){const o=r.forumData(m.forumId);o!==void 0&&(t.value.randomHeadsGroup=o.default_heads)}},{immediate:!0});const _=U(!1),F=["#b65954","#c78878","#9b7e70","#de7562","#fca44b","#f1c727","#f6da79","#fbda97","#9fc778","#78c79f","#8ab185","#98c0d9","#8691db","#7878c7","#566b7c","#9678c7","#9f78c7","#ca95e9","#ecacc6","#a86fa2","#7e3749"],f=T(()=>{let l=0;return _.value&&(l+=500),(t.value.lockedByCoin??!1)&&(l+=500),t.value.isPrivate&&(l+=500),l}),C=T(()=>({...t.value,titleColor:_.value?t.value.titleColor:null,subId:t.value.subtitle==="[公告]"?t.value.subId:0}));return i({tabNormalInput:C}),(l,o)=>(c(),b(e(ie),{ref:"formRef",model:t.value,"label-placement":"left","label-width":"auto",size:e(d).isMobile?"small":"medium"},{default:u(()=>[a(e(se),{cols:"1 600:2","x-gap":12},{default:u(()=>[a(e(q),{style:{"max-width":"18rem"}},{default:u(()=>[a(e(V),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:u(()=>[a(e(A),{depth:"3",style:{"font-size":"0.875rem"}},{default:u(()=>[h("常规选项")]),_:1})]),_:1}),a(e(v),{label:"副标题",path:"subtitle"},{default:u(()=>[a(e(J),{value:t.value.subtitle,"onUpdate:value":o[0]||(o[0]=s=>t.value.subtitle=s),options:p.value,disabled:t.value.isPrivate,"menu-props":{style:{borderRadius:"10px"}}},null,8,["value","options","disabled"])]),_:1}),t.value.subtitle==="[公告]"?(c(),b(e(v),{key:0,label:"全岛公告",path:"subId"},{default:u(()=>[a(e(S),{value:t.value.subId,"onUpdate:value":o[1]||(o[1]=s=>t.value.subId=s),"checked-value":99,"unchecked-value":10},null,8,["value"])]),_:1})):E("",!0),a(e(v),{label:"日清时间",path:"nissinTime"},{default:u(()=>[a(e(J),{value:t.value.nissinTime,"onUpdate:value":o[2]||(o[2]=s=>t.value.nissinTime=s),options:$.value,disabled:G.value},null,8,["value","options","disabled"])]),_:1}),a(e(v),{label:"随机头像组",path:"randomHeadsGroup"},{default:u(()=>[a(e(J),{value:t.value.randomHeadsGroup,"onUpdate:value":o[3]||(o[3]=s=>t.value.randomHeadsGroup=s),options:z.value},null,8,["value","options"])]),_:1}),a(e(v),{label:"开启反精分",path:"antiJingfen"},{default:u(()=>[a(e(S),{value:t.value.antiJingfen,"onUpdate:value":o[4]||(o[4]=s=>t.value.antiJingfen=s)},null,8,["value"])]),_:1}),a(e(v),{label:"开启大乱斗",path:"canBattle"},{default:u(()=>[a(e(S),{value:t.value.canBattle,"onUpdate:value":o[5]||(o[5]=s=>t.value.canBattle=s)},null,8,["value"])]),_:1})]),_:1}),a(e(q),{style:{"max-width":"18rem"}},{default:u(()=>[a(e(V),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:u(()=>[a(e(A),{depth:"3",style:{"font-size":"0.875rem"}},{default:u(()=>[h("以下选项每个500olo ")]),_:1})]),_:1}),a(e(v),{label:"看帖权限",path:"lockedByCoin"},{default:u(()=>[a(e(ne),{value:t.value.lockedByCoin,"onUpdate:value":o[6]||(o[6]=s=>t.value.lockedByCoin=s),placeholder:"需要多少olo才能看",max:25e3,parse:e(le),format:e(oe),min:0,step:5e3,clearable:"",style:{"border-radius":"17px"}},null,8,["value","parse","format"])]),_:1}),a(e(v),{label:"私密主题",path:"isPrivate"},{default:u(()=>[a(e(S),{value:t.value.isPrivate,"onUpdate:value":o[7]||(o[7]=s=>t.value.isPrivate=s)},null,8,["value"])]),_:1}),a(e(v),{label:"标题颜色",path:"titleColor"},{default:u(()=>[a(e(S),{value:_.value,"onUpdate:value":o[8]||(o[8]=s=>_.value=s)},null,8,["value"]),R(a(e(de),{value:t.value.titleColor,"onUpdate:value":o[9]||(o[9]=s=>t.value.titleColor=s),modes:["hex"],"show-alpha":!1,swatches:F,style:{"margin-left":"12px"}},null,8,["value"]),[[W,_.value]])]),_:1}),R(a(e(v),{label:"合计花费"},{default:u(()=>[a(e(A),{depth:"3"},{default:u(()=>[h(M(f.value)+"个olo ",1)]),_:1})]),_:1},512),[[W,f.value>0]])]),_:1})]),_:1})]),_:1},8,["model","size"]))}}),ve=g({__name:"TabCrowd",props:{threadType:{default:"normal"}},emits:["threadTypeChange"],setup(y,{emit:i}){k(),N(),x(),I(),w();const n=i;return(d,r)=>(c(),b(e(D),{checked:d.threadType,"checked-value":"crowd","unchecked-value":"normal",onClick:r[0]||(r[0]=m=>n("threadTypeChange","crowd"))},{default:u(()=>[h("开启众筹 ")]),_:1},8,["checked"]))}}),ce=g({__name:"TabGamble",props:{threadType:{default:"normal"}},emits:["threadTypeChange"],setup(y,{emit:i}){k(),N(),x(),I(),w();const n=i;return(d,r)=>(c(),b(e(D),{checked:d.threadType,"checked-value":"gamble","unchecked-value":"normal",onClick:r[0]||(r[0]=m=>n("threadTypeChange","gamble"))},{default:u(()=>[h(" 开启菠菜（500奥利奥） 目前只能在海滨乐园岛开菠菜（避免被日清） ")]),_:1},8,["checked"]))}}),be=g({__name:"TabHongbao",props:{threadType:{default:"normal"}},emits:["threadTypeChange"],setup(y,{emit:i}){k(),N(),x(),I(),w();const n=i;return(d,r)=>(c(),b(e(D),{checked:d.threadType,"checked-value":"hongbao","unchecked-value":"normal",onClick:r[0]||(r[0]=m=>n("threadTypeChange","hongbao"))},{default:u(()=>[h("开启红包")]),_:1},8,["checked"]))}}),he=g({__name:"TabVote",props:{threadType:{default:"normal"}},emits:["threadTypeChange"],setup(y,{emit:i}){k(),N(),x(),I(),w();const n=i;return(d,r)=>(c(),b(e(D),{checked:d.threadType,"checked-value":"vote","unchecked-value":"normal",onClick:r[0]||(r[0]=m=>n("threadTypeChange","vote"))},{default:u(()=>[h(" 开启投票（1000奥利奥） ")]),_:1},8,["checked"]))}}),Me=g({__name:"NewThread",props:{forumId:{}},setup(y){const i=k(),n=N(),d=x();I();const r=w(),m=U();Z();const t=y,H=U(null),p=T(()=>{var l;return(l=H.value)==null?void 0:l.tabNormalInput}),{loading:$,data:G,onSuccess:z,send:_}=L(ee,{immediate:!1});function F(l,o){let s;s={binggan:i.binggan,forumId:t.forumId,title:l.titleInput,content:l.contentInput,nickname:l.nicknameInput,subtitle:p.value.subtitle,threadType:f.value,postWithAdmin:l.postWithAdmin,antiJingfen:p.value.antiJingfen,isDelay:l.isDelay,isPrivate:p.value.isPrivate,canBattle:p.value.canBattle,randomHeadsGroup:p.value.randomHeadsGroup,nissinTime:p.value.nissinTime,titleColor:p.value.titleColor,lockedByCoin:p.value.lockedByCoin,subId:p.value.subId},_(s),z(()=>{o("success"),ae({title:"已发送主题，是否跳转？",mode:"success",onPositiveClick:()=>r.push({name:"thread",params:{threadId:G.value.thread_id}})})})}const f=U("normal");function C(l){f.value=f.value===l?"normal":l}return(l,o)=>{const s=Y("router-link");return c(),b(e(X),{vertical:"",style:{"margin-top":"8px"}},{default:u(()=>[a(ue,{mode:"thread","forum-id":l.forumId,disabled:!1,handling:e($),onContentCommit:F},null,8,["forum-id","handling"]),a(e(re),{type:"line",animated:"",size:e(n).isMobile?"small":"medium",value:m.value,"onUpdate:value":o[0]||(o[0]=B=>m.value=B)},{default:u(()=>[a(e(P),{name:"常规",tab:"常规"},{default:u(()=>[a(e(fe),{"forum-id":t.forumId,ref_key:"TabCommonComponent",ref:H},null,8,["forum-id"])]),_:1}),a(e(P),{name:"红包",tab:"红包"},{default:u(()=>[a(e(be),{"thread-type":f.value,onThreadTypeChange:C},null,8,["thread-type"])]),_:1}),a(e(P),{name:"投票",tab:"投票"},{default:u(()=>[a(e(he),{"thread-type":f.value,onThreadTypeChange:C},null,8,["thread-type"])]),_:1}),a(e(P),{name:"菠菜",tab:"菠菜"},{default:u(()=>[a(e(ce),{"thread-type":f.value,onThreadTypeChange:C},null,8,["thread-type"])]),_:1}),e(i).checkAdminForums(t.forumId)?(c(),b(e(P),{key:0,name:"众筹",tab:"众筹"},{default:u(()=>[a(e(ve),{"thread-type":f.value,onThreadTypeChange:C},null,8,["thread-type"])]),_:1})):E("",!0)]),_:1},8,["size","value"]),(c(),b(K,{to:"#topbar-nav"},[a(s,{to:{name:"forum",params:{forumId:t.forumId}},class:"flex-item-center"},{default:u(()=>[a(e(me),{style:Q({maxWidth:e(n).isMobile?"120px":"900px"}),tooltip:!1},{default:u(()=>{var B;return[h(M((B=e(d).forumData(l.forumId))==null?void 0:B.name),1)]}),_:1},8,["style"]),a(e(pe),{round:"",class:"forum-tag",size:e(n).isMobile?"small":"medium"},{default:u(()=>[h(M(l.forumId),1)]),_:1},8,["size"])]),_:1},8,["to"])]))]),_:1})}}});export{Me as default};