(function () {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;

  const courseSel = document.getElementById("course");
  const nameEl = document.getElementById("name");
  const ccEl = document.getElementById("cc");
  const gradeEl = document.getElementById("grade");
  const btnGenerate = document.getElementById("btnGenerate");
  const btnDownload = document.getElementById("btnDownload");
  const readyState = document.getElementById("readyState");

  function fillCourses() {
    courseSel.innerHTML = "";
    (window.CERT_CONFIG?.courses || []).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.label;
      courseSel.appendChild(opt);
    });
  }

  function getCourse() {
    const id = courseSel.value;
    return (window.CERT_CONFIG?.courses || []).find((c) => c.id === id);
  }

  // Este estado é atualizado pelo calibrate.js
  window.__CERT_READY__ = window.__CERT_READY__ || { templateLoaded: false, picked: { name:false, cc:false, grade:false } };

  function canGenerate() {
    const s = window.__CERT_READY__;
    return !!(s && s.templateLoaded && s.picked.name && s.picked.cc && s.picked.grade);
  }

  function refreshUI() {
    const s = window.__CERT_READY__;
    const msg = !s.templateLoaded
      ? "Carrega o template e marca Nome, CC e Nota."
      : (!s.picked.name || !s.picked.cc || !s.picked.grade)
        ? `Falta marcar: ${[
            !s.picked.name ? "Nome" : null,
            !s.picked.cc ? "CC" : null,
            !s.picked.grade ? "Nota" : null
          ].filter(Boolean).join(", ")}.`
        : "Pronto a gerar.";
    readyState.textContent = msg;
    btnGenerate.disabled = !canGenerate();
    if (!canGenerate()) {
      btnDownload.style.display = "none";
      btnDownload.removeAttribute("href");
    }
  }

  // Expor para o calibrate.js poder atualizar
  window.__refreshCertUI__ = refreshUI;

  function clampPercent(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function fitFontSize(text, font, maxW, desiredSize) {
    let size = desiredSize;
    if (!text) return size;
    for (let i = 0; i < 60; i++) {
      const w = font.widthOfTextAtSize(text, size);
      if (w <= maxW) return size;
      size -= 0.6;
      if (size < 8) return 8;
    }
    return Math.max(8, size);
  }

  async function generate() {
    if (!canGenerate()) {
      refreshUI();
      return;
    }

    const c = getCourse();
    if (!c) return;

    const name = (nameEl.value || "").trim();
    const cc = (ccEl.value || "").trim();
    const gradeN = clampPercent(gradeEl.value);

    if (!name || !cc || gradeN === null) {
      readyState.textContent = "Preenche Nome, CC e Nota (0–100).";
      return;
    }

    btnGenerate.disabled = true;
    readyState.textContent = "A gerar PDF...";

    try {
      const templateBytes = await fetch(c.template).then((r) => r.arrayBuffer());
      const pdf = await PDFDocument.load(templateBytes);

      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);

      const pages = pdf.getPages();
      const page = pages[0];

      const textColor = rgb(1, 1, 1);
      const gradeColor = rgb(1, 1, 1);

      // Nome (auto-fit na largura)
      {
        const f = c.fields.name;
        const fs = fitFontSize(name, font, f.w, f.fontSize);
        page.drawText(name, { x: f.x, y: f.y, size: fs, font, color: textColor });
      }

      // CC
      {
        const f = c.fields.cc;
        const fs = fitFontSize(cc, font, f.w, f.fontSize);
        page.drawText(cc, { x: f.x, y: f.y, size: fs, font, color: textColor });
      }

      // Nota (centrada na caixa)
      {
        const f = c.fields.grade;
        const gradeText = `${gradeN}%`;
        const useFont = c.style?.gradeBold ? fontB : font;
        const fs = fitFontSize(gradeText, useFont, f.w, f.fontSize);
        const textW = useFont.widthOfTextAtSize(gradeText, fs);
        const x = f.x + Math.max(0, (f.w - textW) / 2);
        page.drawText(gradeText, { x, y: f.y, size: fs, font: useFont, color: gradeColor });
      }

      const out = await pdf.save();
      const blob = new Blob([out], { type: "application/pdf" });

      btnDownload.href = URL.createObjectURL(blob);
      btnDownload.download = `Certificado - ${c.label} - ${name}.pdf`;
      btnDownload.style.display = "inline";

      readyState.textContent = "PDF gerado. Podes descarregar.";
    } catch (e) {
      console.error(e);
      readyState.textContent = "Erro a gerar. Abre a consola (F12) para o detalhe.";
    } finally {
      btnGenerate.disabled = !canGenerate();
    }
  }

  fillCourses();
  refreshUI();
  btnGenerate.addEventListener("click", generate);

  // Atualiza UI ao mudar de curso
  courseSel.addEventListener("change", () => {
    // reset estado de calibração para evitar gerar com coords erradas
    window.__CERT_READY__ = { templateLoaded: false, picked: { name:false, cc:false, grade:false } };
    refreshUI();
  });
})();