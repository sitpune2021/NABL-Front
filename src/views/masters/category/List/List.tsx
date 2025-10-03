import ListLayout from '@/components/layouts/ListLayout'
import CategoryListTableTools from './components/ListTableTools'
import CategoryListSelected from './components/ListSelected'
import CategoryListTable from './components/ListTable'
import { TbTemplate } from 'react-icons/tb'
import { ActionButton, PrefixFormSchema } from '@/@types/common'
import endpointConfig from '@/configs/endpoint.config'
import { useState } from 'react'
import { Button, Notification, toast } from '@/components/ui'
import usePrefixCategory from './hooks/usePrefixList'
import sleep from '@/utils/sleep'
import PrefixCategoryForm from '@/components/shared/FormPrefix'
import { useNavigate } from 'react-router'

const CategoryList = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { prefixCategory, savePrefixCategory } = usePrefixCategory()
    const [isSubmiting, setIsSubmiting] = useState(false)
    const navigate = useNavigate()

    const hasPrefix = (() => {
        if (Array.isArray(prefixCategory)) {
            return (
                prefixCategory.length > 0 && prefixCategory[0]?.prefix?.trim()
            )
        } else {
            return prefixCategory?.prefix
        }
    })()

    const handleAddNewCategoryClick = (event: React.MouseEvent) => {
        if (!hasPrefix) {
            event.preventDefault() // prevent navigation
            toast.push(
                <Notification type="success">
                    {'Please add prefix first!'}
                </Notification>,
                { placement: 'top-center' },
            )
        } else {
            navigate(endpointConfig.master.category.create)
        }
    }

    const actionButtons: ActionButton[] = [
        {
            label: 'Add new Category',
            icon: <TbTemplate className="text-xl" />,
            path: `${endpointConfig.master.category.create}`,
            disabled: !hasPrefix,
            action: handleAddNewCategoryClick,
        },
        {
            label: 'Add new Prefix',
            icon: <TbTemplate className="text-xl" />,
            path: `${endpointConfig.master.category.create}`,
            action: () => setDialogOpen(true),
        },
    ]

    const handleFormSubmit = async (values: PrefixFormSchema) => {
        setIsSubmiting(true)
        const payload = values
        await savePrefixCategory(payload)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">{'Category created!'}</Notification>,
            { placement: 'top-center' },
        )
        setDialogOpen(false)
    }

    return (
        <>
            <ListLayout
                title="Category"
                ActionTools={actionButtons}
                TableTools={<CategoryListTableTools />}
                Table={<CategoryListTable />}
                SelectedComponent={<CategoryListSelected />}
            />
            <PrefixCategoryForm
                defaultValues={
                    Array.isArray(prefixCategory)
                        ? (prefixCategory[0] ?? { prefix: '' })
                        : (prefixCategory ?? { prefix: '' })
                }
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                onFormSubmit={handleFormSubmit}
            >
                <Button variant="solid" type="submit" loading={isSubmiting}>
                    save
                </Button>
            </PrefixCategoryForm>
        </>
    )
}

export default CategoryList
