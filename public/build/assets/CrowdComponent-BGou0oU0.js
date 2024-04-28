import{w as H,A as i,F as f,j as d,o as P,b6 as x,l as B,a as e,b as E,u as J,$ as K,d as m,au as Q,c as z,M as b,f as a,H as r,k as C,N as W,s as p,G as c,h as k,z as w,n as I,v as X,i as Z,_ as ee}from"./app-Dui3NARO.js";import{d as _}from"./dayjs.min-BIwLhz4I.js";import{R as te}from"./CloseCircleOutline-kPlIoCtL.js";import{N as oe}from"./Spin-qjXg3HfH.js";import{N as ae}from"./randomHeads-BxNYUALu.js";import{N as se}from"./InputNumber-hjvFW107.js";import{b as re}from"./DataTable-DRzIgKWe.js";import"./_commonjsHelpers-BosuxZz1.js";import"./showDialog-F5g0WIbi.js";import"./FInput.vue_vue_type_script_setup_true_lang-CTooQX49.js";import"./Input-SBYsR2-r.js";import"./use-locale-D3TySvMf.js";import"./FInputGroupLabel.vue_vue_type_script_setup_true_lang-CCr3cE7p.js";import"./InputGroup-D7vQv3Vs.js";import"./index-Crq6HWd9.js";import"./inputNumberFormat-DaYmlx6U.js";import"./Select-F22CaxaN.js";import"./Tag-Bnj7EvYF.js";import"./Grid-DgRUB-Br.js";import"./ColorPicker-B8AQlm68.js";import"./Add-BJlhNwmr.js";import"./_createCompounder-D9lqDjqT.js";import"./Ellipsis-BwhXkXmp.js";import"./download-sglA049O.js";import"./emojiData-nGA-8XBz.js";import"./Tabs-BahyxO83.js";import"./Pagination-fsKk01Ni.js";import"./prop-DfVitj0l.js";import"./Forward-yN5SZMU4.js";const ne={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",viewBox:"0 0 576 512"},le=d("path",{d:"M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 35.7 22.5 72.4 61.9 100.7c31.5 22.7 69.8 37.1 110 41.7C203.3 338.5 240 360 240 360v72h-48c-35.3 0-64 20.7-64 56v12c0 6.6 5.4 12 12 12h296c6.6 0 12-5.4 12-12v-12c0-35.3-28.7-56-64-56h-48v-72s36.7-21.5 68.1-73.6c40.3-4.6 78.6-19 110-41.7c39.3-28.3 61.9-65 61.9-100.7V88c0-13.3-10.7-24-24-24zM99.3 192.8C74.9 175.2 64 155.6 64 144v-16h64.2c1 32.6 5.8 61.2 12.8 86.2c-15.1-5.2-29.2-12.4-41.7-21.4zM512 144c0 16.1-17.7 36.1-35.3 48.8c-12.5 9-26.7 16.2-41.8 21.4c7-25 11.8-53.6 12.8-86.2H512v16z",fill:"currentColor"},null,-1),ie=[le],de=H({name:"Trophy",render:function(s,u){return i(),f("svg",ne,ie)}}),ce=P(),ue=n=>{const s=x.Get("api/crowds/"+n,{name:"crowdDataGetter-"+n,params:{binggan:ce.binggan},localCache:null,hitSource:[]});return s.meta={shouldRemind:!1},s},me=n=>{const s=x.Post("api/crowds/",n,{name:"userCrowdPoster",params:{},localCache:null,hitSource:[]});return s.meta={shouldRemind:!0},s},pe=n=>{const s=x.Post("api/crowds/repeal",n,{name:"adminCrowdRepealPoster",params:{},localCache:null,hitSource:[]});return s.meta={shouldRemind:!0},s},ve={style:{"text-align":"center"}},we={key:0},_e={key:1},fe={key:2},ge={key:3},he=H({__name:"CrowdComponent",props:{crowdId:{},forumId:{}},setup(n){B(t=>({"2bf3f56e":e(T).dividerColor}));const s=n,u=P(),R=E(),T=J(),v=K(1e3),M=m(()=>{const t=_(o.value.end_date),l=_(),h=t.diff(l,"hour");return h>=1?`${h}小时后`:`${t.diff(l,"minute")}分钟后`}),A=m(()=>_(o.value.end_date).format("YY年M月D日 HH:mm")),g=m(()=>_().isAfter(_(o.value.end_date))),G=[{label:"中止",key:"repeal",icon:Q(te,{size:"1.5rem"})}];function F(t){switch(t){case"repeal":q();break}}const O=[{title:"我支持的olo",key:"olo",resizable:!0},{title:"参与时间",key:"created_at",resizable:!0}],{data:y,loading:j,send:L,onSuccess:be}=z(ue(s.crowdId),{immediate:!1});function S(){L({binggan:u.binggan})}u.binggan&&S();const o=m(()=>{var t;return(t=y.value)==null?void 0:t.crowd}),D=m(()=>{var t;return((t=y.value)==null?void 0:t.crowd_record)??[]}),N=m(()=>Math.round(o.value.olo_total/o.value.olo_target*100)),{loading:$,send:V,onSuccess:U}=z(t=>me(t),{immediate:!1});U(()=>{S()});function Y(){if(!v.value){window.$message.error("请输入众筹金额喔");return}const t={binggan:u.binggan,crowd_olo:v.value,crowd_id:s.crowdId},l={title:"参加众筹",closable:!1,content:`确定要参加众筹吗？将消耗${v.value}个olo`,positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{V(t)}};window.$dialog.warning(l)}function q(){const t={binggan:u.binggan,crowd_id:s.crowdId},l={title:"中止众筹",closable:!1,content:"确定要中止众筹吗？已投注的olo将会退回",positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{pe(t).then(()=>{S()})}};window.$dialog.warning(l)}return(t,l)=>(i(),b(e(Z),{size:"small",bordered:!0},{default:a(()=>[r(e(oe),{show:e(j)},{default:a(()=>[o.value!==void 0?(i(),b(e(C),{key:0,vertical:""},{default:a(()=>[r(e(C),{size:"small",align:"center",class:"crowd-title"},{default:a(()=>[r(e(W),{size:e(R).isMobile?24:32},{default:a(()=>[r(e(de))]),_:1},8,["size"]),d("span",null,p(o.value.title),1)]),_:1}),r(e(C),{vertical:"",align:"center"},{default:a(()=>[r(e(ae),{type:"dashboard",status:"success",percentage:N.value},{default:a(()=>[d("span",ve,"进度"+p(N.value)+"% ",1)]),_:1},8,["percentage"]),g.value&&o.value.is_closed===0?(i(),f("span",we,"众筹已经过期了")):c("",!0),o.value.is_closed===1?(i(),f("span",_e,"众筹已达成目标！谢谢各位参与~")):c("",!0),o.value.is_closed===2?(i(),f("span",fe,"众筹已经被管理员中止，olo已退回")):c("",!0),!g.value&&o.value.is_closed===0?(i(),f("div",ge,[r(e(k),{depth:3},{default:a(()=>[w("结束时间：")]),_:1}),d("span",null,p(A.value)+" ("+p(M.value)+")",1)])):c("",!0),d("div",null,[r(e(k),{depth:3},{default:a(()=>[w("众筹目标：")]),_:1}),d("span",null,p(`${o.value.olo_target.toLocaleString("en-us")} 个olo`),1)]),d("div",null,[r(e(k),{depth:3},{default:a(()=>[w("已众筹到：")]),_:1}),d("span",null,p(`${o.value.olo_total.toLocaleString("en-us")} 个olo`),1)]),r(e(C),{size:"small",align:"center"},{default:a(()=>[r(e(se),{max:1e6,min:1,step:1e3,placeholder:"投入额",disabled:g.value||o.value.is_closed!==0,value:v.value,"onUpdate:value":l[0]||(l[0]=h=>v.value=h)},null,8,["disabled","value"]),r(e(I),{type:"primary",onClick:Y,loading:e($),disabled:e($)||g.value||o.value.is_closed!==0},{default:a(()=>[w("投入")]),_:1},8,["loading","disabled"]),e(u).checkAdminForums(t.forumId)&&o.value.is_closed===0?(i(),b(e(X),{key:0,trigger:"hover",options:G,onSelect:F,placement:"bottom-start"},{default:a(()=>[r(e(I),{type:"warning"},{default:a(()=>[w("管理")]),_:1})]),_:1})):c("",!0)]),_:1})]),_:1}),D.value.length>0?(i(),b(e(re),{key:0,columns:O,data:D.value,bordered:!1},null,8,["data"])):c("",!0)]),_:1})):c("",!0)]),_:1},8,["show"])]),_:1}))}}),We=ee(he,[["__scopeId","data-v-e19b6aa1"]]);export{We as default};