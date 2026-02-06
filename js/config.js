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
  name:  { pageIndex: 0, x: 231.6, y: 306.3, w: 320, fontSize: 22.76 },
  cc:    { pageIndex: 0, x: 383.8, y: 283.4, w: 320, fontSize: 22.76 },
  grade: { pageIndex: 0, x: 67.9, y: 132.4, w: 200, fontSize: 56 }
},
      rules: { goldFrom: 80 } // >=80 ouro, <80 cinzento
    }
  ]
};
