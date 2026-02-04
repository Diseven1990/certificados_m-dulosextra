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
  name: {
    pageIndex: 0,
    x: 413,
    y: 68,
    w: 320,
    fontSize: 22.76
  },
  cc: {
    pageIndex: 0,
    x: 413,
    y: 25,
    w: 320,
    fontSize: 22.76
  },
  grade: {
    pageIndex: 0,
    x: 65,
    y: 135,
    w: 200,
    fontSize: 40
  }
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
