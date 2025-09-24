import { axiosInstance } from "../api/axiosinstance"

// ✅ Função para comprimir imagem
const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Redimensiona mantendo proporção
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Converte para Blob com qualidade reduzida
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// ✅ Função para converter para Base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const uploadImage = async (imageFile: File) => {
  try {
    // ✅ COMPRIME a imagem antes de converter
    console.log("📏 Tamanho original:", (imageFile.size / 1024 / 1024).toFixed(2), "MB");
    
    const compressedFile = await compressImage(imageFile);
    console.log("📐 Tamanho comprimido:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");
    
    // ✅ Converte para Base64
    const imageBase64 = await convertToBase64(compressedFile);
    console.log("📊 Tamanho Base64:", (imageBase64.length / 1024).toFixed(2), "KB");
    
    const response = await axiosInstance.post('/image-upload', {
      imageBase64: imageBase64,
      fileName: imageFile.name
    }, {
      headers: {
        'Content-Type': 'application/json'
      } 
    });
    
    return response.data;
    
  } catch(error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}