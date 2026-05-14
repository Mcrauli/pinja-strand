# Pinja Strand Photo — Website Design Spec

**Date:** 2026-05-14
**Project:** Pinja Strand Photo — ammattivalokuvaajan portfolio-sivusto
**Tech:** Pure HTML/CSS/JS static site, GitHub Pages

---

## Brief

Ammattivalokuvaaja Pinja Strandin henkilökohtainen portfolio-sivusto. Kolme päägenreä: häät, muotokuvat, maisema. Tyyli: elegantti, ammattimainen, vaalea — dusty rose & sage green -värimaailma, italic serif -otsikot. Sama arkkitehtuuri kuin bbitumi (jaettu style.css + erilliset HTML-sivut), hostaus GitHub Pagesissa.

---

## Visual Design

### Väripaletti

| Token | Arvo | Käyttö |
|---|---|---|
| `--bg` | `#faf8f5` | Sivun pääväri |
| `--bg2` | `#f2ede8` | Kortit, sektiot |
| `--bg3` | `#ede6df` | Hover, aktiiviset |
| `--rose` | `#b07868` | Pääaksentti (dusty rose) |
| `--rose-dim` | `rgba(176,120,104,0.12)` | Aksentti-taustat |
| `--sage` | `#6a8470` | Toissijainen aksentti |
| `--sage-dim` | `rgba(106,132,112,0.12)` | Sage-taustat |
| `--ink` | `#1e1810` | Pääväri tekstille |
| `--muted` | `#9a8878` | Toissijainen teksti |
| `--border` | `rgba(30,24,16,0.08)` | Reunat |
| `--border-rose` | `rgba(176,120,104,0.25)` | Lämmin reunaväri |

### Typografia

- **Display/otsikot:** Georgia, serif — italic, painot 400 (regular) ja normaali
- **Labelit/eyebrow:** 'Courier New', monospace — pienet, letter-spacing 3-4px, uppercase
- **Leipäteksti:** Inter, sans-serif — weight 300–500
- **H1-koko:** `clamp(2.8rem, 5.5vw, 5.2rem)`, font-style: italic
- **Section headings:** `clamp(2rem, 3.5vw, 3.2rem)`, italic

### Animaatiot

- Scroll-reveal: IntersectionObserver, `opacity 0→1 + translateY 28px→0`, kesto 1.1s (hitaampi kuin bbitumi, elokuvallisempi)
- Hover-efektit: kuvien subtle zoom (scale 1.03), linkkien underline-animaatio
- Portfolio filter: CSS transition opacity + scale kun kuvat piiloutuvat/ilmestyvät

---

## Sivurakenne

### 1. `index.html` — Etusivu

**Hero-osio:**
- Fullscreen-korkuinen (100vh), iso taustakuva (onerror-fallback kuten bbitumi)
- Tumma gradient overlay alhaalta ylöspäin jotta teksti erottuu
- Eyebrow: `— Valokuvaaja / Helsinki` (Courier New, monospace)
- H1 italic serif: esim. *"Hetket jotka jäävät ikuisiksi."*
- Genret rivillä: pienillä tageilla tai tekstinä
- Scroll-indikaattori

**Portfolio-preview-osio:**
- 6 parasta kuvaa 3-kolumnisessa gridissä, hover-zoom
- "Katso kaikki" -nappi → portfolio.html

**About-snippet:**
- 2-kolumninen: iso kuva vasemmalla, lyhyt teksti + nappi oikealla
- Johdattaa about.html-sivulle

**CTA-band:**
- Pehmeä roosa tausta, yhteystiedot, nappi

**Footer:**
- Logo, navigaatio, some-linkit, copyright

---

### 2. `portfolio.html` — Portfolio

**Filter-palkki:**
- Neljä nappia: Kaikki / Häät / Muotokuvat / Maisema
- Aktiivinen nappi: rose-väri, täytetty
- Kuvat merkitty `data-category="haat|muotokuva|maisema"`

**Galleria:**
- CSS columns (3 kolumnia desktop, 2 tablet, 1 mobile) — masonry-efekti
- Kuvat latautuvat kaikki, JS piilottaa/näyttää `display:none` / `display:block` kategorian mukaan
- Hover: tumma overlay + zoom-ikoni

**Lightbox:**
- Sama rakenne kuin bbitumi kuvat.html
- Edellinen/seuraava napit, ESC sulkee, caption alhaalla
- Näyttää vain aktiivisen kategorian kuvat lightboxissa

---

### 3. `palvelut.html` — Palvelut & hinnat

**Pakettikortit (3 kpl):**
- Numero (01/02/03), palvelun nimi italic, lyhyt kuvaus, hinta
- Pinja täyttää oikeat hinnat itse — pohjassa placeholder-hinnat
- CTA-nappi jokaisessa kortissa → yhteystiedot.html

**Pakettisisältö (placeholder):**
1. Hääkuvaus — koko päivä, editointi, digitaaliset kuvat
2. Muotokuvaus — 1–2h, 20–30 editoitua kuvaa
3. Fine Art Print — tasovedos tilauksesta

**Usein kysyttyä -osio:**
- 3–4 kysymystä/vastausta pienemmällä fontilla

---

### 4. `about.html` — Tietoa minusta

**Hero-rakenne:**
- 2-kolumninen: vasen = iso pystykuva Pinjasta, oikea = teksti
- Eyebrow label, H2 italic, 2–3 kappaletta tarinaa
- Pinja kirjoittaa tekstin itse — pohjassa lorem placeholder

**Arvot-osio:**
- 3 arvo-korttia: esim. "Aitous", "Hetki", "Taide"
- Sage-väriset ikonit tai numerot

---

### 5. `yhteystiedot.html` — Yhteystiedot

**Lomake (vasemmalla):**
- Nimi, sähköposti, aihe (dropdown: Hääkuvaus / Muotokuvaus / Maisema / Muu), viesti
- Submit → `mailto:` (ei backendiä)
- Nappi: rose-väri

**Yhteystiedot (oikealla):**
- Sähköposti, sijainti (Helsinki), Instagram-linkki
- Instagram erityisen näkyvästi — valokuvaajille tärkein kanava

---

### 6. `blogi.html` — Blogi

**Korttilistaus:**
- 3-kolumninen grid
- Jokainen kortti: kansi-kuva, päivämäärä (Courier New), otsikko italic, lyhyt intro
- Hover: kuva zoomaa, kortti nousee

---

### 7. `blogi-pohja.html` — Esimerkkiartikkeli

- Yksi valmis artikkelipohja jonka Pinja kopioi uusiin kirjoituksiin
- Otsikko, päivämäärä, hero-kuva, leipäteksti, kuva-grid

---

## Tiedostorakenne

```
pinja-strand/
├── style.css          — jaettu design system
├── index.html
├── portfolio.html
├── palvelut.html
├── about.html
├── yhteystiedot.html
├── blogi.html
└── blogi-pohja.html
```

---

## Tekniset vaatimukset

- Ei frameworkkia, ei npm, ei build-steppiä
- Kuvat: `onerror`-fallback jos kuva ei lataudu (sama kuin bbitumi)
- Mobiiliresponsiivisuus: breakpointit 1024px, 768px, 520px
- GitHub Pages -hostaus (julkinen repo tai GitHub Pro)
- Fontti Inter: Google Fonts CDN (sama kuin bbitumi)
- Georgia ja Courier New: systeemifontit, ei CDN-tarvetta

---

## Ei sisälly scopeen

- CMS tai admin-paneeli
- Maksujärjestelmä
- Varausjärjestelmä
- Blogi-artikkeleita enempää kuin yksi pohja + yksi esimerkki
