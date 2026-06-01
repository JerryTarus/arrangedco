"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Asset = { url: string; name: string };

export function MediaLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const { url } = await res.json();
    if (url) setAssets((prev) => [{ url, name: file.name }, ...prev]);
    setUploading(false);
  }

  return (
    <div className="space-y-4">
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
      <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading…" : "Upload image"}
      </Button>

      {assets.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No assets yet. Upload an image to get started.
        </p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {assets.map((asset) => (
            <div key={asset.url} className="relative aspect-square rounded-lg overflow-hidden border">
              <Image src={asset.url} alt={asset.name} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
