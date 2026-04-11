import { StandardItem } from '@/schemas/standard.schema'

export const flattenClauses = (clauses: StandardItem[]): StandardItem[] =>
    clauses.flatMap((c) => [
        c,
        ...(c.children?.length ? flattenClauses(c.children) : []),
    ])
