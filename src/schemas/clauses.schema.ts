import { z } from 'zod'

// Document schema: version required only if a document is selected
export const ClauseDocumentSchema = z
    .object({
        id: z.union([
            z.coerce.number().int().optional(),
            z.coerce.string().optional(),
        ]),
        version_id: z.union([
            z.coerce.number().int().optional(),
            z.coerce.string().optional(),
        ]),
        label: z.string().optional(),
    })
    .refine(
        (doc) => {
            console.log(doc)

            if (doc.id) {
                return !!doc.version_id
            }
            return true
        },
        {
            message: 'Version is required',
            path: ['version_id'],
        },
    )

// Category schema: category required only if a document is selected
export const ClauseDocumentTaggingSchema = z
    .object({
        category_id: z.union([
            z.coerce.number().int().optional(),
            z.coerce.string().optional(),
        ]),
        documents: ClauseDocumentSchema.optional(),
    })
    .refine(
        (data) => {
            if (data.documents?.id) {
                return !!data.category_id
            }
            return true
        },
        {
            message: 'Category is required',
            path: ['category_id'],
        },
    )

// Clause schema: allows empty document rows
export const StandardClauseSchema = z.object({
    clause_id: z.coerce.number().int().positive(),
    clause_parent_id: z.preprocess(
        (val) => (val === null || val === '' || val === 0 ? undefined : val),
        z.coerce.number().int().optional(),
    ),
    notes: z.string().optional(),
    clause_documents_tagging: z.array(ClauseDocumentTaggingSchema),
})

// Main schema
export const ClausesSchema = z.object({
    standard_id: z.number().int().positive(),
    standard_clauses: z
        .array(StandardClauseSchema)
        .min(1, 'At least one clause is required'),
})

export type ClausesFormSchema = z.infer<typeof ClausesSchema>
