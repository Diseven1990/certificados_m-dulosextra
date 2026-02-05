(function(){
const canvas=document.getElementById("previewCanvas");
const ctx=canvas.getContext("2d");
const btn=document.getElementById("btnLoadPreview");
const sel=document.getElementById("calField");
const out=document.getElementById("calOut");
const cSel=document.getElementById("course");
const scale=1.6;
let page=null;

function log(msg){
  out.value = (out.value ? out.value + "\n" : "") + msg;
}

function resetLog(msg){
  out.value = msg || "";
}

btn.onclick=async()=>{
  try{
    resetLog("A carregar template...");
    const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
    if(!c) throw new Error("Curso não encontrado.");
    const resp = await fetch(c.template);
    if(!resp.ok) throw new Error(`Não consegui abrir ${c.template} (HTTP ${resp.status}). Confirma a pasta /templates no GitHub Pages.`);
    const d = await resp.arrayBuffer();

    if(typeof pdfjsLib === "undefined") throw new Error("pdfjsLib não está definido. O script do pdf.js não carregou.");
    const pdf = await pdfjsLib.getDocument({data:d}).promise;
    page = await pdf.getPage(1);

    const vp = page.getViewport({scale});
    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);

    await page.render({canvasContext:ctx,viewport:vp}).promise;

    window.__CERT_READY__.templateLoaded=true;
    window.__refreshCertUI__();
    resetLog("Template carregado. Escolhe o campo e clica no local exato.");
  }catch(e){
    console.error(e);
    resetLog("ERRO: " + (e && e.message ? e.message : String(e)));
    if(window.__CERT_READY__){
      window.__CERT_READY__.templateLoaded=false;
      window.__refreshCertUI__();
    }
  }
};

canvas.onclick=(e)=>{
  try{
    if(!page){ log("Carrega o template primeiro."); return; }
    const r=canvas.getBoundingClientRect();
    const x=(e.clientX-r.left)*(canvas.width/r.width)/scale;
    const y=page.view[3]-(e.clientY-r.top)*(canvas.height/r.height)/scale;

    const c=CERT_CONFIG.courses.find(x=>x.id===cSel.value);
    c.fields[sel.value].x=x;
    c.fields[sel.value].y=y;

    window.__CERT_READY__.picked[sel.value]=true;
    window.__refreshCertUI__();
    log(`${sel.value} -> x:${x.toFixed(1)} y:${y.toFixed(1)}`);
  }catch(err){
    console.error(err);
    log("ERRO ao clicar: " + (err && err.message ? err.message : String(err)));
  }
};
})();