# Tech Stack & Architecture 🛠️🏗️

This document outlines the software architecture, engineering patterns, dependency graph, and framework selections powering **Panels Studio Pro**.

> [!NOTE]
> Connected Graph Nodes: [[INDEX]] | [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]] | [[UI_COMPONENT_LIBRARY]] | [[DATA_FLOW]] | [[DESIGN]] | [[DEVELOPMENT_HISTORY]]

---

## 1. Tech Stack Overview

| Layer | Technology | Version | Rationale & Usage |
| :--- | :--- | :--- | :--- |
| **Core UI Framework** | **React** | `^18.3.1` | Declarative component UI tree, efficient reconciliation, hooks API. |
| **Language** | **TypeScript** | `^5.5.3` | Strict static typing, custom `Color` interface, zero runtime errors. |
| **Build Tool & Server** | **Vite** | `^5.4.1` | Ultra-fast ESM HMR, optimized production rollup bundling. |
| **State Management** | **Zustand** | `^4.5.5` | Lightweight reactive store with `ImageData` caching for instant updates. |
| **Styling System** | **Tailwind CSS** | `^3.4.11` | Utility-first CSS, custom studio color palette (`#faf8f5`, emerald tokens). |
| **Icons Library** | **Lucide React** | `^0.441.0` | Crisp vector icons (`Palette`, `Sparkles`, `Upload`, `Pipette`, `Download`). |
| **CSS Processing** | **PostCSS / Autoprefixer** | `^8.4.47` | Vendor prefixing, modern CSS feature compilation. |

---

## 2. Directory & Module Architecture

```
color-palette/
├── index.html                  # Main HTML document entry point
├── package.json                # Project dependencies & npm scripts
├── postcss.config.js           # PostCSS plugin configurations
├── tailwind.config.js          # Studio theme tokens & font family settings
├── tsconfig.json               # TypeScript compiler config & path aliases (@/*)
├── vite.config.ts              # Vite server & build rollup configurations
├── 4628.png                    # Aesthetic reference benchmark image
├── src/
│   ├── main.tsx                # React DOM root mounting script
│   ├── index.css               # Base Tailwind directives & custom CSS tokens
│   ├── App.tsx                 # Master Studio Shell layout, toolbar & modals
│   ├── lib/
│   │   ├── colorExtractor.ts   # 4 Quantization algorithms, WCAG & Shades engine
│   │   ├── demoImages.ts       # 4 SVG data URI demo presets (Sunset, Cyberpunk, etc.)
│   │   └── utils.ts            # Classnames merger (clsx + tailwind-merge)
│   ├── stores/
│   │   └── useStore.ts         # Zustand global reactive state & ImageData cache
│   └── components/
│       └── ui/
│         ├── button.tsx        # Styled emerald button variants
│         └── index.tsx         # Uniform Slider, Select, Input, and Dialog primitives
```

---

## 3. Core Architectural Patterns

### 3.1 Caching `ImageData` in Zustand State (`useStore.ts`)
To achieve instant, zero-latency updates when the user adjusts the **Swatches Count Slider** ($2 \to 16$) or switches **Algorithms**, the application caches raw HTML5 Canvas `ImageData` directly in the Zustand global store:

```typescript
interface AppState {
  image: {
    src: string | null;
    width: number | null;
    height: number | null;
    imageData: ImageData | null; // Cached for real-time re-processing
    isLoading: boolean;
    error: string | null;
  };
  controls: {
    algorithm: 'kmeans' | 'median' | 'sample' | 'grid';
    colorCount: number;
  };
  palette: {
    colors: Color[];
  };
}
```

When `colorCount` or `algorithm` changes, `extractColors(cachedImageData)` re-executes synchronously without needing to re-fetch or re-draw the source image!

### 3.2 Uniform UI Component Primitives
All UI controls (Select dropdowns, Sliders, Buttons) are built as reusable, uniform primitives using Tailwind CSS utility classes:
- **Uniform Control Pills**: Height `h-10`, rounded pill borders `rounded-full`, white background `bg-white`, border `border-emerald-200/90`, and hover state `hover:border-emerald-400`.

---

## 🔗 Connected Nodes
- [[INDEX]]
- [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]]
- [[UI_COMPONENT_LIBRARY]]
- [[DATA_FLOW]]
- [[DESIGN]]
- [[DEVELOPMENT_HISTORY]]