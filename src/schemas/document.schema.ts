import { z } from 'zod'

export const documentSchema = z.object({
    id: z.union([z.null(), z.number(), z.any()]),
    // From documentFieldOne
    mode: z.enum(['create', 'upload']).optional(),
    category_id: z.union([
        z.string().min(1, 'Category is required'),
        z.number(),
    ]),
    department: z.array(z.union([z.string(), z.number()])).optional(),
    number: z.string(),
    name: z.string().min(1, 'Document Name is required'),
    status: z.enum(['controlled', 'uncontrolled']),

    // From documentFieldTwo
    header: z
        .object({
            template_id: z.union([z.string(), z.number()]),
            type: z.literal('header'),
            current_version: z.string(),
        })
        .optional(),
    footer: z
        .object({
            template_id: z.union([z.string(), z.number()]),
            type: z.literal('footer'),
            current_version: z.string(),
        })
        .optional(),
    copy_no: z.union([z.string(), z.number(), z.null()]).optional(),
    quantity_prepared: z
        .union([z.string(), z.number(), z.null()])
        .optional()
        .refine((val) => !val || Number(val) >= 0, {
            message: 'Quantity must be a positive number',
        }),

    // From documentFieldThree
    workflow_state: z.string().optional(),
    step_type: z.string().optional(),
    performed_date: z.union([z.string(), z.date()]), // can add date parsing later if needed
    effective_date: z.string().min(1, 'Effective Date is required'),
    review_frequency: z.enum(
        ['Weekly', 'Monthly', 'Yearly', ''],
        'Select frequency',
    ),
    notification_unit: z.string(),
    notification_value: z
        .union([z.string(), z.number()])
        .refine((val) => !val || Number(val) > 0, {
            message: 'Duration Value must be positive',
        }),
    editor_schema: z.any(),
    schedule: z.any(),
    form_fields: z.any(),
    amendment_reason: z.string().optional(),
    amendment_type: z.string().optional(),
})

export type DocumentFormSchema = z.infer<typeof documentSchema>
