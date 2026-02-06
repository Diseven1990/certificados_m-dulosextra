// Coordenadas em pontos PDF (origem: canto inferior esquerdo).
window.CERT_CONFIG = {
  courses: [
    {
      id: "photoshop",
      label: "Adobe Photoshop",
      templates: {
        gold: "templates/photoshop_ouro.pdf",
        grey: "templates/photoshop_cin.pdf"
      },
      fields: {
        // Página 1 (index 0): só escrevemos na 1.ª página. A 2.ª fica intacta do template.
name:  { pageIndex: 0, x: 228.7, y: 302.5, w: 320, fontSize: 22.76 },
  cc:    { pageIndex: 0, x: 382.8, y: 274.8, w: 320, fontSize: 22.76 },
  grade: { pageIndex: 0, x: 45.0, y: 122.8, w: 200, fontSize: 40 }
      },
      rules: { goldFrom: 80 } // >=80 ouro, <80 cinzento
    }
  ]
};
