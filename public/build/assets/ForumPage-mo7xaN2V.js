import{b as J,e as _e,m as ye,w as oe,l as re,u as ve,g as le,d as W,c as we,U as ne,A as u,M as h,f as s,F as k,Q,C as V,a as e,k as g,i as te,H as a,j as C,n as K,z as l,s as d,G as w,o as y,h as G,R as ie,O as ue,_ as de,p as be,$ as b,q as A,r as ke,t as Ce,v as Se,x as se,N as Te,y as Ie,B as xe,S as $,D as H,E as Le}from"./app-lxfZSp_D.js";import{u as $e,t as ae}from"./forums-CnuaepeL.js";import{s as D}from"./subtitles-DW7M559j.js";import{_ as Ne}from"./loudspeaker-BAarqPE_.js";import{u as ze,S as Me,L as Pe,a as Fe}from"./LoudspeakerComponent-BA2M3bPL.js";import{d as Oe,s as We}from"./showDialog-BaCjE6GO.js";import{_ as Be}from"./FInput.vue_vue_type_script_setup_true_lang-CT7jmK7G.js";import{N as Ue}from"./Ellipsis-CuCGL5by.js";import{N as qe,a as Re}from"./Skeleton-D7SY7-0I.js";import{N as Ee}from"./Tag-CaFNK4rR.js";import"./Pagination-FTE6q-qE.js";import"./use-locale-Cx7xZzq0.js";import"./prop-DfVitj0l.js";import"./Input-BuBGdj4Z.js";import"./Select-CnaDYTE-.js";import"./Forward-DwQkqx46.js";import"./Spin-BQ--OYe0.js";import"./_createCompounder-CXyjpdEk.js";import"./use-houdini-DSQf9wrU.js";function je(){const p=J();_e(()=>{p.showTopbarNav=!1}),ye(()=>{p.showTopbarNav=!0})}const Ge=p=>(ie("data-v-5d9679d2"),p=p(),ue(),p),Ae=Ge(()=>C("span",{style:{"margin-left":"auto"}},null,-1)),He={key:0},De=oe({__name:"ThreadList",props:{threadsListData:{},showThis:{type:Boolean},newWindowToPost:{type:Boolean,default:!1}},emits:["withdrawDelayThreadSuccess"],setup(p,{expose:N,emit:m}){re(i=>({"57077b52":e(_).hoverColor,af90790a:(e(f).isMobile,"0.875rem"),c9798ef4:e(_).textColor1}));const f=J(),_=ve(),P=le(),F=p,o=m,z=W(()=>({paddingBottom:f.isMobile?"6px":""})),S=ze(),T=S.data;function B(){S.reload()}N({reloadBrowseLogger:B});function M(i){const x={name:"thread",params:{threadId:i,page:Math.ceil((T.value[i].floor+1)/200)},hash:`#f_${T.value[i].floor}`};if(F.newWindowToPost){const L=P.resolve(x);window.open(L.href,"_blank")}else P.push(x)}const{loading:O,send:U,onSuccess:q}=we(i=>Oe(i),{immediate:!1});q(()=>{o("withdrawDelayThreadSuccess")});function I(i){We({title:"要撤回延时主题吗？",onPositiveClick:()=>{U(i)}})}return(i,x)=>{const L=ne("router-link");return i.showThis?(u(),h(e(g),{key:0,vertical:"",size:2},{default:s(()=>[(u(!0),k(V,null,Q(i.threadsListData,t=>(u(),h(e(te),{size:"small",bordered:!0,key:t.id,class:"thread-cards","content-style":z.value,hoverable:""},{default:s(()=>[a(e(g),{vertical:""},{default:s(()=>[C("div",{style:K({color:t.title_color&&!e(f).userCustom.monochromeMode?t.title_color:e(_).textColor1}),class:"thread-title"},[l(d(t.sub_title)+" "+d(t.vote_question_id?"🗳️":"")+" "+d(t.gamble_question_id?"🎲":"")+" "+d(t.crowd_id?"💰":"")+" "+d(t.hongbao_id?"🧧":"")+" ",1),a(L,{to:{name:"thread",params:{threadId:t.id}},style:K([{"font-size":"1.0rem"},{color:t.title_color&&!e(f).userCustom.monochromeMode?t.title_color:e(_).textColor1,pointerEvents:t.is_delay?"none":void 0}]),target:i.newWindowToPost?"_blank":!1},{default:s(()=>[l(d(t.title),1)]),_:2},1032,["to","style","target"]),t.posts_num>200?(u(),h(L,{key:0,style:{"font-size":"1.0rem"},to:{name:"thread",params:{threadId:t.id,page:Math.ceil((t.posts_num+1)/200)}},target:i.newWindowToPost?"_blank":!1},{default:s(()=>[l(" ["+d(Math.ceil((t.posts_num+1)/200))+"] ",1)]),_:2},1032,["to","target"])):w("",!0),e(T)[t.id]?(u(),h(e(y),{key:1,size:"tiny",type:"primary",onClick:v=>M(t.id)},{default:s(()=>{var v;return[l(" ["+d((v=e(T)[t.id])==null?void 0:v.floor)+"楼] ",1)]}),_:2},1032,["onClick"])):w("",!0),t.is_your_thread?(u(),h(e(y),{key:2,size:"tiny",type:"warning",disabled:e(O),onClick:v=>I(t.id)},{default:s(()=>[l("撤回")]),_:2},1032,["disabled","onClick"])):w("",!0)],4),a(e(g),{size:"small",class:"thread-title-secondary"},{default:s(()=>[C("span",null,[a(e(G),{depth:"3"},{default:s(()=>[l("最新回复:")]),_:1}),l(" "+d(t.updated_at),1)]),C("span",null,[a(e(G),{depth:"3"},{default:s(()=>[l("发帖人:")]),_:1}),l(" "+d(t.nickname),1)]),Ae,l(" "+d(t.posts_num>1200?"🔥":"")+" ",1),t.locked_by_coin>0?(u(),k("span",He,"🔒"+d(t.locked_by_coin),1)):w("",!0),C("span",null,[a(e(G),{depth:"3"},{default:s(()=>[l("Re:")]),_:1}),l(" "+d(t.posts_num),1)])]),_:2},1024)]),_:2},1024)]),_:2},1032,["content-style"]))),128))]),_:1})):(u(),h(e(g),{key:1,vertical:"",size:2},{default:s(()=>[(u(),k(V,null,Q(50,t=>a(e(te),{class:"threads-card-skeleton"})),64))]),_:1}))}}}),Qe=de(De,[["__scopeId","data-v-5d9679d2"]]),ce=p=>(ie("data-v-49edc6e6"),p=p(),ue(),p),Ve={key:0,class:"carousel-box"},Ke={key:0,class:"carousel-box"},Je=["src"],Xe=ce(()=>C("div",{style:{"margin-left":"auto"}},null,-1)),Ye=ce(()=>C("div",{style:{height:"50px"}},null,-1)),Ze=oe({__name:"ForumPage",props:{forumId:{},page:{},search:{},delay:{type:Boolean}},setup(p){var ee;re(r=>({"7b4adc69":e(m).bannerHeight}));const N=be(),m=J(),f=$e(),_=le(),P=b(null);b();const F=b();je();const o=p;document.title=((ee=f.forumData(o.forumId))==null?void 0:ee.name)??"小火锅";const z=A("banner_hiden",!1),S=A("new_window_to_post",!1);function T(){return $(g,{style:"padding:6px 8px",vertical:!0},()=>[$(H,{checked:z.value,"onUpdate:checked":r=>z.value=r,label:"隐藏版头"}),$(H,{checked:S.value,"onUpdate:checked":r=>S.value=r,label:"新窗口打开"})])}const B=[{type:"group",key:"header",label:"功能"},{key:"header-divider",type:"divider"},{key:"funcOption",type:"render",render:T}],M=A("subtitles_included",D),O=W(()=>D.filter(r=>!M.value.includes(r)));function U(){return $(Le,{value:M.value,"onUpdate:value":r=>M.value=r},()=>[$(g,{style:"padding:6px 8px",vertical:!0},()=>[Array.from(D).map(r=>$(H,{value:r,label:r}))])])}const q=[{type:"group",key:"header",label:"筛选"},{key:"header-divider",type:"divider"},{key:"filterOptions",type:"render",render:U}],I=b(o.search),i=b(!!o.search);function x(){_.push({name:"forum",params:{forumId:o.forumId,page:1},query:{search:I.value||void 0}})}function L(){I.value=void 0,i.value=!1,_.push({name:"forum",params:{forumId:o.forumId,page:1}})}function t(){_.push({name:"forum",params:{forumId:o.forumId,page:1},query:{delay:o.delay?void 0:"true"}})}const v=b(o.page);function pe(r){_.push({name:"forum",params:{forumId:o.forumId,page:r},query:{search:o.search,delay:o.delay?"true":void 0}})}ke(()=>o.page,r=>v.value=r);const X=W(()=>({forumId:o.forumId,binggan:N.binggan,page:o.page,threadsPerPage:50,subtitlesExcluded:O.value,searchTitle:o.search,delay:o.delay})),{loading:R,data:E,onSuccess:et}=Ce(()=>ae(X.value),[()=>o.forumId,()=>o.page,()=>o.search,()=>o.delay,O],{initialData:[],immediate:!0}),Y=b(!1),{fetching:tt,onSuccess:me,fetch:fe}=Se();function Z(r=!1){var n;Y.value=r,fe(ae(X.value)),(n=F.value)==null||n.reloadBrowseLogger()}me(()=>{Y.value&&window.$message.success("已刷新数据")});const he=W(()=>{if(R.value)return[];if(N.userData.binggan.use_pingbici){const r=m.userCustom.pingbiciIngnoreCase?"gi":"g";return E.value.threads_data.data.filter(n=>{for(let j of N.userData.pingbici.title_pingbici)if(new RegExp(j,r).test(n.title))return!1;return!0})}else return E.value.threads_data.data});return(r,n)=>{const j=ne("router-link");return u(),h(e(g),{vertical:""},{default:s(()=>[e(z)?w("",!0):(u(),k("div",Ve,[e(f).forumsDataLoading?(u(),k("div",Ke,[a(e(qe),{class:"carousel-skeleton",sharp:""})])):w("",!0),e(f).forumsDataLoading?w("",!0):(u(),h(e(Re),{key:1,"show-arrow":"",trigger:e(m).isMobile?"click":"hover",autoplay:"",interval:1e4},{default:s(()=>{var c;return[(u(!0),k(V,null,Q((c=e(f).forumData(r.forumId))==null?void 0:c.banners,ge=>(u(),k("img",{src:ge,class:"carousel-img"},null,8,Je))),256))]}),_:1},8,["trigger"]))])),a(e(g),{style:{"margin-top":"8px"},size:"small"},{default:s(()=>[a(e(se),{trigger:e(m).isMobile?"click":"hover",options:B,placement:"bottom-start"},{default:s(()=>[a(e(y),null,{default:s(()=>[l("功能")]),_:1})]),_:1},8,["trigger"]),a(e(se),{trigger:e(m).isMobile?"click":"hover",options:q,placement:"bottom-start"},{default:s(()=>[a(e(y),null,{default:s(()=>[l("筛选")]),_:1})]),_:1},8,["trigger"]),a(e(Te),{size:e(m).isMobile?28:34},{default:s(()=>[a(e(Me),{style:{cursor:"pointer"},onClick:n[0]||(n[0]=c=>i.value=!i.value)})]),_:1},8,["size"]),Xe,a(e(y),{type:"primary",onClick:n[1]||(n[1]=c=>r.$router.push({name:"loudspeaker"}))},{default:s(()=>[l("大喇叭")]),_:1}),a(e(y),{type:"primary",onClick:n[2]||(n[2]=c=>r.$router.push({name:"new-thread",params:{forumId:o.forumId}}))},{default:s(()=>[l("新主题")]),_:1})]),_:1}),i.value?(u(),h(e(g),{key:1,wrap:!1},{default:s(()=>[a(e(Be),{value:I.value,"onUpdate:value":n[3]||(n[3]=c=>I.value=c),maxlength:100,style:{"max-width":"400px"},placeholder:"搜索标题","auto-size":"",onKeyup:Ie(x,["enter"])},null,8,["value"]),a(e(y),{type:"primary",onClick:x},{default:s(()=>[l("搜索")]),_:1}),a(e(y),{type:"default",onClick:L},{default:s(()=>[l("清空")]),_:1})]),_:1})):w("",!0),a(Pe),a(Qe,{ref_key:"ThreadListCom",ref:F,"threads-list-data":he.value,"new-window-to-post":e(S),"show-this":!e(R),onWithdrawDelayThreadSuccess:Z},null,8,["threads-list-data","new-window-to-post","show-this"]),a(e(g),{align:"center"},{default:s(()=>[a(e(y),{type:o.delay?"default":"primary",onClick:t},{default:s(()=>[l(d(o.delay?"关闭延时主题":"查看延时主题"),1)]),_:1},8,["type"]),a(Ne,{page:v.value,"onUpdate:page":[n[4]||(n[4]=c=>v.value=c),pe],"last-page":e(R)?1:e(E).threads_data.lastPage,style:{"margin-left":"auto"}},null,8,["page","last-page"])]),_:1}),Ye,(u(),h(xe,{to:"#topbar-nav"},[a(j,{to:"/",class:"flex-item-center"},{default:s(()=>[a(e(Ue),{style:K({maxWidth:e(m).isMobile?"120px":"900px"}),tooltip:!1},{default:s(()=>{var c;return[l(d((c=e(f).forumData(r.forumId))==null?void 0:c.name),1)]}),_:1},8,["style"]),a(e(Ee),{round:"",class:"forum-tag",size:e(m).isMobile?"small":"medium"},{default:s(()=>[l(d(r.forumId),1)]),_:1},8,["size"])]),_:1})])),a(Fe,{mode:"forum",ref_key:"SidebarCom",ref:P,onRefresh:n[5]||(n[5]=c=>Z(!0)),onNewThread:n[6]||(n[6]=c=>r.$router.push({name:"new-thread",params:{forumId:o.forumId}}))},null,512)]),_:1})}}}),bt=de(Ze,[["__scopeId","data-v-49edc6e6"]]);export{bt as default};
