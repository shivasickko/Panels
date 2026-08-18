# Panels Studio Pro 🎨✨

> **Professional Client-Side Color Extraction & Design System Studio**

Panels is a privacy-first, high-performance web application for extracting, analyzing, previewing, and exporting color palettes directly from digital images using client-side HTML5 Canvas processing.

---

## 🌟 Key Features

- ⚡ **100% Client-Side Processing**: Zero server uploads. Images remain completely private in local browser memory.
- 🎨 **4 Advanced Extraction Algorithms**:
  - **Grid Spatial Sampling**: Fast, even sampling across a 2D spatial image grid.
  - **K-Means++ Clustering**: Iterative vector quantization for true dominant color discovery.
  - **Median Cut Color Quantization**: Color box splitting based on maximum RGB variance.
  - **Vibrant / Sample Mode**: Selective extraction based on saturation and visual contrast.
- 👁️ **Interactive Eyedropper & Custom Palette Mode**: Pick pixel-precise colors directly from uploaded images to build custom palettes.
- 📊 **Dual Preview Layouts**:
  - **Vertical Color Bars**: Poster-style view with relative-luminance contrast text and rotated `#` HEX labels.
  - **Upright Data Rows**: Detailed breakdown with HEX, RGB, HSL, and shade generation controls.
- 🧪 **Live UI Mockup Studio**: Test extracted color palettes on a live interactive app user interface in real-time.
- ♿ **WCAG 2.1 Contrast Matrix**: Real-time relative luminance $L$ calculator and AA/AAA compliance indicator.
- 📦 **Multi-Format Export Studio**:
  - Pure Palette PNG / JPEG (clean vertical color bars).
  - Graphic Poster PNG (includes image thumbnail, metadata watermark, and swatches).
  - CSS `:root` variables, Tailwind CSS extension config, JSON dataset, and plain text HEX list.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/shivasickko/Panels.git
   cd Panels
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📚 Technical Documentation & Knowledge Base

Comprehensive architectural specifications and algorithm write-ups are available in the [`/docs`](./docs) directory:

- 📖 [`docs/INDEX.md`](./docs/INDEX.md) — Master Index & Knowledge Graph Overview
- ⚙️ [`docs/TECHNICAL_ALGORITHMS_AND_WORKFLOW.md`](./docs/TECHNICAL_ALGORITHMS_AND_WORKFLOW.md) — Color quantization math & formulas
- 🏗️ [`docs/TECH_STACK_AND_ARCHITECTURE.md`](./docs/TECH_STACK_AND_ARCHITECTURE.md) — Frameworks & state management design
- 🎨 [`docs/UI_COMPONENT_LIBRARY.md`](./docs/UI_COMPONENT_LIBRARY.md) — Component architecture & UI primitives
- 🔄 [`docs/DATA_FLOW.md`](./docs/DATA_FLOW.md) — Reactive data loops & export pipelines
- 🎨 [`docs/DESIGN.md`](./docs/DESIGN.md) — Design tokens & aesthetic philosophy
- 📜 [`docs/DEVELOPMENT_HISTORY.md`](./docs/DEVELOPMENT_HISTORY.md) — Milestones & changelog

---

## 🛠️ Built With

- **React 18** — Component UI framework
- **TypeScript 5** — Type safety & developer experience
- **Vite 5** — Blazing fast build tool & dev server
- **Tailwind CSS 4** — Modern utility-first styling
- **Zustand 5** — Ultra-fast state management with cached `ImageData`
- **Lucide React** — Crisp vector icons

---

## 📄 License

MIT License © 2026 Panels
