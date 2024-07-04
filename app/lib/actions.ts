'use server'

// Libraries 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

// Helpers
import { signIn } from '@/auth';

// Validation Schema
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: "please select a customer"
    }),
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),

    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select a status' }),
    date: z.string(),
});

const CreateInvoiceSchema = FormSchema.omit({ id: true, date: true });
const UpdateInvoiceSchema = FormSchema.omit({ id: true, date: true });

// Types 
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};


/**
 * Create an invoice
 * @param previousState 
 * @param formData 
 * @returns 
 */
export async function createInvoice(previousState: State, formData: FormData) {
    
    
    const validatedFormData = CreateInvoiceSchema.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFormData.success) {
        return {
            errors: validatedFormData.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFormData.data;

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    } catch (err) {
        return {
            message: 'An error occurred while creating the invoice',
        }
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

/**
 * Update an invoice
 * @param id 
 * @param formData 
 * @returns 
 */
export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFormData = UpdateInvoiceSchema.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFormData.success) {
        return {
            errors: validatedFormData.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFormData.data;
    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

/**
 * Delete an invoice
 * @param id 
 * @returns 
 */
export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (err) {
        return {
            message: 'An error occurred while deleting the invoice',
        }
    }
}

/**
 * Autenticate a user
 * @param previousState 
 * @param formData 
 */
export async function authenticate(previousState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (err) {
        if (err instanceof AuthError) {
            switch (err.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw err;
    }
}