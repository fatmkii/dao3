import{w as W,p as G,b as A,$ as h,d as J,c as k,ck as q,cl as I,A as g,M as O,f as a,H as l,a as e,i as x,h as v,z as n,F as L,G as P,k as c,o as b,ar as w,n as M,j as u,s as p,S as R}from"./app-DNiDbruX.js";import{b as B}from"./DataTable-zjxh4zXC.js";import"./Input-DPs_spKr.js";import"./use-locale-Dk0lH-2-.js";import"./Ellipsis-Da1-F3JE.js";import"./Select-DJR65rQm.js";import"./Tag-CfXSXn3u.js";import"./Pagination-COul0yIQ.js";import"./prop-DfVitj0l.js";import"./Forward-DR3bpUeV.js";import"./download-sglA049O.js";const E={key:0},K=u("img",{src:"https://ll4484.bvimg.com/21501/26529351bdd69ac9.png",style:{"max-width":"100%"}},null,-1),Q={key:0,style:{"margin-left":"auto"}},V={key:1,style:{"margin-left":"auto"}},re=W({__name:"TabLevelup",setup(X){const f=G(),y=A(),_=h(!1),d=h(!1),m={title_pingbici:{name:"标题屏蔽词",min:1e3,max:4e3,intervel:200,olo:4e3},content_pingbici:{name:"内容屏蔽词",min:1e3,max:4e3,intervel:200,olo:4e3},fjf_pingbici:{name:"FJF黑名单",min:1e3,max:4e3,intervel:200,olo:4e3},my_emoji:{name:"我的表情包",min:5e3,max:3e4,intervel:1e3,olo:2e4},my_battle_chara:{name:"大乱斗角色",min:0,max:3,intervel:1,olo:5e4}},S=[{title:"项目",key:"name",resizable:!0},{title:"目前容量",key:"value",resizable:!0},{title:"操作",key:"controller",render:C,resizable:!0}],z=J(()=>[{name:"标题屏蔽词",value:r.value.title_pingbici,mode:"title_pingbici"},{name:"内容屏蔽词",value:r.value.content_pingbici,mode:"content_pingbici"},{name:"FJF黑名单",value:r.value.fjf_pingbici,mode:"fjf_pingbici"},{name:"我的表情包",value:r.value.my_emoji,mode:"my_emoji"},{name:"大乱斗角色",value:r.value.my_battle_chara,mode:"my_battle_chara"}]);function C(s){return R(b,{onClick:()=>F(s.mode),size:"tiny",type:"success",innerHTML:"升级"})}const $={title_pingbici:0,content_pingbici:0,fjf_pingbici:0,my_emoji:0,my_battle_chara:0},{loading:D,data:r,send:U}=k(s=>q(s),{immediate:!1,initialData:$});f.binggan!==null&&U({binggan:f.binggan});const i=h("title_pingbici");function F(s){i.value=s,d.value=!0}const{loading:j,send:N,onSuccess:T}=k(s=>I(s),{immediate:!1});T(()=>{f.refreshUserData(),U({binggan:f.binggan}),d.value=!1});function H(s){const t={binggan:f.binggan,mode:s};N(t)}return(s,t)=>(g(),O(e(c),{vertical:""},{default:a(()=>[l(e(x),{title:"升级饼干",size:"small"},{"header-extra":a(()=>[l(e(v),{depth:3},{default:a(()=>[n(" 说明：可支付olo升级饼干，"),e(y).isMobile?(g(),L("br",E)):P("",!0),n("增加屏蔽词、表情包等的容量。 ")]),_:1})]),default:a(()=>[l(e(B),{columns:S,data:z.value,bordered:!1,loading:e(D)},null,8,["data","loading"])]),_:1}),l(e(c),{size:"small"},{default:a(()=>[l(e(b),{onClick:t[0]||(t[0]=o=>_.value=!0)},{default:a(()=>[n("查看价格表")]),_:1})]),_:1}),l(e(w),{show:_.value,"onUpdate:show":t[3]||(t[3]=o=>_.value=o),"display-directive":"if"},{default:a(()=>[l(e(x),{style:M({maxWidth:e(y).modalMaxWidth}),title:"升级饼干价目表",closable:"",onClose:t[2]||(t[2]=o=>_.value=!1),size:"small"},{action:a(()=>[l(e(c),{justify:"end"},{default:a(()=>[l(e(b),{onClick:t[1]||(t[1]=o=>_.value=!1)},{default:a(()=>[n("关闭")]),_:1})]),_:1})]),default:a(()=>[K]),_:1},8,["style"])]),_:1},8,["show"]),l(e(w),{show:d.value,"onUpdate:show":t[7]||(t[7]=o=>d.value=o),"display-directive":"if"},{default:a(()=>[l(e(x),{style:M({maxWidth:e(y).modalMaxWidth}),title:"升级饼干",closable:"",onClose:t[6]||(t[6]=o=>d.value=!1),size:"small"},{action:a(()=>[l(e(c),{justify:"end"},{default:a(()=>[l(e(b),{type:"primary",disabled:e(r)[i.value]>=m[i.value].max||e(j),loading:e(j),onClick:t[4]||(t[4]=o=>H(i.value))},{default:a(()=>[n("升级！")]),_:1},8,["disabled","loading"]),l(e(b),{onClick:t[5]||(t[5]=o=>d.value=!1)},{default:a(()=>[n("关闭")]),_:1})]),_:1})]),default:a(()=>[l(e(c),{vertical:"",size:"small"},{default:a(()=>[u("div",null,[l(e(v),{depth:3},{default:a(()=>[n("项目：")]),_:1}),u("span",null,p(m[i.value].name),1)]),u("div",null,[l(e(v),{depth:3},{default:a(()=>[n("升级容量：")]),_:1}),u("span",null," +"+p(m[i.value].intervel)+" "+p(i.value==="my_battle_chara"?"角色槽":"字符"),1)]),u("div",null,[l(e(v),{depth:3},{default:a(()=>[n("最大容量：")]),_:1}),u("span",null,p(m[i.value].max)+" "+p(i.value==="my_battle_chara"?"角色槽":"字符"),1)]),u("div",null,[l(e(v),{depth:3},{default:a(()=>[n("本次消费：")]),_:1}),l(e(v),{type:"warning"},{default:a(()=>[n(p(m[i.value].olo)+" 个olo",1)]),_:1})]),e(r)[i.value]>=m[i.value].max?(g(),L("span",Q,"嗷，这个项目已经塞满了！无法继续升级。")):(g(),L("span",V,"确定要升级这个项目吗？"))]),_:1})]),_:1},8,["style"])]),_:1},8,["show"])]),_:1}))}});export{re as default};