export interface Color {
  id: string;
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
  rgbString: string;
  hslString: string;
  oklchString: string;
  isLight: boolean;
  h: number;
  s: number;
  l: number;
  luminance: number;
}

export function createColor(id: string, r: number, g: number, b: number, a = 255): Color {
  const rClamped = Math.min(255, Math.max(0, Math.round(r)));
  const gClamped = Math.min(255, Math.max(0, Math.round(g)));
  const bClamped = Math.min(255, Math.max(0, Math.round(b)));

  const hex = `#${rClamped.toString(16).padStart(2, '0')}${gClamped.toString(16).padStart(2, '0')}${bClamped.toString(16).padStart(2, '0')}`;
  const rgbString = `rgb(${rClamped}, ${gClamped}, ${bClamped})`;

  const rNorm = rClamped / 255;
  const gNorm = gClamped / 255;
  const bNorm = bClamped / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h *= 60;
  }
  const hslString = `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  const oklchL = Math.round(l * 100);
  const oklchC = Math.round((max - min) * 0.3 * 100) / 100;
  const oklchH = Math.round(h);
  const oklchString = `oklch(${oklchL}% ${oklchC} ${oklchH})`;

  const luminance = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
  const isLight = luminance > 0.55;

  return {
    id,
    r: rClamped,
    g: gClamped,
    b: bClamped,
    a,
    hex,
    rgbString,
    hslString,
    oklchString,
    isLight,
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    luminance
  };
}

// Generate 50-900 Shades & Tints for a Color
export function generateShadesAndTints(color: Color): { level: number; hex: string; isLight: boolean }[] {
  const levels = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  return levels.map(level => {
    // 500 is base color, <500 are lighter tints, >500 are darker shades
    const factor = (500 - level) / 500; // -0.8 to +0.9
    let r = color.r;
    let g = color.g;
    let b = color.b;

    if (factor > 0) {
      // Lighten towards white
      r = r + (255 - r) * factor;
      g = g + (255 - g) * factor;
      b = b + (255 - b) * factor;
    } else if (factor < 0) {
      // Darken towards black
      const darkFactor = 1 + factor; // 0.2 to 1
      r = r * darkFactor;
      g = g * darkFactor;
      b = b * darkFactor;
    }

    const c = createColor(`shade-${level}`, r, g, b);
    return { level, hex: c.hex, isLight: c.isLight };
  });
}

// Calculate WCAG Contrast Ratio between two colors
export function getContrastRatio(c1: Color, c2: Color): number {
  const l1 = c1.luminance + 0.05;
  const l2 = c2.luminance + 0.05;
  return Math.round((Math.max(l1, l2) / Math.min(l1, l2)) * 100) / 100;
}

// Sort Color Palette
export function sortColors(colors: Color[], method: 'default' | 'lum-desc' | 'lum-asc' | 'hue' | 'sat'): Color[] {
  const copy = [...colors];
  switch (method) {
    case 'lum-desc':
      return copy.sort((a, b) => b.luminance - a.luminance);
    case 'lum-asc':
      return copy.sort((a, b) => a.luminance - b.luminance);
    case 'hue':
      return copy.sort((a, b) => a.h - b.h);
    case 'sat':
      return copy.sort((a, b) => b.s - a.s);
    case 'default':
    default:
      return copy;
  }
}

// 1. Grid Sampling
export function extractColorsGrid(imageData: ImageData, colorCount: number): Color[] {
  const { width, height, data } = imageData;
  const gridSize = Math.ceil(Math.sqrt(colorCount));
  const cellWidth = Math.ceil(width / gridSize);
  const cellHeight = Math.ceil(height / gridSize);
  const colors: Color[] = [];

  for (let row = 0; row < gridSize && colors.length < colorCount; row++) {
    for (let col = 0; col < gridSize && colors.length < colorCount; col++) {
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      const startX = col * cellWidth;
      const startY = row * cellHeight;
      const endX = Math.min(startX + cellWidth, width);
      const endY = Math.min(startY + cellHeight, height);

      for (let y = startY; y < endY; y += 2) {
        for (let x = startX; x < endX; x += 2) {
          const i = (y * width + x) * 4;
          if (data[i + 3] > 128) {
            rSum += data[i];
            gSum += data[i + 1];
            bSum += data[i + 2];
            count++;
          }
        }
      }

      if (count > 0) {
        colors.push(createColor(`grid-${row}-${col}`, rSum / count, gSum / count, bSum / count));
      }
    }
  }

  return colors.slice(0, colorCount);
}

// 2. K-Means++ Clustering
export function extractColorsKMeansPlus(imageData: ImageData, colorCount: number): Color[] {
  const pixels: [number, number, number][] = [];
  const data = imageData.data;
  const step = Math.max(1, Math.floor(data.length / (4 * 2000)));

  for (let i = 0; i < data.length; i += step * 4) {
    if (data[i + 3] > 128) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  if (pixels.length === 0) return [];

  const centroids: [number, number, number][] = [];
  centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);

  while (centroids.length < colorCount && centroids.length < pixels.length) {
    const distances = pixels.map(p => {
      let minDist = Infinity;
      for (const c of centroids) {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < minDist) minDist = d;
      }
      return minDist;
    });

    const sumDist = distances.reduce((a, b) => a + b, 0);
    if (sumDist === 0) break;
    let target = Math.random() * sumDist;
    let chosenIndex = 0;
    for (let i = 0; i < distances.length; i++) {
      target -= distances[i];
      if (target <= 0) {
        chosenIndex = i;
        break;
      }
    }
    centroids.push(pixels[chosenIndex]);
  }

  const maxIterations = 8;
  for (let iter = 0; iter < maxIterations; iter++) {
    const clusters: [number, number, number][][] = Array.from({ length: centroids.length }, () => []);
    for (const p of pixels) {
      let closest = 0;
      let minD = Infinity;
      for (let c = 0; c < centroids.length; c++) {
        const d = (p[0] - centroids[c][0]) ** 2 + (p[1] - centroids[c][1]) ** 2 + (p[2] - centroids[c][2]) ** 2;
        if (d < minD) {
          minD = d;
          closest = c;
        }
      }
      clusters[closest].push(p);
    }

    for (let c = 0; c < centroids.length; c++) {
      if (clusters[c].length > 0) {
        const rSum = clusters[c].reduce((sum, p) => sum + p[0], 0);
        const gSum = clusters[c].reduce((sum, p) => sum + p[1], 0);
        const bSum = clusters[c].reduce((sum, p) => sum + p[2], 0);
        centroids[c] = [
          rSum / clusters[c].length,
          gSum / clusters[c].length,
          bSum / clusters[c].length
        ];
      }
    }
  }

  return centroids.map((c, i) => createColor(`kmeans-${i}`, c[0], c[1], c[2]));
}

// 3. Median Cut Quantization
export function extractColorsMedianCut(imageData: ImageData, colorCount: number): Color[] {
  const data = imageData.data;
  const pixels: [number, number, number][] = [];
  const step = Math.max(1, Math.floor(data.length / (4 * 3000)));

  for (let i = 0; i < data.length; i += step * 4) {
    if (data[i + 3] > 128) {
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
  }

  if (pixels.length === 0) return [];

  interface Box {
    pixels: [number, number, number][];
  }

  const boxes: Box[] = [{ pixels }];

  while (boxes.length < colorCount) {
    let largestBoxIndex = -1;
    let maxPixelCount = -1;

    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].pixels.length > maxPixelCount && boxes[i].pixels.length > 1) {
        maxPixelCount = boxes[i].pixels.length;
        largestBoxIndex = i;
      }
    }

    if (largestBoxIndex === -1) break;

    const boxToSplit = boxes.splice(largestBoxIndex, 1)[0];
    const pxs = boxToSplit.pixels;

    let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    for (const p of pxs) {
      if (p[0] < minR) minR = p[0];
      if (p[0] > maxR) maxR = p[0];
      if (p[1] < minG) minG = p[1];
      if (p[1] > maxG) maxG = p[1];
      if (p[2] < minB) minB = p[2];
      if (p[2] > maxB) maxB = p[2];
    }

    const rRange = maxR - minR;
    const gRange = maxG - minG;
    const bRange = maxB - minB;

    let channel = 0;
    if (gRange >= rRange && gRange >= bRange) channel = 1;
    else if (bRange >= rRange && bRange >= gRange) channel = 2;

    pxs.sort((a, b) => a[channel] - b[channel]);

    const median = Math.floor(pxs.length / 2);
    boxes.push({ pixels: pxs.slice(0, median) });
    boxes.push({ pixels: pxs.slice(median) });
  }

  return boxes.map((box, i) => {
    const rSum = box.pixels.reduce((sum, p) => sum + p[0], 0);
    const gSum = box.pixels.reduce((sum, p) => sum + p[1], 0);
    const bSum = box.pixels.reduce((sum, p) => sum + p[2], 0);
    const count = Math.max(1, box.pixels.length);
    return createColor(`median-${i}`, rSum / count, gSum / count, bSum / count);
  });
}

// 4. Vibrant / Dominant Sampling
export function extractColorsPixelSampling(imageData: ImageData, colorCount: number): Color[] {
  const data = imageData.data;
  const colorBucketMap = new Map<string, { r: number; g: number; b: number; count: number }>();
  const step = Math.max(1, Math.floor(data.length / (4 * 2500)));

  for (let i = 0; i < data.length; i += step * 4) {
    if (data[i + 3] > 128) {
      const qR = Math.floor(data[i] / 16) * 16;
      const qG = Math.floor(data[i + 1] / 16) * 16;
      const qB = Math.floor(data[i + 2] / 16) * 16;
      const key = `${qR},${qG},${qB}`;

      const existing = colorBucketMap.get(key);
      if (existing) {
        existing.r += data[i];
        existing.g += data[i + 1];
        existing.b += data[i + 2];
        existing.count++;
      } else {
        colorBucketMap.set(key, { r: data[i], g: data[i + 1], b: data[i + 2], count: 1 });
      }
    }
  }

  const sortedBuckets = Array.from(colorBucketMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, colorCount);

  return sortedBuckets.map((b, i) => createColor(`sample-${i}`, b.r / b.count, b.g / b.count, b.b / b.count));
}