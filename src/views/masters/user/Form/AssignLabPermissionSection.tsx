import Card from '@/components/ui/Card'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/user'
import { Button } from '@/components/ui'
import AssignLabPermissionItem from './AssignLabPermissionItem'
import { UserSchemaType } from '@/schemas/user.schema'
import { HiPlus } from 'react-icons/hi'
import { useState } from 'react'

const AssignLabPermissionSection = ({
    readOnly = false,
    loading,
}: FormSectionBaseProps) => {
    const {
        control,
        formState: { errors },
        setValue,
    } = useFormContext<UserSchemaType>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'userRoles',
    })

    const canRemove = fields.length > 1
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const addNewRole = () => {
        append({
            zone_id: '',
            cluster_id: '',
            location_id: '',
            department: [
                {
                    department_id: '',
                    roles: [],
                    // permissions: {},
                },
            ],
        })
    }

    return (
        <Card>
            <div className="sticky top-[68px] z-40 py-2 flex items-center justify-between gap-2 mb-4">
                <h4></h4>
                {!readOnly && (
                    <Button
                        size="sm"
                        type="button"
                        disabled={readOnly}
                        className="shadow-sm border border-gray-200"
                        onClick={addNewRole}
                    >
                        <HiPlus className="text-lg" />
                    </Button>
                )}
            </div>

            {fields.map((field, index) => (
                <AssignLabPermissionItem
                    key={field.id} // use index if no stable id
                    control={control}
                    errors={errors}
                    readOnly={readOnly || loading}
                    index={index}
                    setValue={setValue}
                    openIndex={openIndex} // Pass which one is open
                    onRemove={
                        !readOnly && canRemove ? () => remove(index) : undefined
                    }
                    onOpenChange={setOpenIndex}
                />
            ))}
        </Card>
    )
}

export default AssignLabPermissionSection
