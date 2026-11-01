"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Video, AlertCircle, Plus, Play } from "lucide-react";

export interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface MultiMediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  maxItems?: number;
}

export default function MultiMediaUploader({
  media = [],
  onChange,
  maxItems = 8,
}: MultiMediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    if (media.length >= maxItems) {
      setErrorMessage(`Maximum of ${maxItems} secondary items allowed.`);
      return;
    }

    setErrorMessage("");
    setIsUploading(true);

    try {
      const remainingSlots = maxItems - media.length;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToUpload) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(file.name);

        if (!isImage && !isVideo) {
          setErrorMessage("Only images (PNG, JPG, WebP) and videos (MP4, WebM, MOV) are supported.");
          continue;
        }

        // Check video size limit (under 50MB)
        if (isVideo && file.size > 50 * 1024 * 1024) {
          setErrorMessage("Videos must be under 50MB.");
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.url) {
          const newItem: MediaItem = {
            url: data.url,
            type: data.type === "video" || isVideo ? "video" : "image",
          };
          onChange([...media, newItem]);
          media = [...media, newItem]; // keep updated for loop
        } else {
          setErrorMessage(data.error || "Upload failed. Try again.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error uploading file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const updated = media.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-maroon/70">
          Secondary Images &amp; Videos (Optional Gallery)
        </label>
        <span className="text-[11px] font-semibold text-maroon/50">
          {media.length} / {maxItems} items
        </span>
      </div>

      {/* Grid of uploaded secondary media */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {media.map((item, idx) => (
          <div
            key={idx}
            className="group relative aspect-square rounded-xl overflow-hidden bg-[#fdf5f6] border border-rose/20 shadow-2xs"
          >
            {item.type === "video" ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                  <div className="w-7 h-7 rounded-full bg-rose/90 text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/70 text-white tracking-widest">
                  Video
                </span>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={item.url}
                  alt={`Secondary media ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/60 text-white tracking-widest">
                  Image
                </span>
              </div>
            )}

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 hover:bg-rose text-white flex items-center justify-center text-xs transition-colors shadow-sm cursor-pointer z-10"
              title="Remove media"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {media.length < maxItems && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-rose/30 hover:border-rose bg-[#fff8f9] hover:bg-[#fce3e0]/40 flex flex-col items-center justify-center gap-1 text-maroon/60 hover:text-rose transition-colors cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-rose border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-center px-1">
                  Add Media
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
      />

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <p className="text-[11px] text-maroon/50 leading-relaxed">
        Upload secondary product angles, close-ups, or unboxing videos. These will appear in the quick-view swipable lookbook.
      </p>
    </div>
  );
}
