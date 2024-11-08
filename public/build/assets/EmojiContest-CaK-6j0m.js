import{w as Q,$,h as E,A as o,M as U,p as t,H as s,n as e,t as w,F as h,y as H,z as f,v as ae,x as g,E as c,B as ne,aw as se,C as oe,J as ie,K as le,L as re,e as F,b as I,O as me,Q as M,I as D,aj as ue,aC as W,b3 as J,aI as K,b4 as de,al as ce,am as fe}from"./vendor-CYaCwXn6.js";import{a as O,g as P,u as q,b as L,e as pe,_ as ge}from"./app-DiIsNjHy.js";import{e as he}from"./emojiData-CmSvr5Em.js";import{s as _e}from"./shuffle-Bl2z5mvo.js";const Z=O(),je=i=>{const u=P.Get("api/emoji_contest/"+i,{name:"moeDataGetter-"+i,params:{binggan:Z.binggan},localCache:null,hitSource:[]});return u.meta={shouldRemind:!1},u},we=()=>{const i=P.Get("api/emoji_contest/show_user_votes",{name:"moeUserVoteDataGetter",params:{binggan:Z.binggan},localCache:null,hitSource:[]});return i.meta={shouldRemind:!1},i},ve=i=>{const u=P.Post("api/emoji_contest/user_vote",i,{name:"moeUserVotePoster",params:{},localCache:null,hitSource:[]});return u.meta={shouldRemind:!0},u},be=["src"],ye={key:0},Ue={key:1},xe={key:2},Se=Q({__name:"VoteModal",emits:["refreshMoeData"],setup(i,{expose:u,emit:v}){const G=q(),k=O(),l=$({emojiUrl:"",emojiGroupId:0,emojiId:0,voteNum:0,endFlag:0}),p=$(),_=$(!1);function T(j){_.value=!0,l.value=j,p.value=void 0}u({show:T});const{loading:y,send:z,onSuccess:V,onError:x}=E(j=>ve(j),{immediate:!1});function N(){if(p.value===void 0){window.$message.error("请输入投票数");return}const j={binggan:k.binggan,emoji_id:l.value.emojiId,emoji_group_id:l.value.emojiGroupId,olo:p.value*100};z(j)}V(()=>{S("refreshMoeData",l.value.emojiGroupId),p.value=void 0,_.value=!1});const S=v;return(j,r)=>(o(),U(e(re),{show:_.value,"onUpdate:show":r[3]||(r[3]=d=>_.value=d),"display-directive":"if"},{default:t(()=>[s(e(le),{style:ie({maxWidth:e(G).modalMaxWidth}),closable:"",onClose:r[2]||(r[2]=d=>_.value=!1),size:"small"},{action:t(()=>[s(e(w),{align:"center"},{default:t(()=>[l.value.endFlag===0?(o(),h("span",ye," 活动尚未开始 ")):H("",!0),l.value.endFlag===1?(o(),h("span",Ue,[f(" 将会花费 "),s(e(ae),{type:"error"},{default:t(()=>{var d;return[f(g(((d=p.value)!=null?d:0)*100),1)]}),_:1}),f(" 个olo ")])):H("",!0),l.value.endFlag===2?(o(),h("span",xe," 活动已经结束了 ")):H("",!0),s(e(L),{type:"primary",onClick:N,loading:e(y),disabled:e(y)||l.value.endFlag!==1,style:{"margin-left":"auto"}},{default:t(()=>[f("投票")]),_:1},8,["loading","disabled"]),s(e(L),{onClick:r[1]||(r[1]=d=>_.value=!1)},{default:t(()=>[f("关闭")]),_:1})]),_:1})]),default:t(()=>[s(e(w),{vertical:"",align:"center",size:[4,4]},{default:t(()=>[c("img",{src:l.value.emojiUrl},null,8,be),c("span",null,"当前票数："+g(l.value.voteNum),1),s(e(ne),null,{default:t(()=>[s(e(pe),{style:{width:"4.2rem"}},{default:t(()=>[f("投票额")]),_:1}),s(e(se),{value:p.value,"onUpdate:value":r[0]||(r[0]=d=>p.value=d),max:1e4,min:1,step:1,onKeyup:oe(N,["enter"])},null,8,["value"])]),_:1})]),_:1})]),_:1},8,["style"])]),_:1},8,["show"]))}}),Ce=i=>(ce("data-v-25172bb8"),i=i(),fe(),i),Fe=["src"],Ie=Ce(()=>c("br",null,null,-1)),$e=["src"],ke={key:0},ze=["src"],Ne=Q({__name:"EmojiContest",setup(i){me(n=>({dced9698:N.value}));const u=F.tz("2024-06-18 20:00"),v=F.tz("2024-06-22 20:00"),G=[1,2,3,4,5,6,7,9,10,11,16],k={1:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/6643615d5fdc9.png",name:"AC娘"},2:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/664363e93d3cf.gif",name:"鹦鹉鸡"},3:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/664366659ab29.gif",name:"咪子鱼"},4:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/664368477446c.gif",name:"小黑猫"},5:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/664369af63190.png",name:"麻将脸"},6:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/66436b99dd1ea.jpg",name:"小恐龙"},7:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/66436cb41e3e3.gif",name:"TD猫"},9:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/66436fa983d7f.jpg",name:"小企鹅"},10:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/664371e81e84c.png",name:"小黄脸"},11:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/66437362aba46.gif",name:"FUFU"},16:{emojiUrl:"https://www.freeimg.cn/i/2024/05/14/66437b01d45b7.gif",name:"药水哥"}},l=I(()=>_e(["https://www.freeimg.cn/i/2024/06/13/666af8740a938.png","https://i3.mjj.rip/2024/06/19/de56a8e0714f1a1706dbf5b93c9e2c54.png","https://i3.mjj.rip/2024/06/19/d95d48e3bf46cdd04e3801621728f4d8.png","https://i3.mjj.rip/2024/06/19/19c6c4bab33292f4455be14145dc0345.jpeg","https://i3.mjj.rip/2024/06/19/5ecb4a448ff9f548f4c5d9cd0f411457.png","https://i3.mjj.rip/2024/06/19/b937c6a09eb690b6677ad4ae5b5fffa6.png","https://iili.io/dHdzNFS.png","https://iili.io/dHJDZlI.png","https://i3.mjj.rip/2024/06/18/7d46966145c589020253e1cdf25f901f.png","https://iili.io/d9y7Af2.png","https://i3.mjj.rip/2024/06/18/dc63798aa13ae4180649f2364ea076c9.png","https://i3.mjj.rip/2024/06/18/3d7c6087726fbb1548b512c0fb3ac161.png","https://i3.mjj.rip/2024/06/17/349ccfc48428a1b09aa6355724fb2b93.png","https://i3.mjj.rip/2024/06/17/21402e49687631f174c892d35b60a8a3.png","https://i2.mjj.rip/2024/06/06/1d7f283697fc8e58c2ecefe9401f4d7e.png","https://i2.mjj.rip/2024/06/05/ce77023b4da545145ce833b677f56061.png"])),p=I(()=>{const n=F.tz();return n<u?`活动将于 ${u.format("M月D日H点")} 开始`:n>v?"投票已经结束！":`投票正在进行！将于${v.format("M月D日H点")}结束。（${_.value}）`}),_=I(()=>{const n=F.tz(),m=v.diff(n,"hour"),a=v.diff(n,"minute")-60*m;return`剩余${m}小时${a}分钟`}),T=O(),y=q(),z=$(),V=I(()=>he.filter(n=>G.includes(n.id))),x=$(null),N=I(()=>y.userCustom.emojiWhiteBack?"#FFFFFF":void 0);function S(n){n===0?A():(r.value=[],d(n))}const{loading:j,data:r,send:d,onSuccess:Me}=E(n=>je(n),{immediate:!1,initialData:[]}),{loading:X,data:B,send:A}=E(we,{immediate:!1,initialData:[]});T.binggan&&A();function Y(n){return n.reduce((m,a)=>(m+=a.votes_num_total,m),0)}function ee(n,m){var R;let a=0;const b=F.tz();b>u&&(a=1),b>v&&(a=2),(R=x==null?void 0:x.value)==null||R.show({emojiUrl:n.emojis[m.emoji_id],emojiGroupId:n.id,emojiId:m.emoji_id,voteNum:m.votes_num_total,endFlag:a})}function te(n){A(),S(n)}return(n,m)=>(o(),U(e(w),{vertical:"",size:[12,12]},{default:t(()=>[s(e(ue),{"show-arrow":"",trigger:e(y).isMobile?"click":"hover",autoplay:"",interval:1e4},{default:t(()=>[(o(!0),h(D,null,M(l.value,a=>(o(),h("img",{src:a,class:"carousel-img"},null,8,Fe))),256))]),_:1},8,["trigger"]),s(e(W),{"show-icon":!1,type:"default"},{default:t(()=>[f(g(p.value),1)]),_:1}),s(e(de),{type:"line",animated:"",placement:"left",size:e(y).isMobile?"small":"large",value:z.value,"onUpdate:value":[m[0]||(m[0]=a=>z.value=a),S]},{default:t(()=>[(o(),U(e(J),{key:0,name:0,tab:"我的本命"},{default:t(()=>[c("div",null,[s(e(W),{"show-icon":!1,type:"default"},{default:t(()=>[f(" 自己票数最多的“角色”为“⭐我的本命”，如该角色夺冠将获得特殊成就哦！ "),Ie,f("注：这里的表情包图片只是用来代表该角色，不是你投票最多的图片。 ")]),_:1})]),s(e(K),{show:e(X),style:{height:"120px"}},{default:t(()=>[s(e(w),{wrap:!0,size:[4,4],style:{"margin-top":"12px"}},{default:t(()=>[(o(!0),h(D,null,M(e(B),(a,b)=>(o(),U(e(w),{key:b,style:{width:"72px",height:"120px"},vertical:"",align:"center",justify:"end",size:[0,4]},{default:t(()=>[c("img",{src:k[a.emoji_group_id].emojiUrl,style:{"max-width":"100%"},class:"emoji-moe-img"},null,8,$e),c("span",null,g(b==0?"⭐":"")+" "+g(k[a.emoji_group_id].name),1),c("span",null,g(a.votes_num_total||""),1)]),_:2},1024))),128)),e(B).length===0?(o(),h("span",ke,"你的投票记录将会显示在这里。")):H("",!0)]),_:1})]),_:1},8,["show"])]),_:1})),(o(!0),h(D,null,M(V.value,(a,b,R)=>(o(),U(e(J),{key:b+1,name:a.id,tab:a.name},{default:t(()=>[s(e(K),{show:e(j),style:{height:"400px"}},{default:t(()=>[s(e(w),{style:{"margin-top":"12px"},align:"center"},{default:t(()=>[c("span",null,g(a.name)+" 总票数： "+g(Y(e(r))),1),s(e(L),{type:"primary",style:{"margin-left":"auto"},onClick:C=>S(a.id)},{default:t(()=>[f("刷新")]),_:2},1032,["onClick"])]),_:2},1024),s(e(w),{wrap:!0,size:[8,4],style:{"margin-top":"12px"}},{default:t(()=>[(o(!0),h(D,null,M(e(r),(C,De)=>(o(),U(e(w),{key:a.id*1e3+C.emoji_id,class:"emoji-moe-box",vertical:"",align:"center",size:[0,4],onClick:He=>ee(a,C)},{default:t(()=>[c("img",{src:a.emojis[C.emoji_id],style:{"max-width":"100%","max-height":"100%"},class:"emoji-moe-img"},null,8,ze),c("span",null,g(C.votes_num_total||""),1)]),_:2},1032,["onClick"]))),128))]),_:2},1024)]),_:2},1032,["show"])]),_:2},1032,["name","tab"]))),128))]),_:1},8,["size","value"]),s(Se,{ref_key:"VoteModalCom",ref:x,onRefreshMoeData:te},null,512)]),_:1}))}}),Re=ge(Ne,[["__scopeId","data-v-25172bb8"]]);export{Re as default};