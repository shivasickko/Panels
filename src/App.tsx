import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import { DEMO_IMAGES, DemoImage } from '@/lib/demoImages';
import {
  sortColors,
  generateShadesAndTints,
  getContrastRatio,
  createColor,
  Color
} from '@/lib/colorExtractor';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui';
import {
  Upload,
  Sparkles,
  RefreshCw,
  Eye,
  Code,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  Copy,
  Download,
  Check,
  Palette,
  LayoutGrid,
  List,
  CheckCheck,
  FileSpreadsheet,
  Pipette,
  ArrowUpDown,
  Laptop,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight
} from 'lucide-react';

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Modals & Active States
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pure-png' | 'pure-jpeg' | 'poster-png' | 'txt' | 'css' | 'tailwind' | 'json'>('pure-png');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<'vertical-bars' | 'upright-list'>('vertical-bars');
  const [cssPrefix, setCssPrefix] = useState('color');
  const [sortMethod, setSortMethod] = useState<'default' | 'lum-desc' | 'lum-asc' | 'hue' | 'sat'>('default');
  const [activeTab, setActiveTab] = useState<'preview' | 'mockup' | 'accessibility'>('preview');

  // Shades & Tints Dialog
  const [selectedSwatch, setSelectedSwatch] = useState<Color | null>(null);
  const [isShadesOpen, setIsShadesOpen] = useState(false);

  // Eyedropper mode
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);
  const [pickedColorInfo, setPickedColorInfo] = useState<string | null>(null);

  const {
    palette: { colors: rawColors },
    controls: { algorithm, colorCount },
  } = useStore();

  // Apply sorting
  const colors = sortColors(rawColors, sortMethod);

  // Extract colors whenever imageSrc, algorithm, or colorCount changes
  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!canvasRef.current) return;
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          try {
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            useStore.getState().extractColors(imageData);
          } catch (e) {
            console.error(e);
          }
        }
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  // Load a demo sample image
  const handleSelectDemoImage = (demo: DemoImage) => {
    setImageSrc(demo.dataUrl);
    useStore.getState().setImage(demo.dataUrl, 800, 600);
  };

  // Render Export Preview Card onto canvas in Modal
  useEffect(() => {
    if (!isExportDialogOpen || (exportFormat !== 'pure-png' && exportFormat !== 'pure-jpeg' && exportFormat !== 'poster-png') || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (exportFormat === 'pure-png' || exportFormat === 'pure-jpeg') {
      canvas.width = 1200;
      canvas.height = 700;
      const count = Math.max(1, colors.length);
      const colWidth = 1200 / count;

      colors.forEach((col, idx) => {
        const x = idx * colWidth;
        ctx.fillStyle = col.hex;
        ctx.fillRect(x, 0, colWidth, 700);

        ctx.save();
        ctx.translate(x + colWidth / 2, 630);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = col.isLight ? '#064e3b' : '#ffffff';
        ctx.font = 'bold 26px monospace';
        ctx.fillText(col.hex.toUpperCase(), 0, 8);
        ctx.restore();
      });
    } else if (exportFormat === 'poster-png') {
      canvas.width = 1000;
      canvas.height = 680;

      const bgGrad = ctx.createLinearGradient(0, 0, 1000, 680);
      bgGrad.addColorStop(0, '#faf8f5');
      bgGrad.addColorStop(1, '#f3f1e8');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1000, 680);

      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('PANELS STUDIO', 50, 55);

      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('Extracted Hero Color Palette', 50, 95);

      ctx.fillStyle = '#047857';
      ctx.font = '15px sans-serif';
      ctx.fillText(`${colors.length} Colors extracted using ${algorithm.toUpperCase()} algorithm`, 50, 125);

      if (canvasRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(50, 160, 320, 240, 16);
        ctx.clip();
        ctx.drawImage(canvasRef.current, 50, 160, 320, 240);
        ctx.restore();
        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 4;
        ctx.strokeRect(50, 160, 320, 240);
      }

      const swatchX = 400;
      const totalWidth = 550;
      const count = Math.max(1, colors.length);
      const colWidth = totalWidth / count;

      colors.forEach((col, idx) => {
        const x = swatchX + idx * colWidth;
        ctx.fillStyle = col.hex;
        ctx.fillRect(x, 160, colWidth, 420);

        ctx.save();
        ctx.translate(x + colWidth / 2, 540);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = col.isLight ? '#064e3b' : '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(col.hex.toUpperCase(), 0, 5);
        ctx.restore();
      });

      ctx.strokeStyle = '#dcfce7';
      ctx.lineWidth = 2;
      ctx.strokeRect(swatchX, 160, totalWidth, 420);

      ctx.fillStyle = '#047857';
      ctx.font = '13px sans-serif';
      ctx.fillText('Generated with Panels Studio', 50, 640);
    }
  }, [isExportDialogOpen, exportFormat, colors, algorithm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      useStore.getState().setImageError('Please select a valid image file');
      return;
    }
    useStore.getState().setImageLoading(true);
    const src = URL.createObjectURL(file);
    setImageSrc(src);
    useStore.getState().setImage(src, null, null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      useStore.getState().setImageError('Please drop an image file');
      return;
    }
    useStore.getState().setImageLoading(true);
    const src = URL.createObjectURL(file);
    setImageSrc(src);
    useStore.getState().setImage(src, null, null);
  };

  const handleReset = () => {
    setImageSrc(null);
    useStore.getState().setImage(null, null, null);
    useStore.getState().setPalette([]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(id);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleActivateCustomPalette = () => {
    useStore.getState().setAlgorithm('custom');
    setIsEyedropperActive(true);
    setPickedColorInfo('Custom Eyedropper Active! Click on your image to select colors.');
    setTimeout(() => setPickedColorInfo(null), 4000);
  };

  // Native Browser Eyedropper API support
  const handleNativeEyedropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const hex = result.sRGBHex;
          copyToClipboard(hex, 'eyedropper');

          const cleanHex = hex.replace('#', '');
          const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
          const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
          const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
          const newColor = createColor(`custom-${Date.now()}`, r, g, b);

          if (algorithm === 'custom' || isEyedropperActive) {
            useStore.getState().addCustomColor(newColor);
            setPickedColorInfo(`Picked & Added: ${hex.toUpperCase()}`);
          } else {
            setPickedColorInfo(`Picked & Copied: ${hex.toUpperCase()}`);
          }
          setTimeout(() => setPickedColorInfo(null), 3000);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsEyedropperActive(!isEyedropperActive);
    }
  };

  // Canvas Click Eyedropper
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const newColor = createColor(`custom-${Date.now()}-${Math.random()}`, r, g, b);

    copyToClipboard(hex, 'canvas-pick');

    if (algorithm === 'custom' || isEyedropperActive) {
      useStore.getState().addCustomColor(newColor);
      setPickedColorInfo(`Added Color to Preview: ${hex.toUpperCase()}`);
    } else {
      setPickedColorInfo(`Picked Pixel Color: ${hex.toUpperCase()}`);
    }
    setTimeout(() => setPickedColorInfo(null), 3000);
  };

  const openShadesModal = (color: Color, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSwatch(color);
    setIsShadesOpen(true);
  };

  const getTxtExportCode = () => {
    return colors.map((c) => c.hex.toUpperCase()).join('\n');
  };

  const getCssExportCode = () => {
    const prefix = cssPrefix || 'color';
    return `:root {\n` + colors.map((c, i) => `  --${prefix}-${i + 1}: ${c.hex}; /* ${c.rgbString} */`).join('\n') + `\n}`;
  };

  const getTailwindExportCode = () => {
    const obj: Record<string, string> = {};
    colors.forEach((c, i) => {
      obj[`palette-${i + 1}`] = c.hex;
    });
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(obj, null, 8)}\n    }\n  }\n}`;
  };

  const getJsonExportCode = () => {
    return JSON.stringify(
      {
        extractedAt: new Date().toISOString(),
        algorithm,
        count: colors.length,
        colors: colors.map((c) => ({
          hex: c.hex,
          rgb: c.rgbString,
          hsl: c.hslString,
          oklch: c.oklchString,
          isLight: c.isLight
        }))
      },
      null,
      2
    );
  };

  const handleQuickDownloadPalette = () => {
    if (colors.length === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const count = colors.length;
    const colWidth = 1200 / count;

    colors.forEach((col, idx) => {
      const x = idx * colWidth;
      ctx.fillStyle = col.hex;
      ctx.fillRect(x, 0, colWidth, 700);

      ctx.save();
      ctx.translate(x + colWidth / 2, 630);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = col.isLight ? '#064e3b' : '#ffffff';
      ctx.font = 'bold 26px monospace';
      ctx.fillText(col.hex.toUpperCase(), 0, 8);
      ctx.restore();
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `color-palette-${colors.length}-colors.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    if (colors.length === 0) return;

    if (exportFormat === 'pure-png' || exportFormat === 'pure-jpeg' || exportFormat === 'poster-png') {
      if (previewCanvasRef.current) {
        const mime = exportFormat === 'pure-jpeg' ? 'image/jpeg' : 'image/png';
        const ext = exportFormat === 'pure-jpeg' ? 'jpg' : 'png';
        const dataUrl = previewCanvasRef.current.toDataURL(mime, 0.95);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `color-palette.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (exportFormat === 'txt') {
      downloadFile(getTxtExportCode(), 'palette.txt', 'text/plain');
    } else if (exportFormat === 'css') {
      downloadFile(getCssExportCode(), 'palette.css', 'text/css');
    } else if (exportFormat === 'tailwind') {
      downloadFile(getTailwindExportCode(), 'tailwind.palette.js', 'text/javascript');
    } else if (exportFormat === 'json') {
      downloadFile(getJsonExportCode(), 'palette.json', 'application/json');
    }
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyExportCode = () => {
    let code = '';
    if (exportFormat === 'txt') code = getTxtExportCode();
    else if (exportFormat === 'css') code = getCssExportCode();
    else if (exportFormat === 'tailwind') code = getTailwindExportCode();
    else if (exportFormat === 'json') code = getJsonExportCode();

    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Primary colors for theme mockup
  const primaryColor = colors[0]?.hex || '#047857';
  const secondaryColor = colors[1]?.hex || '#064e3b';
  const accentColor = colors[2]?.hex || '#10b981';
  const bgColor = colors[colors.length - 1]?.hex || '#faf8f5';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-emerald-950 font-sans antialiased pb-16 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Soft Glow Ambient Accents */}
      <div className="fixed top-0 left-1/3 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-green-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Glassmorphic Header Bar */}
      <header className="border-b border-emerald-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg text-emerald-950 tracking-tight flex items-center gap-1.5 sm:gap-2">
                Panels <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">Studio Pro</span>
              </span>
            </div>
          </div>

          {colors.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button
                onClick={handleQuickDownloadPalette}
                variant="outline"
                size="sm"
                className="font-bold border-emerald-300 text-emerald-900 text-xs px-2.5 sm:px-3 shadow-sm hover:bg-emerald-50"
              >
                <Download className="h-3.5 w-3.5 sm:mr-1 text-emerald-700" />
                <span className="hidden sm:inline">Quick Palette PNG</span>
              </Button>
              <Button
                onClick={() => setIsExportDialogOpen(true)}
                variant="default"
                size="sm"
                className="font-bold shadow-emerald-900/10 text-xs px-2.5 sm:px-3"
              >
                <Sparkles className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Export Studio</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Hero Title & Presets Bar */}
        <div className="text-center max-w-3xl mx-auto space-y-3 px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-[11px] sm:text-xs font-bold text-emerald-800">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Professional Color Palette Extractor & Design System Studio
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-emerald-950 leading-tight">
            Extract Hero Color Palettes <br />
            <span className="text-emerald-700">
              Instantly & Seamlessly
            </span>
          </h1>
          <p className="text-emerald-800/80 text-xs sm:text-sm md:text-base font-medium">
            Upload your own image or tap a sample preset below to generate a live, side-by-side color palette preview.
          </p>

          {/* Quick Demo Image Presets */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-emerald-800/90 mr-1">Try Samples:</span>
            {DEMO_IMAGES.map((demo) => (
              <button
                key={demo.id}
                onClick={() => handleSelectDemoImage(demo)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-900 hover:border-emerald-500 hover:bg-emerald-50 shadow-sm transition-all active:scale-95"
              >
                <div className="h-3 w-3 rounded-full border border-black/10 overflow-hidden shrink-0">
                  <img src={demo.dataUrl} alt={demo.name} className="w-full h-full object-cover" />
                </div>
                {demo.name}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN RESPONSIVE SIDE-BY-SIDE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* LEFT COLUMN: PRETTY UPLOAD & EYEDROPPER ZONE */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-emerald-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-emerald-900/5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <Upload className="h-4 w-4 text-emerald-600" /> Upload Image Zone
                </span>
                <div className="flex items-center gap-2">
                  {imageSrc && (
                    <button
                      onClick={handleNativeEyedropper}
                      title="Pick color from image"
                      className={`text-xs font-semibold px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                        isEyedropperActive ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Pipette className="h-3.5 w-3.5" /> Eyedropper
                    </button>
                  )}
                  {imageSrc && (
                    <button onClick={handleReset} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                      <RefreshCw className="h-3.5 w-3.5" /> Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Toast info for Eyedropper */}
              {pickedColorInfo && (
                <div className="p-2.5 rounded-xl bg-emerald-950 text-white text-xs font-bold font-mono flex items-center justify-between animate-in zoom-in-95">
                  <span className="flex items-center gap-1.5"><Pipette className="h-3.5 w-3.5 text-emerald-400" /> {pickedColorInfo}</span>
                  <Check className="h-4 w-4 text-emerald-400" />
                </div>
              )}

              {/* RESPONSIVE DROP ZONE */}
              <div
                className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-300 relative min-h-[260px] sm:min-h-[340px] flex flex-col items-center justify-center ${
                  imageSrc
                    ? 'border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50/40'
                    : 'border-emerald-300/80 bg-[#fcfbf7] hover:border-emerald-600 hover:bg-emerald-50/50 shadow-sm'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !isEyedropperActive && document.getElementById('file-input')?.click()}
              >
                {!imageSrc ? (
                  <div className="space-y-3 sm:space-y-4 max-w-xs mx-auto">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-emerald-100 to-green-100 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">Upload Your Image</h3>
                      <p className="text-[11px] sm:text-xs text-emerald-700/80 mt-0.5 font-medium">
                        Drag & drop any photo or graphic here, or click to browse
                      </p>
                    </div>
                    <Button variant="default" size="sm" className="font-bold shadow-emerald-700/20 pointer-events-none text-xs">
                      Select Image File
                    </Button>
                    <p className="text-[10px] sm:text-[11px] text-emerald-600/70 font-mono">PNG, JPG, WEBP, SVG up to 10MB</p>
                  </div>
                ) : (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <div className="relative flex justify-center items-center rounded-xl overflow-hidden w-full max-h-[280px] sm:max-h-[340px] border border-emerald-200/80 shadow-md bg-white p-2">
                      <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className={`max-h-[260px] sm:max-h-[320px] max-w-full object-contain rounded-lg ${
                          isEyedropperActive ? 'cursor-crosshair ring-2 ring-emerald-500' : 'cursor-pointer'
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => document.getElementById('file-input')?.click()} className="font-bold text-emerald-800 border-emerald-300 text-xs">
                        Change Image
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: TABBED PREVIEW & MOCKUP STUDIO */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-emerald-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-emerald-900/5 space-y-4">
              {/* Studio Tabs Navigation */}
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3 gap-2 overflow-x-auto">
                <div className="flex items-center bg-[#faf8f5] p-1 rounded-xl border border-emerald-200">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'preview' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-800 hover:text-emerald-950'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" /> Hero Palette
                  </button>
                  <button
                    onClick={() => setActiveTab('mockup')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'mockup' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-800 hover:text-emerald-950'
                    }`}
                  >
                    <Laptop className="h-3.5 w-3.5" /> UI Mockup
                  </button>
                  <button
                    onClick={() => setActiveTab('accessibility')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'accessibility' ? 'bg-emerald-800 text-white shadow-sm' : 'text-emerald-800 hover:text-emerald-950'
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Accessibility
                  </button>
                </div>

                {/* View Style Toggle */}
                {activeTab === 'preview' && (
                  <div className="flex items-center bg-[#faf8f5] p-1 rounded-xl border border-emerald-200 shrink-0 shadow-inner">
                    <button
                      onClick={() => setPreviewStyle('vertical-bars')}
                      title="Side-by-side Vertical Bars (4628.png style)"
                      className={`p-1.5 rounded-lg transition-all duration-300 ease-out flex items-center justify-center ${
                        previewStyle === 'vertical-bars'
                          ? 'bg-emerald-800 text-white shadow-md scale-105'
                          : 'text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100/60'
                      }`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewStyle('upright-list')}
                      title="Upright Rows List"
                      className={`p-1.5 rounded-lg transition-all duration-300 ease-out flex items-center justify-center ${
                        previewStyle === 'upright-list'
                          ? 'bg-emerald-800 text-white shadow-md scale-105'
                          : 'text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100/60'
                      }`}
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Controls Toolbar for Preview Tab */}
              {activeTab === 'preview' && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-[#faf8f5] p-2.5 rounded-2xl border border-emerald-200/80">
                  {/* Algorithm Selector */}
                  <div className="sm:col-span-4">
                    <Select value={algorithm} onValueChange={(val) => useStore.getState().setAlgorithm(val as any)}>
                      <SelectContent>
                        <SelectItem value="grid">Grid Sampling</SelectItem>
                        <SelectItem value="kmeans">K-Means++</SelectItem>
                        <SelectItem value="median">Median Cut</SelectItem>
                        <SelectItem value="sample">Vibrant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Selector */}
                  <div className="sm:col-span-4">
                    <Select value={sortMethod} onValueChange={(val) => {
                      if (val === 'custom') {
                        handleActivateCustomPalette();
                      } else {
                        setSortMethod(val as any);
                      }
                    }}>
                      <SelectContent>
                        <SelectItem value="default">Default Extraction</SelectItem>
                        <SelectItem value="lum-desc">Lightest to Darkest</SelectItem>
                        <SelectItem value="lum-asc">Darkest to Lightest</SelectItem>
                        <SelectItem value="hue">Hue Spectrum</SelectItem>
                        <SelectItem value="sat">Saturation</SelectItem>
                        <SelectItem value="custom">Custom Eyedropper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Swatches Count Slider */}
                  <div className="sm:col-span-4 flex items-center justify-between gap-3 bg-white px-4 rounded-full border border-emerald-200/90 text-xs w-full h-10 shadow-sm hover:border-emerald-400 transition-all">
                    <span className="text-emerald-950 font-extrabold whitespace-nowrap shrink-0">{colorCount} Swatches</span>
                    <div className="flex-1 min-w-[60px]">
                      <Slider
                        min={2}
                        max={16}
                        step={1}
                        value={colorCount}
                        onValueChange={(val) => useStore.getState().setColorCount(val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: LIVE COLOR PALETTE PREVIEW AREA */}
              {activeTab === 'preview' && (
                <>
                  {colors.length === 0 ? (
                    <div className="h-[300px] sm:h-[380px] flex flex-col items-center justify-center text-center p-6 bg-[#faf8f5] rounded-2xl border border-dashed border-emerald-200 space-y-3 animate-in fade-in-50 zoom-in-95 duration-400">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <Pipette className="h-7 w-7 animate-pulse text-emerald-600" />
                      </div>
                      <h4 className="text-base font-bold text-emerald-950">
                        {algorithm === 'custom' ? 'Custom Palette (Empty)' : 'No Image Uploaded Yet'}
                      </h4>
                      <p className="text-xs text-emerald-700/80 max-w-xs font-medium">
                        {algorithm === 'custom'
                          ? 'Custom Eyedropper mode active! Click anywhere on your image to select colors and build your custom palette.'
                          : 'Upload your image on the left or tap any sample preset above to see the extracted hero palette.'}
                      </p>
                    </div>
                  ) : (
                    /* PERSISTENT CONTAINER WITH SILKY 500MS CROSS-FADE TRANSITIONS */
                    <div className="relative h-[300px] sm:h-[380px] w-full rounded-xl sm:rounded-2xl overflow-hidden border border-emerald-200/80 shadow-inner bg-[#faf8f5]">
                      {/* VIEW 1: SIDE-BY-SIDE VERTICAL BARS (4628.PNG STYLE) */}
                      <div
                        className={`absolute inset-0 w-full h-full flex bg-slate-900 select-none transition-all duration-500 ease-in-out ${
                          previewStyle === 'vertical-bars'
                            ? 'opacity-100 scale-100 pointer-events-auto z-10'
                            : 'opacity-0 scale-95 pointer-events-none z-0'
                        }`}
                      >
                        {colors.map((color, idx) => {
                          const textColor = color.isLight ? '#064e3b' : '#ffffff';
                          const isCopied = copiedColor === color.id;
                          return (
                            <div
                              key={color.id}
                              onClick={() => copyToClipboard(color.hex, color.id)}
                              className="flex-1 h-full cursor-pointer hover:flex-[2.2] transition-all duration-300 ease-out relative group flex flex-col justify-between p-1 sm:p-2.5 min-w-0 hover:z-20 overflow-hidden"
                              style={{ backgroundColor: color.hex }}
                            >
                              {/* Top Copy Indicator & Shades Button */}
                              <div className="relative flex items-center justify-center w-full pt-0.5">
                                <div
                                  className="p-1 sm:p-1.5 rounded-md sm:rounded-lg backdrop-blur-md transition-all shadow-sm flex items-center justify-center shrink-0 z-10"
                                  style={{
                                    backgroundColor: color.isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.2)',
                                    color: textColor
                                  }}
                                  title={`Click to copy ${color.hex}`}
                                >
                                  {isCopied ? (
                                    <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-300 animate-in zoom-in-50" />
                                  ) : (
                                    <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-90 group-hover:opacity-100" />
                                  )}
                                </div>

                                <button
                                  onClick={(e) => openShadesModal(color, e)}
                                  title="View 50-900 Shades"
                                  className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 px-1 py-0.5 rounded bg-black/40 text-white hover:bg-black/60 transition-opacity text-[9px] font-bold z-20 shadow-md backdrop-blur-sm hidden sm:block truncate max-w-[45px]"
                                >
                                  Shades
                                </button>
                              </div>

                              {/* Middle Vertical / Upright HEX Label */}
                              <div className="my-auto flex flex-col items-center justify-center space-y-1 sm:space-y-2 py-2">
                                <div
                                  className="font-mono text-[10px] sm:text-xs md:text-sm font-black tracking-wider uppercase drop-shadow-sm select-none transition-all duration-300"
                                  style={{
                                    color: textColor,
                                    writingMode: 'vertical-rl',
                                    transform: 'rotate(180deg)',
                                    textShadow: color.isLight ? '0 1px 2px rgba(255,255,255,0.3)' : '0 1px 3px rgba(0,0,0,0.4)'
                                  }}
                                >
                                  {color.hex}
                                </div>
                              </div>

                              {/* Bottom Copy Hint */}
                              <div className="text-center pb-0.5">
                                <span
                                  className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity block truncate"
                                  style={{ color: textColor }}
                                >
                                  {isCopied ? 'Copied!' : 'Copy #'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* VIEW 2: UPRIGHT ROW LIST VIEW */}
                      <div
                        className={`absolute inset-0 w-full h-full p-2.5 overflow-y-auto space-y-2 transition-all duration-500 ease-in-out ${
                          previewStyle === 'upright-list'
                            ? 'opacity-100 scale-100 pointer-events-auto z-10'
                            : 'opacity-0 scale-95 pointer-events-none z-0'
                        }`}
                      >
                        {colors.map((color) => (
                          <div
                            key={color.id}
                            onClick={() => copyToClipboard(color.hex, color.id)}
                            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-300 ease-out cursor-pointer select-none"
                          >
                            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                              <div
                                className="h-10 w-12 sm:h-12 sm:w-14 rounded-lg sm:rounded-xl shadow-inner border border-black/10 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-300"
                                style={{ backgroundColor: color.hex }}
                              />
                              <div className="min-w-0">
                                <div className="font-mono text-sm sm:text-base font-black text-emerald-950 tracking-tight truncate">
                                  {color.hex}
                                </div>
                                <div className="text-[11px] sm:text-xs font-mono text-emerald-700/80 truncate">
                                  {color.rgbString} · {color.hslString}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={(e) => openShadesModal(color, e)}
                                className="text-[10px] font-bold"
                              >
                                Shades
                              </Button>
                              <Button
                                variant={copiedColor === color.id ? "default" : "outline"}
                                size="xs"
                                className="font-bold gap-1 text-xs"
                              >
                                {copiedColor === color.id ? 'Copied' : 'Copy #'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Quick Actions Bar */}
                  {colors.length > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-emerald-100">
                      <p className="text-[11px] sm:text-xs text-emerald-700 font-medium">
                        Extracted <span className="font-bold text-emerald-950">{colors.length}</span> hero color bars
                      </p>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          onClick={handleQuickDownloadPalette}
                          variant="outline"
                          size="sm"
                          className="font-bold border-emerald-300 text-emerald-900 gap-1.5 text-xs flex-1 sm:flex-initial justify-center"
                        >
                          <Download className="h-3.5 w-3.5 text-emerald-700" /> Palette PNG
                        </Button>
                        <Button
                          onClick={() => setIsExportDialogOpen(true)}
                          variant="default"
                          size="sm"
                          className="font-bold shadow-emerald-800/10 gap-1.5 text-xs flex-1 sm:flex-initial justify-center"
                        >
                          <Sparkles className="h-3.5 w-3.5" /> Export Studio
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: INTERACTIVE LIVE WEB DESIGN MOCKUP */}
              {activeTab === 'mockup' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-emerald-200/80 shadow-md space-y-4" style={{ backgroundColor: bgColor }}>
                    {/* App Bar */}
                    <div className="flex items-center justify-between p-3 rounded-xl shadow-sm" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>
                      <div className="font-black text-sm tracking-tight flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> App Design Preview
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20">Active Theme</span>
                      </div>
                    </div>

                    {/* Hero Card */}
                    <div className="p-6 rounded-xl border border-black/5 shadow-sm space-y-3 bg-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: accentColor + '30', color: primaryColor }}>
                        Extracted Palette Theme
                      </span>
                      <h4 className="text-xl font-black" style={{ color: secondaryColor }}>
                        Building Premium Interfaces
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        This live UI component automatically updates with your extracted image colors.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm" style={{ backgroundColor: primaryColor }}>
                          Get Started
                        </button>
                        <button className="px-4 py-2 rounded-lg text-xs font-bold border" style={{ borderColor: primaryColor, color: primaryColor }}>
                          Learn More
                        </button>
                      </div>
                    </div>

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border bg-white space-y-1">
                        <div className="h-2 w-12 rounded" style={{ backgroundColor: primaryColor }} />
                        <div className="text-xs font-bold" style={{ color: secondaryColor }}>Primary Accent</div>
                        <div className="text-[10px] font-mono opacity-70">{primaryColor}</div>
                      </div>
                      <div className="p-3 rounded-xl border bg-white space-y-1">
                        <div className="h-2 w-12 rounded" style={{ backgroundColor: accentColor }} />
                        <div className="text-xs font-bold" style={{ color: secondaryColor }}>Secondary Accent</div>
                        <div className="text-[10px] font-mono opacity-70">{accentColor}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: WCAG ACCESSIBILITY MATRIX */}
              {activeTab === 'accessibility' && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-emerald-600" /> WCAG 2.1 Contrast Ratio Matrix (Text vs Background)
                  </div>
                  <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                    {colors.slice(0, 6).map((c1, idx) => (
                      <div key={c1.id} className="p-3 rounded-xl bg-[#faf8f5] border border-emerald-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg shadow-inner border" style={{ backgroundColor: c1.hex }} />
                          <div>
                            <div className="text-xs font-mono font-bold text-emerald-950">{c1.hex}</div>
                            <div className="text-[10px] text-emerald-700">Luminance: {Math.round(c1.luminance * 100)}%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-xs font-mono font-bold text-emerald-950">
                              {getContrastRatio(c1, { luminance: 0.95 } as any)}:1 (on Light)
                            </div>
                            <div className="text-[10px] font-semibold text-emerald-700">
                              {getContrastRatio(c1, { luminance: 0.95 } as any) >= 4.5 ? (
                                <span className="text-emerald-700 flex items-center justify-end gap-1"><CheckCircle className="h-3 w-3" /> Passes WCAG AA</span>
                              ) : (
                                <span className="text-amber-700 flex items-center justify-end gap-1"><XCircle className="h-3 w-3" /> Low Contrast</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Swatches Collection Grid */}
        {colors.length > 0 && (
          <div className="bg-white border border-emerald-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-emerald-900/5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-emerald-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-emerald-950 tracking-tight flex items-center gap-2">
                Color Swatches Collection <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">({colors.length} Swatches)</span>
              </h2>
              <span className="text-xs text-emerald-700 font-medium">Click any swatch to copy value or generate shades</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
              {colors.map((color) => (
                <div
                  key={color.id}
                  onClick={() => copyToClipboard(color.hex, color.id)}
                  className="bg-[#faf8f5] border border-emerald-200/70 hover:border-emerald-400 rounded-xl sm:rounded-2xl p-2.5 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md group relative"
                >
                  <div
                    className="w-full h-12 sm:h-14 rounded-lg sm:rounded-xl mb-2 shadow-inner border border-black/10 flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                  >
                    {copiedColor === color.id && (
                      <span className="bg-emerald-950 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg animate-in zoom-in-50">
                        <Check className="h-3 w-3 text-emerald-400" /> Copied
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs font-extrabold text-emerald-950 truncate">
                    {color.hex}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-emerald-700/80 font-mono mt-0.5 truncate">
                    {color.rgbString}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* SHADES & TINTS MODAL */}
      <Dialog open={isShadesOpen} onOpenChange={setIsShadesOpen}>
        <DialogContent className="max-w-xl w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-emerald-950">
              <Layers className="h-5 w-5 text-emerald-600" /> 50-900 Color Shades & Tints
            </DialogTitle>
            <DialogDescription>
              Tailwind-style color shades generated for <span className="font-mono font-bold text-emerald-950">{selectedSwatch?.hex}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedSwatch && (
            <div className="space-y-2 my-2">
              {generateShadesAndTints(selectedSwatch).map((shade) => (
                <div
                  key={shade.level}
                  onClick={() => copyToClipboard(shade.hex, `shade-${shade.level}`)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="h-9 w-12 rounded-lg shadow-inner border border-black/10"
                      style={{ backgroundColor: shade.hex }}
                    />
                    <span className="font-mono text-xs font-bold text-emerald-950">
                      {shade.level}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold text-emerald-950">{shade.hex}</span>
                    <Button variant="ghost" size="xs" className="text-xs font-bold opacity-80 group-hover:opacity-100">
                      {copiedColor === `shade-${shade.level}` ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShadesOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESPONSIVE EXPORT STUDIO DIALOG */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-full p-4 sm:p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl text-emerald-950">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" /> Hero Palette Export Studio
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-emerald-700/80">
              Choose to download pure color palette bars or export code and graphic cards.
            </DialogDescription>
          </DialogHeader>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 my-2 sm:my-4">
            <div className="md:col-span-4 space-y-1.5 sm:space-y-2">
              <label className="text-[11px] sm:text-xs font-extrabold text-emerald-800 uppercase tracking-wider block mb-1">
                Select Export Format
              </label>

              {[
                { id: 'pure-png', label: 'Pure Palette PNG', icon: Palette, desc: 'Clean color bars image (4628.png)' },
                { id: 'pure-jpeg', label: 'Pure Palette JPEG', icon: Palette, desc: 'Clean compressed image' },
                { id: 'poster-png', label: 'Full Graphic Poster', icon: ImageIcon, desc: 'Poster with thumbnail' },
                { id: 'txt', label: 'HEX List (.txt)', icon: FileSpreadsheet, desc: 'Plain text list of HEX codes' },
                { id: 'css', label: 'CSS Variables', icon: Code, desc: 'Native CSS :root variables' },
                { id: 'tailwind', label: 'Tailwind Config', icon: Layers, desc: 'Tailwind color extension' },
                { id: 'json', label: 'JSON Dataset', icon: FileText, desc: 'Structured color data' },
              ].map((item) => {
                const IconComp = item.icon;
                const active = exportFormat === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setExportFormat(item.id as any)}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-all flex items-start gap-2.5 sm:gap-3 ${
                      active
                        ? 'border-emerald-500 bg-emerald-100/70 text-emerald-950 shadow-sm'
                        : 'border-emerald-200/80 bg-white text-emerald-900 hover:border-emerald-300 hover:bg-[#faf8f5]'
                    }`}
                  >
                    <IconComp className={`h-4 w-4 mt-0.5 shrink-0 ${active ? 'text-emerald-700' : 'text-emerald-500'}`} />
                    <div>
                      <div className="text-xs font-extrabold">{item.label}</div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-700/80">{item.desc}</div>
                    </div>
                  </button>
                );
              })}

              {exportFormat === 'css' && (
                <div className="p-3 bg-white rounded-xl sm:rounded-2xl border border-emerald-200 space-y-1.5 mt-2">
                  <label className="text-xs font-bold text-emerald-900">CSS Variable Prefix</label>
                  <Input
                    value={cssPrefix}
                    onChange={(e) => setCssPrefix(e.target.value)}
                    placeholder="e.g. brand, color, theme"
                  />
                </div>
              )}
            </div>

            {/* Preview Panel */}
            <div className="md:col-span-8 bg-[#faf8f5] border border-emerald-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden relative min-h-[300px] sm:min-h-[380px]">
              <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2.5 mb-2.5">
                <span className="text-[11px] sm:text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" /> Export Preview
                </span>
                {(exportFormat === 'txt' || exportFormat === 'css' || exportFormat === 'tailwind' || exportFormat === 'json') && (
                  <Button variant="ghost" size="xs" onClick={copyExportCode} className="text-xs text-emerald-800 hover:text-emerald-950 font-bold">
                    {copiedCode ? <CheckCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </Button>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center overflow-auto max-h-[280px] sm:max-h-[360px]">
                {(exportFormat === 'pure-png' || exportFormat === 'pure-jpeg' || exportFormat === 'poster-png') && (
                  <div className="w-full flex justify-center">
                    <canvas
                      ref={previewCanvasRef}
                      className="max-w-full max-h-[260px] sm:max-h-[320px] object-contain rounded-lg sm:rounded-xl border border-emerald-200 shadow-md"
                    />
                  </div>
                )}

                {exportFormat === 'txt' && (
                  <pre className="w-full h-full p-3 sm:p-4 bg-emerald-950 rounded-lg sm:rounded-xl font-mono text-xs sm:text-sm text-emerald-200 overflow-auto border border-emerald-800">
                    {getTxtExportCode()}
                  </pre>
                )}

                {exportFormat === 'css' && (
                  <pre className="w-full h-full p-3 sm:p-4 bg-emerald-950 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs text-emerald-200 overflow-auto border border-emerald-800">
                    {getCssExportCode()}
                  </pre>
                )}

                {exportFormat === 'tailwind' && (
                  <pre className="w-full h-full p-3 sm:p-4 bg-emerald-950 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs text-green-300 overflow-auto border border-emerald-800">
                    {getTailwindExportCode()}
                  </pre>
                )}

                {exportFormat === 'json' && (
                  <pre className="w-full h-full p-3 sm:p-4 bg-emerald-950 rounded-lg sm:rounded-xl font-mono text-[11px] sm:text-xs text-amber-200 overflow-auto border border-emerald-800">
                    {getJsonExportCode()}
                  </pre>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 flex-col sm:flex-row">
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            <Button onClick={handleDownload} variant="default" className="w-full sm:w-auto gap-2 font-bold shadow-emerald-800/10">
              <Download className="h-4 w-4" /> Download {exportFormat.toUpperCase().replace('-', ' ')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;