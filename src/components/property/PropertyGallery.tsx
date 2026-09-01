'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface GalleryImage {
  url: string;
  altText: string | null;
}

export default function PropertyGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [{ url: '/uploads/properties/placeholder-1.svg', altText: title }];
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div className="overflow-hidden rounded-card bg-stone-100">
      <div className="relative aspect-[16/10] w-full">
        <Image src={current.url} alt={current.altText || title} fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" priority />
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-2 p-2 sm:grid-cols-6">
          {list.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-[4/3] overflow-hidden rounded-lg ${
                i === active ? 'ring-2 ring-brand-600' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt={img.altText || `${title} ${i + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
