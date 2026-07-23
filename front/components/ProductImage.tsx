'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ProductImages({ images, name }: { images: string[], name: string }) {
  const [selected, setSelected] = useState(0)

  if (!images || images.length === 0) {
    return <div className="bg-gray-100 h-96 rounded-2xl" />
  }

  return (
    <div>
      <Image
        src={images[selected]}
        alt={name}
        width={600}
        height={600}
        className="w-full h-96 object-cover rounded-2xl mb-3"
      />
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => setSelected(i)}>
              <Image
                src={img}
                alt={name}
                width={80}
                height={80}
                className={`w-20 h-20 object-cover rounded-lg border-2 ${selected === i ? 'border-black' : 'border-transparent'}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}