// Coordenadas em unidades PDF (origem no canto inferior esquerdo).
// Ajusta aqui por curso.
//
// DICA: Se algum nome ficar "fora", aumenta a largura (w) do campo
// e/ou baixa o tamanho (fontSize). O sistema tenta auto-ajustar ao máximo.
//
// Nota: o template do exemplo tem 2 páginas; só escrevemos na página 1 (index 0).

window.CERT_CONFIG = {
  courses: [
    {
      id: "photoshop",
      label: "Adobe Photoshop",
      template: "templates/photoshop.pdf",
      // Página 1: campos preenchidos
      fields: {
        // Linha de cima (nome)
    name: { pageIndex: 0, x: 505, y: 445, w: 260, fontSize: 22.76 },
cc:   { pageIndex: 0, x: 505, y: 385, w: 260, fontSize: 22.76 },
grade:{ pageIndex: 0, x: 70,  y: 135, w: 200, fontSize: 54 }
      },
      // Estilo (podes afinar depois)
      style: {
        textColorRgb: [1, 1, 1],   // branco
        gradeColorRgb: [1, 1, 1],  // branco
        // Para a nota, normalmente fica melhor em bold e maior.
        gradeBold: true
      }
    }
  ]
};
