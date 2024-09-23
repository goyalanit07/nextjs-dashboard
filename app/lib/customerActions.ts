'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter name of customer.',
    })
        .min(3, { message: "Must be 3 or more characters long" }),
    email: z.coerce
        .string()
        .email({ message: 'Please enter a valid email address.' }),
    date: z.string(),
});

const CreateCustomer = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
    };
    message?: string | null;
};

export async function createCustomer(prevState: State, formData: FormData) {

    // Validate form fields using Zod
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.',
        };
    }

    // Prepare data for insertion into the database
    const { name, email } = validatedFields.data;

    try {
        await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, '/customers/evil-rabbit.png')
    `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}