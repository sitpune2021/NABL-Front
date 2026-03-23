/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'

export const standardItemSchema: z.ZodType<any> = z.lazy(() =>
    z
        .object({
            title: z.string().min(1, 'Title is required'),
            message: z.string().min(1, 'Message is required'),
            note: z.boolean(),
            is_child: z.boolean(),
            children_count: z
                .number()
                .min(0, { message: 'Count must be 0 or greater' }),
            children: z.array(standardItemSchema).optional(),
            numbering_type: z.union([z.number(), z.string()]),
            numbering_value: z.union([z.number(), z.string()]),
        })
        .superRefine((data, ctx) => {
            if (
                data.is_child &&
                (!data.children || data.children.length === 0)
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Children are required when is_child is true',
                    path: ['children'],
                })
            }
        }),
)

export type StandardChildFormSchema = z.infer<typeof standardItemSchema>

export const standardSchema = z.object({
    uuid: z
        .string()
        .uuid()
        .default(() => crypto.randomUUID()),
    name: z.string().min(1, { message: 'Name is required' }),
    clauses: z
        .array(standardItemSchema)
        .min(1, { message: 'At least one clauses is required' }),
})

export type StandardFormSchema = z.infer<typeof standardSchema>
