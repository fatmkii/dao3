import{w as P,o as Q,b as U,g as q,u as V,d as f,$ as W,c as w,c6 as D,t as J,A as o,M as n,f as a,H as u,a as t,i as K,k as d,F as M,C as X,Q as Y,m as R,j as Z,h as tt,z as c,s as g,G as m,n as et,_ as at}from"./app-CKeLOz7-.js";import{k,l as N,m as st}from"./randomHeads-BFSkuTfE.js";import{u as lt}from"./forums-DGdXgkYv.js";import{N as rt,_ as ot}from"./index-w-7-o8MY.js";import{N as nt}from"./ThreadPage-CMXWHCgw.js";import{N as h}from"./Tag-BLPI_0a_.js";import{b as it}from"./Ellipsis-DKv5hnV0.js";import"./showDialog-wazrIzMu.js";import"./Checkbox-CQEqMbRf.js";import"./FInput.vue_vue_type_script_setup_true_lang-DlTyJ0dN.js";import"./Input-imgOsV1O.js";import"./use-locale-ma6yKE5D.js";import"./Tabs-Blo0MwIG.js";import"./emojiData-a0Hcov0e.js";import"./_createCompounder-QXOQu3qV.js";import"./download-sglA049O.js";import"./_commonjsHelpers-BosuxZz1.js";import"./Sidebar-p70xNofK.js";import"./Pagination-BA48k7gh.js";import"./dayjs.min-BIwLhz4I.js";const ut=["src"],ct=P({__name:"Battle",props:{battleId:{}},setup($,{expose:j}){const y=Q(),C=U();lt(),q(),V();const p=$,v=[{"flex-direction":"row","justify-content":"center"},{"flex-direction":"row","justify-content":"start"},{"flex-direction":"row-reverse","justify-content":"end"}],F=f(()=>{const e=k[l.value.battle.chara_group];if(l.value.battle.chara_group===0){const r=y.userData.my_battle_chara.filter(s=>!s.not_use).map((s,b)=>({value:b+240,label:s.name}));return e.concat(r)}else return e}),x=f(()=>l.value.battle.is_your_battle||l.value.battle.you_are_challenger),I=f(()=>{const e=l.value.battle;if(!x.value)return"";const r=e.result===1&&e.is_your_battle===!0||e.result===2&&e.you_are_challenger===!0||e.result===3,s=C.isDouble11?1.98:1.96,b=Math.floor(r?e.battle_olo*s:e.battle_olo).toLocaleString("en-us");return`你${r?"赢得":"输掉"}了${b}个奥利奥`}),i=W(8),{data:l,loading:z,onSuccess:G}=w(N(p.battleId));G(e=>{e.data.battle.progress===0&&D(`battleDataGetter-${e.data.battle.id}`),e.data.battle.chara_group>0&&(i.value=k[e.data.battle.chara_group-1][0].value)});const{fetch:T,fetching:B,onSuccess:H}=J();function _(){T(N(p.battleId))}H(e=>{e.data.battle.progress===0&&D(`battleDataGetter-${e.data.battle.id}`)}),j({refreshBattleDataHandle:_});const{loading:S,onSuccess:L,onError:O,send:A}=w(e=>st(e),{immediate:!1});L(()=>{_()}),O(()=>{_()});function E(){const e={title:"加入战斗！",closable:!1,content:`将押注：${l.value.battle.battle_olo.toLocaleString("en-us")}个奥利奥`,positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{const r={binggan:y.binggan,battle_id:p.battleId,chara_id:i.value>=240?i.value-240:i.value,is_custom_chara:i.value>=240};A(r)}};window.$dialog.warning(e)}return(e,r)=>(o(),n(t(d),{size:"small",vertical:""},{default:a(()=>[u(t(K),{size:"small",bordered:!0,embedded:"",class:"battle-card"},{default:a(()=>[u(t(nt),{show:t(z)||t(B)},{default:a(()=>[t(l)!==void 0?(o(),n(t(d),{key:0,vertical:"",size:"small"},{default:a(()=>[(o(!0),M(X,null,Y(t(l).battle_messages,s=>(o(),n(t(d),{align:"center",wrap:!1,style:R(v[s.message_type])},{default:a(()=>[Z("img",{class:"emoji-img",src:s.chara_url},null,8,ut),s.message_type!==0?(o(),n(t(tt),{key:0},{default:a(()=>[c(g(s.message),1)]),_:2},1024)):(o(),n(t(h),{key:1,round:""},{default:a(()=>[c(g(s.message),1)]),_:2},1024))]),_:2},1032,["style"]))),256)),u(t(d),{style:R(v[0])},{default:a(()=>[t(l).battle.progress===0?(o(),n(t(h),{key:0,round:""},{default:a(()=>[c("正在等待挑战者")]),_:1})):m("",!0),t(l).battle.progress===2&&x.value?(o(),n(t(h),{key:1,round:""},{default:a(()=>[c(g(I.value),1)]),_:1})):m("",!0)]),_:1},8,["style"]),t(l).battle.progress===0&&t(l).battle.is_your_battle===!1?(o(),n(t(d),{key:0,size:"small",wrap:!1,align:"center",justify:"center",style:{"margin-top":"6px"}},{default:a(()=>[u(t(rt),{style:{"max-width":"15.2rem"}},{default:a(()=>[u(t(ot),{style:{width:"3.2rem"}},{default:a(()=>[c("角色")]),_:1}),u(t(it),{value:i.value,"onUpdate:value":r[0]||(r[0]=s=>i.value=s),options:F.value},null,8,["value","options"])]),_:1}),u(t(et),{type:"primary",onClick:E,disabled:t(S),loading:t(S)},{default:a(()=>[c("挑战")]),_:1},8,["disabled","loading"])]),_:1})):m("",!0)]),_:1})):m("",!0)]),_:1},8,["show"])]),_:1})]),_:1}))}}),It=at(ct,[["__scopeId","data-v-b214d744"]]);export{It as default};
