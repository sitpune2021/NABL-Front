/* eslint-disable @typescript-eslint/no-explicit-any */
const getAllDocuments = (clauses: any[], parentPath = ''): any[] => {
    const result: any[] = []

    clauses.forEach((clauseItem) => {
        // Build path
        const currentPath = parentPath
            ? `${parentPath} -> ${clauseItem.title}`
            : clauseItem.title

        // 1. Add documents with full path
        if (clauseItem.documents?.length) {
            const docs = clauseItem.documents.map((doc: any) => ({
                clauseId: clauseItem.id,
                clauseTitle: currentPath, // 👈 full path here
                ...doc,
            }))
            result.push(...docs)
        }

        // 2. Go deeper
        if (clauseItem.children?.length) {
            result.push(...getAllDocuments(clauseItem.children, currentPath))
        }
    })

    return result
}

export default getAllDocuments
