import{w as l,b as i,d,A as r,M as c,aV as h,Q as g,am as b,a as _,f as m,bO as u,e as v,bL as w,bJ as t}from"./app-Dqwzfab-.js";import{a as P}from"./Checkbox-Doo8sv46.js";const N=l({__name:"FCheckbox",setup(e){const o=i(),s=d(()=>o.isMobile?"small":"medium");return(n,C)=>(r(),c(_(P),b({size:s.value},n.$attrs),h({_:2},[g(n.$slots,(T,a,k)=>({name:a,fn:m(()=>[u(n.$slots,a)])}))]),1040,["size"]))}});function x(){const e=i();v(()=>{e.showTopbarNav=!1}),w(()=>{e.showTopbarNav=!0})}const O=e=>t.Post("/api/threads/create",{binggan:e.binggan,forum_id:e.forumId,title:e.title,content:e.content,nickname:e.nickname,subtitle:e.subtitle,thread_type:e.threadType,post_with_admin:e.postWithAdmin,anti_jingfen:e.antiJingfen,is_delay:e.isDelay,is_private:e.isPrivate,can_battle:e.canBattle,random_heads_group:e.randomHeadsGroup,nissin_time:e.nissinTime,title_color:e.titleColor,locked_by_coin:e.lockedByCoin,sub_id:e.subId,...e.hongbaoParams===void 0?{}:{hongbao_params:{type:e.hongbaoParams.type,hongbao_olo:e.hongbaoParams.hongbaoOlo,hongbao_num:e.hongbaoParams.hongbaoNum,hongbao_keyword:e.hongbaoParams.hongbaoKeyWord,hongbao_olo_hide:e.hongbaoParams.hongbaoOloHide,hongbao_loudspeaker:e.hongbaoParams.hongbaoLoudspeaker}},...e.voteParams===void 0?{}:{vote_params:{vote_multiple:e.voteParams.voteMultiple,vote_title:e.voteParams.voteTitle,vote_options:e.voteParams.voteOptions,vote_end_time:e.voteParams.voteEndTime,vote_max_choices:e.voteParams.voteMaxChoices}},...e.gambleParams===void 0?{}:{gamble_params:{gamble_title:e.gambleParams.gambleTitle,gamble_options:e.gambleParams.gambleOptions,gamble_end_time:e.gambleParams.gambleEndTime}},...e.crowdParams===void 0?{}:{crowd_params:{crowd_title:e.crowdParams.crowdTitle,crowd_end_time:e.crowdParams.crowdEndTime,crowd_olo_target:e.crowdParams.crowdOloTarget}}},{name:"newThreadPoster",localCache:null}),$=e=>{const o=t.Delete("/api/threads/delay/"+e,{name:"delayThreadDeleter",localCache:null});return o.meta={shouldRemind:!0},o},A=e=>t.Get("/api/threads/"+e.threadId,{name:"postsListGetter",params:{binggan:e.binggan,page:e.page,search_content:e.searchContent},localCache:null}),D=e=>{const o=t.Post("api/threads/change_color",e,{name:"threadChangeColorPoster",params:{},localCache:null,hitSource:[]});return o.meta={shouldRemind:!0},o};function I(e){const o={title:e.title,closable:!1,content:e.content,positiveText:"确定",negativeText:"取消",onPositiveClick:e.onPositiveClick,onNegativeClick:e.onNegativeClick};switch(e.mode){case"warning":window.$dialog.warning(o);break;case"success":window.$dialog.success(o);break;default:window.$dialog.warning(o);break}}export{N as _,$ as d,O as n,A as p,I as s,D as t,x as u};