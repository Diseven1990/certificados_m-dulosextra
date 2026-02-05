(function(){
const canvas=document.getElementById("previewCanvas");
const ctx=canvas.getContext("2d");
const btn=document.getElementById("btnLoadPreview");
const sel=document.getElementById("calField");
const out=document.getElementById("calOut");
const cSel=document.getElementById("course");
let scale=1.5,pdfH;

btn.onclick=async()=>{
const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
const d=await fetch(c.template).then(r=>r.arrayBuffer());
const pdf=await pdfjsLib.getDocument({data:d}).promise;
const p=await pdf.getPage(1);
const vp=p.getViewport({scale});
pdfH=p.view[3];
canvas.width=vp.width;canvas.height=vp.height;
await p.render({canvasContext:ctx,viewport:vp}).promise;
};

canvas.onclick=e=>{
const r=canvas.getBoundingClientRect();
const x=(e.clientX-r.left)*(canvas.width/r.width)/scale;
const y=pdfH-(e.clientY-r.top)*(canvas.height/r.height)/scale;
out.value=sel.value+" -> x:"+x.toFixed(1)+" y:"+y.toFixed(1);
};
})();