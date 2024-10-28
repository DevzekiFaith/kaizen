"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormInputs {
  name: string;
  email: string;
  company?: string;
  teamSize?: string;
  message: string;
}

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    try {
      // TODO: Implement actual contact form submission
      console.log('Contact form data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Message sent successfully! We'll get back to you soon.", {
        position: "top-center",
        autoClose: 3000,
      });
      reset();
      
      // Redirect to signin page after a short delay
      setTimeout(() => {
        router.push('/signIn');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Contact Our Team
          </h1>
          <p className="mt-4 text-xl text-gray-300">
            Get in touch with us to learn more about Enterprise plans and custom solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-6">How to Reach Us</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-orange-500 font-medium mb-2">Email</h3>
                <p className="text-gray-300">enterprise@reflectify.com</p>
              </div>
              
              <div>
                <h3 className="text-orange-500 font-medium mb-2">Phone</h3>
                <p className="text-gray-300">+91 (800) 123-4567</p>
              </div>
              
              <div>
                <h3 className="text-orange-500 font-medium mb-2">Office Hours</h3>
                <p className="text-gray-300">Monday - Friday</p>
                <p className="text-gray-300">9:00 AM - 6:00 PM IST</p>
              </div>
              
              <div>
                <h3 className="text-orange-500 font-medium mb-2">Location</h3>
                <p className="text-gray-300">Bengaluru, Karnataka</p>
                <p className="text-gray-300">India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  {...register("company")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Team Size
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  {...register("teamSize")}
                >
                  <option value="">Select team size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  rows={4}
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactPage;
