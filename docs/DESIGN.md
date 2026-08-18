# Design System & Decision Rationale 🎨✨

This document explains the design philosophy, aesthetic tokens, component guidelines, and visual choices behind **Panels Studio Pro**.

> [!NOTE]
> Connected Graph Nodes: [[INDEX]] | [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]] | [[TECH_STACK_AND_ARCHITECTURE]] | [[UI_COMPONENT_LIBRARY]] | [[DATA_FLOW]] | [[DEVELOPMENT_HISTORY]]

---

## 🎨 Aesthetic Vision & Design Principles

The primary objective of **Panels Studio Pro** is to provide an interface that feels like a premium design studio application—combining warmth, elegance, and utility.

### Core Visual Pillars:
1. **Warm Studio Canvas (`#faf8f5`)**: Instead of stark dark modes or plain cold whites, the interface uses a warm, organic studio background reminiscent of fine art paper and design workbench surfaces.
2. **Emerald Green Accent Tokens (`#064e3b` / `#047857` / `#a7f3d0`)**: Emerald represents precision, vitality, and craftsmanship. Primary call-to-actions, badges, and icon highlights use rich emerald greens.
3. **Glassmorphism Header**: A semi-transparent sticky navigation bar (`bg-white/80 backdrop-blur-md`) grounds the workspace while scrolling.
4. **Soft Glow Ambient Lighting**: Fixed background ambient radial blurs (`bg-emerald-200/30 blur-3xl`) add spatial depth without overloading GPU memory.

---

## 📐 Color Science & Visual Legibility

To ensure maximum legibility when rendering text on extracted color bars (both in the live UI and in PNG poster exports), Panels Studio Pro calculates relative luminance $L$ dynamically:

```typescript
const isLight = luminance > 0.55;
const textColor = isLight ? '#064e3b' : '#ffffff';
```

- **Light Color Swatches**: Text renders in deep emerald `#064e3b` with a soft white text shadow.
- **Dark Color Swatches**: Text renders in crisp white `#ffffff` with a subtle dark text shadow.

---

## 3. Uniform Control Pill Specification

Toolbar buttons and select dropdowns adhere to a strict uniform design specification:
- **Height**: Exact `h-10` (40px).
- **Shape**: Complete pill curvature (`rounded-full`).
- **Border**: `border border-emerald-200/90`.
- **Background**: `bg-white`.
- **Hover State**: `hover:border-emerald-400`.
- **Shadow**: `shadow-sm`.

---

## 🔗 Connected Nodes
- [[INDEX]]
- [[TECHNICAL_ALGORITHMS_AND_WORKFLOW]]
- [[TECH_STACK_AND_ARCHITECTURE]]
- [[UI_COMPONENT_LIBRARY]]
- [[DATA_FLOW]]
- [[DEVELOPMENT_HISTORY]]