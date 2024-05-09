function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/Home-Cm4HpOSV.js","assets/vendor-DQqxAeCv.js","assets/forums-Bv1zgne9.js","assets/Home-BzLLqj0W.css","assets/404-CCNtKDQ6.js","assets/ForumPage-CJxgAoRZ.js","assets/subtitles-DW7M559j.js","assets/loudspeaker-DnfryfrZ.js","assets/LoudspeakerComponent-rxzjzSdT.js","assets/LoudspeakerComponent-CImdvviL.css","assets/ThreadList-DJPAzEVV.js","assets/showDialog-4EiY6tbd.js","assets/browseLogger-DN4xlfaA.js","assets/ThreadList-BbkDJXRc.css","assets/ForumPage-BNuovhRn.css","assets/ThreadPage-CCylumQ3.js","assets/emojiData-D2eobXXi.js","assets/dayjs.min-CUVi99TO.js","assets/emojiData-BaEGuFkb.css","assets/PostInput.vue_vue_type_script_setup_true_lang-BPt3xc8C.js","assets/inputNumberFormat-DaYmlx6U.js","assets/PostInput-JCDAAN1b.css","assets/admin-Cp4IVX8_.js","assets/ThreadPage-CBZunowq.css","assets/NewThread-Janm5RdP.js","assets/UserCenter-B2qwgqDP.js","assets/UserCenter-D3NalcPi.css","assets/AdminCenter-BCNydifT.js","assets/AdminCenter-Ci9W3-7p.css","assets/LoudspeakerPage-C5rE4mvJ.js","assets/LoudspeakerPage-Dlj-fcU0.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
var Te=Object.defineProperty,Re=Object.defineProperties;var Me=Object.getOwnPropertyDescriptors;var ie=Object.getOwnPropertySymbols;var Ee=Object.prototype.hasOwnProperty,De=Object.prototype.propertyIsEnumerable;var ue=(t,e,o)=>e in t?Te(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,N=(t,e)=>{for(var o in e||(e={}))Ee.call(e,o)&&ue(t,o,e[o]);if(ie)for(var o of ie(e))De.call(e,o)&&ue(t,o,e[o]);return t},ce=(t,e)=>Re(t,Me(e));var A=(t,e,o)=>new Promise((s,r)=>{var l=d=>{try{m(o.next(d))}catch(c){r(c)}},i=d=>{try{m(o.throw(d))}catch(c){r(c)}},m=d=>d.done?s(d.value):Promise.resolve(d.value).then(l,i);m((o=o.apply(t,e)).next())});import{c as $e,a as Be,d as ee,$ as P,b as y,u as be,e as ze,f as Ce,V as ye,G as Se,g as U,w as I,h as Ae,A as b,F as te,i as Ue,S as f,N as Ge,j as B,k as we,M as S,Z as W,Q as q,l as V,m as a,n as je,o as n,Y as Q,p as He,q as Ne,r as Oe,H as u,s as F,t as x,z as g,v as oe,x as O,y as de,B as me,C as We,D as ae,E as re,I as se,J as k,U as ne,K as Pe,L as qe,O as Ve,P as ke,R as Qe,T as Ye,W as Je,X as pe,_ as Ke,a0 as Z,a1 as Xe,a2 as Ze,a3 as et,a4 as tt,a5 as ot,a6 as at,a7 as rt,a8 as st,a9 as nt,aa as lt,ab as it,ac as ut}from"./vendor-DQqxAeCv.js";const ct="modulepreload",dt=function(t){return"/build/"+t},ge={},M=function(e,o,s){let r=Promise.resolve();if(o&&o.length>0){const l=document.getElementsByTagName("link"),i=document.querySelector("meta[property=csp-nonce]"),m=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.all(o.map(d=>{if(d=dt(d),d in ge)return;ge[d]=!0;const c=d.endsWith(".css"),C=c?'[rel="stylesheet"]':"";if(!!s)for(let T=l.length-1;T>=0;T--){const R=l[T];if(R.href===d&&(!c||R.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${C}`))return;const _=document.createElement("link");if(_.rel=c?"stylesheet":ct,c||(_.as="script",_.crossOrigin=""),_.href=d,m&&_.setAttribute("nonce",m),document.head.appendChild(_),c)return new Promise((T,R)=>{_.addEventListener("load",T),_.addEventListener("error",()=>R(new Error(`Unable to preload CSS for ${d}`)))})}))}return r.then(()=>e()).catch(l=>{const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=l,window.dispatchEvent(i),!i.defaultPrevented)throw l})},mt=[{path:"/",name:"Homepage",component:()=>M(()=>import("./Home-Cm4HpOSV.js"),__vite__mapDeps([0,1,2,3]))},{path:"/:pathMatch(.*)*",name:"Page404",component:()=>M(()=>import("./404-CCNtKDQ6.js"),__vite__mapDeps([4,1]))},{path:"/forum/:forumId/:page?",name:"forum",props:t=>({forumId:parseInt(t.params.forumId),page:t.params.page?parseInt(t.params.page):1,search:t.query.search,delay:t.query.delay==="true"}),component:()=>M(()=>import("./ForumPage-CJxgAoRZ.js"),__vite__mapDeps([5,1,2,6,7,8,9,10,11,12,13,14]))},{path:"/thread/:threadId/:page?",name:"thread",props:t=>({threadId:parseInt(t.params.threadId),page:t.params.page?parseInt(t.params.page):1,search:t.query.search}),component:()=>M(()=>import("./ThreadPage-CCylumQ3.js"),__vite__mapDeps([15,1,16,11,2,17,18,7,19,20,21,8,9,22,12,23]))},{path:"/new-thread/:forumId",name:"new-thread",props:t=>({forumId:parseInt(t.params.forumId)}),component:()=>M(()=>import("./NewThread-Janm5RdP.js"),__vite__mapDeps([24,1,11,2,19,16,17,18,20,21,6]))},{path:"/user-center",component:()=>M(()=>import("./UserCenter-B2qwgqDP.js"),__vite__mapDeps([25,1,2,10,11,12,13,16,17,18,20,26])),name:"user-center"},{path:"/admin-center",component:()=>M(()=>import("./AdminCenter-BCNydifT.js"),__vite__mapDeps([27,1,22,2,20,28])),name:"admin-center"},{path:"/loudspeaker",component:()=>M(()=>import("./LoudspeakerPage-C5rE4mvJ.js"),__vite__mapDeps([29,1,22,7,17,30])),name:"loudspeaker"}],pt=$e({history:Be(),routes:mt,scrollBehavior(t,e,o){return o||(t.hash?!1:{top:0})}}),L=ee("commonStore",()=>{const t=P(!1),e=P(0),o=P(document.body.clientWidth),s=P(document.body.clientWidth<1200),r=y(()=>o.value>=532?"500px":o.value-32+"px");window.addEventListener("resize",()=>{s.value=document.body.clientWidth<1200,o.value=document.body.clientWidth});const l=P(!0);function i(){const _=document.getElementById("app").offsetWidth-24;return Math.ceil(_*250/920)+"px"}const m=P(i());window.addEventListener("resize",()=>m.value=i());const d=y(()=>{const h=new Date("2023-11-11");return new Date(Date.now()).toLocaleDateString()===h.toLocaleDateString()}),c=be("user_custom",{version:240505,imgHost:"mjj",hongbaoThenStop:!1,holdPageWhenListening:!1,lessToast:!1,postLegacyMode:!1,monochromeMode:!1,sidebarLeft:!1,loudspeakerPosition:"bottom",quoteMax:3,foldMaxLine:16,lineHeightPost:28,fontSizePost:16,fontSizeQuote:16,fontSizeFooter:14,fontSizeThreadList:16,fontSizeThreadListFooter:14,fontSizeInput:16,threadListCardPadding:12,threadListInnerMargin:6,postCardPadding:12,postInnerMargin:12,hidePingbiciFloor:!1,pingbiciIngnoreCase:!1},localStorage,{mergeDefaults:!0});function C(){const h={title:"重置设定",closable:!1,content:"确定要重置所有一般设定吗？",positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{c.value.quoteMax=3,c.value.foldMaxLine=16,c.value.lineHeightPost=28,c.value.fontSizePost=16,c.value.fontSizeQuote=16,c.value.fontSizeFooter=14,c.value.fontSizeThreadList=16,c.value.fontSizeThreadListFooter=14,c.value.fontSizeInput=16,c.value.threadListCardPadding=12,c.value.threadListInnerMargin=6,c.value.postCardPadding=12,c.value.postInnerMargin=12}};window.$dialog.warning(h)}return{unauthModalShow:t,requestErrorCode:e,isMobile:s,clientWidth:o,showTopbarNav:l,bannerHeight:m,isDouble11:d,userCustom:c,modalMaxWidth:r,userCustomReset:C}}),he={common:{fontFamily:'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Microsoft YaHei"',bodyColor:"rgba(249, 249, 249, 1)"},Button:{colorPrimary:"#32BA32FF"},Card:{colorPrimary:"#32BA32FF",color:"#fafffa80"}},gt={common:{fontFamily:'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Microsoft YaHei"',textColor1:"rgba(255, 255, 255, 0.73)",textColor2:"rgba(255, 255, 255, 0.66)"},Card:{colorEmbedded:"rgba(44, 44, 50, 1)",color:"rgba(44, 44, 50, 0.5)"}},ht={common:{fontFamily:'v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Microsoft YaHei"',bodyColor:"#eefaee"},Card:{color:"#fafffa80",borderColor:"rgba(233, 245, 234, 1)"},Button:{colorPrimary:"#52b051FF",colorHoverPrimary:"#3ba251FF",color:"#ffffffFF",colorHover:"#ffffffFF",colorPressed:"#ffffffFF",colorFocus:"#ffffffFF",colorDisabled:"#ffffffFF",colorPressedPrimary:"#3a9958FF",borderPressedPrimary:"0px",borderFocusPrimary:"0px",borderDisabledPrimary:"0px",borderHoverPrimary:"0px",borderPrimary:"0px",colorSecondary:"rgba(46, 51, 56, .05)",colorTertiary:"rgba(46, 51, 56, .05)",textColorTertiary:"rgb(118, 124, 130)"}},fe={topBarBackgroudColor:"#FFF",sidebarColor:"#90d590",postItemBorderColor:"#111111",postFooterColor:"#767C82FF"},ft={topBarBackgroudColor:"#18181CFF",sidebarColor:"#316c58",postItemBorderColor:"#FFFFFF17",postFooterColor:"#FFFFFF85"},_t={topBarBackgroudColor:"#fafffaFF",sidebarColor:"#52b051",postItemBorderColor:"#5FB878",postFooterColor:"#5FB878"},le=ee("themeStore",()=>{const t=be("theme","green");function e(i){t.value=i}const o=y(()=>({light:null,dark:ze,green:null})[t.value]||null),s=y(()=>({light:he,dark:gt,green:ht})[t.value]||he),r=y(()=>({light:{strong:!0,secondary:!0},dark:{strong:!0,secondary:!0},green:{strong:!1,secondary:!1}})[t.value]||{strong:!0,secondary:!0}),l=y(()=>t.value==="light"?fe:t.value==="dark"?ft:t.value==="green"?_t:fe);return{themeClass:o,themeOverrideClass:s,themeChange:e,buttonThemeAttr:r,themeColor:l}}),p=Ce({statesHook:ye,requestAdapter:Se(),beforeRequest:t=>{t.config.headers.Accept="application/json";const e=localStorage.getItem("Token");e&&(t.config.headers.Authorization="Bearer "+e)},responded:{onSuccess:(t,e)=>A(void 0,null,function*(){var r;const o=L();if(t.status>=400){if(o.requestErrorCode=t.status,t.status==401)throw o.unauthModalShow=!0,new Error(t.statusText,{cause:{code:t.status}});const l=yield t.json();throw l.message?(window.$message.error(JSON.stringify(l.message),{closable:!0,duration:5e3}),new Error(l.message,{cause:{code:l.code}})):(window.$message.error(t.statusText,{closable:!0,duration:5e3}),new Error(t.statusText,{cause:{code:l.code}}))}const s=yield t.json();if(s.code!==200)throw o.requestErrorCode=s.code,s.code==21499?(o.unauthModalShow=!0,new Error(s.message,{cause:{code:s.code}})):(window.$message.error(JSON.stringify(s.message),{closable:!0,duration:5e3}),new Error(s.message,{cause:{code:s.code}}));return(r=e.meta)!=null&&r.shouldRemind&&!o.userCustom.lessToast&&window.$message.success(s.message),s.data}),onError:(t,e)=>{throw window.$message.error("嗷！好像网络出错了。"),t},onComplete:t=>A(void 0,null,function*(){})},errorLogger:!1,cacheLogger:!1});Ce({statesHook:ye,requestAdapter:Se(),beforeRequest:t=>{},responded:{onSuccess:(t,e)=>A(void 0,null,function*(){if(t.status>=400)throw new Error(t.statusText);return t}),onError:(t,e)=>{},onComplete:t=>A(void 0,null,function*(){})},errorLogger:!1,cacheLogger:!1});const vt=t=>p.Post("/api/user/show",{binggan:t},{name:"userDataGetter",params:{},localCache:{mode:"placeholder",expire:60*60*1e3},hitSource:[/^user(?!DataGetter).*$/,"newPostPoster","pingbiciAddPoster","pingbiciSetPoster","myEmojisAddPoster","myEmojisSetPoster","bankDepositPoster","bankWithdrawPoster","newCustomBingganPoster","battleCreatePoster","battleChanllengerRollPoster","hongbaoPostCreatePoster","hongbaoPostStorePoster","hongbaoStorePoster","newLoudspeakerPoster","deletePostDeleter","recoverPostPutter","newThreadPoster","threadChangeColorPoster"]}),bt=t=>p.Post("api/user/register",{register_key:t},{name:"userRegisterPoster",params:{},localCache:null,hitSource:[]}),Jt=t=>{const e=p.Post("api/user/reward",t,{name:"userRewardPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},Kt=t=>{const e=p.Post("api/user/water_unlock",t,{name:"waterUnlockPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!1},e},Xt=t=>{const e=p.Post("api/user/my_emoji_set",t,{name:"myEmojisSetPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},Zt=t=>{const e=p.Post("api/user/my_emoji_add",t,{name:"myEmojisAddPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},Ct=()=>{const t=p.Get("api/user/check_reg_record",{name:"checkRegisterRecordPoster",params:{},localCache:null,hitSource:[]});return t.meta={shouldRemind:!1},t},eo=t=>{const e=p.Get("api/income/show_day",{name:"incomeDataGetter",params:t,localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},to=t=>{const e=p.Get("api/income/show_sum",{name:"incomeSumDataGetter",params:t,localCache:6e4,hitSource:[]});return e.meta={shouldRemind:!1},e},oo=t=>{const e=p.Post("api/user/pingbici_set",t,{name:"pingbiciSetPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},ao=t=>{const e=p.Post("api/user/pingbici_add",t,{name:"pingbiciAddPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},ro=t=>{const e=p.Post("api/user/show_medals",t,{name:"getMedalsDataPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!1},e},so=t=>{const e=p.Post("api/user/show_medal_progress",t,{name:"getMedalProgressPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!1},e},no=t=>{const e=p.Post("api/user/show_bank",t,{name:"getBankDataPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!1},e},lo=t=>{const e=p.Post("api/user/bank_deposit",t,{name:"bankDepositPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},io=t=>{const e=p.Post("api/user/bank_withdraw",t,{name:"bankWithdrawPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},uo=t=>{const e=p.Get("api/user/user_lv_show",{name:"getUserLevelGetter",params:t,localCache:null,hitSource:[]});return e.meta={shouldRemind:!1},e},co=t=>{const e=p.Post("api/user/user_lv_up",t,{name:"userLevelUpPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},mo=t=>{const e=p.Post("api/user/create_custom",t,{name:"newCustomBingganPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},po=t=>{const e=p.Get("api/user/my_battle_chara",{name:"getUserLevelGetter",params:t,localCache:null,hitSource:[]});return e.meta={shouldRemind:!1},e},go=t=>{const e=p.Post("api/user/my_battle_chara_set",t,{name:"setUserCharaPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},Y=ee("userStore",()=>{const t=P(!1),e=localStorage.getItem("Binggan"),o=localStorage.getItem("Token"),s={binggan:{nickname:"= =",coin:0,coin_in_bank:0,use_pingbici:!1,new_msg:!1,user_lv:0,locked_ttl:0},my_battle_chara:[],emoji_excluded:[],pingbici:{content_pingbici:[],fjf_pingbici:[],title_pingbici:[]},my_emoji:[]},{loading:r,data:l,onSuccess:i,send:m}=U(vt,{initialData:s,immediate:!1});e&&o&&(t.value=!0,m(e));function d(){m(e)}function c(h){return h===void 0||r.value||l.value.binggan.admin_forums===void 0?!1:l.value.binggan.admin_forums.includes(h)}const C=y(()=>{var _;const h=(_=l.value.binggan.admin)!=null?_:0;return{isForumAdmin:h>=1,isNormalAdmin:h>=10,isSeniorAdmin:h>=20,isSuperAdmin:h>=99}});return{userDataLoading:r,userData:l,userLoginStatus:t,binggan:e,admin:C,refreshUserData:d,checkAdminForums:c}}),yt=I({setup(){window.$dialog=Ae()}}),Ie=(t,e)=>{const o=t.__vccOpts||t;for(const[s,r]of e)o[s]=r;return o};function St(t,e,o,s,r,l){return b(),te("div")}const wt=Ie(yt,[["render",St]]),Pt=I({setup(){window.$message=Ue()}});function kt(t,e,o,s,r,l){return b(),te("div")}const It=Ie(Pt,[["render",kt]]),xt=(t,e)=>p.Post("/api/login",{binggan:t,password:e},{name:"userLoginPoster",params:{},localCache:null}),Ft=t=>p.Post("/api/logout",{binggan:t},{name:"userLogoutPoster",params:{},localCache:null}),ho=t=>{const e=p.Post("/api/set_password",t,{name:"userSetPasswordPoster",params:{},localCache:null});return e.meta={shouldRemind:!0},e};function xe(){localStorage.removeItem("Binggan"),localStorage.removeItem("Token"),window.location.href="/"}const Lt={size:"1rem"},z=(t,e=Lt)=>{let o="1rem";return typeof e.size=="string"?o=e.size:typeof e.size=="number"&&(o=e.size+"rem"),()=>f(Ge,{size:o,color:e.color},{default:()=>f(t)})},Tt=p.Get("/api/new_binggan_enable/",{name:"newBingganEnableGetter",params:{},localCache:null}),fo=p.Get("/api/home_banners/",{name:"homeBannersGetter",params:{},localCache:{mode:"placeholder",expire:60*60*1e3}}),_o=p.Get("/api/new_loudspeaker_enable",{name:"newLoudspeakerEnableGetter",params:{},localCache:null});function Rt(t){var e,o,s="",r;for(t+="",e=0,o=t.length;e<o;e++)r=t.charCodeAt(e).toString(16),s+=r.length<2?"0"+r:r;return s}function Mt(t){var e=document.createElement("canvas"),o=e.getContext("2d"),s=t;o.textBaseline="top",o.font="14px 'Arial'",o.textBaseline="alphabetic",o.fillStyle="#f60",o.fillRect(125,1,62,20),o.fillStyle="#069",o.fillText(s,2,15),o.fillStyle="rgba(102, 204, 0, 0.7)",o.fillText(s,4,17);var r=e.toDataURL().replace("data:image/png;base64,",""),l=atob(r),i=Rt(l.slice(-16,-12));return i}function Et(){const t="XiaoHuoGuoCpttmm",e="abcdef0123456789",o=B.enc.Utf8.parse(t);var r={iv:B.enc.Utf8.parse(e),mode:B.mode.CBC,padding:B.pad.Pkcs7};const l=Mt("BrowserLeaks,com <canvas> 1.0"),i=B.MD5(navigator.userAgent).toString().substr(0,8);return B.AES.encrypt("XiaoHuoGuo"+l+i,o,r).toString()}const $=I({__name:"FButton",setup(t){const e=L(),o=le(),s=we(),r=y(()=>N(N({},s),o.buttonThemeAttr)),l=y(()=>e.isMobile?"small":"medium");return(i,m)=>(b(),S(a(je),V({round:"",size:l.value},r.value),W({_:2},[q(i.$slots,(d,c,C)=>({name:c,fn:n(()=>[Q(i.$slots,c)])}))]),1040,["size"]))}}),_e=I({__name:"FInput",props:{autoSize:{type:Boolean,default:!1}},setup(t){const e=L(),o=t,s=y(()=>o.autoSize&&e.isMobile?"small":"medium");return(r,l)=>(b(),S(a(He),V({round:"",size:s.value},r.$attrs),W({_:2},[q(r.$slots,(i,m,d)=>({name:m,fn:n(()=>[Q(r.$slots,m)])}))]),1040,["size"]))}}),ve=I({__name:"FInputGroupLabel",props:{round:{type:Boolean,default:!0},autoSize:{type:Boolean,default:!1}},setup(t){const e=L(),o=we(),s=t,r=s.round?{"border-bottom-left-radius":"17px","border-top-left-radius":"17px"}:void 0,l=y(()=>ce(N({},o),{style:r})),i=y(()=>s.autoSize&&e.isMobile?"small":"medium");return(m,d)=>(b(),S(a(Ne),V({size:i.value},l.value),W({_:2},[q(m.$slots,(c,C,h)=>({name:C,fn:n(()=>[Q(m.$slots,C)])}))]),1040,["size"]))}}),Dt=I({__name:"FCheckbox",setup(t){const e=L(),o=y(()=>e.isMobile?"small":"medium");return(s,r)=>(b(),S(a(Oe),V({size:o.value},s.$attrs),W({_:2},[q(s.$slots,(l,i,m)=>({name:i,fn:n(()=>[Q(s.$slots,i)])}))]),1040,["size"]))}}),$t=k("div",null,[g("这里是私人论坛，欢迎来玩！"),k("br"),g("QQ小火锅避难群：156840110 "),k("br"),g("使用前需要在下面申请或者导入饼干喔")],-1),Bt=I({__name:"LoginModal",emits:["submitRegister"],setup(t,{expose:e,emit:o}){const s=L(),r=P(!1);e({show:()=>r.value=!0});const i=P(""),m=P(""),{data:d}=U(Tt,{initialData:!1}),{data:c}=U(Ct(),{initialData:{reg_record_TTL:-2}}),C=y(()=>{var E,w;if(!(((E=c.value)==null?void 0:E.reg_record_TTL)<=0))return`在${Math.floor(((w=c.value)==null?void 0:w.reg_record_TTL)/3600)}小时后才能再次领取饼干。`}),h=()=>{K(i.value,m.value),m.value=""},{loading:_,onSuccess:T,data:R,send:K}=U(xt,{immediate:!1});T(()=>{localStorage.Token=R.value.token,localStorage.Binggan=R.value.binggan,window.location.href="/"});const v=()=>{Fe(Et())},{loading:G,onSuccess:X,onError:j,data:H,send:Fe}=U(bt,{immediate:!1});X(()=>{const E=Y();E.binggan=H.value.binggan,localStorage.Token=H.value.token,localStorage.Binggan=H.value.binggan,r.value=!1,Le("submitRegister")}),j(E=>{window.$dialog.error({title:"申请饼干失败",content:E.error.message})});const Le=o;return(E,w)=>(b(),S(a(se),{show:r.value,"onUpdate:show":w[4]||(w[4]=D=>r.value=D),"display-directive":"if"},{default:n(()=>[u(a(re),{style:ae({maxWidth:a(s).modalMaxWidth}),title:"欢迎来到小火锅！",closable:"",onClose:w[3]||(w[3]=D=>r.value=!1),size:"small"},{action:n(()=>[u(a(F),{justify:"end"},{default:n(()=>[a(c).reg_record_TTL>0?(b(),S(a(x),{key:0,style:{"margin-right":"auto"}},{default:n(()=>[g(oe(C.value),1)]),_:1})):O("",!0),u(a($),{onClick:w[2]||(w[2]=D=>r.value=!1)},{default:n(()=>[g("关闭")]),_:1})]),_:1})]),default:n(()=>[u(a(F),{vertical:""},{default:n(()=>[$t,u(a(de),null,{default:n(()=>[u(a(ve),{style:{width:"3.2rem"}},{default:n(()=>[g("饼干")]),_:1}),u(a(_e),{value:i.value,"onUpdate:value":w[0]||(w[0]=D=>i.value=D),placeholder:"请输入饼干",maxlength:"16",onKeyup:me(h,["enter"])},null,8,["value"])]),_:1}),u(a(de),null,{default:n(()=>[u(a(ve),{style:{width:"3.2rem"},class:"round"},{default:n(()=>[g("密码")]),_:1}),u(a(_e),{type:"password",placeholder:"（可留空）请输入密码","show-password-on":"mousedown",value:m.value,"onUpdate:value":w[1]||(w[1]=D=>m.value=D),onKeyup:me(h,["enter"])},null,8,["value"])]),_:1}),u(a(F),null,{default:n(()=>[u(a(We),{placement:"bottom",trigger:"hover",disabled:a(d)},{trigger:n(()=>[u(a($),{type:"warning",disabled:a(G)||!a(d)||a(c).reg_record_TTL>0,onClick:v},{default:n(()=>[g(" 我想领取新饼干！ ")]),_:1},8,["disabled"])]),default:n(()=>[u(a(x),null,{default:n(()=>[g("嗷！很抱歉，领取新饼干目前暂停中…… ")]),_:1})]),_:1},8,["disabled"]),u(a($),{style:{"margin-left":"auto"},type:"primary",onClick:h,disabled:a(_)},{default:n(()=>[g("导入饼干")]),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1},8,["style"])]),_:1},8,["show"]))}}),zt=k("br",null,null,-1),At=I({__name:"RegisterHintModal",setup(t,{expose:e}){const o=Y(),s=L(),r=P(!1);e({show:()=>r.value=!0});function i(){r.value=!1,window.location.href="/"}return(m,d)=>{const c=ne("router-link");return b(),S(a(se),{show:r.value,"onUpdate:show":d[1]||(d[1]=C=>r.value=C),"display-directive":"if"},{default:n(()=>[u(a(re),{style:ae({maxWidth:a(s).modalMaxWidth}),title:"欢迎加入小火锅！",closable:"",onClose:d[0]||(d[0]=C=>r.value=!1),size:"small"},{action:n(()=>[u(a(F),{justify:"end"},{default:n(()=>[u(a($),{onClick:i},{default:n(()=>[g("关闭")]),_:1})]),_:1})]),default:n(()=>[u(a(F),{vertical:"",size:"medium",style:{"word-wrap":"break-word"}},{default:n(()=>[k("div",null,[g("你的饼干是："),u(a(x),{strong:"",type:"info",style:{"font-size":"1.5rem"}},{default:n(()=>[g(oe(a(o).binggan),1)]),_:1}),zt,g("（之后在个人中心也可以查看）")]),u(a(x),{depth:"2"},{default:n(()=>[g("① 饼干就是你的小火锅账号。请保存好，不要泄露喔！")]),_:1}),u(a(x),{depth:"2"},{default:n(()=>[g("② 为了账号安全，建议尽快在个人中心设定密码。")]),_:1}),u(a(x),{depth:"2"},{default:n(()=>[g("③ 请务必遵守"),u(c,{to:"/thread/13351"},{default:n(()=>[g("小火锅版规")]),_:1}),g("喔！")]),_:1})]),_:1})]),_:1},8,["style"])]),_:1},8,["show"])}}}),Ut=k("div",{id:"topbar-nav"},null,-1),Gt=k("div",{id:"topbar-func"},null,-1),jt=k("img",{src:"https://ll4484.bvimg.com/21501/d9a590aef0560534.png",style:{"margin-left":"auto"},class:"img-icon"},null,-1),Ht=I({__name:"TopBar",setup(t){Pe(v=>({fa5cd518:a(d).textColor1,"766b769a":a(m).themeColor.topBarBackgroudColor,"008fe643":a(d).dividerColor}));const e=Y(),o=L(),s=qe(),r=Ve(),l=P(null),i=P(null),m=le(),d=ke(),c=[{label:"白汤锅",key:"light",icon:z(Z,{color:"#F9F9F9"})},{label:"芝麻锅",key:"dark",icon:z(Z,{color:"#101014"})},{label:"青菜锅",key:"green",icon:z(Z,{color:"#53A551"})},{type:"render",key:"monochrome",render:C}];function C(){return f(F,{style:"padding:6px 8px",vertical:!0},()=>[f(Dt,{checked:o.userCustom.monochromeMode,"onUpdate:checked":v=>o.userCustom.monochromeMode=v,label:"单色模式"})])}function h(){return f(F,{vertical:!0},()=>[f("div",{style:"display: flex; align-items: center; padding: 4px 8px;"},[f("img",{style:"max-height: 40px;",src:"https://ll4484.bvimg.com/21501/6fe7ac5fa3fe2159.png"}),f("div",null,[f("div",null,[f(x,{depth:3},{default:()=>"我的饼干"})]),f("div",{style:"font-size: 1rem;"},[f(x,{depth:2},{default:()=>e.binggan})])])]),f("div",{style:"display: flex; align-items: center; padding: 4px 8px;"},[f("img",{style:"max-height: 40px;",src:"https://ll4484.bvimg.com/21501/f411b2d1d632cf32.png"}),f("div",null,[f("div",null,[f(x,{depth:3},{default:()=>"奥利奥"})]),f("div",{style:"font-size: 1rem;"},[f(x,{depth:2},{default:()=>e.userData.binggan.coin})])])])])}const _=y(()=>{const v=[{key:"header",type:"render",render:h},{key:"header-divider",type:"divider"},{label:"个人中心",key:"profile",icon:z(Xe,{size:"1.25rem"}),props:{onClick:()=>s.push("/user-center")}},{label:"退出饼干",key:"logout",icon:z(Ze,{size:"1.25rem"}),props:{onClick:T}}];return e.admin.isForumAdmin&&v.splice(3,0,{label:"管理中心",key:"admin",icon:z(et,{size:"1.25rem"}),props:{onClick:()=>s.push("/admin-center")}}),v});function T(){const v={title:"退出饼干",closable:!1,content:"确定要退出饼干吗？请务必先记下自己的饼干喔。",positiveText:"确定",negativeText:"取消",onPositiveClick:()=>{Ft(e.binggan).then(()=>{xe(),window.location.href="/"})}};window.$dialog.warning(v)}function R(){e.refreshUserData()}function K(){var v;(v=i.value)==null||v.show()}return Qe(()=>{var v;!(localStorage.getItem("Binggan")&&localStorage.getItem("Token"))&&r.path=="/"&&((v=l.value)==null||v.show())}),(v,G)=>{const X=ne("router-link");return b(),S(a(F),{class:"top-bar",align:"center"},{default:n(()=>{var j;return[k("img",{src:"/favicon.png",alt:"",onClick:G[0]||(G[0]=H=>v.$router.push("/"))}),Ye(u(X,{to:"/"},{default:n(()=>[g(" 小火锅 ")]),_:1},512),[[Je,a(o).showTopbarNav]]),Ut,Gt,u(a(pe),{trigger:a(o).isMobile?"click":"hover",options:c,onSelect:a(m).themeChange},{default:n(()=>[jt]),_:1},8,["trigger","onSelect"]),a(e).userLoginStatus?(b(),S(a(pe),{key:0,trigger:a(o).isMobile?"click":"hover",options:_.value},{default:n(()=>[k("img",{src:"https://ll4484.bvimg.com/21501/e0ccb7c5a30c3537.png",onMouseenter:R,class:"img-icon"},null,32)]),_:1},8,["trigger","options"])):O("",!0),!a(e).userDataLoading&&!a(e).userLoginStatus?(b(),S(a($),{key:1,type:"primary",onClick:(j=l.value)==null?void 0:j.show},{default:n(()=>[g(" 导入饼干 ")]),_:1},8,["onClick"])):O("",!0),!a(e).userDataLoading&&!a(e).userLoginStatus?(b(),te(Ke,{key:2},[u(Bt,{ref_key:"LoginModalCom",ref:l,onSubmitRegister:K},null,512),u(At,{ref_key:"registerHintModalCom",ref:i},null,512)],64)):O("",!0)]}),_:1})}}}),Nt=k("img",{src:"https://ll4484.bvimg.com/21501/35a95bd9d55dec07.png",alt:"需要饼干才能进入喔"},null,-1),Ot={style:{"margin-left":"auto"}},Wt=I({__name:"UnauthModal",setup(t){const e=L(),o=y(()=>e.requestErrorCode===401?"你未导入饼干，或者饼干的登录信息已失效。请申请或重新导入饼干。":e.requestErrorCode===21499?"嗷……你的饼干被碎了。请申请或重新导入饼干。":"");return(s,r)=>(b(),S(a(se),{show:a(e).unauthModalShow,"onUpdate:show":r[2]||(r[2]=l=>a(e).unauthModalShow=l),"display-directive":"if"},{default:n(()=>[u(a(re),{style:ae({maxWidth:a(e).modalMaxWidth}),closable:"",onClose:r[1]||(r[1]=l=>a(e).unauthModalShow=!1),size:"small"},{action:n(()=>[u(a(F),{justify:"end"},{default:n(()=>[u(a($),{onClick:a(xe),type:"primary"},{default:n(()=>[g("导入饼干")]),_:1},8,["onClick"]),u(a($),{onClick:r[0]||(r[0]=l=>a(e).unauthModalShow=!1)},{default:n(()=>[g("关闭")]),_:1})]),_:1})]),default:n(()=>[u(a(F),{vertical:""},{default:n(()=>[Nt,k("div",Ot,oe(o.value),1)]),_:1})]),_:1},8,["style"])]),_:1},8,["show"]))}}),qt=I({__name:"App",setup(t){Pe(r=>({"6d19f257":a(s).userCustom.fontSizeQuote+"px","0596cefa":a(o).textColor3,"9240e7b8":a(o).warningColor,"26bd8504":a(o).primaryColor,"12c5a878":a(o).errorColor,feb23f74:a(e).themeColor.postFooterColor}));const e=le(),o=ke();Y();const s=L();return(r,l)=>{const i=ne("router-view");return b(),S(a(lt),{theme:a(e).themeClass,"theme-overrides":a(e).themeOverrideClass,locale:a(nt)},{default:n(()=>[u(a(tt)),u(a(ot),null,{default:n(()=>[u(It)]),_:1}),u(a(at),null,{default:n(()=>[u(wt)]),_:1}),u(Ht),u(i,null,{default:n(({Component:m})=>[(b(),S(rt,{include:"ThreadPage,NewThread"},[(b(),S(st(m)))],1024))]),_:1}),u(Wt)]),_:1},8,["theme","theme-overrides","locale"])}}}),Vt=it(),J=ut({});J.component("app",qt);J.use(pt);J.use(Vt);J.mount("#app");export{ho as A,oo as B,Zt as C,_o as D,Ie as _,Y as a,$ as b,_e as c,Dt as d,ve as e,Jt as f,p as g,fo as h,le as i,no as j,lo as k,io as l,po as m,mo as n,Xt as o,ao as p,eo as q,z as r,go as s,to as t,L as u,uo as v,Kt as w,co as x,ro as y,so as z};