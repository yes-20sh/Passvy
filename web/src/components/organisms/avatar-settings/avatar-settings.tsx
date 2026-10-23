"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card/card";
import { UpdateSettingsDocument } from "@/gql/graphql";
import AVTAR from "@/assets/image/avtar";

interface AvatarSettingsProps {
  avatarUrl?: string | null;
  onSuccess?: () => void;
}

export function AvatarSettings({ avatarUrl, onSuccess }: AvatarSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateSettings, { loading }] = useMutation(UpdateSettingsDocument);

  const displayAvatar = avatarUrl || AVTAR.avtar;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please upload an image file.",
        });
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Please upload an image smaller than 5MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const { data } = await updateSettings({
            variables: {
              input: { avatar: base64String },
            },
          });

          if (data?.updateSettings?.success) {
            toast.success("Success", {
              description: "Avatar updated successfully.",
            });
            if (onSuccess) onSuccess();
          } else {
            toast.error("Update failed", {
              description: data?.updateSettings?.message || "Could not update avatar.",
            });
          }
        } catch (err) {
          toast.error("Upload failed", {
            description: (err as Error).message || "Something went wrong uploading your avatar.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Update your avatar.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div
          className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-muted/50 hover:border-primary/50 transition-colors shadow-sm cursor-pointer"
          onClick={handleAvatarClick}
        >
          <Image
            src={displayAvatar}
            alt="User Avatar"
            fill
            sizes="128px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Camera className="text-white size-8" />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleAvatarClick}
          loading={loading}
        >
          Upload New Photo
        </Button>
      </CardContent>
    </Card>
  );
}
