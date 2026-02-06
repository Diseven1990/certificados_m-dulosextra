(function(){
  const { PDFDocument, StandardFonts, rgb } = PDFLib;

  const courseSel = document.getElementById("course");
  const nameEl = document.getElementById("name");
  const ccEl = document.getElementById("cc");
  const gradeEl = document.getElementById("grade");
  const btn = document.getElementById("btn");
  const dl = document.getElementById("dl");
  const status = document.getElementById("status");

  (CERT_CONFIG.courses || []).forEach(c => {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = c.label;
    courseSel.appendChild(o);
  });

  function setStatus(t){ status.textContent = t || ""; }

  function fit(font, text, maxW, fs){
    let s = fs;
    while (font.widthOfTextAtSize(text, s) > maxW && s > 10) s -= 0.6;
    return s;
  }

  function clampPercent(v){
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  btn.onclick = async () => {
    const c = CERT_CONFIG.courses.find(x => x.id === courseSel.value);
    if (!c) return;

    const name = (nameEl.value || "").trim();
    const cc = (ccEl.value || "").trim();
    const gradeN = clampPercent(gradeEl.value);

    if (!name || !cc || gradeN === null){
      setStatus("Preenche Nome, CC e Nota (0–100).");
      return;
    }

    const tpl = (gradeN >= (c.rules?.goldFrom ?? 80)) ? c.templates.gold : c.templates.grey;

    btn.disabled = true;
    dl.style.display = "none";
    setStatus("A gerar...");

    try{
      const bytes = await fetch(tpl).then(r => {
        if(!r.ok) throw new Error("Template não encontrado: " + tpl);
        return r.arrayBuffer();
      });

      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const fontB = await pdf.embedFont(StandardFonts.HelveticaBold);
      const page = pdf.getPages()[0];

      const white = rgb(1,1,1);

      // Nome
      {
        const f = c.fields.name;
        const fs = fit(font, name, f.w, f.fontSize);
        page.drawText(name, { x:f.x, y:f.y, size:fs, font, color:white });
      }

      // CC
      {
        const f = c.fields.cc;
        const fs = fit(font, cc, f.w, f.fontSize);
        page.drawText(cc, { x:f.x, y:f.y, size:fs, font, color:white });
      }

      // Nota
      {
        const f = c.fields.grade;
        page.drawText(gradeN + "%", { x:f.x, y:f.y, size:f.fontSize, font:fontB, color:white });
      }

      const out = await pdf.save();
      dl.href = URL.createObjectURL(new Blob([out], {type:"application/pdf"}));
      dl.download = `Certificado - ${c.label} - ${name}.pdf`;
      dl.style.display = "inline";
      setStatus("Pronto.");
    }catch(e){
      console.error(e);
      setStatus("Erro a gerar. Abre a consola (F12) para detalhe.");
    }finally{
      btn.disabled = false;
    }
  };
})();