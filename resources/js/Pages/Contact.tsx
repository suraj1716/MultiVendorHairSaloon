import React from 'react';
import { useForm, usePage } from "@inertiajs/react";
import { PageProps } from '@/types';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

const Contact: React.FC = () => {
  const { props } = usePage<PageProps>();
  const { faqs = [], flash = {} } = props;

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    message: '',
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  post('/contact', {
    onSuccess: () => {
      reset(); // this will clear all form fields back to initial values
    },
  });
};

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <section>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          We're here to help. Please fill out the form below and we'll get back to you shortly.
        </p>

        {flash?.success && (
          <div className="mb-6 px-4 py-3 rounded bg-green-100 text-green-800 border border-green-300">
            {flash.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              rows={5}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
            />
            {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {processing ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs?.length > 0 ? (
            faqs.map((faq) => (
              <div key={faq.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                <h3 className="font-medium text-gray-800">{faq.question}</h3>
                <p className="text-gray-600 mt-1">{faq.answer}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No FAQs available at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;
