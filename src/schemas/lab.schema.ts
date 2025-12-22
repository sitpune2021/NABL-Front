import { z } from 'zod'

export const labSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    labType: z.string().min(1, { message: 'Lab Type is required' }),
    labCode: z.string().min(1, { message: 'Lab Code is required' }),
    emails: z
        .array(
            z.object({
                type: z.string(),
                value: z
                    .string()
                    .nonempty({ message: 'Email is required' })
                    .email({ message: 'Invalid email address' }),
                is_primary: z.boolean().optional(),
                label: z.enum(['primary', 'alternate']).optional(),
            }),
        )
        .min(1, { message: 'At least one email is required' }),
    phones: z
        .array(
            z.object({
                type: z.string(),
                value: z.string().nonempty({ message: 'Phone is required' }),
                is_primary: z.boolean().optional(),
                label: z.enum(['primary', 'alternate']).optional(),
            }),
        )
        .min(1, { message: 'At least one phone is required' }),
    address: z.string().optional(),
    location: z
        .array(
            z.object({
                zone_name: z.union([z.string(), z.number()]),
                cluster_name: z.union([z.string(), z.number()]),
                location_name: z.union([z.string(), z.number()]),

                departments: z
                    .array(
                        z.object({
                            name: z.union([z.string(), z.number()]),
                            instruments: z
                                .array(z.union([z.string(), z.number()]))
                                .min(1, {
                                    message:
                                        'At least one instrument is required per department',
                                }),
                        }),
                    )
                    .min(1, { message: 'At least one department is required' }),
                prefix: z.string().nonempty(),
                shortName: z.string(),
                emails: z
                    .array(
                        z.object({
                            type: z.string(),
                            value: z
                                .string()
                                .nonempty({ message: 'Email is required' })
                                .email({ message: 'Invalid email address' }),
                            is_primary: z.boolean().optional(),
                            label: z.enum(['primary', 'alternate']).optional(),
                        }),
                    )
                    .min(1, { message: 'At least one email is required' }),
                phones: z
                    .array(
                        z.object({
                            type: z.string(),
                            value: z
                                .string()
                                .nonempty({ message: 'Phone is required' }),
                            is_primary: z.boolean().optional(),
                            label: z.enum(['primary', 'alternate']).optional(),
                        }),
                    )
                    .min(1, { message: 'At least one phone is required' }),
                address: z.string().optional(),
                instruments: z
                    .array(z.union([z.string(), z.number()]))
                    .min(1, { message: 'At least one instrument is required' }),
            }),
        )
        .min(1, { message: 'At least one location is required' }),
})

export type LabFormSchema = z.infer<typeof labSchema>
