import{w as g,o as N,b as h,aO as S,g as z,u as M,A as _,M as y,f as t,H as a,a as e,h as n,z as i}from"./app-BStV-yuR.js";import{u as R}from"./forums-DPJEWvF1.js";import{a as U,N as p}from"./Grid-BUEESWZB.js";import{N as d}from"./Tabs-DcvONM7_.js";import{b as u,c as m,N as f,a as w}from"./Switch-CRH8FpWK.js";import{N as b}from"./Select-B9C_qx_7.js";import"./Add-vXYQIfAu.js";import"./use-locale-B7_UWEDL.js";import"./Input-Bj8i2T-n.js";import"./Tag-CCZNyJlJ.js";const G=g({__name:"TabCommon",setup(T){N();const r=h();R(),S(),z(),M();const o=r.userCustom,v=[{value:"top",label:"放在顶部"},{value:"center",label:"放在中间"},{value:"bottom",label:"放在底部"}],x=[{value:"mjj",label:"mjj"},{value:"imgbb",label:"imgbb"},{value:"freeimage",label:"freeimage"}];return(j,l)=>(_(),y(e(w),{ref:"formRef",model:e(o),"label-placement":"left","label-width":"auto",size:e(r).isMobile?"small":"medium"},{default:t(()=>[a(e(U),{cols:"1 600:2","x-gap":12},{default:t(()=>[a(e(p),{style:{"max-width":"18rem"}},{default:t(()=>[a(e(d),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:t(()=>[a(e(n),{depth:"3",style:{"font-size":"0.875rem"}},{default:t(()=>[i("外观选项 ")]),_:1})]),_:1}),a(e(u),{label:"大喇叭位置",path:"loudspeakerPosition"},{default:t(()=>[a(e(b),{value:e(o).loudspeakerPosition,"onUpdate:value":l[0]||(l[0]=s=>e(o).loudspeakerPosition=s),options:v,"menu-props":{style:{borderRadius:"10px"}}},null,8,["value"])]),_:1}),a(e(u),{label:"单色模式",path:"monochromeMode"},{default:t(()=>[a(e(m),{value:e(o).monochromeMode,"onUpdate:value":l[1]||(l[1]=s=>e(o).monochromeMode=s)},null,8,["value"])]),_:1}),a(e(u),{label:"侧边栏放左边",path:"sidebarLeft"},{default:t(()=>[a(e(m),{value:e(o).sidebarLeft,"onUpdate:value":l[2]||(l[2]=s=>e(o).sidebarLeft=s)},null,8,["value"])]),_:1}),a(e(u),{label:"最大引用层数",path:"quoteMax"},{default:t(()=>[a(e(f),{value:e(o).quoteMax,"onUpdate:value":l[3]||(l[3]=s=>e(o).quoteMax=s),max:6,min:1,step:1},null,8,["value"])]),_:1}),a(e(u),{label:"字体大小",path:"fontRemSize"},{default:t(()=>[a(e(f),{value:e(o).fontRemSize,"onUpdate:value":l[4]||(l[4]=s=>e(o).fontRemSize=s),max:24,min:10,step:1},null,8,["value"])]),_:1})]),_:1}),a(e(p),{style:{"max-width":"18rem"}},{default:t(()=>[a(e(d),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:t(()=>[a(e(n),{depth:"3",style:{"font-size":"0.875rem"}},{default:t(()=>[i("功能选项 ")]),_:1})]),_:1}),a(e(u),{label:"图床选择",path:"loudspeakerPosition"},{default:t(()=>[a(e(b),{value:e(o).imgHost,"onUpdate:value":l[5]||(l[5]=s=>e(o).imgHost=s),options:x,"menu-props":{style:{borderRadius:"10px"}}},null,8,["value"])]),_:1}),a(e(u),{label:"自动涮锅时遇红包停止",path:"hongbaoThenStop"},{default:t(()=>[a(e(m),{value:e(o).hongbaoThenStop,"onUpdate:value":l[6]||(l[6]=s=>e(o).hongbaoThenStop=s)},null,8,["value"])]),_:1})]),_:1})]),_:1})]),_:1},8,["model","size"]))}});export{G as default};