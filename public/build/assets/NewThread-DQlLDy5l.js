var ge=Object.defineProperty,he=Object.defineProperties;var ke=Object.getOwnPropertyDescriptors;var re=Object.getOwnPropertySymbols;var we=Object.prototype.hasOwnProperty,xe=Object.prototype.propertyIsEnumerable;var de=(T,v,s)=>v in T?ge(T,v,{enumerable:!0,configurable:!0,writable:!0,value:s}):T[v]=s,G=(T,v)=>{for(var s in v||(v={}))we.call(v,s)&&de(T,s,v[s]);if(re)for(var s of re(v))xe.call(v,s)&&de(T,s,v[s]);return T},V=(T,v)=>he(T,ke(v));import{w as L,O as ce,$ as i,b as $,ao as ie,aB as X,A as C,M as N,p as l,H as a,n as e,aY as me,aZ as Q,v as M,z as d,ay as H,a_ as Z,az as R,y as Y,aw as W,W as ve,X as fe,aE as Ce,x as O,a$ as Te,ax as Ne,e as z,B as I,b0 as q,t as B,F as ee,Q as ae,a0 as le,o as j,N as J,b1 as te,b2 as ue,K,s as F,aA as pe,U as Ie,b3 as E,b4 as Ue,as as Pe,at as $e,ak as ze}from"./vendor-DK937lF0.js";import{n as De,s as He}from"./showDialog-D5pDV4eu.js";import{a as _e,u as oe,i as Me,e as U,c as A}from"./app-Am_RzsK3.js";import{u as ye}from"./forums-De22175i.js";import{_ as Be}from"./PostInput.vue_vue_type_script_setup_true_lang-BSXKWAki.js";import{r as Se}from"./PostItem.vue_vue_type_script_setup_true_lang-D6FWTOFY.js";import{s as be}from"./subtitles-DW7M559j.js";import{i as se,a as ne}from"./inputNumberFormat-DaYmlx6U.js";import"./emojiData-CmSvr5Em.js";import"./Delete-C0QqkNti.js";const Ge=L({__name:"TabCommon",props:{forumId:{}},setup(T,{expose:v}){const s=_e(),k=oe(),g=ye();Me(),ce();const m=T,o={subtitle:"[闲聊]",nissinTime:1,antiJingfen:!1,randomHeadsGroup:1,canBattle:!0,titleColor:"#212529",lockedByCoin:null,isPrivate:!1,subId:10},t=i(G({},o)),w=$(()=>s.checkAdminForums(m.forumId)?be.filter(p=>!["[私密]"].includes(p)):be.filter(p=>!["[公告]","[私密]"].includes(p))),f=$(()=>w.value.map(p=>({value:p,label:p})));ie(()=>t.value.isPrivate,p=>{p?t.value.subtitle="[私密]":t.value.subtitle="[闲聊]"});const b=$(()=>{var u;switch((u=g.forumData(m.forumId))==null?void 0:u.is_nissin){case 0:return[{value:1,label:"本小岛不日清"}];case 1:return[{value:1,label:"本小岛固定8点日清"}];case 2:return[{value:1,label:"24小时"},{value:2,label:"48小时"},{value:3,label:"72小时"},{value:7,label:"一周"},{value:1095,label:"长期"}];default:return[]}}),n=$(()=>{var u;switch((u=g.forumData(m.forumId))==null?void 0:u.is_nissin){case 0:return!0;case 1:return!0;case 2:return!1;default:return!0}}),x=$(()=>Se.map(p=>({value:p.id,label:p.name})));ie(()=>g.forumsDataLoading,p=>{if(p===!1){const u=g.forumData(m.forumId);u!==void 0&&(t.value.randomHeadsGroup=u.default_heads)}},{immediate:!0});const c=i(!1),D=["#b65954","#c78878","#9b7e70","#de7562","#fca44b","#f1c727","#f6da79","#fbda97","#9fc778","#78c79f","#8ab185","#98c0d9","#8691db","#7878c7","#566b7c","#9678c7","#9f78c7","#ca95e9","#ecacc6","#a86fa2","#7e3749"],h=$(()=>{var u;let p=0;return c.value&&(p+=500),(u=t.value.lockedByCoin)!=null&&u&&(p+=500),t.value.isPrivate&&(p+=500),p}),y=$(()=>V(G({},t.value),{titleColor:c.value?t.value.titleColor:null,subId:t.value.subtitle==="[公告]"?t.value.subId:0}));return v({tabNormalInput:y}),X(()=>{t.value=G({},o)}),(p,u)=>(C(),N(e(Ne),{ref:"formRef",model:t.value,"label-placement":"left","label-width":"auto",size:e(k).isMobile?"small":"medium"},{default:l(()=>[a(e(Te),{cols:"1 600:2","x-gap":12},{default:l(()=>[a(e(me),{style:{"max-width":"18rem"}},{default:l(()=>[a(e(Q),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:l(()=>[a(e(M),{depth:"3",style:{"font-size":"0.875rem"}},{default:l(()=>[d("常规选项")]),_:1})]),_:1}),a(e(H),{label:"副标题",path:"subtitle"},{default:l(()=>[a(e(Z),{value:t.value.subtitle,"onUpdate:value":u[0]||(u[0]=r=>t.value.subtitle=r),options:f.value,disabled:t.value.isPrivate,"menu-props":{style:{borderRadius:"10px"}}},null,8,["value","options","disabled"])]),_:1}),t.value.subtitle==="[公告]"?(C(),N(e(H),{key:0,label:"全岛公告",path:"subId"},{default:l(()=>[a(e(R),{value:t.value.subId,"onUpdate:value":u[1]||(u[1]=r=>t.value.subId=r),"checked-value":99,"unchecked-value":10},null,8,["value"])]),_:1})):Y("",!0),a(e(H),{label:"日清时间",path:"nissinTime"},{default:l(()=>[a(e(Z),{value:t.value.nissinTime,"onUpdate:value":u[2]||(u[2]=r=>t.value.nissinTime=r),options:b.value,disabled:n.value},null,8,["value","options","disabled"])]),_:1}),a(e(H),{label:"随机头像组",path:"randomHeadsGroup"},{default:l(()=>[a(e(Z),{value:t.value.randomHeadsGroup,"onUpdate:value":u[3]||(u[3]=r=>t.value.randomHeadsGroup=r),options:x.value},null,8,["value","options"])]),_:1}),a(e(H),{label:"开启反精分",path:"antiJingfen"},{default:l(()=>[a(e(R),{value:t.value.antiJingfen,"onUpdate:value":u[4]||(u[4]=r=>t.value.antiJingfen=r)},null,8,["value"])]),_:1}),a(e(H),{label:"开启大乱斗",path:"canBattle"},{default:l(()=>[a(e(R),{value:t.value.canBattle,"onUpdate:value":u[5]||(u[5]=r=>t.value.canBattle=r)},null,8,["value"])]),_:1})]),_:1}),a(e(me),{style:{"max-width":"18rem"}},{default:l(()=>[a(e(Q),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:l(()=>[a(e(M),{depth:"3",style:{"font-size":"0.875rem"}},{default:l(()=>[d("以下选项每个500olo ")]),_:1})]),_:1}),a(e(H),{label:"看帖权限",path:"lockedByCoin"},{default:l(()=>[a(e(W),{value:t.value.lockedByCoin,"onUpdate:value":u[6]||(u[6]=r=>t.value.lockedByCoin=r),placeholder:"需要多少olo才能看",max:25e3,parse:e(se),format:e(ne),min:0,step:5e3,clearable:"",style:{"border-radius":"17px"}},null,8,["value","parse","format"])]),_:1}),a(e(H),{label:"私密主题",path:"isPrivate"},{default:l(()=>[a(e(R),{value:t.value.isPrivate,"onUpdate:value":u[7]||(u[7]=r=>t.value.isPrivate=r)},null,8,["value"])]),_:1}),a(e(H),{label:"标题颜色",path:"titleColor"},{default:l(()=>[a(e(R),{value:c.value,"onUpdate:value":u[8]||(u[8]=r=>c.value=r)},null,8,["value"]),ve(a(e(Ce),{value:t.value.titleColor,"onUpdate:value":u[9]||(u[9]=r=>t.value.titleColor=r),modes:["hex"],"show-alpha":!1,swatches:D,style:{"margin-left":"12px"}},null,8,["value"]),[[fe,c.value]])]),_:1}),ve(a(e(H),{label:"合计花费"},{default:l(()=>[a(e(M),{depth:"3"},{default:l(()=>[d(O(h.value)+"个olo ",1)]),_:1})]),_:1},512),[[fe,h.value>0]])]),_:1})]),_:1})]),_:1},8,["model","size"]))}}),Ye=L({__name:"TabCrowd",setup(T,{expose:v}){const s=i(),k=i(z.tz().add(7,"day").format("YYYY-MM-DD 00:00:00")),g=i(1e6);function m(t){return z().subtract(1,"day").isAfter(t)||z().add(1,"month").isBefore(z(t))}const o=$(()=>({title:s.value,olo_target:g.value,end_time:k.value}));return v({crowdParams:o}),(t,w)=>(C(),N(e(B),{vertical:"",style:{"max-width":"450px","margin-top":"8px"}},{default:l(()=>[a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("众筹项目")]),_:1}),a(e(A),{value:s.value,"onUpdate:value":w[0]||(w[0]=f=>s.value=f),placeholder:"必填"},null,8,["value"])]),_:1}),a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("目标金额")]),_:1}),a(e(W),{value:g.value,"onUpdate:value":w[1]||(w[1]=f=>g.value=f),max:1e7,min:1e5,step:1e5,parse:e(se),format:e(ne)},null,8,["value","parse","format"])]),_:1}),a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("结束日期")]),_:1}),a(e(q),{"formatted-value":k.value,"onUpdate:formattedValue":w[2]||(w[2]=f=>k.value=f),"value-format":"yyyy-MM-dd HH:mm:ss",type:"datetime","is-date-disabled":m},null,8,["formatted-value"])]),_:1})]),_:1}))}}),Fe=K("span",null,"最长菠菜时间是1个月",-1),Ae=K("span",null,"菠菜开奖时只能开一个选项（没有多选，因为赔率不会算……）",-1),Ve=L({__name:"TabGamble",setup(T,{expose:v}){const s=i(),k=i([]),g=i(z.tz().add(7,"day").format("YYYY-MM-DD 00:00:00")),m=i(3);function o(f){f===1&&m.value<20&&(m.value+=1),f===-1&&m.value>1&&(k.value.splice(m.value-1,1),m.value-=1)}function t(f){return z().subtract(1,"day").isAfter(f)||z().add(1,"month").isBefore(z(f))}const w=$(()=>({title:s.value,options:k.value,end_time:g.value}));return v({gambleParams:w}),(f,b)=>(C(),N(e(B),{vertical:"",style:{"max-width":"450px","margin-top":"8px"}},{default:l(()=>[a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("菠菜标题")]),_:1}),a(e(A),{value:s.value,"onUpdate:value":b[0]||(b[0]=n=>s.value=n),placeholder:"必填"},null,8,["value"])]),_:1}),a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("结束日期")]),_:1}),a(e(q),{"formatted-value":g.value,"onUpdate:formattedValue":b[1]||(b[1]=n=>g.value=n),"value-format":"yyyy-MM-dd HH:mm:ss",type:"datetime","is-date-disabled":t},null,8,["formatted-value"])]),_:1}),Fe,a(e(Q),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}}),(C(!0),ee(le,null,ae(m.value,n=>(C(),N(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d(O(`选项#${n}`),1)]),_:2},1024),a(e(A),{value:k.value[n-1],"onUpdate:value":x=>k.value[n-1]=x,maxlength:255},null,8,["value","onUpdate:value"])]),_:2},1024))),256)),a(e(B),{size:"small",align:"center"},{default:l(()=>[a(e(M),{depth:3},{default:l(()=>[d("选项数量")]),_:1}),a(e(j),{size:"tiny",circle:"",disabled:m.value===20,onClick:b[2]||(b[2]=n=>o(1))},{icon:l(()=>[a(e(J),null,{default:l(()=>[a(e(te))]),_:1})]),_:1},8,["disabled"]),a(e(j),{size:"tiny",circle:"",disabled:m.value===1,onClick:b[3]||(b[3]=n=>{o(-1)})},{icon:l(()=>[a(e(J),null,{default:l(()=>[a(e(ue))]),_:1})]),_:1},8,["disabled"])]),_:1}),Ae]),_:1}))}}),Oe=L({__name:"TabHongbao",setup(T,{expose:v}){const s=oe(),k=i(2e4),g=i(10),m=i(1),o=i(),t=i([]),w=i(!1),f=i(!1),b=i(1);function n(D){D===1&&b.value<5&&(b.value+=1),D===-1&&b.value>1&&(t.value.splice(b.value-1,1),b.value-=1)}const x=[{value:1,label:"随机olo"},{value:2,label:"定额olo"}],c=$(()=>({olo:k.value,num:g.value,type:m.value,keyword:o.value,message:t.value,olo_hide:w.value,loudspeaker:f.value}));return v({hongbaoParams:c}),(D,h)=>(C(),N(e(B),{vertical:"",style:{"max-width":"450px","margin-top":"8px"}},{default:l(()=>[K("div",null,[a(e(M),{depth:3},{default:l(()=>[d("温馨提示：")]),_:1}),d("在红包总额以外，会追加扣除7%手续费。 ")]),K("div",null,[a(e(M),{depth:3},{default:l(()=>[d("总共扣除：")]),_:1}),a(e(M),{type:"warning"},{default:l(()=>[d(O(Math.ceil(k.value*(e(s).isDouble11?1.02:1.07))),1)]),_:1}),d("个奥利奥 ")]),a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("olo类型")]),_:1}),a(e(Z),{value:m.value,"onUpdate:value":h[0]||(h[0]=y=>m.value=y),options:x},null,8,["value"])]),_:1}),a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("红包个数")]),_:1}),a(e(W),{value:g.value,"onUpdate:value":h[1]||(h[1]=y=>g.value=y),max:600,min:10,step:10},null,8,["value"])]),_:1}),a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("olo总额")]),_:1}),a(e(W),{value:k.value,"onUpdate:value":h[2]||(h[2]=y=>k.value=y),max:2e6,min:2e4,step:1e4,parse:e(se),format:e(ne)},null,8,["value","parse","format"])]),_:1}),a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("红包口令")]),_:1}),a(e(A),{value:o.value,"onUpdate:value":h[3]||(h[3]=y=>o.value=y),placeholder:"必填"},null,8,["value"])]),_:1}),(C(!0),ee(le,null,ae(b.value,y=>(C(),N(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("回复留言")]),_:1}),a(e(A),{value:t.value[y-1],"onUpdate:value":p=>t.value[y-1]=p,placeholder:`#${y}（可选） 多个留言时随机抽取一个`,maxlength:255},null,8,["value","onUpdate:value","placeholder"])]),_:2},1024))),256)),a(e(B),{size:"small",align:"center"},{default:l(()=>[a(e(M),{depth:3},{default:l(()=>[d("留言数量")]),_:1}),a(e(j),{size:"tiny",circle:"",disabled:b.value===5,onClick:h[4]||(h[4]=y=>n(1))},{icon:l(()=>[a(e(J),null,{default:l(()=>[a(e(te))]),_:1})]),_:1},8,["disabled"]),a(e(j),{size:"tiny",circle:"",disabled:b.value===1,onClick:h[5]||(h[5]=y=>{n(-1)})},{icon:l(()=>[a(e(J),null,{default:l(()=>[a(e(ue))]),_:1})]),_:1},8,["disabled"])]),_:1}),a(e(B),{size:"small",align:"center",justify:"end"},{default:l(()=>[a(e(F),{checked:f.value,"onUpdate:checked":h[6]||(h[6]=y=>f.value=y),label:"附带发出大喇叭"},null,8,["checked"]),a(e(F),{checked:w.value,"onUpdate:checked":h[7]||(h[7]=y=>w.value=y),label:"隐藏olo总额"},null,8,["checked"])]),_:1})]),_:1}))}}),je=K("span",null,"最长投票时间是1个月",-1),Je=L({__name:"TabVote",setup(T,{expose:v}){const s=i(!1),k=i(1),g=i(),m=i([]),o=i(z.tz().add(7,"day").format("YYYY-MM-DD 00:00:00")),t=i(3);function w(n){n===1&&t.value<20&&(t.value+=1),n===-1&&t.value>1&&(m.value.splice(t.value-1,1),t.value-=1)}function f(n){return z().subtract(1,"day").isAfter(n)||z().add(1,"month").isBefore(z(n))}const b=$(()=>({multiple:s.value,max_choices:s?k.value:1,title:g.value,options:m.value,end_time:o.value}));return v({voteParams:b}),(n,x)=>(C(),N(e(B),{vertical:"",style:{"max-width":"450px","margin-top":"8px"}},{default:l(()=>[a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("投票标题")]),_:1}),a(e(A),{value:g.value,"onUpdate:value":x[0]||(x[0]=c=>g.value=c),placeholder:"必填"},null,8,["value"])]),_:1}),a(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("结束日期")]),_:1}),a(e(q),{"formatted-value":o.value,"onUpdate:formattedValue":x[1]||(x[1]=c=>o.value=c),"value-format":"yyyy-MM-dd HH:mm:ss",type:"datetime","is-date-disabled":f},null,8,["formatted-value"])]),_:1}),je,a(e(Q),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}}),(C(!0),ee(le,null,ae(t.value,c=>(C(),N(e(I),null,{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d(O(`选项#${c}`),1)]),_:2},1024),a(e(A),{value:m.value[c-1],"onUpdate:value":D=>m.value[c-1]=D,maxlength:255},null,8,["value","onUpdate:value"])]),_:2},1024))),256)),a(e(B),{size:"small",align:"center"},{default:l(()=>[a(e(M),{depth:3},{default:l(()=>[d("选项数量")]),_:1}),a(e(j),{size:"tiny",circle:"",disabled:t.value===20,onClick:x[2]||(x[2]=c=>w(1))},{icon:l(()=>[a(e(J),null,{default:l(()=>[a(e(te))]),_:1})]),_:1},8,["disabled"]),a(e(j),{size:"tiny",circle:"",disabled:t.value===1,onClick:x[3]||(x[3]=c=>{w(-1)})},{icon:l(()=>[a(e(J),null,{default:l(()=>[a(e(ue))]),_:1})]),_:1},8,["disabled"])]),_:1}),a(e(Q),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}}),a(e(F),{checked:s.value,"onUpdate:checked":x[4]||(x[4]=c=>s.value=c),label:"开启多选"},null,8,["checked"]),s.value?(C(),N(e(I),{key:0},{default:l(()=>[a(e(U),{style:{width:"5.2rem"}},{default:l(()=>[d("最多选择")]),_:1}),a(e(W),{value:k.value,"onUpdate:value":x[5]||(x[5]=c=>k.value=c),max:t.value,min:1,step:1},null,8,["value","max"])]),_:1})):Y("",!0)]),_:1}))}}),la=L({__name:"NewThread",props:{forumId:{}},setup(T){const v=_e(),s=oe(),k=ye(),g=ce(),m=i(),o=i("normal"),t=i(null);pe(()=>{s.showTopbarNav=!1}),X(()=>{s.showTopbarNav=!0});const w=i(!1);pe(()=>{w.value=!0}),X(()=>{w.value=!1}),document.title="新主题";const f=T,b=i(null),n=$(()=>{var u;return(u=b.value)==null?void 0:u.tabNormalInput}),x=i(null),c=i(null),D=i(null),h=i(null);let y=!1;function p(u,r){let S;if(S={binggan:v.binggan,forum_id:f.forumId,title:u.titleInput,content:u.contentInput,nickname:u.nicknameInput,subtitle:n.value.subtitle,thread_type:o.value,post_with_admin:u.postWithAdmin,anti_jingfen:n.value.antiJingfen,is_delay:u.isDelay,is_private:n.value.isPrivate,can_battle:n.value.canBattle,random_heads_group:n.value.randomHeadsGroup,nissin_time:n.value.nissinTime,title_color:n.value.titleColor,locked_by_coin:n.value.lockedByCoin,sub_id:n.value.subId},o.value==="hongbao"){const _=x.value.hongbaoParams;if(_.type===2&&_.olo%_.num!==0){window.$message.error("选择定额红包时，总额要是红包数量的整倍数喔");return}if(!_.keyword){window.$message.error("必须要输入红包口令");return}S.hongbao_params=V(G({},_),{keyword:_.keyword})}if(o.value==="vote"){const _=h.value.voteParams;if(!_.title){window.$message.error("必须要输入投票标题");return}S.vote_params=V(G({},_),{title:_.title})}if(o.value==="gamble"){const _=D.value.gambleParams;if(!_.title){window.$message.error("必须要输入菠菜标题");return}S.gamble_params=V(G({},_),{title:_.title})}if(o.value==="crowd"){const _=c.value.crowdParams;if(!_.title){window.$message.error("必须要输入众筹标题");return}if(!_.olo_target){window.$message.error("必须要输入众筹金额");return}S.crowd_params=V(G({},_),{title:_.title})}y=!0,De(S).then(_=>{r("success"),y=!1,He({title:"已发送主题，是否跳转？",mode:"success",onPositiveClick:()=>g.push({name:"thread",params:{threadId:_.thread_id}})})})}return X(()=>{var u;o.value="normal",(u=t.value)==null||u.resetInput()}),(u,r)=>{const S=Ie("router-link");return C(),N(e(B),{vertical:"",style:{"margin-top":"8px"}},{default:l(()=>{var _;return[a(Be,{ref_key:"postInputCom",ref:t,mode:"thread","forum-id":u.forumId,disabled:!1,handling:e(y),"random-heads-group":(_=n.value)==null?void 0:_.randomHeadsGroup,onContentCommit:p},null,8,["forum-id","handling","random-heads-group"]),a(e(Ue),{type:"line",animated:"",size:e(s).isMobile?"small":"medium",value:m.value,"onUpdate:value":r[4]||(r[4]=P=>m.value=P)},{default:l(()=>[a(e(E),{name:"常规",tab:"常规","display-directive":"show"},{default:l(()=>[a(e(Ge),{"forum-id":f.forumId,ref_key:"TabCommonComponent",ref:b},null,8,["forum-id"])]),_:1}),a(e(E),{name:"红包",tab:"红包","display-directive":"show"},{default:l(()=>[a(e(F),{checked:o.value,"onUpdate:checked":r[0]||(r[0]=P=>o.value=P),"checked-value":"hongbao","unchecked-value":"normal"},{default:l(()=>[d(" 开启红包 ")]),_:1},8,["checked"]),o.value==="hongbao"?(C(),N(e(Oe),{key:0,ref_key:"TabHongbaoCom",ref:x},null,512)):Y("",!0)]),_:1}),a(e(E),{name:"投票",tab:"投票","display-directive":"show"},{default:l(()=>[a(e(F),{checked:o.value,"onUpdate:checked":r[1]||(r[1]=P=>o.value=P),"checked-value":"vote","unchecked-value":"normal"},{default:l(()=>[d(" 开启投票（1000奥利奥） ")]),_:1},8,["checked"]),o.value==="vote"?(C(),N(e(Je),{key:0,ref_key:"TabVoteCom",ref:h},null,512)):Y("",!0)]),_:1}),a(e(E),{name:"菠菜",tab:"菠菜","display-directive":"show"},{default:l(()=>[a(e(F),{checked:o.value,"onUpdate:checked":r[2]||(r[2]=P=>o.value=P),"checked-value":"gamble","unchecked-value":"normal",disabled:u.forumId!==12},{default:l(()=>[d(" 开启菠菜（500奥利奥） 目前只能在海滨乐园岛开菠菜（避免被日清） ")]),_:1},8,["checked","disabled"]),o.value==="gamble"?(C(),N(e(Ve),{key:0,ref_key:"TabGambleCom",ref:D},null,512)):Y("",!0)]),_:1}),e(v).checkAdminForums(f.forumId)?(C(),N(e(E),{key:0,name:"众筹",tab:"众筹","display-directive":"show"},{default:l(()=>[a(e(F),{checked:o.value,"onUpdate:checked":r[3]||(r[3]=P=>o.value=P),"checked-value":"crowd","unchecked-value":"normal",disabled:u.forumId!==2},{default:l(()=>[d(" 开启众筹（仅管理员可见） 目前只能在小火锅调味区开众筹（避免被日清） ")]),_:1},8,["checked","disabled"]),o.value==="crowd"?(C(),N(e(Ye),{key:0,ref_key:"TabCrowdCom",ref:c},null,512)):Y("",!0)]),_:1})):Y("",!0)]),_:1},8,["size","value"]),w.value?(C(),N(Pe,{key:0,to:"#topbar-nav"},[a(S,{to:{name:"forum",params:{forumId:f.forumId}},class:"flex-item-center"},{default:l(()=>[a(e($e),{tooltip:!1},{default:l(()=>{var P;return[d(O((P=e(k).forumData(u.forumId))==null?void 0:P.name),1)]}),_:1}),a(e(ze),{round:"",class:"forum-tag",size:e(s).isMobile?"small":"medium"},{default:l(()=>[d(O(u.forumId),1)]),_:1},8,["size"])]),_:1},8,["to"])])):Y("",!0)]}),_:1})}}});export{la as default};
