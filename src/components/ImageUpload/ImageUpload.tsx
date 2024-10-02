"use client";

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/clerk-react";
import Img from "next/image";

const ImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    // Implement your upload logic here (e.g., to a server or cloud storage)
    const formData = new FormData();
    formData.append("file", image);

    // Example upload request (replace with your API endpoint)
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div>
      <SignedIn>
        <UserButton showName />
        <label htmlFor="file-upload" className="sr-only text-white">Upload Image</label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} title="Upload an image" />
        {preview && <Img src={preview} alt="Image Preview" className="mt-2" />}
        <button onClick={handleUpload} className="mt-2 bg-blue-500 text-white p-2 rounded">
          Upload Image
        </button>
      </SignedIn>
    </div>
  );
};

export default ImageUpload;