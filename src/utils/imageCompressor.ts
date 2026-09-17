/**
 * Canvas-based client-side image compressor.
 * Reads File via FileReader, scales proportionally to max 800x800,
 * and encodes to compact Base64 JPEG string (~0.72 quality).
 * Keeps Firestore document size well below limits (~30KB-80KB vs 3MB+).
 */

export interface CompressionResult {
  base64: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

export function compressImageFile(
  file: File,
  maxDimension = 800,
  quality = 0.72
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const originalSizeKB = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional dimensions bounded within maxDimension
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not obtain canvas 2D rendering context.'));
          return;
        }

        // Enable high-quality scaling algorithms
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw white background for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        // Convert directly to Base64 JPEG string
        const base64 = canvas.toDataURL('image/jpeg', quality);

        // Calculate compressed size in KB from Base64 string length
        // Base64 string length * (3/4) = approximate raw bytes
        const stringLength = base64.length - 'data:image/jpeg;base64,'.length;
        const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.562489633438314;
        const compressedSizeKB = Math.max(1, Math.round(sizeInBytes / 1024));

        const reductionPercentage = Math.max(
          0,
          Math.round(((originalSizeKB - compressedSizeKB) / (originalSizeKB || 1)) * 100)
        );

        resolve({
          base64,
          originalSizeKB,
          compressedSizeKB,
          reductionPercentage,
          width,
          height,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load and parse image data.'));
      };

      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      } else {
        reject(new Error('Failed to read file as data URL.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('FileReader encountered an error reading the file.'));
    };

    reader.readAsDataURL(file);
  });
}

export interface ImageTransformOptions {
  rotation?: number; // 0, 90, 180, 270
  brightness?: number; // -50 to 50 (default 0)
  contrast?: number; // -50 to 50 (default 0)
  saturation?: number; // 0 to 200 (default 100)
  flipH?: boolean;
  maxDimension?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/png';
}

/**
 * Transforms an existing image (Base64 or URL) on canvas with rotation, filters, and resizing.
 */
export function transformAndCompressImage(
  sourceUrlOrBase64: string,
  options: ImageTransformOptions = {}
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const {
      rotation = 0,
      brightness = 0,
      contrast = 0,
      saturation = 100,
      flipH = false,
      maxDimension = 800,
      quality = 0.75,
      format = 'image/jpeg',
    } = options;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let srcWidth = img.width;
      let srcHeight = img.height;

      // Handle 90/270 degree rotation swapping width & height
      const isSideways = rotation % 180 !== 0;
      let targetWidth = isSideways ? srcHeight : srcWidth;
      let targetHeight = isSideways ? srcWidth : srcHeight;

      if (targetWidth > targetHeight) {
        if (targetWidth > maxDimension) {
          targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
          targetWidth = maxDimension;
        }
      } else {
        if (targetHeight > maxDimension) {
          targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
          targetHeight = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not obtain canvas 2D rendering context.'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // CSS Filters for Brightness, Contrast & Saturation
      const brightnessVal = 1 + brightness / 100;
      const contrastVal = 1 + contrast / 100;
      const saturationVal = saturation / 100;
      ctx.filter = `brightness(${brightnessVal}) contrast(${contrastVal}) saturate(${saturationVal})`;

      // Fill white background for transparent formats converted to JPEG
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Coordinate transformation for rotation & flip
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);

      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180);
      }
      if (flipH) {
        ctx.scale(-1, 1);
      }

      const drawW = isSideways ? targetHeight : targetWidth;
      const drawH = isSideways ? targetWidth : targetHeight;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const base64 = canvas.toDataURL(format, quality);

      const stringLength = base64.length - (format === 'image/png' ? 'data:image/png;base64,'.length : 'data:image/jpeg;base64,'.length);
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.562489633438314;
      const compressedSizeKB = Math.max(1, Math.round(sizeInBytes / 1024));

      resolve({
        base64,
        originalSizeKB: Math.round(sourceUrlOrBase64.length / 1024),
        compressedSizeKB,
        reductionPercentage: 0,
        width: targetWidth,
        height: targetHeight,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for transformation.'));
    };

    img.src = sourceUrlOrBase64;
  });
}
