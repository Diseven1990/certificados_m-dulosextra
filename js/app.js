(function(){
const{PDFDocument,StandardFonts,rgb}=PDFLib;
const cSel=document.getElementById("course");
const n=document.getElementById("name");
const cc=document.getElementById("cc");
const g=document.getElementById("grade");
const btn=document.getElementById("btnGenerate");
const dl=document.getElementById("btnDownload");
const state=document.getElementById("readyState");

window.__CERT_READY__={templateLoaded:false,picked:{name:false,cc:false,grade:false}};

CERT_CONFIG.courses.forEach(c=>{
  const o=document.createElement("option");
  o.value=c.id;o.textContent=c.label;cSel.appendChild(o);
});

function refresh(){
  const s=window.__CERT_READY__;
  btn.disabled=!(s.templateLoaded&&s.picked.name&&s.picked.cc&&s.picked.grade);
  state.textContent=btn.disabled?"Carrega o template e marca Nome, CC e Nota":"Pronto a gerar";
}
window.__refreshCertUI__=refresh;
refresh();

btn.onclick=async()=>{
  if(btn.disabled) return;
  const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
  const b=await fetch(c.template).then(r=>{ if(!r.ok) throw new Error("Template não encontrado: "+c.template); return r.arrayBuffer();});
  const pdf=await PDFDocument.load(b);
  const f=await pdf.embedFont(StandardFonts.Helvetica);
  const fb=await pdf.embedFont(StandardFonts.HelveticaBold);
  const p=pdf.getPages()[0];

  p.drawText((n.value||"").trim(),{x:c.fields.name.x,y:c.fields.name.y,size:c.fields.name.fontSize,font:f,color:rgb(1,1,1)});
  p.drawText((cc.value||"").trim(),{x:c.fields.cc.x,y:c.fields.cc.y,size:c.fields.cc.fontSize,font:f,color:rgb(1,1,1)});
  p.drawText(Math.round(Number(g.value)||0)+'%',{x:c.fields.grade.x,y:c.fields.grade.y,size:c.fields.grade.fontSize,font:fb,color:rgb(1,1,1)});

  const out=await pdf.save();
  dl.href=URL.createObjectURL(new Blob([out],{type:"application/pdf"}));
  dl.download="certificado.pdf";
  dl.style.display="inline";
};
})();