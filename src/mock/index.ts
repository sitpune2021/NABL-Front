import { mock } from './MockAdapter'
import './fakeApi/authFakeApi'
import './fakeApi/commonFakeApi'
import './fakeApi/dashboardFakeApi'
import './fakeApi/tempFakeApi'

mock.onAny().passThrough()
