/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiClause = {
    id: number
    parent_id: number | null
    note_message?: string
    documents?: any[]
    children?: ApiClause[]
}

export const flattenClauses = (clauses: ApiClause[]): ApiClause[] =>
    clauses.flatMap((c) => [
        c,
        ...(c.children?.length ? flattenClauses(c.children) : []),
    ])
