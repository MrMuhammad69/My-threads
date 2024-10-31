import { useState } from "react";
import useShowToast from "./useShowToast";
import imageCompression from "browser-image-compression";

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const [imageSizes, setImageSizes] = useState({ original: null, compressed: null });
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const showToast = useShowToast();

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.05, // 50KB
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
      setIsLoading(true); // Start loading
      const originalSize = file.size / 1024;
      const compressedFile = await compressImage(file);

      if (compressedFile) {
        const compressedSize = compressedFile.size / 1024;
        setImageSizes({
          original: originalSize.toFixed(2),
          compressed: compressedSize.toFixed(2),
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setImgUrl(reader.result);
          setIsLoading(false); // End loading
        };
        reader.readAsDataURL(compressedFile);
      } else {
        setIsLoading(false);
      }
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImgUrl(null);
      setImageSizes({ original: null, compressed: null });
      setIsLoading(false);
    }
  };

  return { handleImageChange, imgUrl, setImgUrl, imageSizes, isLoading };
};

export default usePreviewImg;
