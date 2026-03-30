# Vivek Akkisetty — Personal Portfolio

A modern, minimal, and professional portfolio website built with pure HTML, CSS, and JavaScript.

## 📁 File Structure

```
portfolio/
├── index.html    ← Main HTML structure
├── style.css     ← All styles (colors, layout, animations)
├── script.js     ← Scroll effects, mobile menu, animations
└── README.md     ← This file
```

## 🚀 How to Run

### Option 1 — Direct Open (Simplest)
1. Download all four files into one folder named `portfolio/`
2. Double-click `index.html` — it opens instantly in your browser
3. Done. No server needed.

### Option 2 — VS Code Live Server (Recommended for development)
1. Open the `portfolio/` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `index.html` → **"Open with Live Server"**
4. Your browser will auto-refresh on every save

### Option 3 — Python Local Server
```bash
cd portfolio
python -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

### Option 4 — Node.js serve
```bash
npm install -g serve
cd portfolio
serve .
```
Then open the URL shown in your terminal.

## 🖼️ Adding Your Profile Photo

1. Add your photo (e.g., `photo.jpg`) into the `portfolio/` folder
2. In `index.html`, find the `<div class="avatar-placeholder">` block
3. Replace it with:
```html
<img src="photo.jpg" alt="Vivek Akkisetty" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />
```

## 🎨 Color Palette

| Name      | Hex       | Usage              |
|-----------|-----------|--------------------|
| Beige     | `#F5F5DC` | Background         |
| Brown     | `#5C4033` | Accent / CTA       |
| Dark Brown| `#2E1F18` | Headings / Text    |
| Mid Brown | `#8B6F63` | Muted / Subtext    |
| Light Brown| `#C4A99B`| Borders / Rings    |

## ✨ Features

- Fixed navbar with active section highlight
- Smooth scroll to all sections
- Fade-in animations on scroll (Intersection Observer)
- Staggered reveal for skill & project cards
- Mobile hamburger menu with overlay
- Fully responsive (mobile, tablet, desktop)
- No frameworks. No build tools. Just open and run.

---

Built for Vivek Akkisetty · © 2025
