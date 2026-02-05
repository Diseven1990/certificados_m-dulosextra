// js/config.js
// Coordenadas em pontos PDF (origem: canto inferior esquerdo).
// Cada curso tem o seu bloco próprio. Os colegas não mexem aqui.
window.CERT_CONFIG = {
  courses: [
    {
      id: "photoshop",
      label: "Adobe Photoshop",
      template: "templates/photoshop.pdf",
      fields: {
        name:   { pageIndex: 0, x: 413.0, y: 68.0, w: 320, fontSize: 22.76 },
        cc:     { pageIndex: 0, x: 413.0, y: 25.0, w: 320, fontSize: 22.76 },

        // Coroa (define a âncora). Ajusta em modo admin.
        wreath: { pageIndex: 0, x: 65.0, y: 55.0, w: 240.0 },

        // Nota centrada na coroa
        grade:  { fontSize: 56, maxW: 180, offsetX: 0, offsetY: -6 },

        // "Nota final" (ancorado na coroa)
        label:  { text: "Nota final", fontSize: 14, offsetY: 18 }
      },
      rules: {
        goldFrom: 80 // >=80 dourado, abaixo cinzento
      }
    }
  ]
};
