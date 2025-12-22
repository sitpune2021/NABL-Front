/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { useFieldArray } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/lab'
import { Button } from '@/components/ui'
import LocationsItems from './LocationsItems'

type LocationsSectionProps = FormSectionBaseProps & {
    zoneList: any[]
    clusterList: any[]
    locationList: any[]
    departmentList: any[]
    instrumentList: any[]
}

const LocationsSection = ({
    control,
    errors,
    readOnly = false,
    zoneList,
    clusterList,
    locationList,
    departmentList,
    instrumentList,
}: LocationsSectionProps) => {
    const { fields, append } = useFieldArray({
        control,
        name: 'location',
    })

    const handleAddLocation = () => {
        append({
            zone_name: '',
            cluster_name: '',
            location_name: '',
            departments: [{ name: '', instruments: [] }],
            prefix: '',
            shortName: '',
            emails: [{ type: 'email', value: '' }],
            instruments: [],
            phones: [{ type: 'phone', value: '' }],
            address: '',
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
                            onClick={handleAddLocation}
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
                    zoneList={zoneList}
                    clusterList={clusterList}
                    locationList={locationList}
                    departmentList={departmentList}
                    instrumentList={instrumentList}
                />
            ))}
        </>
    )
}

export default LocationsSection
