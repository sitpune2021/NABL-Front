import { z } from 'zod'

export const instrumentSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    short_name: z.string().min(1, { message: 'Short Name is required' }),
    manufacturer: z.string().min(1, { message: 'Manufacturer is required' }),
    serial_no: z.string().min(1, { message: 'Serial Number is required' }),
    identifier: z
        .string()
        .min(1, { message: 'Prefix is required' })
        .max(4, { message: 'Prefix must be at most 4 characters' })
        .regex(/^[A-Z]+$/, {
            message: 'Prefix must contain only uppercase letters',
        })
        .refine((val) => !/\s{2,}/.test(val), {
            message: 'Prefix must not contain double spaces',
        }),
})

export type InstrumentFormSchema = z.infer<typeof instrumentSchema>
