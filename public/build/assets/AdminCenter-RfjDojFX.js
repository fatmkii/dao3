import{w as N,K as W,m as e,P as q,$ as y,R as ee,b as F,al as ae,g as G,A as g,M as w,o as l,E,H as n,s as x,z as f,F as z,_ as B,Q as P,J as C,p as le,x as V,t as k,aX as X,aw as J,T as L,W as Q,av as A,au as Y,at as ne,ah as te,v as K,b1 as se,b0 as oe,a8 as ue}from"./vendor-Clag2dEF.js";import{a as T,u as O,b as U,_ as Z,c as j}from"./app-I8niFFFx.js";import{s as re,g as ie,h as de,i as me,j as ge}from"./admin-CgHNMtQf.js";import{u as H}from"./forums-CQsFEEk1.js";import{i as ve,a as pe}from"./inputNumberFormat-DaYmlx6U.js";const ce={class:"banner-box-sm"},fe=["src"],be=["src","onClick"],_e=N({__name:"TabBanners",setup(I){W(i=>({"6a1c8eac":e(v).textColor1}));const d=T();O();const b=H(),v=q(),a=y(0);ee(()=>{u.value.length>0&&(a.value=u.value[0].value)});const u=F(()=>d.binggan===null||d.userData.binggan.admin_forums===void 0?[]:b.forumsData.reduce((i,o)=>(d.checkAdminForums(o.id)&&i.push({value:o.id,label:o.name,forumId:o.id}),i),[])),s=y([]);ae(a,i=>{var o,_;i===void 0?s.value=[]:s.value=[...(_=(o=b.forumData(i))==null?void 0:o.banners)!=null?_:[]]});const t=y(!1),r=y(),p=F(()=>{var i,o;return(o=(i=r.value)==null?void 0:i.split(/[\n,，]+/).filter(_=>_!=""))!=null?o:[]});function M(){t.value=!1,s.value=s.value.concat(p.value),r.value=void 0,$()}function S(i){var o;(o=s.value)==null||o.splice(i,1)}const{loading:m,send:c,onSuccess:h}=G(i=>re(i),{immediate:!1});h(()=>{b.getForumsData()});function $(){const i={binggan:d.binggan,forum_id:a.value,banners:s.value};c(i)}return(i,o)=>(g(),w(e(x),{vertical:""},{default:l(()=>[t.value?(g(),w(e(E),{key:0,title:"待追加的版头",size:"small",class:"dash-line"},{"header-extra":l(()=>[n(e(x),{size:"small"},{default:l(()=>[n(e(U),{type:"primary",onClick:M},{default:l(()=>[f("追加")]),_:1}),n(e(U),{type:"default",onClick:o[0]||(o[0]=_=>{t.value=!1,r.value=void 0})},{default:l(()=>[f("关闭")]),_:1})]),_:1})]),default:l(()=>[n(e(x),{size:"small"},{default:l(()=>[(g(!0),z(B,null,P(p.value,(_,R,D)=>(g(),z("div",ce,[C("img",{src:_,style:{width:"100%"}},null,8,fe)]))),256))]),_:1}),n(e(le),{type:"textarea",value:r.value,"onUpdate:value":o[1]||(o[1]=_=>r.value=_),placeholder:"在这里贴网址追加版头。可以一次多个，每行一个。",style:{"border-radius":"10px","margin-top":"6px"},autosize:{minRows:3,maxRows:5}},null,8,["value"])]),_:1})):V("",!0),n(e(E),{title:"版头设定",size:"small"},{"header-extra":l(()=>[n(e(x),{size:"small",align:"center",wrap:!0},{default:l(()=>[n(e(k),{depth:3},{default:l(()=>[f("选择小岛")]),_:1}),n(e(X),{value:a.value,"onUpdate:value":o[2]||(o[2]=_=>a.value=_),options:u.value,"consistent-menu-width":!1,style:{width:"100px"}},null,8,["value","options"]),t.value?V("",!0):(g(),w(e(U),{key:0,type:"primary",onClick:o[3]||(o[3]=_=>t.value=!0)},{default:l(()=>[f("追加")]),_:1}))]),_:1})]),default:l(()=>[n(e(k),{depth:3},{default:l(()=>[f("点击图片移除")]),_:1}),n(e(x),{wrap:!0,size:[4,4]},{default:l(()=>[(g(!0),z(B,null,P(s.value,(_,R)=>{var D;return g(),z("div",{key:R+((D=a.value)!=null?D:0)*1e3,class:"banner-box"},[C("img",{src:_,class:"banner-img",onClick:Ce=>S(R)},null,8,be)])}),128))]),_:1})]),_:1}),n(e(x),{align:"center",justify:"end"},{default:l(()=>[n(e(k),{depth:3,style:{"font-size":"0.875rem"}},{default:l(()=>[f("各个小岛的变更要分别提交喔")]),_:1}),n(e(U),{type:"primary",loading:e(m),disable:e(m),onClick:$},{default:l(()=>[f("提交")]),_:1},8,["loading","disable"])]),_:1})]),_:1}))}}),xe=Z(_e,[["__scopeId","data-v-35893c7d"]]),ye=N({__name:"TabGlobal",setup(I){W(t=>({a7c75f86:e(b).textColor1}));const d=T();O(),H();const b=q(),v=y(!1),a=y(!1),u=y(!1);d.admin.isSuperAdmin===!0&&ie().then(t=>{v.value=t.new_binggan,a.value=t.new_loudspeaker,u.value=!0});function s(t,r){const p={binggan:d.binggan,key:t,value:JSON.stringify(r)};de(p).then()}return(t,r)=>(g(),w(e(x),{vertical:"",size:[6,12]},{default:l(()=>[n(e(x),{size:"small"},{default:l(()=>[n(e(k),{style:{width:"6.2rem"}},{default:l(()=>[f("领取饼干开关")]),_:1}),n(e(J),{value:v.value,"onUpdate:value":r[0]||(r[0]=p=>v.value=p),disabled:!u.value,onUpdateValue:r[1]||(r[1]=p=>s("new_binggan",p))},null,8,["value","disabled"]),L(n(e(k),{depth:3},{default:l(()=>[f("读取中")]),_:1},512),[[Q,!u.value]])]),_:1}),n(e(x),{size:"small"},{default:l(()=>[n(e(k),{style:{width:"6.2rem"}},{default:l(()=>[f("大喇叭开关")]),_:1}),n(e(J),{value:a.value,"onUpdate:value":r[2]||(r[2]=p=>a.value=p),disabled:!u.value,onUpdateValue:r[3]||(r[3]=p=>s("new_loudspeaker",p))},null,8,["value","disabled"]),L(n(e(k),{depth:3},{default:l(()=>[f("读取中")]),_:1},512),[[Q,!u.value]])]),_:1})]),_:1}))}}),we=Z(ye,[["__scopeId","data-v-44dcccc7"]]),Se=N({__name:"TabMedal",setup(I){const d=T(),b=O();H(),q();const v=y(null),a=y({binggan:"",medalId:181}),u={binggan:{required:!0,message:"请填写目标饼干",trigger:"blur"},medalId:{required:!0,message:"请选择要发放的成就",type:"number",trigger:"blur"}},s=[{value:181,label:"皇家御用画宗"},{value:182,label:"小火锅守护者"}],{loading:t,send:r,onSuccess:p,onError:M}=G(m=>me(m),{immediate:!1});p(()=>{a.value.binggan=""}),M(()=>{a.value.binggan=""});function S(){var m;(m=v.value)==null||m.validate(c=>{if(c){window.$message.error("请确认信息填写完整");return}else{const h={binggan:d.binggan,binggan_target:a.value.binggan,medal_id:a.value.medalId},$=s.find(o=>o.value===a.value.medalId),i={title:"发放成就",closable:!1,content:`对象饼干：${a.value.binggan}  发放成就：${$==null?void 0:$.label}`,positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{r(h)}};window.$dialog.warning(i)}})}return(m,c)=>(g(),w(e(Y),{ref_key:"formRef",ref:v,model:a.value,"label-placement":"left","label-width":"auto",rules:u,size:e(b).isMobile?"small":"medium",style:{"max-width":"300px"}},{default:l(()=>[n(e(A),{label:"目标饼干",path:"binggan"},{default:l(()=>[n(e(j),{value:a.value.binggan,"onUpdate:value":c[0]||(c[0]=h=>a.value.binggan=h)},null,8,["value"])]),_:1}),n(e(A),{label:"发放成就",path:"medalId"},{default:l(()=>[n(e(X),{value:a.value.medalId,"onUpdate:value":c[1]||(c[1]=h=>a.value.medalId=h),options:s,"menu-props":{style:{borderRadius:"10px"}}},null,8,["value"])]),_:1}),n(e(U),{type:"primary",loading:e(t),disabled:e(t),onClick:S},{default:l(()=>[f("提交")]),_:1},8,["loading","disabled"])]),_:1},8,["model","size"]))}}),he=N({__name:"TabCoin",setup(I){const d=T(),b=O(),v=y(null),a=y({binggan:"",olo:void 0,message:""}),u={binggan:{required:!0,message:"请填写目标饼干",trigger:"blur"},message:{required:!1},olo:{required:!0,message:"请选择要奖罚的olo",type:"number",trigger:"blur"}},{loading:s,send:t,onSuccess:r,onError:p}=G(S=>ge(S),{immediate:!1});r(()=>{a.value.binggan=""}),p(()=>{a.value.binggan=""});function M(){var S;(S=v.value)==null||S.validate(m=>{if(m){window.$message.error("请确认信息填写完整");return}else{const c={binggan:d.binggan,binggan_target:a.value.binggan,olo_num:a.value.olo,olo_message:a.value.message},h=a.value.olo>0?"奖励":"罚款",$={title:"奖罚olo",closable:!1,content:`对象饼干：${a.value.binggan} ${h}${a.value.olo}个olo`,positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{t(c)}};window.$dialog.warning($)}})}return(S,m)=>(g(),w(e(Y),{ref_key:"formRef",ref:v,model:a.value,"label-placement":"left","label-width":"auto",rules:u,size:e(b).isMobile?"small":"medium",style:{"max-width":"300px"}},{default:l(()=>[n(e(A),{label:"目标饼干",path:"binggan"},{default:l(()=>[n(e(j),{value:a.value.binggan,"onUpdate:value":m[0]||(m[0]=c=>a.value.binggan=c)},null,8,["value"])]),_:1}),n(e(A),{label:"奖罚olo",path:"olo"},{default:l(()=>[n(e(ne),{value:a.value.olo,"onUpdate:value":m[1]||(m[1]=c=>a.value.olo=c),max:1e6,min:-1e6,step:1e3,parse:e(ve),format:e(pe),placeholder:"正数是奖励，负数是罚款"},null,8,["value","parse","format"])]),_:1}),n(e(A),{label:"附带留言",path:"message"},{default:l(()=>[n(e(j),{value:a.value.message,"onUpdate:value":m[2]||(m[2]=c=>a.value.message=c),placeholder:"将显示在收支记录"},null,8,["value"])]),_:1}),n(e(U),{type:"primary",loading:e(s),disabled:e(s),onClick:M},{default:l(()=>[f("提交")]),_:1},8,["loading","disabled"])]),_:1},8,["model","size"]))}}),$e=C("img",{src:"https://ll4484.bvimg.com/21501/f332ae15bee8da0e.png",style:{"max-width":"50px","max-height":"50px"}},null,-1),ke=C("span",null,"管理员中心",-1),ze=N({__name:"AdminCard",setup(I){const d=T(),b=O(),v=H(),a=F(()=>d.binggan===null||d.userData.binggan.admin_forums===void 0?[]:v.forumsData.reduce((u,s)=>(d.checkAdminForums(s.id)&&u.push({value:s.id,label:s.name,forumId:s.id}),u),[]));return(u,s)=>(g(),w(e(E),{hoverable:"",size:"small"},{default:l(()=>[n(e(x),{vertical:e(b).isMobile},{default:l(()=>[n(e(x),{size:"small",align:"center"},{default:l(()=>[$e,ke]),_:1}),C("div",null,[n(e(k),{depth:3},{default:l(()=>[f("我管理的板块")]),_:1}),n(e(x),null,{default:l(()=>[(g(!0),z(B,null,P(a.value,t=>(g(),w(e(te),null,{default:l(()=>[f(K(t.forumId)+". "+K(t.label),1)]),_:2},1024))),256))]),_:1})])]),_:1},8,["vertical"])]),_:1}))}}),Ue=C("div",{style:{height:"50px"}},null,-1),Ae=N({__name:"AdminCenter",setup(I){const d=T(),b=O(),v=y();document.title="管理员中心";const a=F(()=>{const u=[{name:"actives",tab:"管理状况",component:null},{name:"banners",tab:"版头设定",component:xe}];return d.admin.isSuperAdmin?u.concat([{name:"global",tab:"全局设置",component:we},{name:"medals",tab:"发放成就",component:Se},{name:"olo",tab:"奖罚olo",component:he}]):u});return(u,s)=>(g(),w(e(x),{vertical:"",style:{"margin-top":"8px"}},{default:l(()=>[n(e(ze)),n(e(se),{type:"line","bar-width":e(b).isMobile?0:void 0,animated:"",size:e(b).isMobile?"small":"large",value:v.value,"onUpdate:value":s[0]||(s[0]=t=>v.value=t)},{default:l(()=>[(g(!0),z(B,null,P(a.value,t=>(g(),w(e(oe),{name:t.name,tab:t.tab,key:t.name},{default:l(()=>[(g(),w(ue(t.component)))]),_:2},1032,["name","tab"]))),128))]),_:1},8,["bar-width","size","value"]),Ue]),_:1}))}});export{Ae as default};
