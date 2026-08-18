# Data Flow & State Management Architecture 🔄📊

This document details the reactive data flow, state management lifecycle, event loops, and export pipelines in **Panels Studio Pro**.

> [!NOTE]
> Connected Graph Nodes: [[INDEX]] | [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]] | [[TECH_STACK_AND_ARCHITECTURE]] | [[UI_COMPONENT_LIBRARY]] | [[DESIGN]] | [[DEVELOPMENT_HISTORY]]

---

## 1. End-to-End Data Pipeline

```
[ User Interaction ] 
  ├── File Drag & Drop / File Input
  └── Sample Preset Click
        │
        ▼
[ Image Loading Phase ]
  ├── URL.createObjectURL(file) OR Demo SVG Data URI
  ├── Set imageSrc in React state
  └── Draw image onto HTML5 Canvas context (canvasRef)
        │
        ▼
[ Pixel Extraction & Caching ]
  ├── ctx.getImageData(0, 0, width, height)
  └── Store cached imageData in Zustand store (useStore)
        │
        ▼
[ Color Quantization Execution ]
  ├── Read current controls: algorithm ('kmeans'|'median'|'sample'|'grid'), colorCount (2-16)
  ├── Run selected extraction algorithm in colorExtractor.ts
  └── Generate raw Color[] array
        │
        ▼
[ Palette Post-Processing ]
  ├── Calculate HSL, OKLCH, relative luminance L
  ├── Compute 50-900 Shades & Tints
  └── Evaluate WCAG 2.1 contrast ratios
        │
        ▼
[ Sorting & UI Synchronization ]
  ├── Apply selected sort method (Default, Light-to-Dark, Dark-to-Light, Hue, Saturation)
  └── React re-renders side-by-side vertical color bars, UI Mockup, & WCAG Matrix
        │
        ▼
[ Export Pipeline ]
  ├── Render preview canvas for Pure PNG/JPEG or Full Poster
  └── Generate download blob or code text (CSS/Tailwind/JSON/TXT)
```

---

## 2. Zustand Store Schema (`useStore.ts`)

```typescript
export interface AppState {
  image: {
    src: string | null;
    width: number | null;
    height: number | null;
    imageData: ImageData | null;
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
  
  // Actions
  setImage: (src: string | null, width: number | null, height: number | null) => void;
  setAlgorithm: (algorithm: 'kmeans' | 'median' | 'sample' | 'grid') => void;
  setColorCount: (count: number) => void;
  extractColors: (imageData?: ImageData) => void;
}
```

---

## 🔗 Connected Nodes
- [[INDEX]]
- [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]]
- [[TECH_STACK_AND_ARCHITECTURE]]
- [[UI_COMPONENT_LIBRARY]]
- [[DESIGN]]
- [[DEVELOPMENT_HISTORY]]