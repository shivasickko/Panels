import { create } from 'zustand';
import { Color } from '@/lib/colorExtractor';
import {
  extractColorsGrid,
  extractColorsKMeansPlus,
  extractColorsMedianCut,
  extractColorsPixelSampling
} from '@/lib/colorExtractor';

interface State {
  // Image state
  image: {
    src: string | null;
    width: number | null;
    height: number | null;
    loading: boolean;
    error: string | null;
  };

  // Cache for fast re-extraction on slider/algorithm change
  lastImageData: ImageData | null;

  // Palette state
  palette: {
    colors: Color[];
    extracting: boolean;
    error: string | null;
  };

  // Controls state
  controls: {
    algorithm: 'kmeans' | 'median' | 'sample' | 'grid' | 'custom';
    colorCount: number;
  };

  // Actions
  setImage: (src: string | null, width: number | null, height: number | null) => void;
  setImageLoading: (loading: boolean) => void;
  setImageError: (error: string | null) => void;

  extractColors: (imageData: ImageData) => void;
  setPalette: (colors: Color[]) => void;
  addCustomColor: (color: Color) => void;
  clearCustomPalette: () => void;
  setExtracting: (extracting: boolean) => void;
  setPaletteError: (error: string | null) => void;

  setAlgorithm: (algorithm: State['controls']['algorithm']) => void;
  setColorCount: (count: number) => void;
}

export const useStore = create<State>((set, get) => ({
  // Initial state
  image: {
    src: null,
    width: null,
    height: null,
    loading: false,
    error: null,
  },
  lastImageData: null,
  palette: {
    colors: [],
    extracting: false,
    error: null,
  },
  controls: {
    algorithm: 'grid',
    colorCount: 8,
  },

  // Image actions
  setImage: (src, width, height) =>
    set((state) => ({
      image: {
        ...state.image,
        src,
        width,
        height,
        loading: false,
        error: null,
      },
      // Clear cached imageData if image is removed
      lastImageData: src ? state.lastImageData : null,
    })),

  setImageLoading: (loading) =>
    set((state) => ({
      image: {
        ...state.image,
        loading,
      }
    })),

  setImageError: (error) =>
    set((state) => ({
      image: {
        ...state.image,
        error,
        loading: false,
      }
    })),

  // Palette actions
  extractColors: (imageData) => {
    // Save image data cache for instant re-extraction
    set((state) => ({
      lastImageData: imageData,
      palette: {
        ...state.palette,
        extracting: true,
        error: null,
      }
    }));

    const { algorithm, colorCount } = get().controls;

    // In custom eyedropper mode, don't overwrite user's handpicked colors
    if (algorithm === 'custom') {
      set((state) => ({
        palette: {
          ...state.palette,
          extracting: false,
          error: null,
        }
      }));
      return;
    }

    let colors: Color[] = [];
    let error: string | null = null;

    try {
      switch (algorithm) {
        case 'kmeans':
          colors = extractColorsKMeansPlus(imageData, colorCount);
          break;
        case 'median':
          colors = extractColorsMedianCut(imageData, colorCount);
          break;
        case 'sample':
          colors = extractColorsPixelSampling(imageData, colorCount);
          break;
        case 'grid':
        default:
          colors = extractColorsGrid(imageData, colorCount);
      }
    } catch (err) {
      console.error('Color extraction failed:', err);
      error = 'Failed to extract colors. Please try again.';
    }

    set((state) => ({
      palette: {
        ...state.palette,
        colors,
        extracting: false,
        error,
      }
    }));
  },

  setPalette: (colors) =>
    set((state) => ({
      palette: {
        ...state.palette,
        colors,
        extracting: false,
      }
    })),

  addCustomColor: (color) =>
    set((state) => ({
      palette: {
        ...state.palette,
        colors: [...state.palette.colors, color],
      }
    })),

  clearCustomPalette: () =>
    set((state) => ({
      palette: {
        ...state.palette,
        colors: [],
      }
    })),

  setExtracting: (extracting) =>
    set((state) => ({
      palette: {
        ...state.palette,
        extracting,
      }
    })),

  setPaletteError: (error) =>
    set((state) => ({
      palette: {
        ...state.palette,
        error,
        extracting: false,
      }
    })),

  // Controls actions with automatic real-time re-extraction
  setAlgorithm: (algorithm) => {
    set((state) => ({
      controls: {
        ...state.controls,
        algorithm,
      }
    }));

    if (algorithm === 'custom') {
      // Empty the preview window when switching to Custom Eyedropper mode
      set((state) => ({
        palette: {
          ...state.palette,
          colors: [],
        }
      }));
    } else {
      const { lastImageData } = get();
      if (lastImageData) {
        get().extractColors(lastImageData);
      }
    }
  },

  setColorCount: (count) => {
    set((state) => ({
      controls: {
        ...state.controls,
        colorCount: count,
      }
    }));
    const { lastImageData } = get();
    if (lastImageData) {
      get().extractColors(lastImageData);
    }
  },
}));