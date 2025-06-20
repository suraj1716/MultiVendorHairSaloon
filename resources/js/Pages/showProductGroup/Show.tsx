import ProductItem from "@/Components/App/ProductItem";
import Breadcrumbs from "@/Components/Core/Breadcrumbs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useMemo } from "react";
import { Product, ProductGroup, PaginationProps } from "@/types";

interface ProductGroupShowProps {
  productGroup: ProductGroup;
  products: PaginationProps<Product>;
}

export default function ProductGroupShow({
  productGroup,
  products,
}: ProductGroupShowProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: productGroup.name, current: true },
  ];

  return (
    <AuthenticatedLayout>
      <Head title={`Products - ${productGroup.name}`} />

      <div className="bg-gray-100 py-10 text-center">
        <div className="ml-20">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800">
          Shop Products - {productGroup.name}
        </h1>
      </div>

      <div className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
        {/* Optional Sidebar for Group Info */}
        <aside className="hidden lg:flex sticky top-5 w-full lg:w-1/4 bg-white shadow rounded-lg p-6 items-center justify-center">
          {productGroup.image && (
            <img
              src={`/storage/${productGroup.image}`}
              alt={productGroup.name}
              className="h-[450px] w-full object-cover rounded"
            />
          )}
        </aside>

        {/* Product Listing */}
        <main className="w-full lg:w-3/4">
          {products.data.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.data.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthenticatedLayout>
  );
}
