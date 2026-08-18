# Panels Studio Pro - Master Index & Knowledge Graph 🎨🔬

Welcome to the central Knowledge Graph index for **Panels Studio Pro**, an interactive, privacy-first, client-side Web Application designed for extracting, analyzing, previewing, and exporting color palettes from digital images.

> [!NOTE]
> This vault uses Obsidian WikiLinks syntax (`[[Node-Name]]`) to connect all architectural components, algorithms, design systems, and data pipelines into an interactive knowledge graph.

---

## 🌐 Knowledge Graph Nodes & Sitemap

- [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]] — Color quantization (K-Means++, Median Cut, Vibrant, Grid), 50-900 Shades/Tints generator, WCAG 2.1 contrast formulas, and sorting algorithms.
- [[TECH_STACK_AND_ARCHITECTURE]] — React 18, TypeScript 5, Vite 5, Tailwind CSS, Zustand with cached `ImageData` state management.
- [[UI_COMPONENT_LIBRARY]] — Glassmorphic header, Demo Presets bar, Canvas Dropzone, Eyedropper crosshair tool, Side-by-Side vertical bar preview, Uniform Pill Controls, Live UI Mockup studio tab, WCAG Accessibility Matrix, and Export Studio modal.
- [[DATA_FLOW]] — Complete reactive state cycle from image upload / preset selection $\rightarrow$ HTML5 Canvas extraction $\rightarrow$ Zustand store $\rightarrow$ algorithm processing $\rightarrow$ sorting $\rightarrow$ UI re-rendering & Export Canvas generation.
- [[DESIGN]] — The "Studio Pro" aesthetic: `#faf8f5` warm off-white canvas, emerald green `#064e3b` / `#047857` / `#a7f3d0` accents, contrast-aware typography, and dual-mode previews.
- [[DEVELOPMENT_HISTORY]] — Full version history, architectural milestones, bug fixes, and feature progression.

---

## 📌 Executive Summary

**Panels Studio Pro** empowers designers, frontend engineers, and brand strategists to extract dominant and vibrant color palettes from uploaded images or curated demo presets. Processing happens 100% locally in the client browser using the HTML5 Canvas API, ensuring maximum privacy and computational speed.

### Core Value Propositions:
1. **Privacy-First**: Zero server uploads; images remain exclusively inside local browser memory.
2. **Real-Time Performance**: Image pixel data (`ImageData`) is cached in Zustand state for zero-latency slider and algorithm updates.
3. **Dual Preview Modes**: Side-by-side vertical color bars (inspired by high-end design poster aesthetics) with rotated `#` HEX labels vs upright data rows.
4. **Studio Application Mockup**: Includes a live interactive Web UI theme previewer to test extracted color combinations in real-time.
5. **Accessibility Built-In**: WCAG 2.1 AA/AAA contrast matrix calculator and automated relative luminance scoring.
6. **Comprehensive Export**: 7 export formats including Pure Palette PNG/JPEG, Graphic Poster, CSS `:root` variables, Tailwind CSS config, JSON, and plain text HEX.

---

## ⚙️ How the Application Works (High-Level Overview)

```
[ Image Upload / Demo Preset ] 
             │
             ▼
   [ HTML5 Canvas API ] ──────► Extract raw RGBA Uint8ClampedArray
             │
             ▼
    [ Zustand Store ] ────────► Cache ImageData & Config (Algorithm, Swatch Count)
             │
             ▼
[ Color Quantization Engine ] ──► Execute Grid / K-Means++ / Median Cut / Vibrant Bucket
             │
             ▼
   [ Palette Post-Processor ] ──► Compute HSL, OKLCH, Luminance, WCAG Contrast, 50-900 Shades
             │
             ▼
   [ Sorting & Filtering ] ───► Default, Light-to-Dark, Dark-to-Light, Hue Spectrum, Saturation
             │
             ▼
[ Studio UI Render & Export ] ──► Hero Bars / UI Mockup / WCAG Matrix / Export Studio PNG/CSS/JSON
```

---

## 🔗 Cross-Graph Links

- [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]]
- [[TECH_STACK_AND_ARCHITECTURE]]
- [[UI_COMPONENT_LIBRARY]]
- [[DATA_FLOW]]
- [[DESIGN]]
- [[DEVELOPMENT_HISTORY]]