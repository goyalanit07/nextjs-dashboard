'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createCustomer, State } from '@/app/lib/customerActions';
import { useState } from 'react';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (file && file.size > maxSize) {
      setImageError('Image size should not exceed 5MB.');
      event.target.value = '';
    } else {
      setImageError(null);
    }
  };

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Customer Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="customer-error"
              />
            </div>
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors?.name?.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
              />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors?.email?.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Image */}
        <div className="mb-4">
          <label htmlFor="image" className="mb-2 block text-sm font-medium">
            Image
          </label>
          <div className="relative mt-2 rounded-md border border-gray-200 bg-white shadow-sm">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:rounded file:border-0 file:bg-gray-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
              aria-describedby="image-error"
              onChange={handleImageChange}
            />
          </div>
          <div id="image-error" aria-live="polite" aria-atomic="true">
            {imageError && (
              <p className="mt-2 text-sm text-red-500">{imageError}</p>
            )}
            {state.errors?.image &&
              state.errors?.image?.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
 
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
