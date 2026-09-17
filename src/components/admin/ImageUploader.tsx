import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sliders,
  RotateCw,
  FlipHorizontal,
  X,
  Check,
  RefreshCw,
  Sun,
  Contrast,
} from 'lucide-react';
import {
  compressImageFile,
  transformAndCompressImage,
  CompressionResult,
} from '../../utils/imageCompressor';

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  currentImageBase64?: string;
  onImageReady: (base64: string, stats?: CompressionResult) => void;
  onRemoveImage?: () => void;
  maxDimension?: number;
  quality?: number;
  aspectRatioLabel?: string;
  isIcon?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  sublabel = 'Canvas client-side compression. Direct Firestore Base64 payload.',
  currentImageBase64,
  onImageReady,
  onRemoveImage,
  maxDimension = 800,
  quality = 0.72,
  aspectRatioLabel = 'Recommended 1:1 or 4:3',
  isIcon = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Editor adjustment controls
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(100);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, SVG, etc.)');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      const targetDimension = isIcon ? Math.min(maxDimension, 256) : maxDimension;
      const result = await compressImageFile(file, targetDimension, quality);
      setStats(result);
      onImageReady(result.base64, result);
    } catch (err) {
      console.error('Error compressing image:', err);
      setError((err as Error).message || 'Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyEditorChanges = async () => {
    if (!currentImageBase64) return;
    setIsProcessing(true);
    try {
      const targetDimension = isIcon ? Math.min(maxDimension, 256) : maxDimension;
      const result = await transformAndCompressImage(currentImageBase64, {
        rotation,
        flipH,
        brightness,
        contrast,
        saturation,
        maxDimension: targetDimension,
        quality,
      });
      setStats(result);
      onImageReady(result.base64, result);
      setIsEditorOpen(false);
      // Reset editor delta
      setRotation(0);
      setFlipH(false);
      setBrightness(0);
      setContrast(0);
      setSaturation(100);
    } catch (err) {
      console.error('Error editing image:', err);
      setError('Failed to apply image edits.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemoveImage) {
      onRemoveImage();
    } else {
      onImageReady('');
    }
    setStats(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-slate-800">{label}</label>
          {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
        </div>
        <div className="flex items-center gap-2">
          {currentImageBase64 && (
            <button
              type="button"
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditorOpen ? 'Close Editor' : 'Edit Image'}</span>
            </button>
          )}
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {aspectRatioLabel}
          </span>
        </div>
      </div>

      {/* Main Drag-and-Drop Area */}
      <div
        id={`uploader-dropzone-${label.toLowerCase().replace(/\s+/g, '-')}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-sky-500 bg-sky-50/60'
            : 'border-slate-300 hover:border-sky-400 bg-white/80 hover:bg-slate-50/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Preview thumbnail */}
          <div
            className={`relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-inner ${
              isIcon ? 'w-16 h-16 sm:w-20 sm:h-20 p-2' : 'w-24 h-24 sm:w-28 sm:h-28'
            }`}
          >
            {currentImageBase64 ? (
              <img
                src={currentImageBase64}
                alt="Preview"
                className={`w-full h-full ${isIcon ? 'object-contain' : 'object-cover'}`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-300" />
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Action Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sky-700 font-medium text-sm">
              <UploadCloud className="w-4 h-4 text-sky-600" />
              <span>{currentImageBase64 ? 'Replace / Upload New Image' : 'Select or Drag & Drop Image'}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Auto-compressed to compact Base64 JPEG/PNG for direct Firestore database storage.
            </p>

            {/* Actions for existing image */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {currentImageBase64 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditorOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Sliders className="w-3 h-3 text-sky-600" />
                    <span>Adjust / Rotate</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-rose-600" />
                    <span>Remove Image</span>
                  </button>
                </>
              )}

              {stats && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{stats.compressedSizeKB} KB ({stats.width}x{stats.height}px)</span>
                </span>
              )}
            </div>

            {error && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Image Editor Panel */}
      {isEditorOpen && currentImageBase64 && (
        <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h4 className="text-sm font-bold text-white">Live Canvas Image Editor</h4>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* Live Filter Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div
                className="w-36 h-36 overflow-hidden rounded-lg flex items-center justify-center bg-slate-900 border border-slate-800 transition-all"
                style={{
                  transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                  filter: `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100}) saturate(${saturation / 100})`,
                }}
              >
                <img
                  src={currentImageBase64}
                  alt="Editor Live Preview"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-2 font-mono">
                Rotated {rotation}° | Brightness: {brightness}% | Contrast: {contrast}%
              </span>
            </div>

            {/* Editing Controls */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                  <span>Rotate 90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH((prev) => !prev)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
                >
                  <FlipHorizontal className="w-3.5 h-3.5 text-sky-400" />
                  <span>Flip Horizontal</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-400" /> Brightness
                  </span>
                  <span>{brightness > 0 ? `+${brightness}` : brightness}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span className="flex items-center gap-1">
                    <Contrast className="w-3 h-3 text-sky-400" /> Contrast
                  </span>
                  <span>{contrast > 0 ? `+${contrast}` : contrast}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Saturation</span>
                  <span>{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRotation(0);
                    setFlipH(false);
                    setBrightness(0);
                    setContrast(0);
                    setSaturation(100);
                  }}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyEditorChanges}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply & Save Edits</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
