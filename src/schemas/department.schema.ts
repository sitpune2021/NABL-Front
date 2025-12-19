import { z } from 'zod'

export const departmentSchema = z.object({
    name: z.string().min(1, { message: ' Name required' }),
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

export type DepartmentFormSchema = z.infer<typeof departmentSchema>
