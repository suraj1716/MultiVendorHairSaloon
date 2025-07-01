"use client";

import { FormEventHandler, Fragment, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosurePanel,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useForm, usePage } from "@inertiajs/react";
import MiniCartDropdown from "./MiniCartDropdown";
import { PageProps } from "@/types";
import {
  HomeIcon,
  Search,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import CategoriesDropdown from "./CategoriesDropdown";
import SearchBar from "./SearchBar";
import DepartmentComponent from "./Department";
import LoginModal from "@/Pages/Auth/Login";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { router } from "@inertiajs/react";
import useScrollInfo from "@/hooks/useScrollDirection";
import MiniCartDropdownBottom from "./MiniCartDropdownBottom";
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
export default function NavbarBottom() {
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
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // showBar is a boolean, not a function, so we cannot call it
  };

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


    <>
      {/* === Bottom Navigation Bar === */}
      <div className="fixed bottom-0 left-0 w-full z-[999] bg-green-600 border-t flex justify-around items-center h-20 px-4 lg:hidden">
        <Link
          href="/"
          className="flex flex-col items-center text-gray-700 gap-1"
        >
          <HomeIcon className="w-7 h-7 text-white" />
          <span className="text-sm text-white">Home</span>
        </Link>
        <div
 onClick={scrollToTop}
          className="flex flex-col items-center text-white gap-1"
        >
          <SearchBar keyword={keyword} />
          <span className="text-sm text-white">Search</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <MiniCartDropdownBottom />

        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative rounded-md text-white p-2  lg:hidden"
        >
          <span className="sr-only">Open menu</span>
          <Bars3Icon aria-hidden="true" className="w-10 h-10" />
        </button>
      </div>

      {/* === Slide-Up Mobile Menu Dialog === */}
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[999]" onClose={setOpen}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          {/* Slide-up Panel */}
          <div className="fixed inset-0 z-[999] flex items-end lg:hidden">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transition ease-in duration-200"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="w-full h-full bg-white shadow-xl overflow-y-auto rounded-t-2xl">
                {/* Drag Handle */}
                <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto my-3" />

                {/* Close Button */}
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Auth Section */}
                <div className="px-6 pt-10 pb-6 border-b border-gray-200 space-y-3">
                  {!user ? (
                    <>
                      <button
                        onClick={() => setLoginOpen(true)}
                        className="w-full rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50"
                      >
                        Sign in
                      </button>
                      <Link
                        href={route("register")}
                        className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white px-2 py-1 rounded"
                      >
                        Create account
                      </Link>
                    </>
                  ) : (
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="w-full text-left flex items-center justify-between text-lg px-2 py-1 font-semibold text-gray-900 hover:bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <img
                                src={user.avatar}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span>Account</span>
                            </div>
                            <ChevronDownIcon
                              className={`h-5 w-5 transition-transform ${
                                open ? "rotate-180" : ""
                              }`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 space-y-2 px-4 pb-2">
                            <Link
                              href={route("profile.edit")}
                              className="block"
                            >
                              Profile
                            </Link>
                            <Link
                              href={route("bookings.history")}
                              className="block"
                            >
                              Bookings
                            </Link>
                            <Link
                              href={route("orders.history")}
                              className="block"
                            >
                              Order History
                            </Link>
                            <Link
                              href={route("logout")}
                              method="post"
                              as="button"
                              className="block text-red-600"
                            >
                              Logout
                            </Link>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                </div>

                {/* Navigation Links */}
                <nav className="px-6 py-4 space-y-4">
                  <Link
                    href={route("shop.search")}
                    className="block text-lg text-gray-700 hover:text-gray-700 transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                  >
                    All Products
                  </Link>

                  {/* Categories Dropdown */}
                  {/* Expandable Categories Section */}

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
                                      setOpen(false);
                                    }}
                                  >
                                    {group.name}
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
                                    setOpen(false);
                                  }}
                                >
                                  {group.name}
                                </button>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </div>

                  {/* Other Links */}
                  <Link
                    href={route("contact.index")}
                    className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                  >
                    Get Quotes
                  </Link>
                  <Link
                    href={route("about")}
                    className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                  >
                    About
                  </Link>
                  <Link
                    href={route("gallery.index")}
                    className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                  >
                    Gallery
                  </Link>
                  <Link
                    href={route("contact.index")}
                    className="block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded"
                  >
                    Contact Us
                  </Link>
                </nav>

                {/* Currency Footer */}
                <div className="mt-auto border-t border-gray-200 px-6 py-6">
                  <a href="#" className="flex items-center space-x-3">
                    <img
                      src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                      alt="Flag"
                      className="w-5 h-4"
                    />
                    <span className="text-base text-gray-900">CAD</span>
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

