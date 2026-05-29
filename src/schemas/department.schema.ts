import { z } from 'zod'
import { validatePrefixRule } from '@/utils/validation/prefixConfigValidation'

export const departmentSchema = z.object({
    name: z.string().min(1, { message: ' Name required' }),
    identifier: z
        .string()
        .min(1, { message: 'Prefix is required' })
        .superRefine(async (value, ctx) => {
            const errors = await validatePrefixRule('departments', value)

            errors.forEach((message) =>
                ctx.addIssue({ code: 'custom', message }),
            )
        }),
})

export type DepartmentFormSchema = z.infer<typeof departmentSchema>
