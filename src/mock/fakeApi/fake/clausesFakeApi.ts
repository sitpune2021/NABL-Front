/* eslint-disable @typescript-eslint/no-explicit-any */

import { mock } from '../../MockAdapter'
import { accordionData } from '../../data/clausesData'

// ✅ Fetch all clauses
mock.onGet('/api/clauses-data').reply(() => {
    return [200, accordionData]
})

// ✅ Fetch a single clause by title (optional feature)
mock.onGet(/\/api\/clauses\/.+/).reply((config) => {
    const title = config.url?.split('/').pop()
    const findClause = (items: any[]): any =>
        items.find(
            (item) =>
                item.title.toLowerCase() === title?.toLowerCase() ||
                (item.children && findClause(item.children)),
        )

    const clause = findClause(accordionData)
    if (clause) {
        return [200, clause]
    }
    return [404, { message: 'Clause not found' }]
})
