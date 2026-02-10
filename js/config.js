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
        name:  { pageIndex: 0, x: 227.8, y: 303.9,  w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 381.9, y: 277.2,  w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 49.8, y: 123.3, w: 200, fontSize: 40 }
      },
      rules: { goldFrom: 80 } // >=80 ouro, <80 cinzento
    }
  ]
};


