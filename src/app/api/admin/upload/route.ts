import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import path from "path";

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
    const ext = path.extname(file.name) || ".png";
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const fileName = `${cleanBase}-${Date.now()}${ext}`;

    // Upload directly to Supabase Storage bucket 'product-images'
    const contentType = file.type || (ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg");
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, buffer, {
        contentType,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message || "Failed to upload image to cloud storage" },
        { status: 500 }
      );
    }

    // Retrieve public URL from bucket
    const { data: publicData } = supabase.storage
      .from("product-images")
      .getPublicUrl(uploadData.path);

    const publicUrl = publicData.publicUrl;

    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
