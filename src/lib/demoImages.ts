// Generate SVG Data URIs for 4 curated demo images
export interface DemoImage {
  id: string;
  name: string;
  category: string;
  dataUrl: string;
}

function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

export const DEMO_IMAGES: DemoImage[] = [
  {
    id: 'sunset',
    name: 'Emerald Sunset',
    category: 'Nature',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="40%" stop-color="#047857"/>
            <stop offset="70%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#ef4444"/>
          </linearGradient>
          <linearGradient id="sun" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="100%" stop-color="#f97316"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#bg)"/>
        <circle cx="400" cy="320" r="140" fill="url(#sun)" opacity="0.9"/>
        <path d="M 0,450 Q 200,380 400,460 T 800,430 L 800,600 L 0,600 Z" fill="#022c22"/>
        <path d="M 0,500 Q 300,460 600,520 T 800,490 L 800,600 L 0,600 Z" fill="#064e3b" opacity="0.7"/>
      </svg>
    `)
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    category: 'Abstract',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="c1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a"/>
            <stop offset="50%" stop-color="#581c87"/>
            <stop offset="100%" stop-color="#be185d"/>
          </linearGradient>
          <linearGradient id="c2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4"/>
            <stop offset="100%" stop-color="#3b82f6"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#c1)"/>
        <circle cx="250" cy="200" r="180" fill="url(#c2)" opacity="0.6"/>
        <circle cx="600" cy="400" r="160" fill="#ec4899" opacity="0.5"/>
        <polygon points="100,550 400,200 700,550" fill="#1e1b4b" opacity="0.8"/>
        <rect x="350" y="280" width="100" height="270" fill="#38bdf8" opacity="0.4"/>
      </svg>
    `)
  },
  {
    id: 'nordic',
    name: 'Nordic Forest',
    category: 'Landscape',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e0f2fe"/>
            <stop offset="50%" stop-color="#bae6fd"/>
            <stop offset="100%" stop-color="#38bdf8"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#sky)"/>
        <polygon points="50,600 200,250 350,600" fill="#0f766e"/>
        <polygon points="200,600 400,180 600,600" fill="#115e59"/>
        <polygon points="450,600 650,280 800,600" fill="#134e4a"/>
        <circle cx="650" cy="150" r="50" fill="#fef08a" opacity="0.85"/>
      </svg>
    `)
  },
  {
    id: 'architecture',
    name: 'Minimal Clay',
    category: 'Architecture',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#fdfbf7"/>
        <rect x="120" y="100" width="300" height="400" fill="#e7e5e4" rx="20"/>
        <rect x="360" y="180" width="320" height="320" fill="#d6d3d1" rx="20"/>
        <circle cx="270" cy="250" r="70" fill="#a8a29e"/>
        <rect x="420" y="240" width="200" height="180" fill="#78716c" rx="12"/>
      </svg>
    `)
  }
];
