var c=Object.defineProperty,u=Object.defineProperties;var m=Object.getOwnPropertyDescriptors;var o=Object.getOwnPropertySymbols;var d=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;var n=(t,e,s)=>e in t?c(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s,r=(t,e)=>{for(var s in e||(e={}))d.call(e,s)&&n(t,s,e[s]);if(o)for(var s of o(e))i.call(e,s)&&n(t,s,e[s]);return t},l=(t,e)=>u(t,m(e));import{a as h,g as a}from"./app-CzMN0HNP.js";const p=h(),_=t=>{const e=a.Post("api/admin/thread_delete",t,{name:"deleteThreadPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},C=t=>{const e=a.Delete("api/admin/post_delete/"+t.post_id,t,{name:"deletePostPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},I=t=>{const e=a.Put("api/admin/post_recover/"+t.post_id,t,{name:"recoveryPostPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},R=t=>{const e=a.Post("api/admin/post_delete_all",t,{name:"deleteAllPostPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},g=t=>{const e=a.Post("api/admin/user_ban",t,{name:"userBanPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},k=t=>{const e=a.Post("api/admin/user_lock",t,{name:"userLockPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},b=t=>{const e=a.Post("api/admin/check_post",t,{name:"userCheckPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},G=t=>{const e=a.Post("api/admin/thread_set_top",t,{name:"threadSetTopPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},v=t=>{const e=a.Post("api/admin/thread_cancel_top",t,{name:"threadCancelTopPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},T=t=>{const e=a.Post("api/admin/del_loudspeaker",t,{name:"deleteLoudspeakerPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},A=t=>{const e=a.Post("api/admin/set_banner",t,{name:"setBannersPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},U=t=>{const e=a.Post("api/admin/create_medal",t,{name:"createMedalPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},f=t=>{const e=a.Post("api/admin/set_user_olo",t,{name:"setUserOloPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},B=(t="")=>{const e=a.Get("api/admin/global_setting/"+t,{name:"globalSettingDataGetter",params:{binggan:p.binggan},localCache:null,hitSource:[]});return e.meta={shouldRemind:!1},e},L=t=>{const e=a.Post("api/admin/set_global_setting",t,{name:"setGlobalSettingPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e},D=t=>{const e=a.Get("api/admin/actives",{name:"adminActivesGetter",params:l(r({},t),{show_super:t.show_super?1:0}),localCache:null,hitSource:[]});return e.meta={shouldRemind:!1},e},w=t=>{const e=a.Post("api/admin/unlock_uuid",t,{name:"unlockUuidPoster",params:{},localCache:null,hitSource:[]});return e.meta={shouldRemind:!0},e};export{G as a,C as b,R as c,_ as d,k as e,g as f,B as g,L as h,U as i,f as j,D as k,w as l,T as m,I as r,A as s,v as t,b as u};
