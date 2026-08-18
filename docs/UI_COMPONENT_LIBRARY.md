# UI Component Library & Visual Interface 🎨📱

This document details the user interface layout, design system components, visual primitives, and interactive elements of **Panels Studio Pro**.

> [!NOTE]
> Connected Graph Nodes: [[INDEX]] | [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]] | [[TECH_STACK_AND_ARCHITECTURE]] | [[DATA_FLOW]] | [[DESIGN]] | [[DEVELOPMENT_HISTORY]]

---

## 1. Primary Layout Components

### 1.1 Glassmorphic Header Bar
- **Styling**: `bg-white/80 backdrop-blur-md border-b border-emerald-200/80 sticky top-0 z-30 shadow-sm`.
- **Elements**:
  - Studio Pro Logo badge with gradient icon background (`from-emerald-600 to-green-500`).
  - Quick action buttons: **Quick Palette PNG** and **Export Studio**.

### 1.2 Curated Demo Presets Bar
- **Location**: Top of main content area below hero text.
- **Functionality**: Renders 4 curated SVG sample cards (*Emerald Sunset, Cyberpunk Neon, Nordic Forest, Minimal Clay*).
- **Behavior**: Clicking any sample loads the image into canvas and triggers immediate color extraction without waiting for user file upload.

### 1.3 Upload Zone & Eyedropper Studio
- **Dropzone**: Responsive drag-and-drop zone with dashed emerald border (`border-dashed border-emerald-300`).
- **Native / Canvas Eyedropper**:
  - Supports native `EyeDropper` browser API (`new EyeDropper()`).
  - Falls back to interactive HTML5 Canvas pixel sampling with crosshair cursor. Clicking any pixel on the uploaded image extracts and copies its exact `#` HEX code.

### 1.4 Hero Color Palette Preview Area (`4628.png` Style)
- **Dual Preview Modes**:
  1. **Side-by-Side Vertical Bars**: Displays extracted colors as proportional vertical bars. Each bar contains a rotated $-90^\circ$ upright `#` HEX label in contrast-aware typography (`#064e3b` on light swatches, `#ffffff` on dark swatches). Hovering expands the bar smoothly (`hover:flex-[1.8]`).
  2. **Upright List View**: Renders swatches as detailed rows displaying HEX, RGB, and HSL strings with quick copy buttons.

### 1.5 Controls Toolbar
- **Uniform Control Pills**: All 3 controls (*Algorithm Select*, *Sort Select*, *Swatches Count Slider*) share an identical `h-10 rounded-full border border-emerald-200/90 bg-white px-4 text-xs font-extrabold` pill design.

### 1.6 Studio Tabs Suite
- **Tab 1: Hero Palette**: Live side-by-side vertical color bars.
- **Tab 2: Live UI Web Design Mockup**: Renders a miniature interactive web application UI (Navigation Header, Hero Card, Action Buttons, Badges) painted in real-time using extracted image colors.
- **Tab 3: WCAG Accessibility Matrix**: Calculates contrast ratios and WCAG 2.1 AA/AAA compliance for all extracted colors.

### 1.7 50-900 Color Shades & Tints Modal
- Displays Tailwind-style 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 shade variations for any selected swatch with 1-click copy.

### 1.8 Export Studio Modal
- Renders real-time canvas previews for 7 export formats:
  1. **Pure Palette PNG** (Vertical color bars matching `4628.png` style).
  2. **Pure Palette JPEG**.
  3. **Full Graphic Poster** (Poster layout with image thumbnail).
  4. **HEX List (.txt)**.
  5. **CSS `:root` Variables**.
  6. **Tailwind CSS Config**.
  7. **JSON Dataset**.

---

## 🔗 Connected Nodes
- [[INDEX]]
- [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]]
- [[TECH_STACK_AND_ARCHITECTURE]]
- [[UI_COMPONENT_LIBRARY]]
- [[DATA_FLOW]]
- [[DESIGN]]
- [[DEVELOPMENT_HISTORY]]