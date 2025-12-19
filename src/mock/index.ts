import { mock } from './MockAdapter'
import './fakeApi/commonFakeApi'
import './fakeApi/dashboardFakeApi'

mock.onAny().passThrough()
