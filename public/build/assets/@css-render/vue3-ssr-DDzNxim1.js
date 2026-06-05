import{i as u}from"../vue-ecosystem-DK9DjemX.js";const i="@css-render/vue3-ssr";function o(e,n){return`<style cssr-id="${e}">
${n}
</style>`}function d(e,n,t){const{styles:r,ids:s}=t;s.has(e)||r!==null&&(s.add(e),r.push(o(e,n)))}const c=typeof document!="undefined";function l(){if(c)return;const e=u(i,null);if(e!==null)return{adapter:(n,t)=>d(n,t,e),context:e}}export{l as u};
