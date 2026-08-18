# Technical Algorithms & Workflow Architecture 🔬⚙️

This document provides a comprehensive mathematical, technical, and algorithmic breakdown of the **Panels Studio Pro** extraction pipeline, color space transformations, WCAG accessibility formulas, and processing workflows.

> [!NOTE]
> Connected Graph Nodes: [[INDEX]] | [[TECH_STACK_AND_ARCHITECTURE]] | [[UI_COMPONENT_LIBRARY]] | [[DATA_FLOW]] | [[DESIGN]] | [[DEVELOPMENT_HISTORY]]

---

## 1. Extraction Pipeline Overview

Panels Studio Pro implements 4 distinct color extraction algorithms in `src/lib/colorExtractor.ts` to accommodate diverse image types (photographs, digital art, screenshots, logos).

### 1.1 Grid Spatial Sampling (`extractColorsGrid`)
- **Concept**: Divides the image canvas into a 2D spatial grid matrix of $N \times N$ cells (where $N = \lceil\sqrt{k}\rceil$ for target color count $k$).
- **Mechanism**:
  - Calculates cell width $W_{cell} = \lceil W_{image} / N \rceil$ and cell height $H_{cell} = \lceil H_{image} / N \rceil$.
  - Iterates through pixels with a step stride of 2 for memory efficiency.
  - Filters out transparent pixels ($A \le 128$).
  - Accumulates red, green, and blue values within each spatial grid region and computes arithmetic mean:
    $$\bar{R} = \frac{1}{M}\sum_{i=1}^{M} R_i, \quad \bar{G} = \frac{1}{M}\sum_{i=1}^{M} G_i, \quad \bar{B} = \frac{1}{M}\sum_{i=1}^{M} B_i$$
- **Best Used For**: Uniform spatial coverage, capturing background, midground, and foreground tones equally regardless of color frequency.

### 1.2 K-Means++ Clustering (`extractColorsKMeansPlus`)
- **Concept**: An iterative unsupervised machine learning clustering algorithm that partitions pixel RGBA vectors into $k$ optimal color clusters.
- **Initialization (K-Means++)**:
  1. Selects first centroid $c_1$ uniformly at random from sampled pixels.
  2. For subsequent centroids $c_2, \dots, c_k$, computes squared Euclidean distance to nearest existing centroid:
     $$D(x)^2 = \min_{j} \|x - c_j\|^2$$
  3. Selects next centroid with probability proportional to $D(x)^2$, ensuring spread-out initial cluster centers and avoiding poor local minima convergence.
- **Iteration Phase**:
  - Assigns each pixel $x_i$ to nearest centroid $c_j$.
  - Recalculates centroid coordinates as cluster mean vector:
    $$c_j^{(t+1)} = \frac{1}{|S_j^{(t)}|} \sum_{x_i \in S_j^{(t)}} x_i$$
  - Executes for up to 8 iterations or until centroid convergence.
- **Best Used For**: Continuous tone photographs, complex color gradients, and high-fidelity dominant palette discovery.

### 1.3 Median Cut Quantization (`extractColorsMedianCut`)
- **Concept**: A recursive spatial color space subdivision algorithm (invented by Paul Heckbert) that partitions the RGB color bounding box along its maximum color spread axis.
- **Mechanism**:
  1. Encloses all valid image pixels inside a initial 3D bounding box in RGB color space.
  2. Calculates color range $\Delta R = R_{max} - R_{min}$, $\Delta G = G_{max} - G_{min}$, $\Delta B = B_{max} - B_{min}$.
  3. Identifies the color channel with the largest spread ($\max(\Delta R, \Delta G, \Delta B)$).
  4. Sorts pixels along that dominant channel and splits the box at the **median** index into two sub-boxes with equal pixel counts.
  5. Repeats recursively until $k$ bounding boxes are created.
  6. Computes weighted average RGB color of each final bounding box.
- **Best Used For**: Flat graphic design, website screenshots, illustrations, and logos with crisp distinct color blocks.

