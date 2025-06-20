import { Department } from "@/types";
import { Link } from "@inertiajs/react";

interface CategoriesDropdownProps {
  departments: Department[];
}

export default function CategoriesDropdown({ departments }: CategoriesDropdownProps) {
  if (departments.length === 0) {
    return (
      <div className="px-4 py-3 text-center text-sm text-gray-500">
        No departments found.
      </div>
    );
  }

  return (
    <div className="bg-slate-100 flex flex-col space-y-4 px-4 mt-4 py-5">
      {departments.map((dept) => (
        <div key={dept.id} className="space-y-2">
          {/* Department Name */}
          <div className="text-base font-semibold text-purple-700">{dept.name}</div>

          {/* All Products Link */}
          <Link
            href={`/d/${dept.slug}`}
            className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
          >
            All {dept.name} Products
          </Link>

          {/* Categories */}
          {dept.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/d/${dept.slug}?category_id=${cat.id}&department_id=${dept.id}&max_price=4000&sort_by=default`}
              className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded "
            >
              {cat.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
