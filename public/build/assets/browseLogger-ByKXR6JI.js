var s=Object.defineProperty;var i=(a,t,o)=>t in a?s(a,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[t]=o;var r=(a,t,o)=>(i(a,typeof t!="symbol"?t+"":t,o),o);import{$ as u}from"./app-BFaYVfH7.js";function f(){class a{constructor(){r(this,"_defaultValue",{});r(this,"_logData",u(this._defaultValue));const e=localStorage.getItem("browseLogger");if(!e)this._logData.value=this._defaultValue;else{let l=JSON.parse(e);for(let g in l)l[g].expireTime<Date.now()&&delete l[g];this._logData.value=l,localStorage.setItem("browseLogger",JSON.stringify(this._logData.value))}}reload(){const e=localStorage.getItem("browseLogger");e&&(this._logData.value=JSON.parse(e))}log(e,l){const g=new Date().getTime()+864e5;this._logData.value[e]={expireTime:g,floor:l},localStorage.setItem("browseLogger",JSON.stringify(this._logData.value))}initThread(e){this.get(e)===void 0&&this.log(e,0)}get(e){return this._logData.value[e]}get data(){return this._logData}}return new a}export{f as u};
