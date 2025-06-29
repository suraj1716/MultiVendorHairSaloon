import { HeroBannerProps } from "@/types";
import { router } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function HeroBanner({
  title,
  subtitle,
  image_path,
  button_text = "Explore",
  button_link = "/shop",
}: HeroBannerProps) {
  return (
    <section
      className="
    min-h-screen/2 w-full
    bg-gradient-to-r from-[#521f48] to-[#a70797]
    text-white font-montserrat
    flex flex-col md:flex-row items-center justify-between
    overflow-hidden
    px-4  md:px-0 md:py-0
  "
    >
      {/* Content Area */}
     <motion.div
  className="w-full md:w-1/2 z-20 px-6 py-10 md:px-20"
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
>
  <h1 className="text-4xl md:text-7xl font-extrabold leading-tight tracking-tight mb-4 max-w-lg md:max-w-xl">
    {title}
  </h1>
  <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-md md:max-w-lg mb-10">
    {subtitle}
  </p>
  <motion.button
    onClick={() => router.visit(button_link)}
    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-slate-200 transition duration-300"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.6 }}
  >
    {button_text}
  </motion.button>
</motion.div>


      {/* Image Area */}
      {image_path && (
        <motion.div
          className="w-full md:w-1/2 h-full z-10 flex justify-center md:justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={image_path}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </section>
  );
}
