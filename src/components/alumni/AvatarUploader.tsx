"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Loader2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AvatarUploaderProps {
  userId: string;
  initialUrl: string | null;
  size?: number;
}

export default function AvatarUploader({ userId, initialUrl, size = 120 }: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;

      const buffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, buffer, { 
          upsert: true,
          contentType: file.type 
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update alumni_profiles table
      const { error: updateError } = await supabase
        .from("alumni_profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      router.refresh();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert(`Gagal mengunggah foto profil: ${error instanceof Error ? error.message : "Pastikan ukuran file tidak terlalu besar dan bucket 'avatars' sudah public."}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative group inline-block" style={{ width: size, height: size }}>
      <div 
        className="overflow-hidden rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center relative shadow-xl"
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            fill
            className="object-cover"
            unoptimized // Useful if external images might not be configured in next.config.ts
          />
        ) : (
          <User className="text-white/50" size={size * 0.5} />
        )}

        {/* Hover Overlay */}
        <label 
          htmlFor={`avatar-upload-${userId}`}
          className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300 z-10 ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {uploading ? (
            <Loader2 className="animate-spin text-white mb-1" size={24} />
          ) : (
            <>
              <Camera className="text-white mb-1" size={24} />
              <span className="text-xs text-white font-medium">Ubah</span>
            </>
          )}
        </label>
      </div>

      <input
        id={`avatar-upload-${userId}`}
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}