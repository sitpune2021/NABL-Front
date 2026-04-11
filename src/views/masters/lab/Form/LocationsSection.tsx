import Card from '@/components/ui/Card'
import { useFieldArray, useWatch } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import { Button } from '@/components/ui'
import LocationsItems from './LocationsItems'
import { HiPlus } from 'react-icons/hi'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const LocationsSection = ({
    control,
    errors,
    readOnly = false,
}: FormSectionBaseProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'location',
    })

    const locationLimit = useWatch({
        control,
        name: 'location_limit',
    })

    const maxLocations = Number(locationLimit) || 0
    const isLimitReached = fields.length >= maxLocations

    const handleAddLocation = () => {
        if (isLimitReached) {
            toast.push(
                <Notification type="warning">
                    Maximum {maxLocations} locations allowed. You cannot add
                    more.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            return
        }

        append({
            id: null,
            zone_id: '',
            cluster_id: '',
            location_id: '',
            departments: [{ id: null, name: '', instruments: [] }],
            prefix: '',
            shortName: '',
            emails: [{ id: null, user_id: null, type: 'email', value: '' }],
            instruments: [],
            phones: [{ id: null, user_id: null, type: 'phone', value: '' }],
        })
    }

    return (
        <>
            <Card>
                <div className="flex items-center justify-between gap-2">
                    <h4>Locations</h4>
                    {!readOnly && (
                        <Button
                            type="button"
                            size="xs"
                            icon={<HiPlus />}
                            variant="solid"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={handleAddLocation}
                        />
                    )}
                </div>
                {!readOnly && isLimitReached && (
                    <p className="text-xs text-red-500 mt-2">
                        Maximum {maxLocations} locations reached
                    </p>
                )}
            </Card>

            {fields.map((item, index) => (
                <LocationsItems
                    key={item.id}
                    control={control}
                    errors={errors}
                    readOnly={readOnly}
                    index={index}
                    item={item}
                    removeLocation={remove}
                />
            ))}
        </>
    )
}

export default LocationsSection
