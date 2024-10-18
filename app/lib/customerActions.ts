'use server';

import { promises as fs } from 'node:fs';
import path from 'path';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const isProduction = true;
const uploadDir = isProduction ? '/tmp/customers' : path.join(process.cwd(), 'public/customers');

// Ensure the upload directory exists
await fs.mkdir(uploadDir, { recursive: true });

const FormSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter the name of the customer.',
    })
        .min(3, { message: "Must be 3 or more characters long" }),
    email: z.coerce
        .string()
        .email({ message: 'Please enter a valid email address.' }),
    image: z
        .instanceof(File)
        .refine(file => file.size <= 5 * 1024 * 1024, {
            message: "Image must be less than 5MB",
        }),

    date: z.string(),
});

const CreateCustomer = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        image?: string[];
    };
    message?: string | null;
};

export async function createCustomer(prevState: State, formData: FormData) {

    const name = formData.get('name');
    const email = formData.get('email');
    const image = formData.get('image') as File;

    const validatedFields = CreateCustomer.safeParse({ name, email, image });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation Failed. Please provide valid data.',
        };
    }

    try {
        console.log("UploadDir-------------------", {uploadDir});
        
        const imageFileName = `${Date.now()}-${image.name}`;
        const imagePath = path.join(uploadDir, imageFileName);

        const arrayBuffer = await image.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        await fs.writeFile(imagePath, buffer);

        const imageUrl = `/customers/${imageFileName}`;
        
        // const { name: validName, email: validEmail } = validatedFields.data;
        
        // await sql`
        //     INSERT INTO customers (name, email, image_url)
        //     VALUES (${validName}, ${validEmail}, ${imageUrl})
        // `;

    } catch (error) {
        console.error('Error creating customer:', error);
        return { message: 'Database Error: Failed to Create Customer.' };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}