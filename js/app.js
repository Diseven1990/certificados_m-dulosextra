(function(){
const{PDFDocument,StandardFonts,rgb}=PDFLib;
const courseSel=document.getElementById("course");
const nameEl=document.getElementById("name");
const ccEl=document.getElementById("cc");
const gradeEl=document.getElementById("grade");
const btn=document.getElementById("btn");
const dl=document.getElementById("dl");
const status=document.getElementById("status");

CERT_CONFIG.courses.forEach(c=>{
const o=document.createElement("option");
o.value=c.id;o.textContent=c.label;courseSel.appendChild(o);
});

function fit(font,text,maxW,fs){
let s=fs;
while(font.widthOfTextAtSize(text,s)>maxW && s>10)s-=0.6;
return s;
}

btn.onclick=async()=>{
const c=CERT_CONFIG.courses.find(x=>x.id===courseSel.value);
const grade=Math.max(0,Math.min(100,Math.round(Number(gradeEl.value)||0)));
if(!nameEl.value||!ccEl.value){status.textContent="Preenche Nome e CC.";return;}
const tpl=(grade>=c.rules.goldFrom)?c.templates.gold:c.templates.grey;

status.textContent="A gerar...";
const bytes=await fetch(tpl).then(r=>r.arrayBuffer());
const pdf=await PDFDocument.load(bytes);
const font=await pdf.embedFont(StandardFonts.Helvetica);
const fontB=await pdf.embedFont(StandardFonts.HelveticaBold);
const p=pdf.getPages()[0];

p.drawText(nameEl.value,{x:c.fields.name.x,y:c.fields.name.y,size:fit(font,nameEl.value,c.fields.name.w,c.fields.name.fontSize),font,color:rgb(1,1,1)});
p.drawText(ccEl.value,{x:c.fields.cc.x,y:c.fields.cc.y,size:fit(font,ccEl.value,c.fields.cc.w,c.fields.cc.fontSize),font,color:rgb(1,1,1)});
p.drawText(grade+"%",{x:c.fields.grade.x,y:c.fields.grade.y,size:c.fields.grade.fontSize,font:fontB,color:rgb(1,1,1)});

const out=await pdf.save();
dl.href=URL.createObjectURL(new Blob([out],{type:"application/pdf"}));
dl.download="Certificado - "+nameEl.value+".pdf";
dl.style.display="inline";
status.textContent="Pronto.";
};
})();