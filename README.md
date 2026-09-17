# TIZZY · Seção Shopify — Hero Céu 3D

Apenas o hero (a única seção aprovada). As demais seções serão redesenhadas antes de virar código de tema.

## Arquivos
- `sections/tizzy-hero.liquid` — a seção, com schema completo para o Customizer
- `assets/tizzy-hero.css` — estilos do hero
- `assets/tizzy-hero.js` — motor three.js + GSAP (nuvens, queda do sachê, etiquetas, estouro)
- Imagens: já estão em `assets/` deste pacote (nuvens, gomas e `embalagem.png`) — envie tudo para **Assets** do tema.

## Instalação
1. **Online Store → Themes → ⋯ → Edit code** (num tema duplicado).
2. Envie **todos os arquivos de `assets/`** (css, js e as 13 imagens) para **Assets**; `tizzy-hero.liquid` para **Sections**.
3. No Customizer, adicione a seção **TIZZY · Hero céu 3D** no topo da página — fontes e GSAP são carregados pela própria seção; nenhuma edição no `theme.liquid` é necessária.

## Editável no Customizer
- Título, eyebrow, imagem do sachê, altura do scroll de queda (200–320vh)
- Física da queda (pluma / goma / pesada) e energia do movimento (30–200%)
- Itens do ticker (um por linha) e cores do céu (3 pontos do gradiente)
- Cada **nuvem clicável** é um block: nome do benefício, nota, cor do selo, imagem da goma

## Notas
- three.js entra por CDN como módulo ES dinâmico — sem import map, compatível com temas 2.0.
- O sachê usa a foto recortada em alta (`embalagem.png`); quando a textura do Blender for exportada, dá para evoluir para o OBJ real sem mudar a seção.
- O canvas é `position:fixed` atrás do conteúdo e desaparece junto com o céu ao fim do hero — as seções seguintes do tema ficam por cima normalmente.
