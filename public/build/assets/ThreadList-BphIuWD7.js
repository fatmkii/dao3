import{w as I,l as N,b as A,u as G,g as H,c as O,U as Q,A as r,M as d,f as n,F as g,Q as b,C as z,a as s,k as y,i as L,H as i,j as c,B as k,z as l,s as t,G as h,v as S,h as T,R as U,O as V,_ as E}from"./app-DHSg6T1I.js";import{d as J,s as K}from"./showDialog-X27gZ7Iz.js";import{u as X}from"./browseLogger-mn2k-wPz.js";const Y=u=>(U("data-v-7df6172d"),u=u(),V(),u),Z=Y(()=>c("span",{style:{"margin-left":"auto"}},null,-1)),D={key:0},ee=I({__name:"ThreadList",props:{threadsListData:{},showThis:{type:Boolean},newWindowToPost:{type:Boolean,default:!1}},emits:["withdrawDelayThreadSuccess"],setup(u,{expose:x,emit:M}){N(o=>({"3f321aeb":s(_).hoverColor,f9244fc2:s(_).textColor1}));const a=A(),_=G(),C=H(),P=u,W=M,v=X(),m=v.data;function B(){v.reload()}x({reloadBrowseLogger:B});function F(o){const w={name:"thread",params:{threadId:o,page:Math.ceil((m.value[o].floor+1)/200)},hash:`#f_${m.value[o].floor}`};if(P.newWindowToPost){const p=C.resolve(w);window.open(p.href,"_blank")}else C.push(w)}const{loading:R,send:j,onSuccess:$}=O(o=>J(o),{immediate:!1});$(()=>{W("withdrawDelayThreadSuccess")});function q(o){K({title:"要撤回延时主题吗？",onPositiveClick:()=>{j(o)}})}return(o,w)=>{const p=Q("router-link");return o.showThis?(r(),d(s(y),{key:0,vertical:"",size:2},{default:n(()=>[(r(!0),g(z,null,b(o.threadsListData,e=>(r(),d(s(L),{size:"small",bordered:!0,key:e.id,class:"thread-cards","content-style":{padding:s(a).userCustom.threadListCardPadding+"px"},hoverable:""},{default:n(()=>[i(s(y),{vertical:"",size:[0,0]},{default:n(()=>[c("div",{style:k({color:e.title_color&&!s(a).userCustom.monochromeMode?e.title_color:s(_).textColor1,fontSize:s(a).userCustom.fontSizeThreadList+"px"}),class:"thread-title"},[l(t(e.sub_title)+" "+t(e.vote_question_id?"🗳️":"")+" "+t(e.gamble_question_id?"🎲":"")+" "+t(e.crowd_id?"💰":"")+" "+t(e.hongbao_id?"🧧":"")+" ",1),i(p,{to:{name:"thread",params:{threadId:e.id}},style:k({color:e.title_color&&!s(a).userCustom.monochromeMode?e.title_color:s(_).textColor1,pointerEvents:e.is_delay?"none":void 0}),target:o.newWindowToPost?"_blank":!1},{default:n(()=>[l(t(e.title),1)]),_:2},1032,["to","style","target"]),e.posts_num>200?(r(),d(p,{key:0,to:{name:"thread",params:{threadId:e.id,page:Math.ceil((e.posts_num+1)/200)}},target:o.newWindowToPost?"_blank":!1},{default:n(()=>[l(" ["+t(Math.ceil((e.posts_num+1)/200))+"] ",1)]),_:2},1032,["to","target"])):h("",!0),s(m)[e.id]?(r(),d(s(S),{key:1,size:"tiny",type:"primary",onClick:f=>F(e.id)},{default:n(()=>{var f;return[l(" ["+t((f=s(m)[e.id])==null?void 0:f.floor)+"楼] ",1)]}),_:2},1032,["onClick"])):h("",!0),e.is_your_thread?(r(),d(s(S),{key:2,size:"tiny",type:"warning",disabled:s(R),onClick:f=>q(e.id)},{default:n(()=>[l("撤回")]),_:2},1032,["disabled","onClick"])):h("",!0)],4),i(s(y),{size:"small",class:"thread-title-secondary",style:k({fontSize:s(a).userCustom.fontSizeThreadListFooter+"px",marginTop:s(a).userCustom.threadListInnerMargin+"px"})},{default:n(()=>[c("span",null,[i(s(T),{depth:"3"},{default:n(()=>[l("最新回复:")]),_:1}),l(" "+t(e.updated_at),1)]),c("span",null,[i(s(T),{depth:"3"},{default:n(()=>[l("发帖人:")]),_:1}),l(" "+t(e.nickname),1)]),Z,l(" "+t(e.posts_num>1200?"🔥":"")+" ",1),e.locked_by_coin>0?(r(),g("span",D,"🔒"+t(e.locked_by_coin),1)):h("",!0),c("span",null,[i(s(T),{depth:"3"},{default:n(()=>[l("Re:")]),_:1}),l(" "+t(e.posts_num),1)])]),_:2},1032,["style"])]),_:2},1024)]),_:2},1032,["content-style"]))),128))]),_:1})):(r(),d(s(y),{key:1,vertical:"",size:2},{default:n(()=>[(r(),g(z,null,b(50,e=>i(s(L),{class:"threads-card-skeleton"})),64))]),_:1}))}}}),ne=E(ee,[["__scopeId","data-v-7df6172d"]]);export{ne as T};
