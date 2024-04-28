import{w as A,l as O,a as e,o as P,b as Q,as as B,g as E,u as J,$ as b,q as K,e as W,d as h,c as N,c8 as X,c9 as Z,A as n,M as p,f as a,H as l,n as T,z as o,i as w,k as m,s as c,v as ee,G as k,F as _,C as I,Q as te,j as z,h as r,ca as C,S as ae,_ as le}from"./app-DJ79Uvu2.js";import{u as se}from"./forums-BTqggR83.js";import{d as D}from"./dayjs.min-BIwLhz4I.js";import{N as ie}from"./DatePicker-DZkUrTQr.js";import{b as oe}from"./DataTable-DS1Wq8dW.js";import{N as ne}from"./Pagination-BeBNnr8T.js";import{a as re}from"./Select-BMwDOE-A.js";import"./_commonjsHelpers-BosuxZz1.js";import"./use-locale-DTAsc9kE.js";import"./Forward-DgQ-Smbj.js";import"./Input-CTB-VS1k.js";import"./Ellipsis-hMed8DtT.js";import"./download-sglA049O.js";import"./prop-DfVitj0l.js";import"./Tag-pwYhadDQ.js";const ue={class:"income-item"},de={style:{"margin-left":"auto"}},me={key:0,style:{"margin-top":"6px"}},g=30,ce=A({__name:"TabIncome",setup(fe){O(t=>({bac3eccc:e($).dividerColor})),P();const y=Q();se(),B(),E();const $=J(),u=b(D().format("YYYY-MM-DD"));K(u,()=>f("day")),W(()=>f("day"));const j=b({pageSize:g}),F=[{title:"时间",key:"created_at",resizable:!0},{title:"收支",key:"olo",resizable:!0},{title:"内容",key:"content",resizable:!0},{title:"主题",key:"thread",render:q,ellipsis:!0,resizable:!0}],L=h(()=>Y.value?[{label:"加载中...",key:"loading"}]:[{label:"当月统计："+M.value.sum_month,key:"monthSum"},{label:"全年统计："+M.value.sum_year,key:"yearSum"}]);function G(t){return D().isBefore(t)}const v=b(1),S=h(()=>(v.value-1)*g),{loading:H,data:d,send:R}=N(t=>X(t),{immediate:!1,initialData:[]}),{loading:Y,data:M,send:U}=N(t=>Z(t),{immediate:!1,initialData:{sum_year:0,sum_month:0}}),V=h(()=>d.value.map(t=>t.olo).reduce((t,s)=>t+s,0));function f(t){if(u.value===null)window.$message.error("需要选择日期");else{const s={income_date:u.value};t==="day"&&R(s),t==="sum"&&U(s)}}function x(t){return{name:"thread",params:{threadId:t.thread_id,page:t.floor===null?1:Math.ceil((t.floor+1)/200)},hash:t.floor===null?void 0:"#f_"+t.floor}}function q(t,s){return t.thread_id!==null?ae(C,{to:x(t),target:"_blank",innerHTML:t.thread_title}):""}return(t,s)=>(n(),p(e(m),{size:"small"},{default:a(()=>[l(e(ie),{"formatted-value":u.value,"onUpdate:formattedValue":s[0]||(s[0]=i=>u.value=i),"value-format":"yyyy-MM-dd",type:"date",size:e(y).isMobile?"small":"medium","is-date-disabled":G},null,8,["formatted-value","size"]),l(e(T),{type:"primary",onClick:s[1]||(s[1]=i=>f("day"))},{default:a(()=>[o(" 查询 ")]),_:1}),l(e(w),{title:"收支记录",size:"small"},{"header-extra":a(()=>[l(e(m),{size:"small",align:"center"},{default:a(()=>[o(" 当日小计："+c(V.value)+" ",1),l(e(ee),{trigger:"click",placement:"bottom-end",options:L.value},{default:a(()=>[l(e(T),{size:"small",onClick:s[2]||(s[2]=i=>f("sum"))},{default:a(()=>[o("月年总计")]),_:1})]),_:1},8,["options"])]),_:1})]),default:a(()=>[e(y).isMobile?k("",!0):(n(),p(e(oe),{key:0,columns:F,data:e(d),pagination:j.value,bordered:!1,loading:e(H)},null,8,["data","pagination","loading"])),e(y).isMobile?(n(),_(I,{key:1},[e(d).length>0?(n(),p(e(m),{key:0,vertical:"",align:"start",size:"small"},{default:a(()=>[(n(!0),_(I,null,te(e(d).slice(S.value,S.value+g),i=>(n(),_("div",ue,[l(e(m),null,{default:a(()=>[z("div",null,[l(e(r),{depth:3},{default:a(()=>[o("时间：")]),_:1}),l(e(r),null,{default:a(()=>[o(c(i.created_at),1)]),_:2},1024)]),z("div",de,[l(e(r),{depth:3},{default:a(()=>[o("收支：")]),_:1}),l(e(r),null,{default:a(()=>[o(c(i.olo),1)]),_:2},1024)])]),_:2},1024),l(e(m),{style:{"margin-top":"6px"}},{default:a(()=>[z("div",null,[l(e(r),{depth:3},{default:a(()=>[o("内容：")]),_:1}),l(e(r),null,{default:a(()=>[o(c(i.content),1)]),_:2},1024)])]),_:2},1024),i.thread_id!==null?(n(),_("div",me,[l(e(r),{depth:3},{default:a(()=>[o("主题：")]),_:1}),l(e(C),{to:x(i)},{default:a(()=>[o(c(i.thread_title),1)]),_:2},1032,["to"])])):k("",!0)]))),256)),l(e(ne),{page:v.value,"onUpdate:page":s[3]||(s[3]=i=>v.value=i),"item-count":e(d).length,"page-size":g,size:"small",style:{"margin-left":"auto"}},null,8,["page","item-count"])]),_:1})):(n(),p(e(re),{key:1}))],64)):k("",!0)]),_:1})]),_:1}))}}),Ce=le(ce,[["__scopeId","data-v-456e121a"]]);export{Ce as default};