import{w as O,b as q,$ as y,c as _,bL as I,d as K,bM as Q,bN as W,o as X,A as R,M as k,f as t,H as o,a as e,i as J,m as V,k as x,h as C,z as l,s as Y,G as Z,n as S,x as U,aw as ee,aq as te,j as h}from"./app-DQ8266SS.js";import{a as ae}from"./globalSetting-CAPBTnZY.js";import{c as f}from"./index-Crq6HWd9.js";import{_ as B}from"./FInput.vue_vue_type_script_setup_true_lang-C8i50sDQ.js";import{_ as M}from"./FInputGroupLabel.vue_vue_type_script_setup_true_lang-D3FtrZJs.js";import{N as $}from"./InputGroup-CPu6Vif3.js";import"./_commonjsHelpers-BosuxZz1.js";import"./Input-Nv-VAIlA.js";import"./use-locale-BKZTEJ_B.js";function se(i){var n,a,u="",s;for(i+="",n=0,a=i.length;n<a;n++)s=i.charCodeAt(n).toString(16),u+=s.length<2?"0"+s:s;return u}function oe(i){var n=document.createElement("canvas"),a=n.getContext("2d"),u=i;a.textBaseline="top",a.font="14px 'Arial'",a.textBaseline="alphabetic",a.fillStyle="#f60",a.fillRect(125,1,62,20),a.fillStyle="#069",a.fillText(u,2,15),a.fillStyle="rgba(102, 204, 0, 0.7)",a.fillText(u,4,17);var s=n.toDataURL().replace("data:image/png;base64,",""),p=atob(s),d=se(p.slice(-16,-12));return d}function re(){const i="XiaoHuoGuoCpttmm",n="abcdef0123456789",a=f.enc.Utf8.parse(i);var s={iv:f.enc.Utf8.parse(n),mode:f.mode.CBC,padding:f.pad.Pkcs7};const p=oe("BrowserLeaks,com <canvas> 1.0"),d=f.MD5(navigator.userAgent).toString().substr(0,8);return f.AES.encrypt("XiaoHuoGuo"+p+d,a,s).toString()}const ne=h("div",null,[l("这里是私人论坛，欢迎来玩！"),h("br"),l("QQ小火锅避难群：156840110 "),h("br"),l("使用前需要在下面申请或者导入饼干喔")],-1),ve=O({__name:"LoginModal",emits:["submitRegister"],setup(i,{expose:n,emit:a}){const u=q(),s=y(!1);n({show:()=>s.value=!0});const d=y(""),m=y(""),{data:T}=_(ae,{initialData:!1}),{data:v}=_(I(),{initialData:{reg_record_TTL:-2}}),N=K(()=>{var c,r;if(!(((c=v.value)==null?void 0:c.reg_record_TTL)<=0))return`在${Math.floor(((r=v.value)==null?void 0:r.reg_record_TTL)/3600)}小时后才能再次领取饼干。`}),b=()=>{E(d.value,m.value),m.value=""},{loading:A,onSuccess:D,data:L,send:E}=_(Q,{immediate:!1});D(()=>{localStorage.Token=L.value.token,localStorage.Binggan=L.value.binggan,window.location.href="/"});const G=()=>{z(re())},{loading:H,onSuccess:j,onError:P,data:w,send:z}=_(W,{immediate:!1});j(()=>{const c=X();c.binggan=w.value.binggan,localStorage.Token=w.value.token,localStorage.Binggan=w.value.binggan,s.value=!1,F("submitRegister")}),P(c=>{window.$dialog.error({title:"申请饼干失败",content:c.error.message})});const F=a;return(c,r)=>(R(),k(e(te),{show:s.value,"onUpdate:show":r[4]||(r[4]=g=>s.value=g),"display-directive":"if"},{default:t(()=>[o(e(J),{style:V({maxWidth:e(u).modalMaxWidth}),title:"欢迎来到小火锅！",closable:"",onClose:r[3]||(r[3]=g=>s.value=!1),size:"small"},{action:t(()=>[o(e(x),{justify:"end"},{default:t(()=>[e(v).reg_record_TTL>0?(R(),k(e(C),{key:0,style:{"margin-right":"auto"}},{default:t(()=>[l(Y(N.value),1)]),_:1})):Z("",!0),o(e(S),{onClick:r[2]||(r[2]=g=>s.value=!1)},{default:t(()=>[l("关闭")]),_:1})]),_:1})]),default:t(()=>[o(e(x),{vertical:""},{default:t(()=>[ne,o(e($),null,{default:t(()=>[o(e(M),{style:{width:"3.2rem"}},{default:t(()=>[l("饼干")]),_:1}),o(e(B),{value:d.value,"onUpdate:value":r[0]||(r[0]=g=>d.value=g),placeholder:"请输入饼干",maxlength:"16",onKeyup:U(b,["enter"])},null,8,["value"])]),_:1}),o(e($),null,{default:t(()=>[o(e(M),{style:{width:"3.2rem"},class:"round"},{default:t(()=>[l("密码")]),_:1}),o(e(B),{type:"password",placeholder:"（可留空）请输入密码","show-password-on":"mousedown",value:m.value,"onUpdate:value":r[1]||(r[1]=g=>m.value=g),onKeyup:U(b,["enter"])},null,8,["value"])]),_:1}),o(e(x),null,{default:t(()=>[o(e(ee),{placement:"bottom",trigger:"hover",disabled:e(T)},{trigger:t(()=>[o(e(S),{type:"warning",disabled:e(H)||!e(T)||e(v).reg_record_TTL>0,onClick:G},{default:t(()=>[l(" 我想领取新饼干！ ")]),_:1},8,["disabled"])]),default:t(()=>[o(e(C),null,{default:t(()=>[l("嗷！很抱歉，领取新饼干目前暂停中…… ")]),_:1})]),_:1},8,["disabled"]),o(e(S),{style:{"margin-left":"auto"},type:"primary",onClick:b,disabled:e(A)},{default:t(()=>[l("导入饼干")]),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1},8,["style"])]),_:1},8,["show"]))}});export{ve as default};
