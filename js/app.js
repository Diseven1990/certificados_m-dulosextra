(function () {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;

  const elCourse = document.getElementById("course");
  const elName = document.getElementById("name");
  const elCC = document.getElementById("cc");
  const elGrade = document.getElementById("grade");
  const elStatus = document.getElementById("status");
  const btnGenerate = document.getElementById("btnGenerate");
  const btnOpen = document.getElementById("btnOpen");
  const btnDownload = document.getElementById("btnDownload");

  const courses = (window.CERT_CONFIG && window.CERT_CONFIG.courses) ? window.CERT_CONFIG.courses : [];

  function setStatus(msg) { elStatus.textContent = msg || ""; }

  function sanitizePercent(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    const clamped = Math.max(0, Math.min(100, Math.round(n)));
    return clamped;
  }

  function fileSafeName(s) {
    return String(s || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s._-]/g, "")
      .trim()
      .replace(/\s+/g, " ");
  }

  function fillSelect() {
    elCourse.innerHTML = "";
    courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.label;
      elCourse.appendChild(opt);
    });
  }

  function getCourse() {
    const id = elCourse.value;
    return courses.find(c => c.id === id) || courses[0];
  }

  // Auto-fit: reduz tamanho até caber na largura máxima (w)
  function fitFontSize(text, font, maxW, desiredSize) {
    let size = desiredSize;
    if (!text) return size;
    for (let i = 0; i < 40; i++) {
      const w = font.widthOfTextAtSize(text, size);
      if (w <= maxW) return size;
      size -= 0.6;
      if (size < 8) return 8;
    }
    return Math.max(8, size);
  }

  async function generate() {
    btnGenerate.disabled = true;
    btnOpen.style.display = "none";
    btnDownload.style.display = "none";
    btnOpen.href = "#";
    btnDownload.href = "#";
    setStatus("A gerar PDF...");

    try {
      const course = getCourse();
      const name = (elName.value || "").trim();
      const cc = (elCC.value || "").trim();
      const gradeN = sanitizePercent(elGrade.value);

      if (!name || !cc || gradeN === null) {
        setStatus("Preenche: Nome do formando, N.º CC e Nota (0–100).");
        return;
      }

      const templateBytes = await fetch(course.template).then(r => {
        if (!r.ok) throw new Error("Não foi possível carregar o template.");
        return r.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(templateBytes);

      // Fonts (aproximação): Helvetica / Helvetica-Bold
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const textColor = rgb(...(course.style?.textColorRgb || [1,1,1]));
      const gradeColor = rgb(...(course.style?.gradeColorRgb || [1,1,1]));

      // Preencher campos na página 1
      const pages = pdfDoc.getPages();

      // Nome
      {
        const f = course.fields.name;
        const page = pages[f.pageIndex];
        const fs = fitFontSize(name, fontRegular, f.w, f.fontSize);
        page.drawText(name, { x: f.x, y: f.y, size: fs, font: fontRegular, color: textColor });
      }

      // CC
      {
        const f = course.fields.cc;
        const page = pages[f.pageIndex];
        const fs = fitFontSize(cc, fontRegular, f.w, f.fontSize);
        page.drawText(cc, { x: f.x, y: f.y, size: fs, font: fontRegular, color: textColor });
      }

      // Nota (percentagem, sem casas decimais)
      {
        const f = course.fields.grade;
        const page = pages[f.pageIndex];
        const gradeText = `${gradeN}%`;
        const font = (course.style?.gradeBold) ? fontBold : fontRegular;
        const fs = fitFontSize(gradeText, font, f.w, f.fontSize);
        // Centrar dentro da caixa (w)
        const textW = font.widthOfTextAtSize(gradeText, fs);
        const x = f.x + Math.max(0, (f.w - textW) / 2);
        page.drawText(gradeText, { x, y: f.y, size: fs, font, color: gradeColor });
      }

      const outBytes = await pdfDoc.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const filename = `Certificado - ${course.label} - ${fileSafeName(name)}.pdf`;

      btnOpen.href = url;
      btnOpen.style.display = "inline";

      btnDownload.href = url;
      btnDownload.download = filename;
      btnDownload.style.display = "inline";

      setStatus("PDF gerado. Podes abrir ou descarregar.");
    } catch (err) {
      console.error(err);
      setStatus("Erro ao gerar o PDF. Se continuares com erro, diz-me o texto exato aqui.");
    } finally {
      btnGenerate.disabled = false;
    }
  }

  fillSelect();
  btnGenerate.addEventListener("click", generate);
})();