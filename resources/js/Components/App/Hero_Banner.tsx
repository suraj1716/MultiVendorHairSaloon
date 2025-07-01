import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_path: string;
  is_active: boolean;
}

interface HeroCarouselProps {
  banners: Banner[];
}

const ZOOM_DURATION = 10_000; // 10 seconds

function HeroBanner({
  title,
  subtitle,
  image_path,
  button_text,
  button_link,
}: Banner) {
  return (
    <motion.section
      className="absolute inset-0 w-full min-h-screen overflow-hidden text-gray-600 font-montserrat flex flex-col md:flex-row items-center justify-between"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background with slow zoom-in */}
      <motion.div
        className="xs:hidden absolute inset-0 bg-center bg-cover bg-no-repeat z-0"
        style={{ backgroundImage: `url(${image_path})` }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        exit={{ scale: 1.05 }}
        transition={{ duration: ZOOM_DURATION / 1000, ease: "easeInOut" }}
      />

      {/* Overlay */}
      <motion.div className="absolute inset-0 z-10" />

      {/* Desktop Content */}
      <motion.div
        className="xs:hidden z-20 hidden  md:block ml-10 px-11 py-20 md:px-20 text-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h1
          className="text-4xl md:text-7xl mb-4 leading-tight tracking-tight"
          style={{ fontFamily: "'Great Vibes', cursive", color: "#064e3b" }}
        >
          {title}
        </h1>
        <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-xl ml-10">{subtitle}</p>
       <motion.button

  onClick={() => {
    window.scrollBy({ top: 550, behavior: 'smooth' });
  }}

  className="ml-10 bg-white text-black px-8 py-3  font-semibold hover:bg-slate-100 transition duration-300 border border-gray-300"
  whileHover={{ scale: 1.05 }}
>


          {button_text}
        </motion.button>
      </motion.div>

      {/* Mobile Content */}
     <motion.div
  className="absolute inset-0 bg-center bg-cover bg-no-repeat z-0"
  style={{ backgroundImage: `url(${image_path})`, backgroundPosition: "left 80% top 70%",}}
  initial={{ scale: 1 }}
  animate={{ scale: 1.1 }}
  exit={{ scale: 1.05 }}
  transition={{ duration: ZOOM_DURATION / 1000, ease: "easeInOut" }}
/>
      <motion.div
className="md:hidden absolute bottom-0 z-20 px-10 py-12 w-full max-w-xl bg-black/50 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
      >

        <h1
          className="text-5xl mb-4"
          style={{ fontFamily: "'Great Vibes', cursive", color: "#64f87d" }}
        >
          {title}
        </h1>
        <p className="text-gray-300 text-lg mb-6">{subtitle}</p>
   <button
  type="button" // <-- ensures it's not treated as a submit button
  onClick={() => {
    window.scrollBy({ top: 550, behavior: 'smooth' });
  }}
  className="bg-white text-black px-6 py-2 font-semibold hover:bg-gray-300 transition duration-300"
>
  {button_text}
</button>

      </motion.div>
    </motion.section>
  );
}

export default function HeroCarousel({ banners }: HeroCarouselProps) {
  const activeBanners = banners.filter((b) => b.is_active);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeBanners.length);
    }, ZOOM_DURATION);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  return (
    <div className="relative w-full min-h-screen overflow-hidden z-[15]">
      <AnimatePresence initial={false}>
        <HeroBanner key={activeBanners[activeIndex].id} {...activeBanners[activeIndex]} />
      </AnimatePresence>
    </div>
  );
}








// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { router } from "@inertiajs/react";

// interface Banner {
//   id: number;
//   title: string;
//   subtitle: string;
//   button_text: string;
//   button_link: string;
//   image_path: string;
//   is_active: boolean;
// }

// interface HeroCarouselProps {
//   banners: Banner[];
// }

// const ZOOM_DURATION = 10_000; // 10 seconds

// function HeroBanner({
//   title,
//   subtitle,
//   image_path,
//   button_text,
//   button_link,
// }: Banner) {
//   return (
//     <motion.section
//       className="absolute inset-0 w-full min-h-screen overflow-hidden text-gray-600 font-montserrat flex flex-col md:flex-row items-center justify-between"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
//     >
//       {/* Background with slow zoom-in */}
//       <motion.div
//         className="absolute inset-0 bg-center bg-cover bg-no-repeat z-0"
//         style={{ backgroundImage: `url(${image_path})` }}
//         initial={{ scale: 1 }}
//         animate={{ scale: 1.1 }}
//         exit={{ scale: 1.05 }}
//         transition={{ duration: ZOOM_DURATION / 1000, ease: "easeInOut" }}
//       />

//       {/* Overlay */}
//       <motion.div className="absolute inset-0 z-10" />

//       {/* Desktop Content */}
//       <motion.div
//         className="z-20 hidden  md:block ml-10 px-11 py-20 md:px-20 text-left"
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: 20 }}
//         transition={{ duration: 1, ease: "easeInOut" }}
//       >
//         <h1
//           className="text-4xl md:text-7xl mb-4 leading-tight tracking-tight"
//           style={{ fontFamily: "'Great Vibes', cursive", color: "#064e3b" }}
//         >
//           {title}
//         </h1>
//         <p className="text-gray-700 text-lg md:text-xl mb-8 max-w-xl ml-10">{subtitle}</p>
//        <motion.button
//   onClick={() => router.visit(button_link)}
//   className="ml-10 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition duration-300 border border-gray-300"
//   whileHover={{ scale: 1.05 }}
// >


//           {button_text}
//         </motion.button>
//       </motion.div>

//       {/* Mobile Content */}
//       <motion.div
//         className="md:hidden relative z-20 px-6 py-12 w-full max-w-xl rounded-lg top-1/4 mx-auto"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         transition={{ duration: 0.8 }}
//       >
//         <h1
//           className="text-5xl mb-4"
//           style={{ fontFamily: "'Great Vibes', cursive", color: "#64f87d" }}
//         >
//           {title}
//         </h1>
//         <p className="text-gray-300 text-lg mb-6">{subtitle}</p>
//         <button
//           onClick={() => router.visit(button_link)}
//           className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-300 transition duration-300"
//         >
//           {button_text}
//         </button>
//       </motion.div>
//     </motion.section>
//   );
// }

// export default function HeroCarousel({ banners }: HeroCarouselProps) {
//   const activeBanners = banners.filter((b) => b.is_active);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     if (activeBanners.length <= 1) return;
//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % activeBanners.length);
//     }, ZOOM_DURATION);

//     return () => clearInterval(interval);
//   }, [activeBanners.length]);

//   if (activeBanners.length === 0) return null;

//   return (
//     <div className="relative w-full min-h-screen overflow-hidden">
//       <AnimatePresence initial={false}>
//         <HeroBanner key={activeBanners[activeIndex].id} {...activeBanners[activeIndex]} />
//       </AnimatePresence>
//     </div>
//   );
// }
