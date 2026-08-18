# Panels Studio Pro

A high-performance, privacy-first client-side web application for extracting, analyzing, previewing, and exporting color palettes directly from digital images using HTML5 Canvas processing.

---

## Core Capabilities

- **Client-Side Pixel Processing**: All computations execute locally in browser memory using the HTML5 Canvas API. Zero network requests or external server image uploads ensure complete data privacy.
- **Color Quantization Algorithms**:
  - **Grid Spatial Sampling**: Fast 2D matrix sampling across spatial image coordinates.
  - **K-Means++ Vector Quantization**: Iterative cluster centroid optimization for precise dominant color discovery.
  - **Median Cut Quantization**: Recursive RGB box partitioning along maximum color variance axes.
  - **Vibrant / Sample Extraction**: Selective color extraction prioritizing saturation and visual distinction.
- **Custom Palette & Eyedropper Workflow**: Interactive canvas eyedropper allowing pixel-precise manual color selection to curate custom color schemes.
- **Dual Display Modes**:
  - **Vertical Color Bars**: Poster-style visualization featuring relative luminance contrast calculations and rotated HEX labels.
  - **Upright Data Rows**: Expanded detail view providing HEX, RGB, HSL values, and 50–900 shade generation.
- **Interactive UI Mockup Studio**: Real-time component preview environment for testing extracted color palettes across application user interfaces.
- **WCAG 2.1 Accessibility Matrix**: Real-time relative luminance calculation and automated AA/AAA contrast compliance verification.
- **Multi-Format Export Engine**:
  - High-resolution palette PNG / JPEG image exports.
  - Graphic poster PNG output featuring image thumbnail, color swatches, and metadata watermark.
  - Code exports including native CSS `:root` variables, Tailwind CSS extension configurations, structured JSON datasets, and plain-text HEX arrays.

---

## Technical Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript 5
- **Build Tooling**: Vite 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5 (with cached `ImageData` buffers)
- **Icons**: Lucide React

---

## Project Structure & Technical Documentation

Comprehensive architectural specifications and algorithm documentation are maintained in the [`docs/`](./docs) directory:

- [`docs/INDEX.md`](./docs/INDEX.md): Master Knowledge Graph Index
- [`docs/TECHNICAL_ALGORITHMS_AND_WORKFLOW.md`](./docs/TECHNICAL_ALGORITHMS_AND_WORKFLOW.md): Mathematical foundations and quantization algorithms
- [`docs/TECH_STACK_AND_ARCHITECTURE.md`](./docs/TECH_STACK_AND_ARCHITECTURE.md): Software architecture and state management specifications
- [`docs/UI_COMPONENT_LIBRARY.md`](./docs/UI_COMPONENT_LIBRARY.md): Component layout and design system tokens
- [`docs/DATA_FLOW.md`](./docs/DATA_FLOW.md): Event loops and reactive state lifecycle
- [`docs/DESIGN.md`](./docs/DESIGN.md): Design tokens and aesthetic guidelines
- [`docs/DEVELOPMENT_HISTORY.md`](./docs/DEVELOPMENT_HISTORY.md): Changelog and release milestones

---

## Setup and Installation

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm, yarn, or pnpm

### Execution Commands

1. Clone the repository:
   ```bash
   git clone https://github.com/shivasickko/Panels.git
   cd Panels
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch local development server:
   ```bash
   npm run dev
   ```

4. Create production build:
   ```bash
   npm run build
   ```

---

## License

MIT License © 2026 Panels
