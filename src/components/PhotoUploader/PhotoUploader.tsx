"use client";

import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase/firebaseConfig';
import { Button } from '../ui/Button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface PhotoUploaderProps {
  folder: string;  // The folder in Firebase Storage where photos will be stored
  onUploadComplete?: (url: string) => void;
  existingPhotoURL?: string;
  className?: string;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  folder,
  onUploadComplete,
  existingPhotoURL,
  className = '',
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>(existingPhotoURL || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setPhotoFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!photoFile) return;

    setLoading(true);
    setError('');

    try {
      // Generate a unique filename using timestamp
      const filename = `${Date.now()}-${photoFile.name}`;
      const photoRef = ref(storage, `${folder}/${filename}`);

      // If there's an existing photo, delete it first
      if (existingPhotoURL) {
        try {
          const oldPhotoRef = ref(storage, existingPhotoURL);
          await deleteObject(oldPhotoRef);
        } catch (error) {
          console.error('Error deleting old photo:', error);
        }
      }

      // Upload new photo
      await uploadBytes(photoRef, photoFile);
      const downloadURL = await getDownloadURL(photoRef);

      if (onUploadComplete) {
        onUploadComplete(downloadURL);
      }

      setPreviewURL(downloadURL);
      setPhotoFile(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {previewURL && (
          <div className="relative w-48 h-48">
            <Image
              src={previewURL}
              alt="Preview"
              className="rounded-lg object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="max-w-xs"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {photoFile && (
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full max-w-xs bg-orange-500 hover:bg-orange-600"
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      )}
    </div>
  );
};

export default PhotoUploader;