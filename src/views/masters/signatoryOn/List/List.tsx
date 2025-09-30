import ListLayout from '@/components/layouts/ListLayout'
import { actionButtons } from './actionButtons'
import SignatoryOnListTableTools from './components/ListTableTools'
import SignatoryOnListSelected from './components/ListSelected'
import SignatoryOnListTable from './components/ListTable'

const SignatoryOnList = () => {
    return (
        <ListLayout
            title="SignatoryOn"
            ActionTools={actionButtons}
            TableTools={<SignatoryOnListTableTools />}
            Table={<SignatoryOnListTable />}
            SelectedComponent={<SignatoryOnListSelected />}
        />
    )
}

export default SignatoryOnList
