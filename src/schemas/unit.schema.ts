import { z } from 'zod'
// import { validatePrefixRule } from '@/utils/validation/prefixConfigValidation'

export const unitSchema = z.object({
    name: z.string().min(1, { message: ' Name required' }),
    // .superRefine(async (value, ctx) => {
    //     const errors = await validatePrefixRule('units', value)

    //     errors.forEach((message) =>
    //         ctx.addIssue({ code: 'custom', message }),
    //     )
    // }),
})

export type UnitFormSchema = z.infer<typeof unitSchema>
