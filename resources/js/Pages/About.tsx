


import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React from 'react';

const About: React.FC = () => {
  return (

      <AuthenticatedLayout>
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="relative bg-blue-50 py-20 px-6 md:px-12 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Empowering ideas through technology, design, and innovation.
          </p>
        </div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(400 300)">
              <path d="M152.2,-178.3C191.3,-139.1,207.3,-69.5,196.2,-10.1C185.2,49.3,147.2,98.7,108.1,146.5C69,194.3,28.8,240.6,-23.3,256.6C-75.3,272.6,-138.3,258.4,-179.8,213.2C-221.2,168,-241.1,91.9,-224.7,27.2C-208.3,-37.5,-155.6,-91.8,-109.6,-136.3C-63.5,-180.9,-31.7,-215.7,24.4,-232.2C80.5,-248.7,161,-246.8,152.2,-178.3Z" fill="#3b82f6" />
            </g>
          </svg>
        </div>
      </section>

      {/* Mission Section (2 Column) */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700">
            Our mission is to deliver innovative and reliable technology solutions that help our clients grow and succeed.
            We believe in integrity, creativity, and collaboration at every step.
          </p>
        </div>
        <div>
          <img
            src="https://source.unsplash.com/600x400/?technology,mission"
            alt="Our Mission"
            className="w-full rounded-lg shadow-md object-cover"
          />
        </div>
      </section>

      {/* Vision Section (2 Column Reversed) */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="md:order-2">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-700">
            We envision a world where technology connects and empowers people to create a better future. Through sustainable solutions,
            we aim to leave a positive mark on every industry we touch.
          </p>
        </div>
        <div className="md:order-1">
          <img
            src="https://source.unsplash.com/600x400/?vision,future"
            alt="Our Vision"
            className="w-full rounded-lg shadow-md object-cover"
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-100 py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { name: 'Alice Johnson', role: 'CEO', img: 'https://i.pravatar.cc/150?img=32' },
              { name: 'Mark Lee', role: 'CTO', img: 'https://i.pravatar.cc/150?img=45' },
              { name: 'Sarah Kim', role: 'Design Lead', img: 'https://i.pravatar.cc/150?img=12' },
            ].map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Want to collaborate?</h2>
          <p className="mb-6 text-lg">
            Reach out today and let’s build something extraordinary together.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-blue-100 transition"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
    </AuthenticatedLayout>
  );
};

export default About;
