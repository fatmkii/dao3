import{w as _,$ as m,d as g,A as f,M as v,f as s,H as n,a as e,i as x,m as w,k as c,n as I,z as d,j as S,h as j,s as C,aJ as $}from"./app-Dqwzfab-.js";const b={0:{name:"空白占位",ImgSrc:""},23410:{name:"已日清",ImgSrc:"https://oss.cpttmm.com/xhg_other/notice_2.png"},23401:{name:"olo不足",ImgSrc:"https://oss.cpttmm.com/xhg_other/notice_3.png"},234011:{name:"私密主题",ImgSrc:"https://oss.cpttmm.com/xhg_other/notice_1.png"},23404:{name:"板块or主题不存在",ImgSrc:"https://oss.cpttmm.com/xhg_other/notice_404.png"},21404:{name:"需要饼干",ImgSrc:"https://oss.cpttmm.com/xhg_other/notice_4.png"}},y=["src"],W=_({__name:"ForbiddenModal",setup(M,{expose:u}){const l=m(0),i=m(""),p=g(()=>{const t=window.innerWidth;return t>=532?"500px":t-32+"px"}),a=m(!1);function h(t){l.value=t.errorCode,i.value=t.message,a.value=!0}return u({show:h}),(t,o)=>(f(),v(e($),{show:a.value,"onUpdate:show":o[2]||(o[2]=r=>a.value=r),"display-directive":"if"},{default:s(()=>[n(e(x),{style:w({maxWidth:p.value}),closable:"",onClose:o[1]||(o[1]=r=>a.value=!1),size:"small"},{action:s(()=>[n(e(c),{justify:"end"},{default:s(()=>[n(e(I),{onClick:o[0]||(o[0]=r=>a.value=!1)},{default:s(()=>[d("关闭")]),_:1})]),_:1})]),default:s(()=>[n(e(c),{vertical:""},{default:s(()=>[S("img",{style:{width:"100%"},src:e(b)[l.value].ImgSrc},null,8,y),n(e(j),null,{default:s(()=>[d(C(i.value),1)]),_:1})]),_:1})]),_:1},8,["style"])]),_:1},8,["show"]))}});export{W as default};