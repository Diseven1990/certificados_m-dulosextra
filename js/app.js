(function(){
const{PDFDocument,StandardFonts,rgb}=PDFLib;
const cSel=document.getElementById("course");
const n=document.getElementById("name");
const cc=document.getElementById("cc");
const g=document.getElementById("grade");
const btn=document.getElementById("btnGenerate");
const dl=document.getElementById("btnDownload");

CERT_CONFIG.courses.forEach(c=>{
const o=document.createElement("option");
o.value=c.id;o.textContent=c.label;cSel.appendChild(o);
});

btn.onclick=async()=>{
const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
const b=await fetch(c.template).then(r=>r.arrayBuffer());
const pdf=await PDFDocument.load(b);
const f=await pdf.embedFont(StandardFonts.Helvetica);
const fb=await pdf.embedFont(StandardFonts.HelveticaBold);
const p=pdf.getPages()[0];
p.drawText(n.value,{x:c.fields.name.x,y:c.fields.name.y,size:c.fields.name.fontSize,font:f,color:rgb(1,1,1)});
p.drawText(cc.value,{x:c.fields.cc.x,y:c.fields.cc.y,size:c.fields.cc.fontSize,font:f,color:rgb(1,1,1)});
p.drawText(Math.round(g.value)+'%',{x:c.fields.grade.x,y:c.fields.grade.y,size:c.fields.grade.fontSize,font:fb,color:rgb(1,1,1)});
const out=await pdf.save();
dl.href=URL.createObjectURL(new Blob([out],{type:"application/pdf"}));
dl.download="certificado.pdf";
dl.style.display="inline";
};
})();