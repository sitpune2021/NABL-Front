import { z } from 'zod'

export const labSchema = z.object({
    name: z.string().min(0, { message: 'Name is required' }),
    lab_type: z.string().min(0, { message: 'Lab Type is required' }),
    lab_code: z.string().min(0, { message: 'Lab Code is required' }),
    location_limit: z.union([z.string(), z.number()]),
    user_limit: z.union([z.string(), z.number()]),
    emails: z
        .array(
            z.object({
                id: z.union([z.null(), z.number(), z.any()]),
                user_id: z.union([z.null(), z.number()]),
                type: z.string(),
                value: z
                    .string()
                    .nonempty({ message: 'Email is required' })
                    .email({ message: 'Invalid email address' }),
                is_primary: z.boolean().optional(),
                label: z.enum(['primary', 'alternate']).optional(),
            }),
        )
        .min(0, { message: 'At least one email is required' }),
    phones: z
        .array(
            z.object({
                id: z.union([z.null(), z.number(), z.any()]),
                user_id: z.union([z.null(), z.number()]),
                type: z.string(),
                value: z.string().nonempty({ message: 'Phone is required' }),
                is_primary: z.boolean().optional(),
                label: z.enum(['primary', 'alternate']).optional(),
            }),
        )
        .min(0, { message: 'At least one phone is required' }),
    location: z
        .array(
            z.object({
                id: z.union([z.null(), z.number(), z.any()]),
                zone_id: z.union([z.string(), z.number()]),
                cluster_id: z.union([z.string(), z.number()]),
                location_id: z.union([z.string(), z.number()]),
                departments: z
                    .array(
                        z.object({
                            id: z.union([z.null(), z.number(), z.any()]),
                            name: z.union([z.string(), z.number()]),
                            instruments: z
                                .array(z.union([z.string(), z.number()]))
                                .min(0, {
                                    message:
                                        'At least one instrument is required per department',
                                }),
                        }),
                    )
                    .min(0, { message: 'At least one department is required' }),
                prefix: z.string(),
                shortName: z.string(),
                emails: z
                    .array(
                        z.object({
                            id: z.union([z.null(), z.number(), z.any()]),
                            user_id: z.union([z.null(), z.number()]),
                            type: z.string(),
                            value: z
                                .string()
                                .nonempty({ message: 'Email is required' })
                                .email({ message: 'Invalid email address' }),
                            is_primary: z.boolean().optional(),
                            label: z.enum(['primary', 'alternate']).optional(),
                        }),
                    )
                    .min(0, { message: 'At least one email is required' }),
                phones: z
                    .array(
                        z.object({
                            id: z.union([z.null(), z.number(), z.any()]),
                            user_id: z.union([z.null(), z.number()]),
                            type: z.string(),
                            value: z
                                .string()
                                .nonempty({ message: 'Phone is required' }),
                            is_primary: z.boolean().optional(),
                            label: z.enum(['primary', 'alternate']).optional(),
                        }),
                    )
                    .min(0, { message: 'At least one phone is required' }),
                instruments: z
                    .array(z.union([z.string(), z.number()]))
                    .min(0, { message: 'At least one instrument is required' }),
            }),
        )
        .min(0, { message: 'At least one location is required' }),
    documents: z.array(z.union([z.string(), z.number()])),
    standard: z.object({
        standard_id: z.union([z.number(), z.string()]).nullable().optional(),
        clause_documents_link: z
            .array(z.union([z.number(), z.string()]))
            .optional(),
    }),
})

export type LabFormSchema = z.infer<typeof labSchema>
