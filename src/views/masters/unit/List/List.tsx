import ListLayout from '@/components/layouts/ListLayout'
// import { actionButtons } from './actionButtons'
import UnitListTableTools from './components/ListTableTools'
import UnitListSelected from './components/ListSelected'
import UnitListTable from './components/ListTable'
import { ActionButton, PrefixFormSchema } from '@/@types/common'
import { TbTemplate } from 'react-icons/tb'
import endpointConfig from '@/configs/endpoint.config'
import sleep from '@/utils/sleep'
import { Button, Notification, toast } from '@/components/ui'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import PrefixForm from '@/components/shared/FormPrefix'
import usePrefixUnit from './hooks/usePrefixList'

const UnitList = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { prefixUnit, savePrefixUnit } = usePrefixUnit()
    const [isSubmiting, setIsSubmiting] = useState(false)
    const navigate = useNavigate()

    const hasPrefix = (() => {
        if (Array.isArray(prefixUnit)) {
            return prefixUnit.length > 0 && prefixUnit[0]?.prefix?.trim()
        } else {
            return prefixUnit?.prefix
        }
    })()

    const handleAddNewUnitClick = (event: React.MouseEvent) => {
        if (!hasPrefix) {
            event.preventDefault() // prevent navigation
            toast.push(
                <Notification type="success">
                    {'Please add prefix first!'}
                </Notification>,
                { placement: 'top-center' },
            )
        } else {
            navigate(endpointConfig.master.unit.create)
        }
    }

    const handleFormSubmit = async (values: PrefixFormSchema) => {
        setIsSubmiting(true)
        const payload = values
        await savePrefixUnit(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">{'Unit created!'}</Notification>,
            { placement: 'top-center' },
        )
        setDialogOpen(false)
    }

    const actionButtons: ActionButton[] = [
        {
            label: 'Add new Unit',
            icon: <TbTemplate className="text-xl" />,
            path: `${endpointConfig.master.unit.create}`,
            disabled: !hasPrefix,
            action: handleAddNewUnitClick,
        },
        {
            label: 'Add new Prefix',
            icon: <TbTemplate className="text-xl" />,
            path: `${endpointConfig.master.unit.create}`,
            action: () => setDialogOpen(true),
        },
    ]
    return (
        <>
            <ListLayout
                title="Unit"
                ActionTools={actionButtons}
                TableTools={<UnitListTableTools />}
                Table={<UnitListTable />}
                SelectedComponent={<UnitListSelected />}
            />

            <PrefixForm
                defaultValues={
                    Array.isArray(prefixUnit)
                        ? (prefixUnit[0] ?? { prefix: '' })
                        : (prefixUnit ?? { prefix: '' })
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

export default UnitList
