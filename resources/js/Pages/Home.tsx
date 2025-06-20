import Hero_Banner from "@/Components/App/Hero_Banner";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginationProps, Product } from "@/types";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ProductItem from "@/Components/App/ProductItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import HeroBanner from "@/Components/App/Hero_Banner";
import LandingPage from "./LandingPage";
import Footer from "@/Components/App/Footer";
import Contact from "@/Pages/Contact";
// other imports...

import { CategoryGroup, Category, Department, ProductGroup } from "@/types"; // Add these types
import { Link, usePage } from "@inertiajs/react";
import ProductCarousel from "@/Components/App/ProductCarousel";

export default function Home({
  products,
  categoryGroups,
  productGroups,
  allproducts,
}: PageProps<{
  allproducts: PaginationProps<Product>;
  products: PaginationProps<Product>;
  categoryGroups: CategoryGroup[];
  productGroups: ProductGroup[]; // camelCase too
}>) {
  const { props, url } = usePage();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    // Remove opacity-0 after AOS is ready to prevent flicker
    setTimeout(() => {
      document.querySelectorAll(".aos-init").forEach((el) => {
        el.classList.remove("opacity-0");
      });
    }, 100); // small delay ensures AOS is initialized
  }, []);

  // Redirect to Category Group
  useEffect(() => {
    // Extract scrollTo param from URL query string
    const params = new URLSearchParams(window.location.search);
    const scrollToCategoryId = params.get("scrollToCategoryId");
    if (scrollToCategoryId) {
      const el = document.getElementById(
        `category-group-${scrollToCategoryId}`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [url]);

  // Redirect to Product Group
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollToProductId = urlParams.get("scrollToProductId");
    if (scrollToProductId) {
      const el = document.getElementById(`product-group-${scrollToProductId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const headingClass =
    "text-center text-4xl font-bold text-gray-900 mb-12 font-Roboto tracking-wide";

  return (
    <div className="overflow-x-hidden font-montserrat">
      <AuthenticatedLayout>
        {/* Hero Banner */}
        <div className="z-[400]">
          <HeroBanner />
        </div>

        {/* Product Groups Section */}
        <section className="w-full">
          {productGroups.map((group, index) => {
            const products = Array.isArray(group.products?.data)
              ? group.products.data
              : [];

            const bgColor = index % 2 === 0 ? "bg-gray-100" : "bg-white";

            return (
              <div
                key={group.id}
                id={`product-group-${group.id}`}
                className={`${bgColor} w-full py-12`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                  <div className="grid grid-cols-3 items-center">
                    <div></div>

                    <h2 className="text-center text-3xl font-montserrat text-gray-800 mb-2 md:mb-8 leading-snug col-span-3 md:col-span-1">
                      {group.name}
                    </h2>

                    {/* Desktop version (right side) */}
                    <Link
                      href={route("productGroup.show", {
                        productGroup: group.slug,
                      })}
                      className="hidden md:block text-sm text-blue-600 hover:underline font-medium text-right"
                    >
                      Show all products →
                    </Link>
                  </div>

                  {/* Mobile version (bottom below heading) */}
                  <div className="md:hidden text-center mb-4">
                    <Link
                      href={route("productGroup.show", {
                        productGroup: group.slug,
                      })}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      Show all products →
                    </Link>
                  </div>

                  <ProductCarousel
                    title=""
                    products={products}
                    wrapperClassName="scroll-mt-20"
                    sectionClassName="px-0 py-0"
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* Category Groups Section */}
        <section className="w-full ">
          {categoryGroups.map((group, index) => {
            const bgColor = index % 2 === 0 ? "bg-gray-100" : "bg-white";
            return (
              <div
                key={group.id}
                id={`category-group-${group.id}`}
                className={`${bgColor} w-full py-12`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-12">
                  <h2 className="text-center text-3xl font-montserrat text-gray-800 mb-8 leading-snug">
                    {group.name}
                  </h2>
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-6 ">
                    {group.categories.map((category) => (
                      <a
                        key={category.id}
                        href={route("category.show", category.id)}
                        className="block overflow-hidden transition"
                      >
                        <div className="relative aspect-square w-full bg-slate-300 border-2 rounded-3xl overflow-hidden">
                          {category.image && (
                            <img
                              src={`/storage/${category.image}`}
                              alt={category.name}
                              className="w-full h-full object-cover opacity-70"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/60"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg text-center px-2">
                              {category.name}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* All Products Section */}
        <section className="w-full bg-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 relative z-10">
            <div className="grid grid-cols-3 items-center">
              <div></div>

              <h2 className="text-center text-3xl font-montserrat text-gray-800 mb-2 md:mb-8 leading-snug col-span-3 md:col-span-1">
                Products
              </h2>

              {/* Desktop version (right side) */}
              <a
                href="/shop"
                className="hidden md:block text-sm text-indigo-600 hover:underline font-medium text-right"
              >
                See all products →
              </a>
            </div>

            {/* Mobile version (bottom below heading) */}
            <div className="md:hidden text-center mb-4">
              <a
                href="/shop"
                className="text-sm text-indigo-600 hover:underline font-medium"
              >
                See all products →
              </a>
            </div>
          </div>

          {/* Full-width carousel outside the container */}
          <div
            className="relative z-0 w-full overflow-x-hidden px-10"
            style={{
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
            }}
          >
            <ProductCarousel
              products={allproducts.data}
              sectionClassName="bg-gray-100 mb-20"
            />
          </div>
        </section>

        {/* Contact Section */}
        {/* <section className="w-full bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12">
            <Contact />
          </div>
        </section> */}

        {/* Blog Section */}
        <section className="w-full bg-gray-50 text-gray-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12">
            <h2 className="text-center text-3xl font-montserrat text-gray-800 mb-8 leading-snug">
              Blog
            </h2>
          </div>
        </section>
      </AuthenticatedLayout>
    </div>
  );
}
