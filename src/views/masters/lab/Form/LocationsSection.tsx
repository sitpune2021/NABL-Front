import Card from '@/components/ui/Card'
import { useFieldArray } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import { Button } from '@/components/ui'
import LocationsItems from './LocationsItems'

const LocationsSection = ({
    control,
    errors,
    readOnly = false,
}: FormSectionBaseProps) => {
    const { fields, append } = useFieldArray({
        control,
        name: 'location',
    })

    return (
        <>
            <Card>
                <div className="flex items-center justify-between gap-2">
                    <h4>Locations</h4>
                    {!readOnly && (
                        <Button
                            type="button"
                            size="xs"
                            onClick={() =>
                                append({
                                    zone_name: '',
                                    cluster_name: '',
                                    location_name: '',
                                    departments: [
                                        { name: '', instruments: [] },
                                    ],
                                    prefix: '',
                                    shortName: '',
                                    emails: [{ value: '' }],
                                    instruments: [],
                                    phones: [{ value: '' }],
                                    address: '',
                                })
                            }
                        >
                            +
                        </Button>
                    )}
                </div>
            </Card>

            {fields.map((item, index) => (
                <LocationsItems
                    key={item.id}
                    control={control}
                    errors={errors}
                    readOnly={readOnly}
                    index={index}
                    item={item}
                />
            ))}
        </>
    )
}

export default LocationsSection
