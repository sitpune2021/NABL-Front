import ListLayout from '@/components/layouts/ListLayout'
import DepartmentListTableTools from './components/ListTableTools'
import DepartmentListSelected from './components/ListSelected'
import DepartmentListTable from './components/ListTable'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import usePrefixDepartment from './hooks/usePrefixList'
import { Button, Notification, toast } from '@/components/ui'
import endpointConfig from '@/configs/endpoint.config'
import { ActionButton, PrefixFormSchema } from '@/@types/common'
import { TbTemplate } from 'react-icons/tb'
import sleep from '@/utils/sleep'
import PrefixForm from '@/components/shared/FormPrefix'

const DepartmentList = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { prefixDepartment, savePrefixDepartment } = usePrefixDepartment()
    const [isSubmiting, setIsSubmiting] = useState(false)
    const navigate = useNavigate()

    const hasPrefix = (() => {
        if (Array.isArray(prefixDepartment)) {
            return (
                prefixDepartment.length > 0 &&
                prefixDepartment[0]?.prefix?.trim()
            )
        } else {
            return prefixDepartment?.prefix
        }
    })()

    const handleAddNewDepartmentClick = (event: React.MouseEvent) => {
        if (!hasPrefix) {
            event.preventDefault() // prevent navigation
            toast.push(
                <Notification type="success">
                    {'Please add prefix first!'}
                </Notification>,
                { placement: 'top-center' },
            )
        } else {
            navigate(endpointConfig.master.department.create)
        }
    }

    const handleFormSubmit = async (values: PrefixFormSchema) => {
        setIsSubmiting(true)
        const payload = values
        await savePrefixDepartment(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">{'Department created!'}</Notification>,
            { placement: 'top-center' },
        )
        setDialogOpen(false)
    }

    const actionButtons: ActionButton[] = [
        {
            label: 'Add new Department',
            icon: <TbTemplate className="text-xl" />,
            path: `${endpointConfig.master.department.create}`,
            disabled: !hasPrefix,
            action: handleAddNewDepartmentClick,
        },
        {
            label: 'Add new Prefix',
            icon: <TbTemplate className="text-xl" />,
            path: `${endpointConfig.master.department.create}`,
            action: () => setDialogOpen(true),
        },
    ]
    return (
        <>
            <ListLayout
                title="Department"
                ActionTools={actionButtons}
                TableTools={<DepartmentListTableTools />}
                Table={<DepartmentListTable />}
                SelectedComponent={<DepartmentListSelected />}
            />
            <PrefixForm
                defaultValues={
                    Array.isArray(prefixDepartment)
                        ? (prefixDepartment[0] ?? { prefix: '' })
                        : (prefixDepartment ?? { prefix: '' })
                }
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                onFormSubmit={handleFormSubmit}
            >
                <Button variant="solid" type="submit" loading={isSubmiting}>
                    save
                </Button>
            </PrefixForm>
        </>
    )
}

export default DepartmentList
