# Pitch Deck — Paraná

Deck en formato **Marp** (Markdown Presentation), convertible a PDF, HTML o PPT.

## Archivos

- `parana.md` — deck en Marp (~14 slides).

## Instalación Marp CLI

```bash
npm install -g @marp-team/marp-cli
```

## Exportar

```bash
# PDF
npx @marp-team/marp-cli parana.md -o parana.pdf --allow-local-files

# HTML (presentable en navegador)
npx @marp-team/marp-cli parana.md -o parana.html --html

# PowerPoint
npx @marp-team/marp-cli parana.md -o parana.pptx

# Modo watch (live preview mientras editás)
npx @marp-team/marp-cli parana.md --preview --watch
```

## VS Code

Instalar extensión [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) para preview en vivo mientras edítás `parana.md`.

## Estructura del deck

1. Portada
2. El problema
3. Hoy: 5-8 herramientas desconectadas
4. Solución: Paraná
5. Producto (qué hace, 3 bullets)
6. Demo / screenshots
7. Mercado (TAM/SAM/SOM)
8. Caso 0: Rosario Burletes
9. Competencia
10. Modelo de negocio y pricing
11. Go-to-market
12. Roadmap geográfico
13. Equipo y ask
14. Cierre
