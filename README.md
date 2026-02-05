EDITOR DE CERTIFICADOS (com modo ADMIN)

MODO COLEGAS (por defeito)
- Abre normalmente: https://.../teu-repo/
- Só aparece o formulário e o botão para gerar PDF.
- Não existe calibração, nem coordenadas.

MODO ADMIN (para calibração)
- Abre com: https://.../teu-repo/?admin=1
- Aparece o painel "Admin: Calibração".
- Carrega o template, clica para marcar Nome, CC e Coroa.
- Copia o snippet e cola no js/config.js (curso correspondente).
- Faz commit/push.

Adicionar novo curso
1) Coloca o PDF em /templates (ex.: templates/illustrator.pdf)
2) Duplica um bloco em js/config.js dentro de courses[]
3) Abre em modo admin (?admin=1) e calibra
