import{w as M,S as w,ad as R,ae as $,N as G,A as l,M as f,m as e,P as L,g as U,b as h,u as V,$ as q,R as E,o as t,K,L as P,U as W,F as g,af as X,x,ag as Y,_ as b,Q as B,H as n,J as y,z as s,t as S,E as H,s as C,v as k,ah as Z,ai as D,aj as ee}from"./vendor-DQqxAeCv.js";import{u as te,h as ae,_ as se}from"./app-CvEUHSZB.js";import{u as oe}from"./forums-B1L0hElq.js";const re=M({__name:"ForumsStar",props:{isFavorite:{type:Boolean,default:!1},forumId:{default:0}},emits:["favorite-add","favorite-cancel"],setup(u,{emit:m}){const c=u,d=w(G,{size:"1.5rem",onClick:_},()=>w(c.isFavorite?R:$)),v=m;function _(){c.isFavorite?v("favorite-cancel",c.forumId):v("favorite-add",c.forumId)}return(N,F)=>(l(),f(e(d)))}}),ne=u=>(D("data-v-2acd8ca0"),u=u(),ee(),u),le={key:0,class:"carousel-box"},ie=["src"],ue=ne(()=>y("div",null,"这里个人论坛“小火锅”，欢迎来玩~",-1)),ce=M({__name:"Home",setup(u){K(r=>({"625844e0":e(c).hoverColor}));const m=oe(),c=L(),d=te(),v=P(),{loading:_,data:N}=U(ae),F=h(()=>N.value.sort(()=>.5-Math.random()));document.title="小火锅";const O=V("banner_hiden",!1),j=h(()=>({paddingBottom:d.isMobile?"6px":"",paddingTop:d.isMobile?"6px":""})),z=h(()=>({paddingBottom:d.isMobile?"6px":""})),o=q([]);E(()=>{localStorage.forums_favorites===void 0?localStorage.forums_favorites=JSON.stringify([]):o.value=JSON.parse(localStorage.forums_favorites)});const I=h(()=>{const r=m.forumsData.filter(a=>o.value.includes(a.id)),i=m.forumsData.filter(a=>!o.value.includes(a.id));return r.concat(i)});function J(r){o.value.includes(r)||(o.value.push(r),localStorage.forums_favorites=JSON.stringify(o.value))}function T(r){const i=o.value.indexOf(r);i!=-1&&(o.value.splice(i,1),localStorage.forums_favorites=JSON.stringify(o.value))}function A(r,i){const p=i.target;["path","svg"].includes(p.nodeName)||v.push({name:"forum",params:{forumId:r}})}return(r,i)=>{const p=W("router-link");return l(),f(e(C),{justify:"center",vertical:""},{default:t(()=>[e(O)?x("",!0):(l(),g("div",le,[e(_)?(l(),f(e(X),{key:0,class:"carousel-skeleton",sharp:""})):x("",!0),e(_)?x("",!0):(l(),f(e(Y),{key:1,"show-arrow":"",trigger:e(d).isMobile?"click":"hover",autoplay:"",interval:1e4},{default:t(()=>[(l(!0),g(b,null,B(F.value,a=>(l(),g("img",{src:a,class:"carousel-img"},null,8,ie))),256))]),_:1},8,["trigger"]))])),n(e(H),{title:"小火锅公告",size:"small"},{default:t(()=>[ue,y("div",null,[s("QQ小火锅避难群："),n(e(S),{type:"info"},{default:t(()=>[s("156840110")]),_:1})]),y("div",null,[s("目前小火锅有5个网址："),n(e(S),{type:"info"},{default:t(()=>[s("cpttmm.com, www.cpttmm.com, cpttmm.love, www.cpttmm.love, v2.cpttmm.com")]),_:1}),s("(v2尽量不要用)")]),y("div",null,[n(e(S),null,{default:t(()=>[s("请务必遵守"),n(p,{to:"/thread/13351",style:{"text-decoration":"underline"}},{default:t(()=>[s("小火锅版规")]),_:1}),s("喔！")]),_:1})])]),_:1}),n(e(C),{justify:"center",vertical:"",size:1},{default:t(()=>[(l(!0),g(b,null,B(I.value,a=>(l(),f(e(H),{size:"small",bordered:!0,key:a.id,class:"forum-cards","header-style":j.value,"content-style":z.value,hoverable:"",onClick:Q=>A(a.id,Q)},{header:t(()=>[n(e(C),null,{default:t(()=>[n(re,{"is-favorite":o.value.includes(a.id),"forum-id":a.id,onFavoriteAdd:J,onFavoriteCancel:T},null,8,["is-favorite","forum-id"]),s(" "+k(a.name),1)]),_:2},1024)]),"header-extra":t(()=>[n(e(Z),{round:""},{default:t(()=>[s(k(a.id),1)]),_:2},1024)]),default:t(()=>[n(e(S),null,{default:t(()=>[s(k(a.description),1)]),_:2},1024)]),_:2},1032,["header-style","content-style","onClick"]))),128))]),_:1})]),_:1})}}}),ve=se(ce,[["__scopeId","data-v-2acd8ca0"]]);export{ve as default};