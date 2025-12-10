import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useWatch } from 'react-hook-form'
import { FormSectionBaseProps } from '@/@types/cluster'
import useZoneList from '../../zone/List/hooks/useList'
import { Select } from '@/components/ui'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    const { zoneList } = useZoneList()
    const options = zoneList.map((zone) => ({
        label: zone.name,
        value: zone.id,
        prefix: zone.identifier, // make sure your API includes this
    }))

    const selectedZoneName = useWatch({ control, name: 'zone_id' })

    const selectedZone = options.find((z) => z.value === selectedZoneName)

    return (
        <Card>
            <h4 className="mb-6">Cluster</h4>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Zone Field */}
                <FormItem
                    label="Zone"
                    invalid={Boolean(errors.zone_id)}
                    errorMessage={errors.zone_id?.message}
                >
                    <Controller
                        name="zone_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select Zone"
                                options={options}
                                value={
                                    options.find(
                                        (o) => o.value === field.value,
                                    ) || null
                                }
                                isDisabled={readOnly}
                                onChange={(selected) => {
                                    field.onChange(
                                        selected ? selected.value : '',
                                    )
                                }}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Cluster Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Prefix"
                    invalid={Boolean(errors.identifier)}
                    errorMessage={errors.identifier?.message}
                >
                    <Controller
                        name="identifier"
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Prefix"
                                value={
                                    selectedZone?.prefix
                                        ? `${selectedZone.prefix}-${(value || '').replace(`${selectedZone.prefix}-`, '')}`
                                        : value || ''
                                }
                                onChange={(e) => {
                                    const inputValue = e.target.value
                                    const cleanedValue = selectedZone?.prefix
                                        ? inputValue.replace(
                                              `${selectedZone.prefix}-`,
                                              '',
                                          )
                                        : inputValue
                                    onChange(
                                        selectedZone?.prefix
                                            ? `${selectedZone.prefix}-${cleanedValue}`
                                            : cleanedValue,
                                    )
                                }}
                                {...rest}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
