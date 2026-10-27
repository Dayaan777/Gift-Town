"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
  aspectHint?: string;
}

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
  aspectHint = "PNG or JPG, preferably transparent cutout",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    setPreviewUrl(currentImageUrl);
  }, [currentImageUrl]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP)");
      return;
    }

    setErrorMessage("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        setPreviewUrl(data.url);
        onImageUploaded(data.url);
      } else {
        setErrorMessage(data.error || "Upload failed. Try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70">
        Product Image
      </label>

      {/* Drag & Drop / Mobile Gallery Upload Container */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center overflow-hidden min-h-[160px] ${
          isDragging
            ? "border-rose bg-[#fdf2f4] scale-[1.01]"
            : "border-rose/25 bg-[#fff8f9] hover:border-rose/50 hover:bg-[#fff0f2]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture={undefined} // Allows both photo gallery & camera on mobile devices
          onChange={onFileChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full flex flex-col items-center gap-2">
            <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-white/80 p-2 border border-rose/15 shadow-xs">
              <Image
                src={previewUrl}
                alt="Product preview"
                fill
                sizes="120px"
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Click or drag another image to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-12 h-12 rounded-full bg-white text-rose border border-rose/20 flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5 text-rose" />
            </div>
            <div>
              <p className="font-body font-bold text-xs text-maroon">
                Tap to upload from Gallery <span className="hidden sm:inline">or Drag & Drop</span>
              </p>
              <p className="font-body text-[11px] text-maroon/50 mt-0.5">
                {aspectHint}
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-10">
            <div className="w-8 h-8 rounded-full border-2 border-rose border-t-transparent animate-spin" />
            <span className="text-xs font-bold text-rose">Uploading image...</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
