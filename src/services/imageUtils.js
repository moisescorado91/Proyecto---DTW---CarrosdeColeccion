const IMAGE_MAX_WIDTH = 800;
const IMAGE_MAX_HEIGHT = 600;
const IMAGE_QUALITY = 0.75;
const IMAGE_MAX_INPUT_BYTES = 8 * 1024 * 1024; // 8 MB

// Procesa el archivo de imagen seleccionado por el usuario antes de guardarlo.
// Valida tipo, tamano y genera una version optimizada en formato Base64.
export function processImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen'));
      return;
    }

    if (file.size > IMAGE_MAX_INPUT_BYTES) {
      reject(new Error(`La imagen supera los ${IMAGE_MAX_INPUT_BYTES / 1024 / 1024} MB`));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen'));
    reader.onload = (e) => {
      resizeImage(e.target.result)
        .then(resolve)
        .catch(reject);
    };
    reader.readAsDataURL(file);
  });
}

// Redimensiona la imagen usando canvas para reducir peso y evitar saturar localStorage.
function resizeImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const ratio = Math.min(
        IMAGE_MAX_WIDTH / width,
        IMAGE_MAX_HEIGHT / height,
        1
      );
      
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Se exporta como JPEG comprimido para equilibrar calidad visual y tamano de almacenamiento.
      resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
    };
    img.onerror = () => reject(new Error('Imagen no válida'));
    img.src = dataUrl;
  });
}
