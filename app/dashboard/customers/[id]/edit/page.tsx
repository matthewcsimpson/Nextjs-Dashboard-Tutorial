// Libraries 
import { notFound } from 'next/navigation';

// Components
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/customers/edit-form';

// Helpers
import { fetchCustomerById } from '@/app/lib/data';

export default async function CustomerEditPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const customer = await fetchCustomerById(id)

    if (!customer) {
        notFound();
    }

    const { name, email } = customer;


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form id={id} name={name} email={email} />
        </main>
    );
}