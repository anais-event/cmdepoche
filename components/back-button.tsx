'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

type BackButtonProps = {
  href?: string;
  label?: string;
};

export default function BackButton({ href, label = 'Retour' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="touch-target text-sub flex items-center gap-1 text-sm font-medium active:opacity-70 transition-opacity"
      aria-label={label}
    >
      <ChevronLeft size={20} />
      <span>{label}</span>
    </button>
  );
}
