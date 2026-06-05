# HIP Cultura

Eina d'autoavaluació d'innovació ciutadana per a institucions culturals, basada en
el model **Hexàgon de la Innovació Pública (HIP)** de Raúl Oliván.

La institució respon 24 preguntes (4 per cada un dels sis vectors: OPEN, TRANS,
FAST, PROTO, CO, TEC) en una escala 1–4. El resultat és un gràfic hexagonal amb
els colors de cada vector, la puntuació global i recomanacions d'accions per als
tres vectors més fluixos. Els resultats es desen al navegador per veure'n l'evolució.

## Desenvolupament local

```bash
npm install
npm run dev
```

Obre l'adreça que indica la consola (normalment http://localhost:5173).

## Publicar a GitHub Pages

Tens dues opcions.

### Opció A — Automàtic amb GitHub Actions (recomanada)

1. Crea un repositori nou a GitHub (per exemple `hip-cultura`) i puja-hi aquests fitxers:
   ```bash
   git init
   git add .
   git commit -m "HIP Cultura"
   git branch -M main
   git remote add origin https://github.com/EL_TEU_USUARI/hip-cultura.git
   git push -u origin main
   ```
2. Al repositori, ves a **Settings → Pages** i, a "Build and deployment",
   tria **Source: GitHub Actions**.
3. Cada cop que facis `push` a `main`, el workflow `.github/workflows/deploy.yml`
   compilarà i publicarà l'aplicació automàticament.
4. L'adreça final serà `https://EL_TEU_USUARI.github.io/hip-cultura/`.

### Opció B — Manual amb el paquet gh-pages

```bash
npm run deploy
```

Això compila i publica la carpeta `dist` a la branca `gh-pages`. Després, a
**Settings → Pages**, tria **Source: Deploy from a branch → gh-pages**.

## Notes

- `vite.config.js` fa servir `base: "./"` (rutes relatives), així que l'app
  funciona tant a `usuari.github.io/hip-cultura/` com en un domini propi sense
  canviar cap configuració.
- La persistència fa servir `localStorage`: les dades es desen al navegador de
  cada usuari, no en cap servidor.
- Tot el contingut (preguntes, recomanacions, colors) és a `src/HIPCultura.jsx`,
  fàcil d'editar.
