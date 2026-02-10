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
  name:  { pageIndex: 0, x: 229.7, y: 306.8, w: 320, fontSize: 22.76 },
  cc:    { pageIndex: 0, x: 381.9, y: 277.2, w: 320, fontSize: 22.76 },
  grade: { pageIndex: 0, x: 46.9, y: 123.3, w: 200, fontSize: 40 }
},
      rules: { goldFrom: 80 } // >=80 ouro, <80 cinzento
    }
  ]
};


