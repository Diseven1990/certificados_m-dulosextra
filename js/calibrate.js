(function(){
const canvas=document.getElementById("previewCanvas");
const ctx=canvas.getContext("2d");
const btn=document.getElementById("btnLoadPreview");
const sel=document.getElementById("calField");
const out=document.getElementById("calOut");
const cSel=document.getElementById("course");
const scale=1.6;
let page=null;

function log(msg){out.value+=(out.value?"\n":"")+msg}
function reset(msg){out.value=msg||""}

btn.onclick=async()=>{
try{
reset("A carregar template...");
const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
const r=await fetch(c.template);
if(!r.ok)throw new Error("Template não encontrado");
const d=await r.arrayBuffer();
const pdf=await pdfjsLib.getDocument({data:d}).promise;
page=await pdf.getPage(1);
const vp=page.getViewport({scale});
canvas.width=vp.width;canvas.height=vp.height;
await page.render({canvasContext:ctx,viewport:vp}).promise;
window.__CERT_READY__.templateLoaded=true;
window.__refreshCertUI__();
reset("Template carregado. Marca Nome, CC e Coroa.");
}catch(e){reset("ERRO: "+e.message)}
};

canvas.onclick=e=>{
if(!page)return;
const r=canvas.getBoundingClientRect();
const x=(e.clientX-r.left)*(canvas.width/r.width)/scale;
const y=page.view[3]-(e.clientY-r.top)*(canvas.height/r.height)/scale;
const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
if(sel.value==="wreath"){
c.fields.wreath.x=x;
c.fields.wreath.y=y;
window.__CERT_READY__.picked.wreath=true;
}else{
c.fields[sel.value].x=x;
c.fields[sel.value].y=y;
window.__CERT_READY__.picked[sel.value]=true;
}
window.__refreshCertUI__();
log(sel.value+" -> x:"+x.toFixed(1)+" y:"+y.toFixed(1));
};
})();