### 1.4 Vibrant / Dominant Bucket Sampling (`extractColorsPixelSampling`)
- **Concept**: A high-speed color quantization technique using a hash-mapped 3D color histogram bucket grid.
- **Mechanism**:
  - Quantizes each pixel channel to 16-step color buckets:
    $$Q(R) = \lfloor R / 16 \rfloor \times 16, \quad Q(G) = \lfloor G / 16 \rfloor \times 16, \quad Q(B) = \lfloor B / 16 \rfloor \times 16$$
  - Groups quantized keys `"Q(R),Q(G),Q(B)"` into a `Map<string, Bucket>` frequency dictionary.
  - Sorts buckets by pixel population count in descending order.
  - Takes top $k$ buckets and computes exact average RGB color per bucket.
- **Best Used For**: Instant previews, low-latency extraction, and finding primary high-frequency dominant brand colors.

---

## 2. Color Space Transformations

Every extracted color is transformed into multiple representations:

### 2.1 RGB to HSL (Hue, Saturation, Lightness)
Given normalized $r = R/255, g = G/255, b = B/255$, $max = \max(r,g,b)$, $min = \min(r,g,b)$, $\Delta = max - min$:
- **Lightness**: $L = (max + min) / 2$
- **Saturation**:
  $$S = \begin{cases} 0 & \text{if } \Delta = 0 \\ \frac{\Delta}{1 - |2L - 1|} & \text{if } \Delta > 0 \end{cases}$$
- **Hue**:
  $$H = \begin{cases} 
  0 & \text{if } \Delta = 0 \\
  60^\circ \times \left(\frac{g - b}{\Delta} \pmod 6\right) & \text{if } max = r \\
  60^\circ \times \left(\frac{b - r}{\Delta} + 2\right) & \text{if } max = g \\
  60^\circ \times \left(\frac{r - g}{\Delta} + 4\right) & \text{if } max = b
  \end{cases}$$

### 2.2 OKLCH (Perceptually Uniform Color Space)
Computes lightness $L$, chroma $C$, and hue angle $H$ in OKLab space to provide uniform perceptual steps without hue shift.

---

## 3. WCAG 2.1 Accessibility & Relative Luminance Engine

### 3.1 Relative Luminance Calculation
Computes relative luminance $L$ according to W3C WCAG 2.1 specs using sRGB linearization:
$$R_{lin} = \begin{cases} \frac{R}{12.92} & \text{if } R \le 0.04045 \\ \left(\frac{R + 0.055}{1.055}\right)^{2.4} & \text{if } R > 0.04045 \end{cases}$$
(Calculated similarly for $G_{lin}$ and $B_{lin}$).
$$L = 0.2126 R_{lin} + 0.7152 G_{lin} + 0.0722 B_{lin}$$

### 3.2 Contrast Ratio Formula
Calculates contrast ratio between two colors with luminances $L_1$ and $L_2$ ($L_1 > L_2$):
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
- **WCAG AA Pass**: Ratio $\ge 4.5:1$ (normal text) or $\ge 3.0:1$ (large text).
- **WCAG AAA Pass**: Ratio $\ge 7.0:1$ (normal text) or $\ge 4.5:1$ (large text).

---

## 4. 50-900 Color Shades & Tints Generator

Generates a 10-level design system scale ($50, 100, 200, 300, 400, 500, 600, 700, 800, 900$) from any base color $C_{base}$ (level 500):
- **Factor**: $f = \frac{500 - \text{level}}{500}$ (range: $-0.8$ to $+0.9$).
- **Lightening Tints ($f > 0$, levels $< 500$)**:
  $$R_{tint} = R_{base} + (255 - R_{base}) \times f$$
- **Darkening Shades ($f < 0$, levels $> 500$)**:
  $$R_{shade} = R_{base} \times (1 + f)$$

---

## 5. Sorting & Filtering Engine

- **Default**: Original algorithm extraction order.
- **Lightest to Darkest**: Sorts by descending relative luminance $L$.
- **Darkest to Lightest**: Sorts by ascending relative luminance $L$.
- **Hue Spectrum**: Sorts by hue angle $H \in [0^\circ, 360^\circ]$.
- **Saturation**: Sorts by color saturation percentage $S \in [0\%, 100\%]$.

---

## 🔗 Connected Nodes
- [[INDEX]]
- [[TECH_STACK_AND_ARCHITECTURE]]
- [[UI_COMPONENT_LIBRARY]]
- [[DATA_FLOW]]
- [[DESIGN]]
- [[DEVELOPMENT_HISTORY]]