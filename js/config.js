// Coordenadas em pontos PDF (origem: canto inferior esquerdo).
// Em modo ADMIN (?admin=1), calibra por clique e descarrega o config.js completo.
window.CERT_CONFIG = {
  courses: [
    {
      id: "canva",
      label: "Canva",
      templates: {
        gold: "templates/canva_ouro.pdf",
        grey: "templates/canva_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 56 }
      },
      rules: { goldFrom: 80 },
      style: { textColorRgb: [1, 1, 1] }
    },
    {
      id: "chatgpt",
      label: "ChatGPT",
      templates: {
        gold: "templates/chatgpt_ouro.pdf",
        grey: "templates/chatgpt_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 56 }
      },
      rules: { goldFrom: 80 },
      style: { textColorRgb: [1, 1, 1] }
    },
    {
      id: "inshot",
      label: "InShot",
      templates: {
        gold: "templates/inshot_ouro.pdf",
        grey: "templates/inshot_cin.pdf"
      },
      fields: {
        name:  { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        cc:    { pageIndex: 0, x: 0, y: 0, w: 320, fontSize: 22.76 },
        grade: { pageIndex: 0, x: 0, y: 0, w: 200, fontSize: 56 }
      },
      rules: { goldFrom: 80 },
      style: { textColorRgb: [1, 1, 1] }
    }
  ]
};
