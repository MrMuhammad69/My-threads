import { useState } from "react";
import useShowToast from "./useShowToast";
import imageCompression from "browser-image-compression";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const [imageSizes, setImageSizes] = useState({ original: null, compressed: null });
  const showToast = useShowToast();

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.05, // 100KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      showToast("Compression failed", "Error compressing the image", "error");
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const originalSize = file.size / 1024; // Convert to KB
      const compressedFile = await compressImage(file);
      
      if (compressedFile) {
        const compressedSize = compressedFile.size / 1024; // Convert to KB
        setImageSizes({
          original: originalSize.toFixed(2),
          compressed: compressedSize.toFixed(2)
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setImgUrl(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      }
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
      setImageSizes({ original: null, compressed: null });
    }
  };

  return { handleImageChange, imgUrl, setImgUrl, imageSizes };
};

export default usePreviewImg;