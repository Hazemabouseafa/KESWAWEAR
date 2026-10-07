/**
 * Image processing utilities for KESWA WEAR CMS
 * Handles file reading, canvas compression, and validation
 */

export const processImageFile = (file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("لم يتم تحديد أي ملف"));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error("الملف المحدد ليس صورة صالحة (يرجى اختيار JPG, PNG, WebP)"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Downscale if dimensions exceed limits while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to original data URL if canvas context unavailable
            resolve(readerEvent.target.result);
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to optimized JPEG or keep PNG if transparent
          const isPng = file.type === 'image/png' && file.size < 800000;
          const outputType = isPng ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(outputType, quality);

          resolve(dataUrl);
        } catch (err) {
          // If canvas fails, fallback to raw reader result
          resolve(readerEvent.target.result);
        }
      };

      img.onerror = () => {
        reject(new Error("فشل في تحميل ومعالجة بيانات الصورة"));
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = () => {
      reject(new Error("فشل في قراءة ملف الصورة من جهازك"));
    };

    reader.readAsDataURL(file);
  });
};
