import{b as n,e as a,aX as i,bi as t}from"./app-B4DzAUIj.js";function d(){const e=n();a(()=>{e.showTopbarNav=!1}),i(()=>{e.showTopbarNav=!0})}const s=e=>t.Post("/api/threads/create",{binggan:e.binggan,forum_id:e.forumId,title:e.title,content:e.content,nickname:e.nickname,subtitle:e.subtitle,thread_type:e.threadType,post_with_admin:e.postWithAdmin,anti_jingfen:e.antiJingfen,is_delay:e.isDelay,is_private:e.isPrivate,can_battle:e.canBattle,random_heads_group:e.randomHeadsGroup,nissin_time:e.nissinTime,title_color:e.titleColor,locked_by_coin:e.lockedByCoin,sub_id:e.subId,...e.hongbaoParams===void 0?{}:{hongbao_params:{type:e.hongbaoParams.type,hongbao_olo:e.hongbaoParams.hongbaoOlo,hongbao_num:e.hongbaoParams.hongbaoNum,hongbao_keyword:e.hongbaoParams.hongbaoKeyWord,hongbao_olo_hide:e.hongbaoParams.hongbaoOloHide,hongbao_loudspeaker:e.hongbaoParams.hongbaoLoudspeaker}},...e.voteParams===void 0?{}:{vote_params:{vote_multiple:e.voteParams.voteMultiple,vote_title:e.voteParams.voteTitle,vote_options:e.voteParams.voteOptions,vote_end_time:e.voteParams.voteEndTime,vote_max_choices:e.voteParams.voteMaxChoices}},...e.gambleParams===void 0?{}:{gamble_params:{gamble_title:e.gambleParams.gambleTitle,gamble_options:e.gambleParams.gambleOptions,gamble_end_time:e.gambleParams.gambleEndTime}},...e.crowdParams===void 0?{}:{crowd_params:{crowd_title:e.crowdParams.crowdTitle,crowd_end_time:e.crowdParams.crowdEndTime,crowd_olo_target:e.crowdParams.crowdOloTarget}}},{name:"newThreadPoster",localCache:null}),c=e=>{const o=t.Delete("/api/threads/delay/"+e,{name:"delayThreadDeleter",localCache:null});return o.meta={shouldRemind:!0},o},r=e=>t.Get("/api/threads/"+e.threadId,{name:"postsListGetter",params:{binggan:e.binggan,page:e.page,search_content:e.searchContent},localCache:null}),g=e=>{const o=t.Post("api/threads/change_color",e,{name:"threadChangeColorPoster",params:{},localCache:null,hitSource:[]});return o.meta={shouldRemind:!0},o};function h(e){const o={title:e.title,closable:!1,content:e.content,positiveText:"确定",negativeText:"取消",onPositiveClick:e.onPositiveClick,onNegativeClick:e.onNegativeClick};switch(e.mode){case"warning":window.$dialog.warning(o);break;case"success":window.$dialog.success(o);break;default:window.$dialog.warning(o);break}}export{c as d,s as n,r as p,h as s,g as t,d as u};
