import{w as j,O as q,T as N,P as A,h as E,U as O,A as r,M as d,p as n,F as g,Q as b,I as z,n as s,t as y,K as L,H as i,E as c,J as T,z as l,x as t,y as h,v as k,al as Q,am as U}from"./vendor-CYaCwXn6.js";import{d as V,s as G}from"./showDialog-DkcOAat_.js";import{u as J}from"./browseLogger-CPbjKXca.js";import{u as K,b as x,_ as X}from"./app-DiIsNjHy.js";const Y=u=>(Q("data-v-3819a25a"),u=u(),U(),u),Z=Y(()=>c("span",{style:{"margin-left":"auto"}},null,-1)),D={key:0},ee=j({__name:"ThreadList",props:{threadsListData:{},showThis:{type:Boolean},newWindowToPost:{type:Boolean,default:!1}},emits:["withdrawDelayThreadSuccess"],setup(u,{expose:S,emit:P}){q(o=>({"07aae8c0":s(_).hoverColor,"4be6a5f4":s(_).textColor1}));const a=K(),_=N(),C=A(),M=u,W=P,v=J(),m=v.data;function F(){v.reload()}S({reloadBrowseLogger:F});function B(o){const w={name:"thread",params:{threadId:o,page:Math.ceil((m.value[o].floor+1)/200)},hash:`#f_${m.value[o].floor}`};if(M.newWindowToPost){const p=C.resolve(w);window.open(p.href,"_blank")}else C.push(w)}const{loading:H,send:I,onSuccess:R}=E(o=>V(o),{immediate:!1});R(()=>{W("withdrawDelayThreadSuccess")});function $(o){G({title:"要撤回延时主题吗？",onPositiveClick:()=>{I(o)}})}return(o,w)=>{const p=O("router-link");return o.showThis?(r(),d(s(y),{key:0,vertical:"",size:2},{default:n(()=>[(r(!0),g(z,null,b(o.threadsListData,e=>(r(),d(s(L),{size:"small",bordered:!0,key:e.id,class:"thread-cards","content-style":{padding:s(a).userCustom.threadListCardPadding+"px"},hoverable:""},{default:n(()=>[i(s(y),{vertical:"",size:[0,0]},{default:n(()=>[c("div",{style:T({color:e.title_color&&!s(a).userCustom.monochromeMode?e.title_color:s(_).textColor1,fontSize:s(a).userCustom.fontSizeThreadList+"px",lineHeight:1.5}),class:"thread-title"},[l(t(e.sub_title)+" "+t(e.vote_question_id?"🗳️":"")+" "+t(e.gamble_question_id?"🎲":"")+" "+t(e.crowd_id?"💰":"")+" "+t(e.hongbao_id?"🧧":"")+" ",1),i(p,{to:{name:"thread",params:{threadId:e.id}},style:T({color:e.title_color&&!s(a).userCustom.monochromeMode?e.title_color:s(_).textColor1,pointerEvents:e.is_delay?"none":void 0}),target:o.newWindowToPost?"_blank":!1},{default:n(()=>[l(t(e.title),1)]),_:2},1032,["to","style","target"]),e.posts_num>200?(r(),d(p,{key:0,to:{name:"thread",params:{threadId:e.id,page:Math.ceil((e.posts_num+1)/200)}},target:o.newWindowToPost?"_blank":!1},{default:n(()=>[l(" ["+t(Math.ceil((e.posts_num+1)/200))+"] ",1)]),_:2},1032,["to","target"])):h("",!0),s(m)[e.id]?(r(),d(s(x),{key:1,size:"tiny",type:"primary",onClick:f=>B(e.id)},{default:n(()=>{var f;return[l(" ["+t((f=s(m)[e.id])==null?void 0:f.floor)+"楼] ",1)]}),_:2},1032,["onClick"])):h("",!0),e.is_your_thread?(r(),d(s(x),{key:2,size:"tiny",type:"warning",disabled:s(H),onClick:f=>$(e.id)},{default:n(()=>[l("撤回")]),_:2},1032,["disabled","onClick"])):h("",!0)],4),i(s(y),{size:"small",class:"thread-title-secondary",style:T({fontSize:s(a).userCustom.fontSizeThreadListFooter+"px",marginTop:s(a).userCustom.threadListInnerMargin+"px",lineHeight:1.5})},{default:n(()=>[c("span",null,[i(s(k),{depth:"3"},{default:n(()=>[l("最新回复:")]),_:1}),l(" "+t(e.updated_at),1)]),c("span",null,[i(s(k),{depth:"3"},{default:n(()=>[l("发帖人:")]),_:1}),l(" "+t(e.nickname),1)]),Z,l(" "+t(e.posts_num>1200?"🔥":"")+" ",1),e.locked_by_coin>0?(r(),g("span",D,"🔒"+t(e.locked_by_coin),1)):h("",!0),c("span",null,[i(s(k),{depth:"3"},{default:n(()=>[l("Re:")]),_:1}),l(" "+t(e.posts_num),1)])]),_:2},1032,["style"])]),_:2},1024)]),_:2},1032,["content-style"]))),128))]),_:1})):(r(),d(s(y),{key:1,vertical:"",size:2},{default:n(()=>[(r(),g(z,null,b(50,e=>i(s(L),{class:"threads-card-skeleton"})),64))]),_:1}))}}}),le=X(ee,[["__scopeId","data-v-3819a25a"]]);export{le as T};
