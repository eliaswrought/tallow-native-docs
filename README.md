# Tallow Native — Documentation Browser

A clean, premium documentation browser for all Tallow Native project files.

## To Open

**Option 1 — Python (fastest, already installed):**
```bash
cd ~/Projects/tallow-native-docs
python3 -m http.server 3000
```
Then open: http://localhost:3000

**Option 2 — npx serve:**
```bash
cd ~/Projects/tallow-native-docs
npx serve -l 3000
```
Then open: http://localhost:3000

**Option 3 — Node http-server:**
```bash
npx http-server ~/Projects/tallow-native-docs -p 3000 -o
```

## To Rebuild content.js

If you update files in `~/Projects/tallow-native/`, regenerate the embedded content:
```bash
cd ~/Projects/tallow-native-docs
node build.js
```

## Features

- Sidebar navigation mirroring the folder structure
- Markdown rendered with proper headings, lists, tables, code blocks
- CSV files rendered as formatted tables
- SVG logos shown on both light and dark backgrounds
- HTML website files embedded in iframes
- CSS and JS files shown with syntax highlighting
- Search/filter files with ⌘K
- Brand colors: Deep Navy, Tallow Cream, Copper Gold
