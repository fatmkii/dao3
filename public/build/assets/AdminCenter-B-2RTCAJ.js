function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/TabBanners-_gzSBPKE.js","assets/app-Bkek0-g6.js","assets/app-CFVkJkKo.css","assets/admin-BG8QDFHo.js","assets/forums-CV3FCPIQ.js","assets/Input-BV_BI3gk.js","assets/use-locale-DVs0hfkD.js","assets/Select-y4KCVrHh.js","assets/Tag-CNHGSnKb.js","assets/TabBanners-CVtthvwT.css","assets/TabGlobal-CbrAvN2v.js","assets/Switch-BZiMAdag.js","assets/TabGlobal-DUFtVQGM.css","assets/TabMedal-Dpxk2pn6.js","assets/FInput.vue_vue_type_script_setup_true_lang-cXbnOQOQ.js","assets/FormItem-AssHkb-w.js","assets/TabCoin-BbYnq62o.js","assets/inputNumberFormat-DaYmlx6U.js","assets/InputNumber-CBc6mNCI.js","assets/Add-CgrTi5vb.js","assets/AdminCard-f0SF9EO7.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{aw as t,ax as o,w as p,o as b,b as v,$ as A,d as T,A as n,M as r,f as i,a as e,H as u,F as E,Q as f,C as P,k as x,j as C,aA as L}from"./app-Bkek0-g6.js";import{a as V,N as w}from"./Tabs-B1jcKDbR.js";import"./Add-CgrTi5vb.js";const D=t(()=>o(()=>import("./TabBanners-_gzSBPKE.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]))),I=t(()=>o(()=>import("./TabGlobal-CbrAvN2v.js"),__vite__mapDeps([10,1,2,3,4,11,12]))),M=t(()=>o(()=>import("./TabMedal-Dpxk2pn6.js"),__vite__mapDeps([13,1,2,3,4,14,5,6,15,7,8]))),N=t(()=>o(()=>import("./TabCoin-BbYnq62o.js"),__vite__mapDeps([16,1,2,3,14,5,6,17,15,18,19]))),O=t(()=>o(()=>import("./AdminCard-f0SF9EO7.js"),__vite__mapDeps([20,1,2,4,8]))),R=C("div",{style:{height:"50px"}},null,-1),F=p({__name:"AdminCenter",setup(S){const d=b(),m=v(),l=A();document.title="管理员中心";const c=T(()=>{const s=[{name:"actives",tab:"管理状况",component:null},{name:"banners",tab:"版头设定",component:D}];return d.admin.isSuperAdmin?s.concat([{name:"global",tab:"全局设置",component:I},{name:"medals",tab:"发放成就",component:M},{name:"olo",tab:"奖罚olo",component:N}]):s});return(s,_)=>(n(),r(e(x),{vertical:"",style:{"margin-top":"8px"}},{default:i(()=>[u(e(O)),u(e(V),{type:"line","bar-width":e(m).isMobile?0:void 0,animated:"",size:e(m).isMobile?"small":"large",value:l.value,"onUpdate:value":_[0]||(_[0]=a=>l.value=a)},{default:i(()=>[(n(!0),E(P,null,f(c.value,a=>(n(),r(e(w),{name:a.name,tab:a.tab,key:a.name},{default:i(()=>[(n(),r(L(a.component)))]),_:2},1032,["name","tab"]))),128))]),_:1},8,["bar-width","size","value"]),R]),_:1}))}});export{F as default};
