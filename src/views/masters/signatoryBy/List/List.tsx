import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import SignatoryByListTableTools from './components/ListTableTools'
import SignatoryByListSelected from './components/ListSelected'
import SignatoryByListTable from './components/ListTable'

const SignatoryByList = () => {
    return (
        <ListLayout
            title="SignatoryBy"
            ActionTools={actionButtons}
            TableTools={<SignatoryByListTableTools />}
            Table={<SignatoryByListTable />}
            SelectedComponent={<SignatoryByListSelected />}
        />
    )
}

export default SignatoryByList
