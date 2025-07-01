"use client";

import { FormEventHandler, Fragment, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useForm, usePage } from "@inertiajs/react";
import MiniCartDropdown from "./MiniCartDropdown";
import { PageProps } from "@/types";
import { Search, UserIcon } from "lucide-react";
import CategoriesDropdown from "./CategoriesDropdown";
import SearchBar from "./SearchBar";
import DepartmentComponent from "./Department";
import LoginModal from "@/Pages/Auth/Login";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { router } from "@inertiajs/react";
import useScrollInfo from "@/hooks/useScrollDirection";
interface Category {
  id: string;
  name: string;
  href: string;
}
interface Department {
  id: string;
  name: string;
  categories: Category[];
  image?: string; // optional
}

// interface Props {
//   departments: Department[];
// }

type Product = {
  title: string;
  slug: string;
  department?: {
    id: number;
    name: string;
    slug: string;
  };
  category?: {
    id: number;
    name: string;
  };
};

interface ProductGroup {
  id: number;
  name: string;
  slug: string;
}

interface CategoryGroup {
  id: number;
  name: string;
  active: boolean;
}
interface Props {
  departments: any[]; // for categories dropdown
  categoryGroups: CategoryGroup[];
  productGroups: ProductGroup[];
}
export default function Navbar() {
  const {
    departments,
    auth,
    keyword,
    categoryGroups = [],
    productGroups = [],
  } = usePage<
    PageProps<{
      keyword: string;
      departments: Department[];
      categoryGroups: CategoryGroup[];
      productGroups: ProductGroup[];
      auth: { user: any };
    }>
  >().props;
  const { user } = auth;
  const [loginOpen, setLoginOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [dealsOpen, setDealsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
const showBar = useScrollInfo(100);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative z-[10] top-0  bg-white shadow">
      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-[60] lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-[40] flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            {/* Close Button */}
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Auth or User Account Section */}
            <div className="border-b border-gray-200 px-6 pb-6 pt-2 text-left space-y-3">
              {!user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    className="w-full rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </button>
                  <Link
                    href={route("register")}
                    className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                  >
                    Create account
                  </Link>
                </>
              ) : (
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="w-full text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center">
                        <span className="flex items-center space-x-3 px-2 py-1 rounded  transition-colors duration-200 cursor-pointer">
                          <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-xl font-medium">Account</span>
                        </span>

                        <ChevronDownIcon
                          className={`h-5 w-5 transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </Disclosure.Button>

                      <Disclosure.Panel className=" bg-slate-100 px-4 pt-2 pb-4 space-y-2 text-sm text-gray-700">
                        <Link
                          href={route("profile.edit")}
                          className="ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                        >
                          Profile
                        </Link>
                        <Link
                          href={route("bookings.history")}
                          className="ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                        >
                          Bookings
                        </Link>
                        <Link
                          href={route("orders.history")}
                          className="ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                        >
                          Order History
                        </Link>
                        <Link
                          href={route("logout")}
                          method="post"
                          as="button"
                          className="ml-2 block text-lg text-gray-700 hover:bg-red-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
                        >
                          Logout
                        </Link>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col divide-y divide-gray-300 px-4 mt-6 mb-6 w-full">
              <Link
                href={route("shop.search")}
                className="block text-lg text-gray-700 hover:text-gray-700 transition-colors duration-200 ease-in-out px-4 py-1 rounded"
              >
                All Products
              </Link>

              {/* Expandable Categories Section */}
              <div>
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="w-full text-left flex justify-between items-center text-lg font-regular text-gray-900 px-4 py-3">
                        <span>All Categories</span>
                        <ChevronDownIcon
                          className={`h-5 w-5 transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </Disclosure.Button>

                      <Disclosure.Panel className="p-0">
                        <CategoriesDropdown departments={departments} />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>

              {/* Deals Dropdown */}
              <div>
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="w-full text-left flex justify-between items-center text-lg font-regular text-gray-900 px-4 py-3">
                        <span>Deals</span>
                        <ChevronDownIcon
                          className={`h-5 w-5 transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </Disclosure.Button>

                      <Disclosure.Panel className="pt-1 mb-14">
                        <div className="flex flex-col divide-y divide-gray-300">
                          {/* Category Groups */}
                          {categoryGroups
                            .filter((g) => g.active)
                            .map((group) => (
                              <button
                                key={group.id}
                                className="text-left w-full px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                onClick={() => {
                                  router.visit(
                                    `/?scrollToCategoryId=${group.id}`,
                                    {
                                      preserveScroll: true,
                                      preserveState: true,
                                    }
                                  );
                                  setDealsOpen(false);
                                  setOpen(false);
                                }}
                              >
                                <span className="text-left w-full text-lg px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                  {group.name}
                                </span>
                              </button>
                            ))}

                          {/* Product Groups */}
                          {productGroups.map((group) => (
                            <button
                              key={group.id}
                              className="text-left w-full px-4 py-4 text-gray-700 hover:bg-purple-700 hover:text-white transition-colors"
                              onClick={() => {
                                router.visit(
                                  route("productGroup.show", {
                                    productGroup: group.slug,
                                  }),
                                  {
                                    preserveScroll: true,
                                    preserveState: true,
                                  }
                                );
                                setDealsOpen(false);
                                setOpen(false);
                              }}
                            >
                              {" "}
                              <span className="text-left w-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                                {group.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>

              <div className="pb-4">
                <Link
                  href={route("contact.index")}
                  className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                >
                  Get Quotes
                </Link>
              </div>

              <div className="pb-4">
                <Link
                  href={route("about")}
                  className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                >
                  About
                </Link>
              </div>
                <div className="pb-4">
                <Link
                  href={route("gallery.index")}
                  className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                >
                  Gallery
                </Link>
              </div>

              <div className="pb-4">
                <Link
                  href={route("contact.index")}
                  className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Currency Switcher */}
            <div className="mt-auto border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt="Flag"
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  CAD
                </span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-purple-900 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav
          aria-label="Top"
          className="sticky lg:static mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* Logo */}

              <div className=" flex lg:ml-0 items-center">
                <a href="/">
                  <span className="sr-only">Dhurva Logo</span>
                  <img
                    alt="Dhurva Logo"
                    src="/storage/a095427b2bbfa1e4d3596bd7c1adb293/Dhurva%20logo-01.png"
                    className="h-[100px] xs:p-5  md:h-20 lg:h-24 w-auto object-contain lg:p-4"
                  />
                </a>
              </div>

              <div className="hidden lg:flex gap-10">
                <div className="ml-auto flex items-center">
                  <Link href={route("shop.search")}>All Products</Link>
                </div>
                <div className="ml-auto flex items-center">
                  <Link href={route("shop.search")}>Get Quotes</Link>
                </div>
                <div className="ml-auto flex items-center">
                  <Link href={route("about")}>About</Link>
                </div>
                  <div className="ml-auto flex items-center">
                  <Link href={route("gallery.index")}>Gallery</Link>
                </div>

                <div className="ml-auto flex items-center">
                  <Link href={route("contact.index")}>Contact Us</Link>
                </div>
              </div>

              <div className="ml-auto flex items-center">
                {/* Cart (visible on all screen sizes) */}
                {/* Search */}
                <div className="flex z-[70]   px-4 sm:px-6 lg:px-0 lg:ml-6">
                  <SearchBar keyword={keyword} />
                </div>

                <div className=" ml-2 sm:ml-4 z-[60] flow-root">
                  <MiniCartDropdown />
                </div>

                {user ? (
                  <div className="relative dropdown dropdown-end">
                    <button
                      tabIndex={0}
                      aria-haspopup="true"
                      className="hidden md:inline-flex relative w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      aria-label="User menu"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name || "User"}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    </button>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu menu-sm bg-white rounded-lg shadow-lg p-2 mt-3 w-52 ring-1 ring-black ring-opacity-5 focus:outline-none"
                      aria-label="User dropdown menu"
                    >
                      <li>
                        <Link
                          href={route("profile.edit")}
                          className="hover:bg-indigo-50 px-3 py-2 rounded"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={route("orders.history")}
                          as="button"
                          className="hover:bg-indigo-50 px-3 py-2 rounded"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={route("bookings.history")}
                          as="button"
                          className="hover:bg-indigo-50 px-3 py-2 rounded"
                        >
                          Bookings
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={route("logout")}
                          method="post"
                          as="button"
                          className="hover:bg-indigo-50 px-3 py-2 rounded"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <div
                      className="relative dropdown dropdown-end hidden lg:flex ml-4"
                      ref={dropdownRef}
                    >
                      {/* Dropdown button */}
                      <button
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                      >
                        <UserIcon className="w-6 h-6 text-indigo-500" />
                      </button>

                      {/* Dropdown menu */}
                      {dropdownOpen && (
                        <ul
                          className="dropdown-content menu menu-sm bg-white rounded-lg shadow-lg p-2 mt-12 w-52 ring-1 ring-black ring-opacity-5 z-50"
                          aria-label="Guest user dropdown"
                        >
                          <li>
                            <button
                              onClick={() => {
                                setDropdownOpen(false);
                                setLoginOpen(true);
                              }}
                              className="w-full text-left hover:bg-indigo-50 px-3 py-2 rounded text-gray-700"
                            >
                              Sign in
                            </button>
                          </li>
                          <li>
                            <Link
                              href={route("register")}
                              className="hover:bg-indigo-50 px-3 py-2 rounded text-gray-700"
                              onClick={() => setDropdownOpen(false)}
                            >
                              Create account
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>

                    <LoginModal
                      isOpen={loginOpen}
                      onClose={() => setLoginOpen(false)}
                      canResetPassword={true}
                    />
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>
            </div>
          </div>
          {/* <div className="sticky top-4 mt-5 w-full lg:static">
            <DepartmentComponent />
          </div> */}
        </nav>
      </header>
    </div>






  );
}
























// "use client";

// import { FormEventHandler, Fragment, useEffect, useRef, useState } from "react";
// import {
//   Dialog,
//   DialogBackdrop,
//   DialogPanel,
//   Disclosure,
//   DisclosurePanel,
// } from "@headlessui/react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import { Link, useForm, usePage } from "@inertiajs/react";
// import MiniCartDropdown from "./MiniCartDropdown";
// import { PageProps } from "@/types";
// import { Search, UserIcon } from "lucide-react";
// import CategoriesDropdown from "./CategoriesDropdown";
// import SearchBar from "./SearchBar";
// import DepartmentComponent from "./Department";
// import LoginModal from "@/Pages/Auth/Login";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
// import { router } from "@inertiajs/react";
// import useScrollDirection from "@/hooks/useScrollDirection";
// interface Category {
//   id: string;
//   name: string;
//   href: string;
// }
// interface Department {
//   id: string;
//   name: string;
//   categories: Category[];
//   image?: string; // optional
// }

// // interface Props {
// //   departments: Department[];
// // }

// type Product = {
//   title: string;
//   slug: string;
//   department?: {
//     id: number;
//     name: string;
//     slug: string;
//   };
//   category?: {
//     id: number;
//     name: string;
//   };
// };

// interface ProductGroup {
//   id: number;
//   name: string;
//   slug: string;
// }

// interface CategoryGroup {
//   id: number;
//   name: string;
//   active: boolean;
// }
// interface Props {
//   departments: any[]; // for categories dropdown
//   categoryGroups: CategoryGroup[];
//   productGroups: ProductGroup[];
// }
// export default function Navbar() {
//   const {
//     departments,
//     auth,
//     keyword,
//     categoryGroups = [],
//     productGroups = [],
//   } = usePage<
//     PageProps<{
//       keyword: string;
//       departments: Department[];
//       categoryGroups: CategoryGroup[];
//       productGroups: ProductGroup[];
//       auth: { user: any };
//     }>
//   >().props;
//   const { user } = auth;
//   const [loginOpen, setLoginOpen] = useState(false);
//   const [open, setOpen] = useState(false);

//   const [dealsOpen, setDealsOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);


//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setDropdownOpen(false);
//       }
//     }

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

// return (
//     <div className="relative z-[9999] top-0 bg-white/30 backdrop-blur-lg shadow-md">

//       {/* Mobile menu */}
//       <Dialog
//         open={open}
//         onClose={setOpen}
//         className="relative z-50 lg:hidden"
//       >
//         <DialogBackdrop
//           transition
//           className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0 z-40"
//         />

//         <div className="fixed inset-0 flex z-50">
//           <DialogPanel
//             transition
//             className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full z-50"
//           >
//             {/* Close Button */}
//             <div className="flex px-4 pt-5 pb-2">
//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
//               >
//                 <span className="absolute -inset-0.5" />
//                 <span className="sr-only">Close menu</span>
//                 <XMarkIcon aria-hidden="true" className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Auth or User Account Section */}
//             <div className="border-b border-gray-200 px-6 pb-6 pt-2 text-left space-y-3">
//               {!user ? (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => setLoginOpen(true)}
//                     className="w-full rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     Sign in
//                   </button>
//                   <Link
//                     href={route("register")}
//                     className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
//                   >
//                     Create account
//                   </Link>
//                 </>
//               ) : (
//                 <Disclosure>
//                   {({ open }) => (
//                     <>
//                       <Disclosure.Button className="w-full text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center">
//                         <span className="flex items-center space-x-3 px-2 py-1 rounded transition-colors duration-200 cursor-pointer">
//                           <img
//                             src={user.avatar}
//                             alt="User Avatar"
//                             className="w-8 h-8 rounded-full object-cover"
//                           />
//                           <span className="text-xl font-medium">Account</span>
//                         </span>

//                         <ChevronDownIcon
//                           className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//                         />
//                       </Disclosure.Button>

//                       <Disclosure.Panel className="bg-slate-100 px-4 pt-2 pb-4 space-y-2 text-sm text-gray-700">
//                         <Link
//                           href={route("profile.edit")}
//                           className="ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
//                         >
//                           Profile
//                         </Link>
//                         <Link
//                           href={route("bookings.history")}
//                           className="ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
//                         >
//                           Bookings
//                         </Link>
//                         <Link
//                           href={route("orders.history")}
//                           className="ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
//                         >
//                           Order History
//                         </Link>
//                         <Link
//                           href={route("logout")}
//                           method="post"
//                           as="button"
//                           className="ml-2 block text-lg text-gray-700 hover:bg-red-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded"
//                         >
//                           Logout
//                         </Link>
//                       </Disclosure.Panel>
//                     </>
//                   )}
//                 </Disclosure>
//               )}
//             </div>

//             {/* Mobile Navigation Links */}
//             <div className="flex flex-col divide-y divide-gray-300 px-4 mt-6 mb-6 w-full">
//               <Link
//                 href={route("shop.search")}
//                 className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
//               >
//                 All Products
//               </Link>

//               {/* Expandable Categories Section */}
//               <div>
//                 <Disclosure>
//                   {({ open }) => (
//                     <>
//                       <Disclosure.Button className="w-full text-left flex justify-between items-center text-lg font-regular text-gray-900 px-4 py-3">
//                         <span>All Categories</span>
//                         <ChevronDownIcon
//                           className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//                         />
//                       </Disclosure.Button>

//                       <Disclosure.Panel className="p-0">
//                         {/* You need to implement CategoriesDropdown component */}
//                         <CategoriesDropdown departments={departments} />
//                       </Disclosure.Panel>
//                     </>
//                   )}
//                 </Disclosure>
//               </div>

//               {/* Deals Dropdown */}
//               <div>
//                 <Disclosure>
//                   {({ open }) => (
//                     <>
//                       <Disclosure.Button className="w-full text-left flex justify-between items-center text-lg font-regular text-gray-900 px-4 py-3">
//                         <span>Deals</span>
//                         <ChevronDownIcon
//                           className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
//                         />
//                       </Disclosure.Button>

//                       <Disclosure.Panel className="pt-1 mb-14">
//                         <div className="flex flex-col divide-y divide-gray-300">
//                           {/* Category Groups */}
//                           {categoryGroups
//                             .filter((g) => g.active)
//                             .map((group) => (
//                               <button
//                                 key={group.id}
//                                 className="text-left w-full px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors"
//                                 onClick={() => {
//                                   router.visit(`/?scrollToCategoryId=${group.id}`, {
//                                     preserveScroll: true,
//                                     preserveState: true,
//                                   });
//                                   setOpen(false);
//                                 }}
//                               >
//                                 {group.name}
//                               </button>
//                             ))}

//                           {/* Product Groups */}
//                           {productGroups.map((group) => (
//                             <button
//                               key={group.id}
//                               className="text-left w-full px-4 py-4 text-gray-700 hover:bg-purple-700 hover:text-white transition-colors"
//                               onClick={() => {
//                                 router.visit(
//                                   route("productGroup.show", {
//                                     productGroup: group.slug,
//                                   }),
//                                   {
//                                     preserveScroll: true,
//                                     preserveState: true,
//                                   }
//                                 );
//                                 setOpen(false);
//                               }}
//                             >
//                               {group.name}
//                             </button>
//                           ))}
//                         </div>
//                       </Disclosure.Panel>
//                     </>
//                   )}
//                 </Disclosure>
//               </div>

//               <div className="pb-4">
//                 <Link
//                   href={route("contact.index")}
//                   className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
//                 >
//                   Get Quotes
//                 </Link>
//               </div>

//               <div className="pb-4">
//                 <Link
//                   href={route("about")}
//                   className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
//                 >
//                   About
//                 </Link>
//               </div>

//               <div className="pb-4">
//                 <Link
//                   href={route("contact.index")}
//                   className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
//                 >
//                   Contact Us
//                 </Link>
//               </div>
//             </div>

//             {/* Currency Switcher */}
//             <div className="mt-auto border-t border-gray-200 px-4 py-6">
//               <a href="#" className="-m-2 flex items-center p-2">
//                 <img
//                   alt="Flag"
//                   src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
//                   className="block h-auto w-5 shrink-0"
//                 />
//                 <span className="ml-3 block text-base font-medium text-gray-900">
//                   CAD
//                 </span>
//                 <span className="sr-only">, change currency</span>
//               </a>
//             </div>
//           </DialogPanel>
//         </div>
//       </Dialog>

//       <header className="relative bg-white z-30">
//         <p className="flex h-10 items-center justify-center bg-purple-900 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
//           Get free delivery on orders over $100
//         </p>

//         <nav
//           aria-label="Top"
//           className="sticky lg:static mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
//         >
//           <div className="border-b border-gray-200">
//             <div className="flex h-16 items-center">
//               {/* Logo */}
//               <div className="flex lg:ml-0 items-center">
//                 <a href="/">
//                   <span className="sr-only">Dhurva Logo</span>
//                   <img
//                     alt="Dhurva Logo"
//                     src="/storage/a095427b2bbfa1e4d3596bd7c1adb293/Dhurva%20logo-01.png"
//                     className="h-[100px] xs:p-5 md:h-20 lg:h-24 w-auto object-contain lg:p-4"
//                   />
//                 </a>
//               </div>

//               <div className="hidden lg:flex gap-10">
//                 <div className="ml-auto flex items-center">
//                   <Link href={route("shop.search")}>All Products</Link>
//                 </div>
//                 <div className="ml-auto flex items-center">
//                   <Link href={route("shop.search")}>Get Quotes</Link>
//                 </div>
//                 <div className="ml-auto flex items-center">
//                   <Link href={route("about")}>About</Link>
//                 </div>
//                 <div className="ml-auto flex items-center">
//                   <Link href={route("contact.index")}>Contact Us</Link>
//                 </div>
//               </div>

//               <div className="ml-auto flex items-center">
//                 {/* Search Bar placeholder */}
//                 <div className="flex z-30 px-4 sm:px-6 lg:px-0 lg:ml-6">
//                   {/* <SearchBar keyword={keyword} /> */}
//                 </div>

//                 {/* Mini Cart Dropdown placeholder */}
//                 <div className="ml-2 sm:ml-4 z-30 flow-root">
//                   <MiniCartDropdown />
//                 </div>

//                 {user ? (
//                   <div className="relative dropdown dropdown-end">
//                     <button
//                       tabIndex={0}
//                       aria-haspopup="true"
//                       className="hidden md:inline-flex relative w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                       aria-label="User menu"
//                     >
//                       <img
//                         src={user.avatar}
//                         alt={user.name || "User"}
//                         className="rounded-full w-10 h-10 object-cover"
//                       />
//                     </button>
//                     <ul
//                       tabIndex={0}
//                       className="dropdown-content menu menu-sm bg-white rounded-lg shadow-lg p-2 mt-3 w-52 ring-1 ring-black ring-opacity-5 focus:outline-none"
//                       aria-label="User dropdown menu"
//                     >
//                       <li>
//                         <Link
//                           href={route("profile.edit")}
//                           className="hover:bg-indigo-50 px-3 py-2 rounded"
//                         >
//                           Profile
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           href={route("orders.history")}
//                           as="button"
//                           className="hover:bg-indigo-50 px-3 py-2 rounded"
//                         >
//                           Orders
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           href={route("bookings.history")}
//                           as="button"
//                           className="hover:bg-indigo-50 px-3 py-2 rounded"
//                         >
//                           Bookings
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           href={route("logout")}
//                           method="post"
//                           as="button"
//                           className="hover:bg-indigo-50 px-3 py-2 rounded"
//                         >
//                           Logout
//                         </Link>
//                       </li>
//                     </ul>
//                   </div>
//                 ) : (
//                   <>
//                     <div
//                       className="relative dropdown dropdown-end hidden lg:flex ml-4"
//                       ref={dropdownRef}
//                     >
//                       {/* Dropdown button */}
//                       <button
//                         onClick={() => setDropdownOpen((prev) => !prev)}
//                         className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                         aria-haspopup="true"
//                         aria-expanded={dropdownOpen}
//                       >
//                         <UserIcon className="w-6 h-6 text-indigo-500" />
//                       </button>

//                       {/* Dropdown menu */}
//                       {dropdownOpen && (
//                         <ul
//                           className="dropdown-content menu menu-sm bg-white rounded-lg shadow-lg p-2 mt-12 w-52 ring-1 ring-black ring-opacity-5 z-50"
//                           aria-label="Guest user dropdown"
//                         >
//                           <li>
//                             <button
//                               onClick={() => {
//                                 setDropdownOpen(false);
//                                 setLoginOpen(true);
//                               }}
//                               className="w-full text-left hover:bg-indigo-50 px-3 py-2 rounded text-gray-700"
//                             >
//                               Sign in
//                             </button>
//                           </li>
//                           <li>
//                             <Link
//                               href={route("register")}
//                               className="hover:bg-indigo-50 px-3 py-2 rounded text-gray-700"
//                               onClick={() => setDropdownOpen(false)}
//                             >
//                               Create account
//                             </Link>
//                           </li>
//                         </ul>
//                       )}
//                     </div>

//                     {/* Login Modal placeholder */}
//                     {loginOpen && (
//                       <div>
//                         {/* <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} canResetPassword={true} /> */}
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>

//               <button
//                 type="button"
//                onClick={() => {
//     console.log("Open menu clicked");
//     setOpen(true);
//   }}
//                 className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
//               >
//                 <span className="absolute -inset-0.5" />
//                 <span className="sr-only">Open menu</span>
//                 <Bars3Icon aria-hidden="true" className="h-6 w-6" />
//               </button>
//             </div>
//           </div>
//         </nav>
//       </header>
//     </div>
//   );
// }
