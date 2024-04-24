function t(r){const n=r.replace(/,/g,"").trim();return/^-?\d+(\.(\d+)?)?$/.test(n)?Number(n):n===""?null:Number.NaN}function e(r){return r===null?"":r.toLocaleString("en-US")}export{e as a,t as i};
