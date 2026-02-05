// js/config.js
// Coordenadas em pontos PDF (origem: canto inferior esquerdo).
window.CERT_CONFIG = {
  courses: [
    {
      id: "photoshop",
      label: "Adobe Photoshop",
      template: "templates/photoshop.pdf",
      fields: {
        // Vais preencher isto com a calibração (clicar no template)
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 40 }
      },
      style: {
        textColorRgb: [1, 1, 1],
        gradeColorRgb: [1, 1, 1],
        gradeBold: true
      }
    }
  ]
};
