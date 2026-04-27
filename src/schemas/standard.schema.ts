import { z } from 'zod'

export interface StandardItem {
    id: number | string | null
    parent_id: number | string | null
    title: string
    message: string
    note: boolean
    is_child: boolean
    children_count: number
    children?: StandardItem[]
    numbering_type: number | string
    numbering_value: number | string
    depth: number
}

export const standardItemSchema: z.ZodType<StandardItem> = z.lazy(() =>
    z
        .object({
            id: z.union([z.null(), z.number(), z.string()]),
            parent_id: z.union([z.null(), z.number(), z.string()]),
            title: z.string().min(0, 'Title is required'),
            message: z.string().min(0, 'Message is required'),
            note: z.boolean(),
            is_child: z.boolean(),
            children_count: z
                .number()
                .min(0, { message: 'Count must be 0 or greater' }),
            children: z.array(standardItemSchema).optional(),
            numbering_type: z.union([z.number(), z.string()]),
            numbering_value: z.union([z.number(), z.string()]),
            depth: z.number().min(0),
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
