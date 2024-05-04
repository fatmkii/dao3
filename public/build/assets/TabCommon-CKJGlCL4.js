import{w as h,b as x,A as N,M as z,f as l,H as a,a as e,h as n,z as r,i as S}from"./app-lxfZSp_D.js";import{N as M,a as u}from"./FormItem-B-5qHAiP.js";import{a as U,N as p}from"./Grid-C6AF8KVE.js";import{N as d}from"./Divider-Dz0Y5kwG.js";import{N as f}from"./Select-CnaDYTE-.js";import{N as m}from"./Switch-DnYkoJV6.js";import{N as b}from"./InputNumber-BaFQKt_b.js";import"./use-locale-Cx7xZzq0.js";import"./Tag-CaFNK4rR.js";import"./Input-BuBGdj4Z.js";import"./Add-Zj7rYPjO.js";const I=h({__name:"TabCommon",setup(_){const i=x(),t=i.userCustom,v=[{value:"top",label:"放在顶部"},{value:"center",label:"放在中间"},{value:"bottom",label:"放在底部"}],g=[{value:"mjj",label:"mjj"},{value:"imgbb",label:"imgbb"},{value:"freeimage",label:"freeimage"}];return(y,o)=>(N(),z(e(S),{title:"一般设定",size:"small"},{"header-extra":l(()=>[a(e(n),{depth:3},{default:l(()=>[r("这些设定保存在本设备，不跟随饼干")]),_:1})]),default:l(()=>[a(e(M),{ref:"formRef",model:e(t),"label-placement":"left","label-width":"auto",size:e(i).isMobile?"small":"medium"},{default:l(()=>[a(e(U),{cols:"1 600:2","x-gap":12},{default:l(()=>[a(e(p),{style:{"max-width":"18rem"}},{default:l(()=>[a(e(d),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:l(()=>[a(e(n),{depth:"3",style:{"font-size":"0.875rem"}},{default:l(()=>[r("外观选项 ")]),_:1})]),_:1}),a(e(u),{label:"大喇叭位置",path:"loudspeakerPosition"},{default:l(()=>[a(e(f),{value:e(t).loudspeakerPosition,"onUpdate:value":o[0]||(o[0]=s=>e(t).loudspeakerPosition=s),options:v,"menu-props":{style:{borderRadius:"10px"}}},null,8,["value"])]),_:1}),a(e(u),{label:"单色模式",path:"monochromeMode"},{default:l(()=>[a(e(m),{value:e(t).monochromeMode,"onUpdate:value":o[1]||(o[1]=s=>e(t).monochromeMode=s)},null,8,["value"])]),_:1}),a(e(u),{label:"侧边栏放左边",path:"sidebarLeft"},{default:l(()=>[a(e(m),{value:e(t).sidebarLeft,"onUpdate:value":o[2]||(o[2]=s=>e(t).sidebarLeft=s)},null,8,["value"])]),_:1}),a(e(u),{label:"最大引用层数",path:"quoteMax"},{default:l(()=>[a(e(b),{value:e(t).quoteMax,"onUpdate:value":o[3]||(o[3]=s=>e(t).quoteMax=s),placeholder:"3",max:6,min:1,step:1},null,8,["value"])]),_:1}),a(e(u),{label:"字体大小",path:"fontRemSize"},{default:l(()=>[a(e(b),{value:e(t).fontRemSize,"onUpdate:value":o[4]||(o[4]=s=>e(t).fontRemSize=s),placeholder:"16",max:20,min:12,step:.5},null,8,["value"])]),_:1})]),_:1}),a(e(p),{style:{"max-width":"18rem"}},{default:l(()=>[a(e(d),{dashed:"",style:{"margin-top":"8px","margin-bottom":"8px"}},{default:l(()=>[a(e(n),{depth:"3",style:{"font-size":"0.875rem"}},{default:l(()=>[r("功能选项 ")]),_:1})]),_:1}),a(e(u),{label:"图床选择",path:"loudspeakerPosition"},{default:l(()=>[a(e(f),{value:e(t).imgHost,"onUpdate:value":o[5]||(o[5]=s=>e(t).imgHost=s),options:g,"menu-props":{style:{borderRadius:"10px"}}},null,8,["value"])]),_:1}),a(e(u),{label:"自动涮锅时遇红包停止",path:"hongbaoThenStop"},{default:l(()=>[a(e(m),{value:e(t).hongbaoThenStop,"onUpdate:value":o[6]||(o[6]=s=>e(t).hongbaoThenStop=s)},null,8,["value"])]),_:1}),a(e(u),{label:"自动涮锅时页面不动",path:"holdPageWhenListening"},{default:l(()=>[a(e(m),{value:e(t).holdPageWhenListening,"onUpdate:value":o[7]||(o[7]=s=>e(t).holdPageWhenListening=s)},null,8,["value"])]),_:1}),a(e(u),{label:"减少弹出提示",path:"lessToast"},{default:l(()=>[a(e(m),{value:e(t).lessToast,"onUpdate:value":o[8]||(o[8]=s=>e(t).lessToast=s)},null,8,["value"])]),_:1})]),_:1})]),_:1})]),_:1},8,["model","size"])]),_:1}))}});export{I as default};
