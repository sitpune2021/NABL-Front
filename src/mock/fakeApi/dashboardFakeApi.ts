import { mock } from '../MockAdapter'
import { eCommerceData } from '../data/dashboardData'

mock.onGet(`/api/v1/dashboard/ecommerce`).reply(() => {
    return [200, eCommerceData]
})
