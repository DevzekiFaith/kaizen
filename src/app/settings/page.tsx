"use client";

import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '../../components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { auth, storage } from '@/firebase/firebaseConfig';
import Image from "next/image"
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isFormChanged, setIsFormChanged] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    } else {
      router.push('/signin');
    }
  }, [user, router]);

  // Check if form has been modified
  useEffect(() => {
    if (user) {
      const hasNameChanged = displayName !== (user.displayName || '');
      const hasPhotoChanged = photoFile !== null;
      setIsFormChanged(hasNameChanged || hasPhotoChanged);
    }
  }, [displayName, photoFile, user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // If nothing has changed, just go back
    if (!isFormChanged) {
      handleGoBack();
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let newPhotoURL = user.photoURL;

      if (photoFile) {
        const photoRef = ref(storage, `profile-photos/${user.uid}`);
        await uploadBytes(photoRef, photoFile);
        newPhotoURL = await getDownloadURL(photoRef);
      }

      await updateProfile(user, {
        displayName: displayName,
        photoURL: newPhotoURL,
      });

      setMessage('Profile updated successfully!');
      // Redirect to content page after successful update
      setTimeout(() => {
        router.push('/content');
      }, 1500);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Return null since useEffect will handle the redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <Button
            type="button"
            onClick={handleGoBack}
            variant="outline"
            className="px-4 py-2"
          >
            Back
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo</Label>
            <div className="flex items-center space-x-4">
              {photoURL && (
                <Image
                  src={photoURL}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover"
                  width={64}
                  height={64}
                />
              )}
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="flex-1"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {!isFormChanged ? 'Go Back' : (loading ? 'Updating...' : 'Update Profile')}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;