(function () {
  if (!window.IS_ADMIN) return;

  const canvas = document.getElementById("previewCanvas");
  const ctx = canvas.getContext("2d");
  const btnLoad = document.getElementById("btnLoadPreview");
  const btnCopy = document.getElementById("btnCopy");
  const fieldSel = document.getElementById("calField");
  const out = document.getElementById("calOut");
  const courseSel = document.getElementById("course");

  const scale = 1.6;
  let page = null;

  function getCourse() {
    return (window.CERT_CONFIG?.courses || []).find((c) => c.id === courseSel.value);
  }

  function setOut(t){ out.value = t || ""; }

  function snippetForCourse(c){
    const f = c.fields;
    const lines = [
`// Cola isto no js/config.js (curso "${c.id}")`,
`fields: {`,
`  name:   { pageIndex: 0, x: ${f.name.x.toFixed(1)}, y: ${f.name.y.toFixed(1)}, w: ${f.name.w}, fontSize: ${f.name.fontSize} },`,
`  cc:     { pageIndex: 0, x: ${f.cc.x.toFixed(1)}, y: ${f.cc.y.toFixed(1)}, w: ${f.cc.w}, fontSize: ${f.cc.fontSize} },`,
`  wreath: { pageIndex: 0, x: ${f.wreath.x.toFixed(1)}, y: ${f.wreath.y.toFixed(1)}, w: ${f.wreath.w.toFixed(1)} },`,
`  grade:  { fontSize: ${f.grade.fontSize}, maxW: ${f.grade.maxW}, offsetX: ${f.grade.offsetX||0}, offsetY: ${f.grade.offsetY||0} },`,
`  label:  { text: "${(f.label?.text||"Nota final").replace(/"/g,'\"')}", fontSize: ${f.label?.fontSize||14}, offsetY: ${f.label?.offsetY??18} }`,
`}`
    ];
    return lines.join("\n");
  }

  async function loadPreview(){
    const c = getCourse();
    if(!c){ setOut("Curso não encontrado."); return; }

    setOut("A carregar template...");
    const resp = await fetch(c.template);
    if(!resp.ok){ setOut(`ERRO: não consegui abrir ${c.template} (HTTP ${resp.status})`); return; }
    const data = await resp.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({data}).promise;
    page = await pdf.getPage(1);
    const vp = page.getViewport({scale});

    canvas.width = Math.floor(vp.width);
    canvas.height = Math.floor(vp.height);
    await page.render({canvasContext:ctx, viewport:vp}).promise;

    setOut("Template carregado. Seleciona o campo e clica no local exato.");
  }

  function clickToPt(evt){
    const rect = canvas.getBoundingClientRect();
    const x = (evt.clientX - rect.left) * (canvas.width / rect.width) / scale;
    const y = page.view[3] - (evt.clientY - rect.top) * (canvas.height / rect.height) / scale;
    return {x, y};
  }

  btnLoad.addEventListener("click", loadPreview);

  canvas.addEventListener("click", (evt) => {
    if(!page) { setOut("Carrega o template primeiro."); return; }
    const c = getCourse();
    const {x,y} = clickToPt(evt);
    const k = fieldSel.value;

    if(k === "wreath"){
      c.fields.wreath.x = x;
      c.fields.wreath.y = y;
    } else {
      c.fields[k].x = x;
      c.fields[k].y = y;
    }

    setOut(snippetForCourse(c));
  });

  btnCopy.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(out.value || "");
    } catch(e){
      // sem stress, fica no textarea
    }
  });
})();