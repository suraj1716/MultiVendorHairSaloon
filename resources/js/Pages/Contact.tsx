import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";

interface DepartmentOption {
  id: number;
  name: string;
  slug: string;
  categories: {
    id: number;
    name: string;
    products: {
      id: number;
      name: string;
    }[];
  }[];
}

const Contact: React.FC = () => {
  const { departments: rawDepartments, contactReasons } =
    usePage<PageProps>().props;

  const departments: DepartmentOption[] = rawDepartments.map((dept: any) => ({
    id: dept.id,
    name: dept.name,
    slug: dept.slug,
    categories: (dept.categories || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      products: (cat.products || []).map((prod: any) => ({
        id: prod.id,
        name: prod.name,
      })),
    })),
  }));

  const reasons = [
    { value: "", label: "Select reason" },
    ...((contactReasons as { value: string; label: string }[]) || []),
  ];

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    reason: "",
    department: "",
    category: "",
    product: "",
    quantity: "",
    file: null as File | null,
    message: "",
  });

  const isGettingQuote = data.reason === "getting_quote";

  const selectedDepartment = departments.find(
    (d) => d.id.toString() === data.department
  );
  const selectedCategory = selectedDepartment?.categories.find(
    (c) => c.id.toString() === data.category
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData("file", e.target.files?.[0] ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/contact", {
      forceFormData: true,
      onSuccess: () => reset(),
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page header */}
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Contact Us / Get Quotes
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto md:mx-0">
            We’re here to help. Fill out the form or use the contact details
            provided.
          </p>
        </header>

        {/* Main content: two column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left: Contact Form */}
          <section>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow-md p-8 space-y-6"
              encType="multipart/form-data"
              noValidate
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Send a Message
              </h2>

              <div>
                <label
                  className="block mb-1 font-medium text-gray-700"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  className="block mb-1 font-medium text-gray-700"
                  htmlFor="reason"
                >
                  Reason for Contact
                </label>
                <select
                  id="reason"
                  value={data.reason}
                  onChange={(e) => setData("reason", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white appearance-none focus:outline-none"
                  style={{ transition: "none" }} // disable any transition
                  required
                >
                  {reasons.map((r) => (
                    <option
                      key={r.value}
                      value={r.value}
                      disabled={r.value === ""}
                    >
                      {r.label}
                    </option>
                  ))}
                </select>
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                )}
              </div>

              {isGettingQuote && (
                <>
                  <div>
                    <label
                      className="block mb-1 font-medium text-gray-700"
                      htmlFor="department"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      value={data.department}
                      onChange={(e) => {
                        setData("department", e.target.value);
                        setData("category", "");
                        setData("product", "");
                      }}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none bg-white"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  {selectedDepartment && (
                    <div>
                      <label
                        className="block mb-1 font-medium text-gray-700"
                        htmlFor="category"
                      >
                        Category
                      </label>
                      <select
                        id="category"
                        value={data.category}
                        onChange={(e) => {
                          setData("category", e.target.value);
                          setData("product", "");
                        }}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none bg-white"
                        required
                      >
                        <option value="">Select Category</option>
                        {selectedDepartment.categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.category}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedCategory && (
                    <div>
                      <label
                        className="block mb-1 font-medium text-gray-700"
                        htmlFor="product"
                      >
                        Product
                      </label>
                      <select
                        id="product"
                        value={data.product}
                        onChange={(e) => setData("product", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none bg-white"
                        required
                      >
                        <option value="">Select Product</option>
                        {selectedCategory.products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {errors.product && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.product}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label
                      className="block mb-1 font-medium text-gray-700"
                      htmlFor="quantity"
                    >
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min={1}
                      value={data.quantity}
                      onChange={(e) => setData("quantity", e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                      placeholder="Quantity needed"
                    />
                    {errors.quantity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block mb-1 font-medium text-gray-700"
                      htmlFor="file"
                    >
                      Upload File (optional)
                    </label>
                    <input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="w-full"
                      accept="image/*,application/pdf"
                    />
                    {errors.file && (
                      <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label
                  className="block mb-1 font-medium text-gray-700"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={data.message}
                  onChange={(e) => setData("message", e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                  placeholder="Write your message here..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
              >
                {processing ? "Sending..." : "Send Message"}
              </button>
            </form>
          </section>

          {/* Right: Contact Details & Map */}
          <section className="space-y-10">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Contact Information
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <strong className="block mb-1">Address:</strong>
                  123 Business Street,
                  <br /> Melbourne, VIC 3000, Australia
                </li>
                <li>
                  <strong className="block mb-1">Phone:</strong>
                  <a
                    href="tel:+61234567890"
                    className="text-blue-600 hover:underline"
                  >
                    +61 2 3456 7890
                  </a>
                </li>
                <li>
                  <strong className="block mb-1">Email:</strong>
                  <a
                    href="mailto:contact@yourcompany.com"
                    className="text-blue-600 hover:underline"
                  >
                    contact@yourcompany.com
                  </a>
                </li>
                <li>
                  <strong className="block mb-1">Business Hours:</strong>
                  Mon - Fri: 9:00 AM - 5:00 PM
                </li>
              </ul>
            </div>

            {/* Embedded Map */}
            <div className="w-full h-80 rounded-lg overflow-hidden shadow-md">
              <iframe
                title="Company Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019777120943!2d144.96305831573905!3d-37.813611879751115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43b01b4e5b%3A0x8dd1a4a1d34c892a!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1627485040554!5m2!1sen!2sus"
                width="100%"
                height="100%"
                loading="lazy"
                className="border-0"
                allowFullScreen
                aria-hidden="false"
                tabIndex={0}
              />
            </div>
          </section>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Contact;
