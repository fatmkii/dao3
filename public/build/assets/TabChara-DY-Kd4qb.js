import{w as B,o as K,b as V,$ as f,d as G,c as W,c2 as X,c3 as Y,A as v,M as ee,f as l,H as a,a as e,i as C,bz as ae,F as y,C as c,k as d,n as m,z as n,h as g,Q as H,j as i,G as z,aG as S,m as M}from"./app-DFyYlO15.js";import{c as le}from"./copyToClipboard-BvCi2fuT.js";import{_ as j}from"./FInput.vue_vue_type_script_setup_true_lang-DGwkhK1J.js";import{N as te,a as $}from"./FormItem-DSM3SNFf.js";import{a as se,N as q}from"./Grid-CBraNmYn.js";import{N as R}from"./Tabs-BCQMtEx7.js";import{N as re}from"./Switch-Dyt3_hMw.js";import{N as oe}from"./Select-QUcpjdXV.js";import{N as A}from"./Input-BplF8DeG.js";import"./Add-Cw_h8GpM.js";import"./use-locale-CVu_pZqR.js";import"./Tag-CLuwH-m3.js";const ne={key:0},ue=i("span",{style:{"margin-left":"6px"}},"暂停使用后，大乱斗时不显示选项",-1),ie=["src"],de=i("h4",null,"骰子语句：",-1),me=i("p",null,"1~10指投出1~10点时候的语句，如此类推。",-1),pe=i("h4",null,"替换词会被自动替换为相应内容：",-1),fe=i("p",null,[n("%rand_num —— 骰子数字（必须有） "),i("br"),n(" %name —— 本角色名字 "),i("br"),n(" %opponent —— 对手名字")],-1),ve=i("span",null,"将代码填入下述框就可以导入角色数据",-1),ge=i("span",null,"可以将下面代码复制下来分享给别人",-1),Se=B({__name:"TabChara",setup(he){const U=K(),h=V(),D=f(null),x=f(!1),p=f(!1),_=f(!1),w=f(),I=G(()=>JSON.stringify(r.value[u.value])),u=f(0),L=G(()=>r.value.map((o,t)=>({value:t,label:o.name}))),E=[{label:"等待",varName:"wait"},{label:"参战",varName:"against"},{label:"攻击",varName:"attack"},{label:"胜利",varName:"win"},{label:"失败",varName:"lose"}],O={name:{required:!0,message:"请输入角色名称",trigger:"blur"},...E.reduce((o,{label:t,varName:s})=>(o[`heads.${s}`]={required:!0,message:"请输入头像地址",trigger:"blur"},o),{}),...Array.from({length:10},(o,t)=>t).reduce((o,t)=>(o[`messages.${t}`]={required:!0,validator:(s,b)=>{const k=/%rand_num/;return b===null?new Error("请输入战斗语音"):k.test(b)?!0:new Error("必须包含%rand_num（上面有使用说明）")},trigger:"blur"},o),{})};function T(){if(w.value===void 0){window.$message.error("请输入角色数据");return}try{r.value[u.value]=JSON.parse(w.value)}catch{window.$message.error("输入数据的格式有误，请重新尝试");return}window.$message.success("已导入角色数据"),p.value=!1}function J(){le(I.value),window.$message.success("已复制到剪贴板")}const{loading:N,data:r,send:Q}=W(o=>X(o),{immediate:!1,initialData:[]});U.binggan!==null&&Q({binggan:U.binggan});const{loading:F,send:P}=W(o=>Y(o),{immediate:!1});function Z(){var o;(o=D.value)==null||o.validate(t=>{if(t)window.$message.error("请确认信息填写完整");else{const s={binggan:U.binggan,chara_id:u.value,...r.value[u.value]};P(s)}})}return(o,t)=>(v(),ee(e(d),{vertical:""},{default:l(()=>[a(e(C),{title:"我的角色",size:"small"},ae({default:l(()=>[!e(N)&&e(r).length>0?(v(),y(c,{key:0},[a(e(d),{size:"small",justify:"end",align:"center"},{default:l(()=>[a(e(m),{onClick:t[1]||(t[1]=s=>p.value=!0)},{default:l(()=>[n("导入角色")]),_:1}),a(e(m),{onClick:t[2]||(t[2]=s=>_.value=!0)},{default:l(()=>[n("导出角色")]),_:1})]),_:1}),a(e(te),{ref_key:"formRef",ref:D,model:e(r)[u.value],"label-placement":"left","label-width":"auto",rules:O,size:e(h).isMobile?"small":"medium"},{default:l(()=>[a(e(se),{cols:"1 1000:2","x-gap":12},{default:l(()=>[a(e(q),{style:{"max-width":"500px"}},{default:l(()=>[a(e(R),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:l(()=>[a(e(g),{depth:"3",style:{"font-size":"0.875rem"}},{default:l(()=>[n(" 角色名 ")]),_:1})]),_:1}),a(e($),{label:"角色名",path:"name"},{default:l(()=>[a(e(j),{value:e(r)[u.value].name,"onUpdate:value":t[3]||(t[3]=s=>e(r)[u.value].name=s),placeholder:"你的角色的名称"},null,8,["value"])]),_:1}),a(e($),{label:"暂停使用",path:"not_use"},{default:l(()=>[a(e(re),{value:e(r)[u.value].not_use,"onUpdate:value":t[4]||(t[4]=s=>e(r)[u.value].not_use=s)},null,8,["value"]),ue]),_:1}),a(e(R),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:l(()=>[a(e(g),{depth:"3",style:{"font-size":"0.875rem"}},{default:l(()=>[n(" 头像组 ")]),_:1})]),_:1}),(v(),y(c,null,H(E,(s,b)=>a(e($),{label:s.label,path:`heads.${s.varName}`},{default:l(()=>[a(e(j),{value:e(r)[u.value].heads[s.varName],"onUpdate:value":k=>e(r)[u.value].heads[s.varName]=k},null,8,["value","onUpdate:value"]),i("img",{src:e(r)[u.value].heads[s.varName],style:{"max-height":"34px"}},null,8,ie)]),_:2},1032,["label","path"])),64))]),_:1}),a(e(q),{style:{"max-width":"500px"}},{default:l(()=>[a(e(R),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:l(()=>[a(e(g),{depth:"3",style:{"font-size":"0.875rem",cursor:"pointer"},onClick:t[5]||(t[5]=s=>x.value=!0)},{default:l(()=>[n(" 战斗语音（使用说明？） ")]),_:1})]),_:1}),(v(),y(c,null,H(10,s=>a(e($),{label:`骰子${s*10-9}~${s*10}`,path:`messages.${s-1}`},{default:l(()=>[a(e(j),{value:e(r)[u.value].messages[s-1],"onUpdate:value":b=>e(r)[u.value].messages[s-1]=b},null,8,["value","onUpdate:value"])]),_:2},1032,["label","path"])),64))]),_:1})]),_:1})]),_:1},8,["model","size"])],64)):z("",!0)]),_:2},[!e(N)&&e(r).length>0?{name:"header-extra",fn:l(()=>[a(e(g),{depth:3,style:{"flex-shrink":"0"}},{default:l(()=>[n(" 选择要编辑的角色 ")]),_:1}),a(e(oe),{value:u.value,"onUpdate:value":t[0]||(t[0]=s=>u.value=s),options:L.value,"consistent-menu-width":!1},null,8,["value","options"])]),key:"0"}:void 0,!e(N)&&e(r).length===0?{name:"header-extra",fn:l(()=>[a(e(g),{depth:3},{default:l(()=>[n(" 你尚未拥有角色槽位，"),e(h).isMobile?(v(),y("br",ne)):z("",!0),n("请在“饼干升级”处购买 ")]),_:1})]),key:"1"}:void 0]),1024),!e(N)&&e(r).length>0?(v(),y(c,{key:0},[a(e(d),{size:"small",justify:"end",align:"center"},{default:l(()=>[a(e(g),{depth:3},{default:l(()=>[n(" 各个角色要分别点提交喔 ")]),_:1}),a(e(m),{type:"primary",loading:e(F),disabled:e(F),onClick:Z},{default:l(()=>[n("提交当前角色")]),_:1},8,["loading","disabled"])]),_:1}),a(e(S),{show:x.value,"onUpdate:show":t[7]||(t[7]=s=>x.value=s),"display-directive":"if"},{default:l(()=>[a(e(C),{style:M({maxWidth:e(h).modalMaxWidth}),closable:"",onClose:t[6]||(t[6]=s=>x.value=!1),size:"small",title:"战斗语音使用说明"},{default:l(()=>[de,me,pe,fe]),_:1},8,["style"])]),_:1},8,["show"]),a(e(S),{show:p.value,"onUpdate:show":t[11]||(t[11]=s=>p.value=s),"display-directive":"if"},{default:l(()=>[a(e(C),{style:M({maxWidth:e(h).modalMaxWidth}),closable:"",onClose:t[10]||(t[10]=s=>p.value=!1),size:"small",title:"导入角色数据"},{action:l(()=>[a(e(d),{justify:"end"},{default:l(()=>[a(e(m),{onClick:T,type:"primary"},{default:l(()=>[n("导入")]),_:1}),a(e(m),{onClick:t[9]||(t[9]=s=>p.value=!1)},{default:l(()=>[n("关闭")]),_:1})]),_:1})]),default:l(()=>[a(e(d),{vertical:""},{default:l(()=>[ve,a(e(A),{value:w.value,"onUpdate:value":t[8]||(t[8]=s=>w.value=s),type:"textarea",style:{"border-radius":"10px","margin-top":"6px"},autosize:{minRows:3,maxRows:8}},null,8,["value"])]),_:1})]),_:1},8,["style"])]),_:1},8,["show"]),a(e(S),{show:_.value,"onUpdate:show":t[14]||(t[14]=s=>_.value=s),"display-directive":"if"},{default:l(()=>[a(e(C),{style:M({maxWidth:e(h).modalMaxWidth}),closable:"",onClose:t[13]||(t[13]=s=>_.value=!1),size:"small",title:"导出角色数据"},{action:l(()=>[a(e(d),{justify:"end"},{default:l(()=>[a(e(m),{onClick:J},{default:l(()=>[n("复制")]),_:1}),a(e(m),{onClick:t[12]||(t[12]=s=>_.value=!1)},{default:l(()=>[n("关闭")]),_:1})]),_:1})]),default:l(()=>[a(e(d),{vertical:""},{default:l(()=>[ge,a(e(A),{value:I.value,type:"textarea",readonly:"",style:{"border-radius":"10px","margin-top":"6px"},autosize:{minRows:3,maxRows:8}},null,8,["value"])]),_:1})]),_:1},8,["style"])]),_:1},8,["show"])],64)):z("",!0)]),_:1}))}});export{Se as default};