# Vivek Akkisetty — Portfolio v3.0

## What's Improved in v3.0

### Bug Fixes
- **"Hire Me" button** now correctly scrolls to the Contact section
- **Email address** is now fully visible and clickable (`vivekakkisetty@gmail.com`)
- **Project buttons** now link to GitHub (update with real repo URLs)
- **Avatar fallback** is now a styled "VA" monogram instead of a generic user icon

### Design Improvements
- **Project card colors** — all three cards now use brand-consistent brown palette gradients (no random green/navy)
- **Skills section balance** — all 4 secondary tiles are equal size; progress bar only on featured Python card
- **Education facts** — replaced "Top Academic Performer" self-declared badge with factual "CGPA 8.9/10"
- **Currently Learning strip** — added React.js, Node.js, MongoDB, TailwindCSS, ML tags below Skills
- **About stats panel** — "3+ Projects" replaced with "Open To Work" (stronger signal)

### New Features
- **GitHub icon** added to Hero socials, Contact section, and Footer
- **Custom cursor** with smooth follower animation and interactive hover scaling
- **Letter wave animation** on hero name hover
- **Hero parallax** on background word while scrolling

---

## File Structure

```
portfolio/
├── index.html      ← Main HTML
├── style.css       ← All styles
├── script.js       ← All interactions
├── README.md       ← This file
└── images/
    └── vivek.jpg   ← Add your photo here
```

---

## How to Run

### Option 1 — Double click (instant)
Open `index.html` directly in your browser. No setup needed.

### Option 2 — VS Code Live Server (recommended)
1. Open the `portfolio/` folder in VS Code
2. Install **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**

### Option 3 — Python server
```bash
cd portfolio
python -m http.server 5500
```
Visit `http://localhost:5500`

---

## Adding Your Profile Photo

1. Place your photo file (e.g. `vivek.jpg`) inside a folder called `images/`
2. The `index.html` already points to `images/vivek.jpg`
3. If the photo fails to load, the "VA" monogram shows automatically

---

## Update GitHub Links

Search for `github.com/vivekakkisetty` in `index.html` and replace with your actual GitHub profile URL or repo links.

---

## Color Reference

| Token        | Hex       | Use                  |
|--------------|-----------|----------------------|
| `--beige`    | `#F5F0E8` | Main background      |
| `--brown`    | `#5C4033` | Primary accent       |
| `--brown-dk` | `#2E1F18` | Headings             |
| `--brown-md` | `#8B6F63` | Subtext / muted      |
| `--brown-lt` | `#C4A99B` | Borders / rings      |
| `--dark`     | `#1A0F0A` | Contact bg / footer  |

---

© 2025 Vivek Akkisetty
