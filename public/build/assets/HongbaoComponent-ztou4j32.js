import{w as P,o as j,b as F,$ as G,d as A,c as y,A as u,M as _,f as a,H as t,a as o,k as h,h as i,z as s,j as b,m as K,G as w,s as m,F as O,ap as U,n as q,i as R,_ as B}from"./app-kheo8X_U.js";import{h as E,a as J,g as Q}from"./randomHeads-CJXi9sfl.js";import{_ as v}from"./FInput.vue_vue_type_script_setup_true_lang-B9zJWYt_.js";import{N as V}from"./Spin-ii7qv40I.js";import"./showDialog-ODCPLuVs.js";import"./FInputGroupLabel.vue_vue_type_script_setup_true_lang-B2CX8pL6.js";import"./InputGroup-CySdXqN4.js";import"./InputNumber-C1MWS2b0.js";import"./use-locale-C7kSl_Yf.js";import"./Input-w7XotX3_.js";import"./Add-Kheouh66.js";import"./index-Crq6HWd9.js";import"./_commonjsHelpers-BosuxZz1.js";import"./inputNumberFormat-DaYmlx6U.js";import"./Select-BNwviYZ0.js";import"./Tag-by8YA5ii.js";import"./Grid-Dvmgo34J.js";import"./ColorPicker-BHV1VC2w.js";import"./_createCompounder-CTkwRAlE.js";import"./Ellipsis-WqQDsGo2.js";import"./download-sglA049O.js";import"./emojiData-nGA-8XBz.js";import"./Tabs-CYOp69F9.js";const W={key:0},X=P({__name:"HongbaoComponent",props:{hongbaoId:{},threadId:{},forumId:{}},emits:["refreshPostsList"],setup(S,{emit:x}){const p=j(),k=F(),l=S,d=G(),I=A(()=>({1:"随机olo",2:"定额olo"})[e.value.type]),{data:e,loading:z,send:N,onSuccess:T}=y(E(l.hongbaoId),{immediate:!1});T(n=>{d.value=n.data.key_word});function D(){N({binggan:p.binggan})}p.binggan&&D();const{loading:H,send:L,onSuccess:$}=y(n=>J(n),{immediate:!1});$(()=>{C("refreshPostsList")});function f(n){if(!n.isTrusted){const M={title:"错误",closable:!1,content:"请不要用脚本抢红包喔",positiveText:"确定"};window.$dialog.warning(M);return}const{timestamp:g,newPostKey:r}=Q(n.isTrusted,l.threadId,p.binggan),c={binggan:p.binggan,forum_id:l.forumId,thread_id:l.threadId,content:"--红包口令: "+d.value,nickname:"= =",post_with_admin:!1,new_post_key:r,timestamp:g,hongbao_id:l.hongbaoId,hongbao_key_word:d.value};L(c)}const C=x;return(n,g)=>(u(),_(o(R),{size:"small",bordered:!0},{default:a(()=>[t(o(V),{show:o(z)},{default:a(()=>[t(o(h),{vertical:"",align:"center"},{default:a(()=>[t(o(h),{align:"center",size:"small"},{default:a(()=>[t(o(i),{style:{"font-size":"1rem"}},{default:a(()=>[s("口令红包")]),_:1}),b("img",{src:"/hongbao.svg",style:K({height:o(k).isMobile?"30px":"36px"})},null,4)]),_:1}),b("div",null,[o(e).key_word?(u(),_(o(i),{key:0,depth:3},{default:a(()=>[s("口令：")]),_:1})):w("",!0),t(o(i),null,{default:a(()=>[s(m(o(e).key_word),1)]),_:1})]),b("div",null,[t(o(i),{depth:3},{default:a(()=>[s("数量：")]),_:1}),t(o(i),null,{default:a(()=>[s(m(o(e).num_remains)+" /"+m(o(e).num_total)+" （"+m(I.value)+"）",1)]),_:1})]),o(e).olo_hide?w("",!0):(u(),O("div",W,[t(o(i),{depth:3},{default:a(()=>[s("总额：")]),_:1}),t(o(i),null,{default:a(()=>{var r;return[s(m((r=o(e).olo_total)==null?void 0:r.toLocaleString("en-us"))+" olo ",1)]}),_:1})])),t(o(h),{size:"small",wrap:!1},{default:a(()=>{var r;return[o(e).hongbao_user===null?(u(),_(o(v),{key:0,value:d.value,"onUpdate:value":g[0]||(g[0]=c=>d.value=c),maxlength:255,onKeyup:U(f,["enter"]),style:{"max-width":"328px"},placeholder:o(e).num_remains===0?"已经抢光啦":"请输入口令","auto-size":"",disabled:o(e).hongbao_user!==null||o(e).num_remains===0},null,8,["value","placeholder","disabled"])):(u(),_(o(v),{key:1,value:`你抢到了${(r=o(e).hongbao_user)==null?void 0:r.olo.toLocaleString("en-us")}个olo`,maxlength:255,style:{"max-width":"328px"},"auto-size":"",disabled:""},null,8,["value"])),t(o(q),{type:"primary",onClick:f,disabled:o(e).hongbao_user!==null||o(H)||o(e).num_remains===0},{default:a(()=>[s("抢！")]),_:1},8,["disabled"])]}),_:1})]),_:1})]),_:1},8,["show"])]),_:1}))}}),So=B(X,[["__scopeId","data-v-3afec89b"]]);export{So as default};