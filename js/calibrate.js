(function(){
  if(!window.IS_ADMIN) return;

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const loadBtn = document.getElementById("loadTpl");
  const fieldSel = document.getElementById("calField");
  const out = document.getElementById("out");
  const copyBtn = document.getElementById("copySnippet");
  const courseSel = document.getElementById("course");

  const scale = 1.6;
  let page = null;

  function getCourse(){
    return CERT_CONFIG.courses.find(c => c.id === courseSel.value);
  }

  function buildSnippet(c){
    const f = c.fields;
    return [
      `// --- Snippet para colar no js/config.js (curso: "${c.id}") ---`,
      `fields: {`,
      `  name:  { pageIndex: 0, x: ${f.name.x.toFixed(1)}, y: ${f.name.y.toFixed(1)}, w: ${f.name.w}, fontSize: ${f.name.fontSize} },`,
      `  cc:    { pageIndex: 0, x: ${f.cc.x.toFixed(1)}, y: ${f.cc.y.toFixed(1)}, w: ${f.cc.w}, fontSize: ${f.cc.fontSize} },`,
      `  grade: { pageIndex: 0, x: ${f.grade.x.toFixed(1)}, y: ${f.grade.y.toFixed(1)}, w: ${f.grade.w}, fontSize: ${f.grade.fontSize} }`,
      `}`
    ].join("\n");
  }

  loadBtn.onclick = async () => {
    const c = getCourse();
    out.value = "A carregar template...";
    try{
      const resp = await fetch(c.templates.gold);
      if(!resp.ok) throw new Error(`Não consegui abrir ${c.templates.gold} (HTTP ${resp.status})`);
      const data = await resp.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({data}).promise;
      page = await pdf.getPage(1);

      const vp = page.getViewport({scale});
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);

      await page.render({canvasContext:ctx, viewport:vp}).promise;
      out.value = "Template carregado. Seleciona o campo e clica no local exato.";
    }catch(e){
      console.error(e);
      out.value = "ERRO: " + (e?.message || String(e));
    }
  };

  canvas.onclick = (e) => {
    if(!page) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width) / scale;
    const y = page.view[3] - (e.clientY - rect.top) * (canvas.height / rect.height) / scale;

    const c = getCourse();
    c.fields[fieldSel.value].x = x;
    c.fields[fieldSel.value].y = y;

    out.value = buildSnippet(c);
  };

  copyBtn.onclick = async () => {
    try{
      await navigator.clipboard.writeText(out.value || "");
    }catch(e){
      // snippet já está no textarea
    }
  };
})();