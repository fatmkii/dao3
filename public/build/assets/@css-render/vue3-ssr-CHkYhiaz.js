import{o as u}from"../vue-ecosystem-Bn0JqwoG.js";const o="@css-render/vue3-ssr";function i(e,n){return`<style cssr-id="${e}">
${n}
</style>`}function d(e,n,t){const{styles:r,ids:s}=t;s.has(e)||r!==null&&(s.add(e),r.push(i(e,n)))}const c=typeof document!="undefined";function l(){if(c)return;const e=u(o,null);if(e!==null)return{adapter:(n,t)=>d(n,t,e),context:e}}export{l as u};
