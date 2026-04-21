import React, { useState } from 'react';
import { School } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  imageClassName?: string;
}

export default function Logo({ className, imageClassName }: LogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={cn("bg-primary rounded-xl flex items-center justify-center text-white shadow-lg", className)}>
        <School size={24} />
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <img 
        src="/logo.png" 
        alt="Logo SMK Prima Unggul" 
        className={cn("object-contain", imageClassName)}
        onError={() => setError(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
