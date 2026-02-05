(function () {
  const canvas = document.getElementById("previewCanvas");
  const ctx = canvas.getContext("2d");

  const btnLoad = document.getElementById("btnLoadPreview");
  const btnClear = document.getElementById("btnClear");
  const fieldSel = document.getElementById("calField");
  const out = document.getElementById("calOut");
  const courseSel = document.getElementById("course");

  if (!canvas || !btnLoad || !btnClear || !fieldSel || !out || !courseSel) return;

  let pdfDoc = null;
  let page = null;
  let viewport = null;

  const picked = { name: null, cc: null, grade: null };
  const sample = { name: "Diogo Cruz", cc: "13938171", grade: "95%" };
  const scale = 1.6;

  function getCourse() {
    const courses = window.CERT_CONFIG?.courses || [];
    const id = courseSel.value;
    return courses.find((c) => c.id === id) || courses[0];
  }

  function setOut(msg) { out.value = msg || ""; }

  function setReady(templateLoaded, fieldKey, value) {
    window.__CERT_READY__ = window.__CERT_READY__ || { templateLoaded:false, picked:{name:false,cc:false,grade:false} };
    window.__CERT_READY__.templateLoaded = templateLoaded;
    if (fieldKey) window.__CERT_READY__.picked[fieldKey] = value;
    if (typeof window.__refreshCertUI__ === "function") window.__refreshCertUI__();
  }

  async function renderPage() {
    if (!page || !viewport) return;
    await page.render({ canvasContext: ctx, viewport }).promise;
    drawOverlay();
  }

  function ptToPx(xPt, yPt) {
    const hPt = page.view[3];
    return { xPx: xPt * scale, yPxFromTop: (hPt - yPt) * scale };
  }

  function drawCross(x, y) {
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0, 255, 255, 0.9)";
    ctx.stroke();
  }

  function drawLabel(text, x, y) {
    ctx.font = "16px system-ui, Arial";
    const w = ctx.measureText(text).width;
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(x - 4, y - 18, w + 10, 22);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(text, x + 1, y - 2);
  }

  function drawOverlay() {
    for (const key of ["name", "cc", "grade"]) {
      const p = picked[key];
      if (!p) continue;
      const { xPx, yPxFromTop } = ptToPx(p.x, p.y);
      drawCross(xPx, yPxFromTop);
      drawLabel(`${key.toUpperCase()}: ${sample[key]}`, xPx + 12, yPxFromTop);
    }
  }

  function updateConfigInMemory() {
    const course = getCourse();
    if (!course) return;
    if (picked.name) { course.fields.name.x = picked.name.x; course.fields.name.y = picked.name.y; }
    if (picked.cc) { course.fields.cc.x = picked.cc.x; course.fields.cc.y = picked.cc.y; }
    if (picked.grade) { course.fields.grade.x = picked.grade.x; course.fields.grade.y = picked.grade.y; }
  }

  function emitSnippet() {
    const course = getCourse();
    if (!course) return;

    const snip = `// Cola isto no js/config.js (curso "${course.id}"):

fields: {
  name:  { pageIndex: 0, x: ${course.fields.name.x.toFixed(1)}, y: ${course.fields.name.y.toFixed(1)}, w: ${course.fields.name.w}, fontSize: ${course.fields.name.fontSize} },
  cc:    { pageIndex: 0, x: ${course.fields.cc.x.toFixed(1)}, y: ${course.fields.cc.y.toFixed(1)}, w: ${course.fields.cc.w}, fontSize: ${course.fields.cc.fontSize} },
  grade: { pageIndex: 0, x: ${course.fields.grade.x.toFixed(1)}, y: ${course.fields.grade.y.toFixed(1)}, w: ${course.fields.grade.w}, fontSize: ${course.fields.grade.fontSize} }
}`;
    setOut(snip);
  }

  btnLoad.addEventListener("click", async () => {
    try {
      const course = getCourse();
      if (!course) { setOut("Não encontrei cursos em CERT_CONFIG."); return; }

      setOut("A carregar template...");
      const data = await fetch(course.template).then((r) => {
        if (!r.ok) throw new Error(`Não consegui carregar: ${course.template} (${r.status})`);
        return r.arrayBuffer();
      });

      pdfDoc = await pdfjsLib.getDocument({ data }).promise;
      page = await pdfDoc.getPage(1);
      viewport = page.getViewport({ scale });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      picked.name = picked.cc = picked.grade = null;
      setReady(true, "name", false);
      setReady(true, "cc", false);
      setReady(true, "grade", false);

      await renderPage();
      setOut("Template carregado. Escolhe o campo e clica no local exato.");
    } catch (e) {
      console.error(e);
      setReady(false);
      setOut("Erro a carregar template. Abre a consola (F12) para ver o detalhe.");
    }
  });

  btnClear.addEventListener("click", async () => {
    picked.name = picked.cc = picked.grade = null;
    setReady(!!page, "name", false);
    setReady(!!page, "cc", false);
    setReady(!!page, "grade", false);
    if (page) await renderPage();
    setOut(page ? "Marcações limpas. Volta a clicar para definir posições." : "Carrega o template primeiro.");
  });

  canvas.addEventListener("click", async (evt) => {
    if (!page) { setOut("Primeiro clica em “Carregar template”."); return; }

    const rect = canvas.getBoundingClientRect();
    const xPx = (evt.clientX - rect.left) * (canvas.width / rect.width);
    const yPx = (evt.clientY - rect.top) * (canvas.height / rect.height);

    const xPt = xPx / scale;
    const yPtFromTop = yPx / scale;
    const hPt = page.view[3];
    const yPt = hPt - yPtFromTop;

    const field = fieldSel.value;
    picked[field] = { x: xPt, y: yPt };

    updateConfigInMemory();
    emitSnippet();

    setReady(true, field, true);
    await renderPage();
  });
})();