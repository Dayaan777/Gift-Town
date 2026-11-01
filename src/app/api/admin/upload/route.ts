import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename & create unique timestamped name
    const ext = path.extname(file.name).toLowerCase() || ".png";
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);

    const isVideo =
      (file.type && file.type.startsWith("video/")) ||
      [".mp4", ".webm", ".mov"].includes(ext);

    let uploadBuffer: Buffer = buffer;
    let fileName = `${cleanBase}-${Date.now()}${ext}`;
    let contentType = file.type || "application/octet-stream";

    if (!isVideo) {
      // Future-proof automatic optimization:
      // Convert all images to WebP, resize max dimension 1600px, quality 85
      try {
        uploadBuffer = await sharp(buffer)
          .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

        fileName = `${cleanBase}-${Date.now()}.webp`;
        contentType = "image/webp";

        // Save local copy to public/images/uploads for zero-latency local fallback
        try {
          const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          fs.writeFileSync(path.join(uploadsDir, fileName), uploadBuffer);
        } catch (fsErr) {
          console.warn("Could not write local upload file:", fsErr);
        }
      } catch (sharpErr) {
        console.warn("Sharp optimization fallback to original buffer:", sharpErr);
      }
    } else {
      if (!contentType) {
        if (ext === ".mp4") contentType = "video/mp4";
        else if (ext === ".webm") contentType = "video/webm";
        else if (ext === ".mov") contentType = "video/quicktime";
      }
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, uploadBuffer, {
        contentType,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Failed to upload file to cloud storage" },
        { status: 500 }
      );
    }

    // Retrieve public URL from bucket
    const { data: publicData } = supabase.storage
      .from("product-images")
      .getPublicUrl(uploadData.path);

    const publicUrl = publicData.publicUrl;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      localUrl: !isVideo ? `/images/uploads/${fileName}` : undefined,
      fileName,
      type: isVideo ? "video" : "image",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
