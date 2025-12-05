import { FileIcon, UploadCloudIcon, XIcon, ImageIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

function Images_Upload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Handle file select
  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  }

  // Handle drag/drop
  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  }

  // Remove selected image
  function handleRemoveImage() {
    setImageFile(null);
    setPreviewUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  // Upload to Cloudinary
  async function uploadImageToCloudinary() {
    try {
      setImageLoadingState(true);
      const data = new FormData();
      data.append("my_file", imageFile);
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

    useEffect(() => {
  if (!imageFile && !uploadedImageUrl) setPreviewUrl("");
}, [imageFile,uploadedImageUrl]);

  return (
    <div
      className={`w-full mt-4 ${
        isCustomStyling ? "" : "max-w-md mx-auto"
      } transition-all`}
    >
      <Label className="text-lg font-semibold mb-2 block ">Upload Image</Label>

      {/* Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
          isEditMode ? "opacity-60 cursor-pointer" : "hover:border-primary"
          
          
        }`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          // disabled={isEditMode}
        />

        <AnimatePresence mode="wait">
          {!imageFile ? (
            <motion.div
              key="upload-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center h-40 cursor-pointer ${
                  isEditMode ? "cursor-pointer" : ""
                }`}
              >
                <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Drag & drop or click to upload image
                </span>
              </Label>
            </motion.div>
          ) : imageLoadingState ? (
            <Skeleton key="loading" className="h-40 w-full bg-gray-100" />
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative rounded-lg overflow-hidden"
            >
              {/* Image Preview */}
              <img
                src={previewUrl || uploadedImageUrl}
                alt="Uploaded preview"
                className="w-full h-40 object-cover rounded-md"
              />

              {/* Overlay with remove button */}
              <div className="absolute inset-0 bg-black/30 flex justify-end items-start p-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                  onClick={handleRemoveImage}
                >
                  <XIcon className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Uploaded filename display */}
      {imageFile && !imageLoadingState && (
        <div className="flex items-center justify-between mt-3 text-sm text-gray-700">
          <div className="flex items-center">
            <FileIcon className="w-5 h-5 mr-2 text-primary" />
            <span>{imageFile.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Images_Upload;
