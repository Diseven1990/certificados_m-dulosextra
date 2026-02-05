(function () {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;

  const courseSel = document.getElementById("course");
  const nameEl = document.getElementById("name");
  const ccEl = document.getElementById("cc");
  const gradeEl = document.getElementById("grade");
  const btn = document.getElementById("btnGenerate");
  const dl = document.getElementById("btnDownload");
  const status = document.getElementById("status");

  function setStatus(t){ status.textContent = t || ""; }

  function fillCourses() {
    courseSel.innerHTML = "";
    (window.CERT_CONFIG?.courses || []).forEach((c) => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.label;
      courseSel.appendChild(o);
    });
  }

  function getCourse() {
    return (window.CERT_CONFIG?.courses || []).find((c) => c.id === courseSel.value);
  }

  function clampPercent(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function fit(font, text, maxW, fs) {
    let size = fs;
    while (font.widthOfTextAtSize(text, size) > maxW && size > 10) size -= 0.6;
    return size;
  }

  async function embedWreath(pdf, gradeN) {
    const c = getCourse();
    const goldFrom = c?.rules?.goldFrom ?? 80;
    const path = gradeN >= goldFrom ? "assets/wreath_gold.png" : "assets/wreath_grey.png";
    const bytes = await fetch(path).then(r => r.arrayBuffer());
    const img = await pdf.embedPng(bytes);
    return img;
  }

  async function generate() {
    const c = getCourse();
    if (!c) return;

    const name = (nameEl.value || "").trim();
    const cc = (ccEl.value || "").trim();
    const gradeN = clampPercent(gradeEl.value);

    if (!name || !cc || gradeN === null) {
      setStatus("Preenche Nome, CC e Nota (0–100).");
      return;
    }

    // Validação mínima de coordenadas (evita gerar “tudo a 0”)
    if (!c.fields?.wreath?.w || (!c.fields?.name?.x && !window.IS_ADMIN)) {
      setStatus("Este curso ainda não está calibrado (posição).");
      return;
    }

    btn.disabled = true;
    dl.style.display = "none";
    setStatus("A gerar PDF...");

    try {
      const pdfBytes = await fetch(c.template).then(r => {
        if(!r.ok) throw new Error("Template não encontrado: " + c.template);
        return r.arrayBuffer();
      });

      const pdf = await PDFDocument.load(pdfBytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);

      const page = pdf.getPages()[0];

      // Texto branco
      const white = rgb(1, 1, 1);

      // Nome (auto-fit por largura)
      {
        const f = c.fields.name;
        const fs = fit(font, name, f.w, f.fontSize);
        page.drawText(name, { x: f.x, y: f.y, size: fs, font, color: white });
      }

      // CC
      {
        const f = c.fields.cc;
        const fs = fit(font, cc, f.w, f.fontSize);
        page.drawText(cc, { x: f.x, y: f.y, size: fs, font, color: white });
      }

      // Coroa (preserva proporção)
      const wf = c.fields.wreath;
      const wreathImg = await embedWreath(pdf, gradeN);

      const targetW = wf.w;
      const ratio = wreathImg.height / wreathImg.width;
      const targetH = targetW * ratio;

      page.drawImage(wreathImg, { x: wf.x, y: wf.y, width: targetW, height: targetH });

      // Nota centrada dentro da coroa (usa a caixa desenhada)
      {
        const gf = c.fields.grade;
        const gradeText = `${gradeN}%`;
        const fs = fit(fontB, gradeText, gf.maxW, gf.fontSize);
        const textW = fontB.widthOfTextAtSize(gradeText, fs);

        const centerX = wf.x + targetW / 2;
        const centerY = wf.y + targetH / 2;

        const x = centerX - (textW / 2) + (gf.offsetX || 0);
        const y = centerY - (fs / 2) + (gf.offsetY || 0);

        page.drawText(gradeText, { x, y, size: fs, font: fontB, color: white });
      }

      // "Nota final" (centrada na coroa)
      {
        const lf = c.fields.label || { text: "Nota final", fontSize: 14, offsetY: 18 };
        const labelText = lf.text || "Nota final";
        const fs2 = lf.fontSize || 14;
        const tw = font.widthOfTextAtSize(labelText, fs2);

        const x = wf.x + (targetW - tw) / 2;
        const y = wf.y + (lf.offsetY ?? 18);

        page.drawText(labelText, { x, y, size: fs2, font, color: white });
      }

      const out = await pdf.save();
      dl.href = URL.createObjectURL(new Blob([out], { type: "application/pdf" }));
      dl.download = `Certificado - ${c.label} - ${name}.pdf`;
      dl.style.display = "inline";
      setStatus("PDF gerado.");
    } catch (e) {
      console.error(e);
      setStatus("Erro a gerar. Abre a consola (F12) para detalhe.");
    } finally {
      btn.disabled = false;
    }
  }

  fillCourses();
  setStatus(window.IS_ADMIN ? "Modo admin ativo." : "Pronto.");
  btn.addEventListener("click", generate);
})();