/**
 * Image processing utilities for KESWA WEAR CMS
 * Handles file reading, canvas compression, and validation
 */

export const processImageFile = (file, maxWidth = 900, maxHeight = 900, quality = 0.70) => {
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
            resolve(readerEvent.target.result);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to optimized JPEG for minimal storage footprint
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // If payload is still larger than 160KB, re-compress gently to save quota
          if (dataUrl.length > 220000) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.62);
          }

          resolve(dataUrl);
        } catch (err) {
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
