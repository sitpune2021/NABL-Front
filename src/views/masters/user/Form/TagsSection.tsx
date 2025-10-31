import { FormSectionBaseProps } from '@/@types/user'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { Controller } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import useRolesList from '../../roles/List/hooks/useList'
import { Roles } from '@/@types/roles'
import { FormItem } from '@/components/ui'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import AssignRoleModal from './AssignRoleModal'

type TagsSectionProps = FormSectionBaseProps

type OptionType = {
    value: string
    label: string
}

const TagsSection = ({ control, errors, readOnly }: TagsSectionProps) => {
    const { rolesList } = useRolesList()
    const [openModal, setOpenModal] = useState(false)

    const defaultOptions: OptionType[] = rolesList.map((role: Roles) => ({
        value: role.name,
        label: role.name.toUpperCase(),
    }))

    return (
        <Card>
            <h4 className="mb-2">Roles</h4>

            <div className="mt-6">
                <FormItem
                    invalid={Boolean(errors.role)}
                    errorMessage={errors.role?.message}
                >
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select<OptionType, true>
                                isMulti
                                {...field}
                                isClearable
                                placeholder="Add roles..."
                                componentAs={CreatableSelect}
                                value={field.value || []}
                                options={defaultOptions}
                                isDisabled={readOnly}
                                onChange={(option) => field.onChange(option)}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <div className="mt-6 text-center">
                <Button variant="default" onClick={() => setOpenModal(true)}>
                    + Assign Role
                </Button>
            </div>

            <AssignRoleModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
            />
        </Card>
    )
}

export default TagsSection
