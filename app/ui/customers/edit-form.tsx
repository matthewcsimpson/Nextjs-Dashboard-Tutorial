'use client';

// Libraries 
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useActionState } from 'react';

// Components
import { Button } from '@/app/ui/button';

// Types
import { CustomerForm } from '@/app/lib/definitions';

// Helpers 
import { updateCustomer, UpdateCustomerState } from '@/app/lib/actions';

export default function EditCustomerForm({ id, name, email }: { id: string, name: string, email: string, }) {

  const initialState: UpdateCustomerState = { message: "", errors: {} };
  const updateCustomerWithId = updateCustomer.bind(null, id);
  const [state, formAction] = useActionState(updateCustomerWithId, initialState);

  return (
    <form action={formAction}
      aria-describedby='form-error'>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Update Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="string"
              defaultValue={name}
              placeholder="name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby='name-error'
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm capitalize text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Update Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="string"
                defaultValue={email}
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm capitalize text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>



      </div>
      <div id="form-error" aria-live="polite" aria-atomic="true">
        {state.message &&
          <p className="mt-2 text-sm capitalize text-red-500" key={state.message}>
            {state.message}
          </p>
        }
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Customer</Button>
      </div>
    </form>
  );
}
