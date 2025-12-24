import { z } from 'zod'

export const zoneSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    identifier: z
        .string()
        .min(1, 'Prefix is required')
        .max(4, 'Prefix must be at most 4 characters')
        .regex(/^[A-Z]+$/, 'Prefix must contain only uppercase letters')
        .refine((val) => !/\s{2,}/.test(val), {
            message: 'Prefix must not contain double spaces',
        }),
})

export type ZoneFormSchema = z.infer<typeof zoneSchema>
