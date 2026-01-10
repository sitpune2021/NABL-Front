/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui'
import SettingsLocationItems from './SettingsLocationItems'
import { FormSectionBaseProps } from '@/@types/user'

type Props = FormSectionBaseProps & {
    zoneList: any[]
    clusterList: any[]
    locationList: any[]
    departmentList: any[]
    instrumentList: any[]
}

const SettingsLocationSection = ({
    control,
    errors,
    readOnly = false,
    setValue,
    zoneList,
    clusterList,
    locationList,
    departmentList,
}: Props) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'userRoles',
    })

    const canRemove = fields.length > 1

    const addNewLocation = () => {
        append({
            zone_id: '',
            cluster_id: '',
            location_id: '',
            department: [
                {
                    department_id: '',
                    roles: [],
                },
            ],
        })
    }

    return (
        <Card>
            <div className="flex items-center justify-between gap-2 mb-4">
                <h4>Location Assignments</h4>

                {!readOnly && (
                    <Button type="button" size="xs" onClick={addNewLocation}>
                        +
                    </Button>
                )}
            </div>

            {fields.map((_, index) => (
                <SettingsLocationItems
                    key={index}
                    control={control}
                    errors={errors}
                    readOnly={readOnly}
                    index={index}
                    setValue={setValue}
                    zoneList={zoneList}
                    clusterList={clusterList}
                    locationList={locationList}
                    departmentList={departmentList}
                    onRemove={
                        !readOnly && canRemove ? () => remove(index) : undefined
                    }
                />
            ))}
        </Card>
    )
}

export default SettingsLocationSection
