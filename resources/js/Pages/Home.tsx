import Hero_Banner from "@/Components/App/Hero_Banner";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  CategoryGroup,
  PageProps,
  PaginationProps,
  Product,
  ProductGroup,
} from "@/types";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, usePage } from "@inertiajs/react";
import ProductCarousel from "@/Components/App/ProductCarousel";
import {
  FireIcon,
  ArrowTrendingUpIcon,
  TagIcon,
  SparklesIcon,
  StarIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  GiftIcon,
  TicketIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { Card, CardHeader } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

const iconPool = [
  FireIcon,
  ArrowTrendingUpIcon,
  TagIcon,
  SparklesIcon,
  StarIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  GiftIcon,
  TicketIcon,
  ShoppingBagIcon,
];

const getIconByIndex = (index: number) => {
  const Icon = iconPool[index % iconPool.length];
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
    "text-indigo-500",
    "text-orange-500",
  ];
  return (
    <Icon
      className={cn("w-5 h-5 sm:w-6 sm:h-6", colors[index % colors.length])}
    />
  );
};

export default function Home({
  products,
  categoryGroups,
  productGroups,
  allproducts,
  hero,
}: PageProps<{
  allproducts: PaginationProps<Product>;
  products: PaginationProps<Product>;
  categoryGroups: CategoryGroup[];
  productGroups: ProductGroup[];
  hero: {
    title: string;
    subtitle: string;
    image_path: string;
    button_text?: string;
    button_link?: string;
  };
}>) {
  const { url } = usePage();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    setTimeout(() => {
      document.querySelectorAll(".aos-init").forEach((el) => {
        el.classList.remove("opacity-0");
      });
    }, 100);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollToCategoryId = params.get("scrollToCategoryId");
    if (scrollToCategoryId) {
      document
        .getElementById(`category-group-${scrollToCategoryId}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [url]);

  useEffect(() => {
    const scrollToProductId = new URLSearchParams(window.location.search).get(
      "scrollToProductId"
    );
    if (scrollToProductId) {
      document
        .getElementById(`product-group-${scrollToProductId}`)
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="overflow-x-hidden font-sans">
      <AuthenticatedLayout>
        <div className="z-40">
          <Hero_Banner
            title={hero.title}
            subtitle={hero.subtitle}
            image_path={
              hero.image_path
                ? `/storage/${hero.image_path}`
                : "/fallback-image.jpg"
            }
            button_text={hero.button_text}
            button_link={hero.button_link}
          />
        </div>

        {productGroups.map((group, index) => {
          const products = Array.isArray(group.products?.data)
            ? group.products.data
            : [];
          const bgColor = index % 2 === 0 ? "bg-muted" : "bg-background";

          return (
            <section
              key={group.id}
              id={`product-group-${group.id}`}
              className={`${bgColor} py-10`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    {getIconByIndex(index)}
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                      {group.name}
                    </h2>
                  </div>
                  <Link
                    href={route("productGroup.show", {
                      productGroup: group.slug,
                    })}
                    className="text-sm sm:text-base text-primary hover:underline"
                  >
                    Show all →
                  </Link>
                </div>

                <ProductCarousel
                  title=""
                  products={products}
                  wrapperClassName="scroll-mt-20"
                  sectionClassName="px-0 mb-10"
                />

                {group.images?.[0] && (
                  <img
                    src={`/storage/${group.images[0]}`}
                    alt={group.name}
                    className="w-full mt-6 rounded-xl object-cover shadow-md h-[220px] sm:h-[350px]"
                  />
                )}
              </div>
            </section>
          );
        })}

        {categoryGroups.map((group, index) => {
          const bgColor = index % 2 === 0 ? "bg-muted" : "bg-background";
          return (
            <section
              key={group.id}
              id={`category-group-${group.id}`}
              className={`${bgColor} py-5`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                <div className="flex items-center gap-3 mb-6">
                  {getIconByIndex(index + 3)}
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground leading-snug">
                    {group.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
  {group.categories.map((category) => (
    <Link
      key={category.id}
      href={route("category.show", category.id)}
      className="
        relative block bg-secondary overflow-hidden rounded-md
        h-48 sm:h-56 md:h-64 lg:h-80
      "
    >
      {category.image && (
        <img
          src={`/storage/${category.image}`}
          alt={category.name}
          className="w-full h-full object-cover opacity-70"
        />
      )}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span className="text-white text-base sm:text-lg lg:text-xl font-semibold text-center px-2">
          {category.name}
        </span>
      </div>
    </Link>
  ))}
</div>

              </div>
            </section>
          );
        })}

        <section className="w-full bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-10 py-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {getIconByIndex(6)}
                <h2 className="text-xl sm:text-3xl font-bold text-foreground leading-snug">
                  Products
                </h2>
              </div>
              <a
                href="/shop"
                className="text-base sm:text-lg text-primary hover:underline font-medium"
              >
                See all →
              </a>
            </div>
          </div>

          <div className="relative z-0 w-full overflow-x-hidden px-4 sm:px-6 md:px-10">
            <div className="md:-mx-[50vw] md:px-[50vw]">
              <ProductCarousel
                products={allproducts.data}
                sectionClassName="bg-muted mb-20"
              />
            </div>
          </div>
        </section>

        <section className="w-full bg-background text-muted-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12">
            <h2 className="text-center text-2xl sm:text-4xl font-semibold text-foreground mb-8 leading-snug">
              Blog
            </h2>
          </div>
        </section>
      </AuthenticatedLayout>
    </div>
  );
}
