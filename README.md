# Gerador de Certificados (GitHub Pages)

- 1 PDF por curso (com 2 páginas).
- Preenche apenas a página 1 (template).
- A página 2 (conteúdos do curso) mantém-se fixa.

## Como publicar
1. Cria um repositório no GitHub e faz upload destes ficheiros.
2. Em Settings → Pages, escolhe "Deploy from a branch" e seleciona `main` + `/root`.
3. Abre o link do GitHub Pages.

## Como adicionar novos cursos
1. Coloca o PDF em `templates/<curso>.pdf` (sempre com 2 páginas).
2. Duplica o bloco do curso em `js/config.js` e altera:
   - `id`, `label`, `template`
   - coordenadas `x`, `y`, largura `w` e `fontSize` dos campos.

## Notas sobre fontes
Este exemplo usa Helvetica (standard) como aproximação. Se quiseres ficar mais próximo da fonte original,
podemos embutir uma fonte condensada (TTF/OTF) no projeto e o pdf-lib passa a usá-la ao escrever texto.
