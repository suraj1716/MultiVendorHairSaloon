// resources/js/Pages/Gallery/Index.tsx
import React, { useEffect } from 'react';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface GalleryImage {
  id: number;
  url: string;
}

interface GalleryItem {
  id: number;
  title: string;
  images: GalleryImage[];
}

interface Props extends PageProps {
  galleryItems: GalleryItem[];
}

export default function Gallery({ galleryItems }: Props) {
  return (
    <>
      <Head title="Gallery" />
      <AuthenticatedLayout>
        <section className="w-full py-12">
          <h2 className="text-4xl font-semibold mb-12 text-center font-serif">Gallery</h2>

          {galleryItems.map((gallery, i) => (
            <GallerySection key={gallery.id} gallery={gallery} index={i} />
          ))}
        </section>
      </AuthenticatedLayout>
    </>
  );
}

function GallerySection({ gallery, index }: { gallery: GalleryItem; index: number }) {
  const gridSizes = [
    "row-span-2 col-span-2",
    "row-span-2 col-span-1",
    "row-span-1 col-span-2",
    "row-span-1 col-span-1",
  ];

  return (
    <div className="mb-20 px-4 md:px-8 lg:px-12">


      <div
        className="
          grid
          grid-cols-3
          auto-rows-[100px]
          gap-4
          md:auto-rows-[280px]
          lg:auto-rows-[300px]
        "
      >
        {gallery.images.map((image, i) => (
          <ImageTile
            key={image.id}
            image={image}
            sizeClass={gridSizes[i % gridSizes.length]}
          />
        ))}
      </div>
    </div>
  );
}

function ImageTile({
  image,
  sizeClass,
}: {
  image: GalleryImage;
  sizeClass: string;
}) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden rounded-lg cursor-pointer shadow-md relative ${sizeClass}`}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: 'easeOut' },
        },
      }}
      whileHover={{ scale: 1.04 }}
    >
      {/* Thin decorative border overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-lg border border-white/40 mix-blend-overlay z-10" />

      <img
        src={image.url}
        alt={`Gallery Image ${image.id}`}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
        draggable={false}
      />
    </motion.div>
  );
}
