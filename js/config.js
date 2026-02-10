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
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 56 }
      },
      rules: { goldFrom: 80 }
    },
    {
      id: "swonkie",
      label: "Swonkie",
      templates: {
        gold: "templates/swonkie_ouro.pdf",
        grey: "templates/swonkie_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 56 }
      },
      rules: { goldFrom: 80 }
    },
    {
      id: "premiere",
      label: "Adobe Premiere",
      templates: {
        gold: "templates/premiere_ouro.pdf",
        grey: "templates/premiere_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 56 }
      },
      rules: { goldFrom: 80 }
    },
    {
      id: "lightroom",
      label: "Adobe Lightroom",
      templates: {
        gold: "templates/lightroom_ouro.pdf",
        grey: "templates/lightroom_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 56 }
      },
      rules: { goldFrom: 80 }
    },
    {
      id: "closum",
      label: "Closum",
      templates: {
        gold: "templates/closum_ouro.pdf",
        grey: "templates/closum_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 56 }
      },
      rules: { goldFrom: 80 }
    }
  ]
};
