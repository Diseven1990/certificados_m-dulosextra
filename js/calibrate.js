(function(){
const canvas=document.getElementById("previewCanvas");
const ctx=canvas.getContext("2d");
const btn=document.getElementById("btnLoadPreview");
const sel=document.getElementById("calField");
const out=document.getElementById("calOut");
const cSel=document.getElementById("course");
const scale=1.6;
let page=null;

btn.onclick=async()=>{
const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
const d=await fetch(c.template).then(r=>r.arrayBuffer());
const pdf=await pdfjsLib.getDocument({data:d}).promise;
page=await pdf.getPage(1);
const vp=page.getViewport({scale});
canvas.width=vp.width;canvas.height=vp.height;
await page.render({canvasContext:ctx,viewport:vp}).promise;
window.__CERT_READY__.templateLoaded=true;
window.__refreshCertUI__();
};

canvas.onclick=e=>{
if(!page)return;
const r=canvas.getBoundingClientRect();
const x=(e.clientX-r.left)*(canvas.width/r.width)/scale;
const y=page.view[3]-(e.clientY-r.top)*(canvas.height/r.height)/scale;
const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
c.fields[sel.value].x=x;
c.fields[sel.value].y=y;
window.__CERT_READY__.picked[sel.value]=true;
out.value=sel.value+" -> x:"+x.toFixed(1)+" y:"+y.toFixed(1);
window.__refreshCertUI__();
};
})();