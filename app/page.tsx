"use client";

import { useState } from "react";
import HomeLayout from "@/components/HomeLayout";
import UploadDropzone from "@/components/UploadDropzone";
import PromptTextarea from "@/components/PromptTextarea";
import FontSelector, { type FontKey } from "@/components/FontSelector";
import GenerateButton from "@/components/GenerateButton";
import PreviewCard from "@/components/PreviewCard";

export default function HomePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [fontKey, setFontKey] = useState<FontKey>("mincho");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const canGenerate = message.trim().length > 0 || imageUrl !== null;

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 600);
  };

  return (
    <HomeLayout>
      <div className="space-y-10">
        <UploadDropzone imageUrl={imageUrl} onChange={setImageUrl} />
        <PromptTextarea value={message} onChange={setMessage} />
        <FontSelector value={fontKey} onChange={setFontKey} />
        <GenerateButton
          disabled={!canGenerate}
          loading={loading}
          onClick={handleGenerate}
        />
      </div>

      <PreviewCard
        imageUrl={imageUrl}
        message={message}
        fontKey={fontKey}
        generated={generated}
      />
    </HomeLayout>
  );
}
