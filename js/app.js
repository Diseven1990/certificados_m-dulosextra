(function(){
const{PDFDocument,StandardFonts,rgb}=PDFLib;
const cSel=document.getElementById("course");
const n=document.getElementById("name");
const cc=document.getElementById("cc");
const g=document.getElementById("grade");
const btn=document.getElementById("btnGenerate");
const dl=document.getElementById("btnDownload");
const state=document.getElementById("readyState");

window.__CERT_READY__={templateLoaded:false,picked:{name:false,cc:false,wreath:false}};

CERT_CONFIG.courses.forEach(c=>{
const o=document.createElement("option");
o.value=c.id;o.textContent=c.label;cSel.appendChild(o);
});

function refresh(){
const s=window.__CERT_READY__;
btn.disabled=!(s.templateLoaded&&s.picked.name&&s.picked.cc&&s.picked.wreath);
state.textContent=btn.disabled?"Marca Nome, CC e Coroa":"Pronto a gerar";
}
window.__refreshCertUI__=refresh;
refresh();

function fit(font,text,maxW,fs){
let size=fs;
while(font.widthOfTextAtSize(text,size)>maxW && size>10){size-=0.6}
return size;
}

btn.onclick=async()=>{
if(btn.disabled)return;
const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
const grade=Math.max(0,Math.min(100,Math.round(Number(g.value)||0)));
const wreathImgPath = grade>=80 ? "assets/wreath_gold.png" : "assets/wreath_grey.png";

const pdfBytes=await fetch(c.template).then(r=>r.arrayBuffer());
const pdf=await PDFDocument.load(pdfBytes);

const font=await pdf.embedFont(StandardFonts.Helvetica);
const fontB=await pdf.embedFont(StandardFonts.HelveticaBold);

const wreathBytes=await fetch(wreathImgPath).then(r=>r.arrayBuffer());
const wreathImg=await pdf.embedPng(wreathBytes);

const p=pdf.getPages()[0];

// Nome
p.drawText(n.value,{x:c.fields.name.x,y:c.fields.name.y,size:c.fields.name.fontSize,font,color:rgb(1,1,1)});
// CC
p.drawText(cc.value,{x:c.fields.cc.x,y:c.fields.cc.y,size:c.fields.cc.fontSize,font,color:rgb(1,1,1)});

// Coroa
const wf=c.fields.wreath;
p.drawImage(wreathImg,{x:wf.x,y:wf.y,width:wf.w,height:wf.h});

// Nota centrada na coroa
const gf=c.fields.grade;
const gradeText=grade+"%";
const fs=fit(fontB,gradeText,gf.maxW,gf.fontSize);
const textW=fontB.widthOfTextAtSize(gradeText,fs);
const x=wf.x+(wf.w-textW)/2+(gf.offsetX||0);
const y=wf.y+(wf.h/2)-(fs/2)+(gf.offsetY||0);
p.drawText(gradeText,{x,y,size:fs,font:fontB,color:rgb(1,1,1)});

// "Nota final"
const label="Nota final";
const fs2=14;
const tw2=font.widthOfTextAtSize(label,fs2);
p.drawText(label,{
x:wf.x+(wf.w-tw2)/2,
y:wf.y+18,
size:fs2,
font,
color:rgb(1,1,1)
});

const out=await pdf.save();
dl.href=URL.createObjectURL(new Blob([out],{type:"application/pdf"}));
dl.download="certificado.pdf";
dl.style.display="inline";
};
})();