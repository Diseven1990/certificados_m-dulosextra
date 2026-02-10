// Coordenadas em pontos PDF (origem: canto inferior esquerdo).
// Em modo ADMIN (?admin=1), calibra por clique e descarrega o config.js completo.
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
        name:  { pageIndex: 0, x: 231.6, y: 303.9, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 382.8, y: 274.3, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 46.9, y: 120.4, w: 200, fontSize: 40 }
      },
      rules: { goldFrom: 80 },
      style: { textColorRgb: [1, 1, 1] }
    },
    {
      id: "swonkie",
      label: "Swonkie",
      templates: {
        gold: "templates/swonkie_ouro.pdf",
        grey: "templates/swonkie_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 590.5, y: 295.3, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 487.1, y: 263.8, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 447.9, y: 115.6, w: 200, fontSize: 40 }
      },
      rules: { goldFrom: 80 },
      style: { textColorRgb: [1, 1, 1] }
    },
    {
      id: "premiere",
      label: "Adobe Premiere",
      templates: {
        gold: "templates/premiere_ouro.pdf",
        grey: "templates/premiere_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 228.7, y: 303.9, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 386.6, y: 276.2, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 47.9, y: 117.5, w: 200, fontSize: 40 }
      },
      rules: { goldFrom: 80 },
      style: { textColorRgb: [1, 1, 1] }
    },
    {
      id: "lightroom",
      label: "Adobe Lightroom",
      templates: {
        gold: "templates/lightroom_ouro.pdf",
        grey: "templates/lightroom_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 227.8, y: 304.9, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 383.8, y: 278.1, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 49.8, y: 117.5, w: 200, fontSize: 40 }
      },
      rules: { goldFrom: 80 },
      style: { textColorRgb: [0, 0, 0] }
    },
    {
      id: "closum",
      label: "Closum",
      templates: {
        gold: "templates/closum_ouro.pdf",
        grey: "templates/closum_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 586.7, y: 296.3, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 490.0, y: 265.7, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 448.8, y: 114.7, w: 200, fontSize: 40 }
      },
      rules: { goldFrom: 80 },
      style: { textColorRgb: [1, 1, 1] }
    }
  ]
};
