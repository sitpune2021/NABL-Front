/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'

import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'

import TextField from '@/components/form/fields/TextField'
import SelectField from '@/components/form/fields/SelectField'

import { PrefixFormSchema, prefixSchema } from '@/schemas/prefix.schema'

import type { CommonProps } from '@/@types/common'

import { apiGetPrefixMasters } from '@/services/prefixService'

const PREFIX_TYPES = [
    {
        label: 'Capital Only',
        value: 'CAPITAL',
    },
    {
        label: 'Numeric',
        value: 'NUMERIC',
    },
    {
        label: 'Alphanumeric',
        value: 'ALPHANUMERIC',
    },
    {
        label: 'Custom',
        value: 'CUSTOM',
    },
]

type PrefixFormProps = {
    onFormSubmit: (values: PrefixFormSchema) => void
    defaultValues: PrefixFormSchema
    readOnly?: boolean
} & CommonProps

const PrefixForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: PrefixFormProps) => {
    const [masterOptions, setMasterOptions] = useState<any[]>([])

    useEffect(() => {
        loadMasters()
    }, [])

    const loadMasters = async () => {
        try {
            const res = await apiGetPrefixMasters()

            setMasterOptions(res.data || [])
        } catch (error) {
            console.error(error)

            setMasterOptions([])
        }
    }

    return (
        <MasterForm
            schema={prefixSchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <FormSectionLayout title="Prefix Config">
                            <SelectField
                                name="prefix_master"
                                label="For Which Master"
                                options={masterOptions}
                                readOnly={readOnly}
                            />

                            <SelectField
                                name="type"
                                label="Type"
                                options={PREFIX_TYPES}
                                readOnly={readOnly}
                            />

                            <TextField
                                name="min_length"
                                label="Min Length"
                                type="number"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="max_length"
                                label="Max Length"
                                type="number"
                                readOnly={readOnly}
                            />
                        </FormSectionLayout>
                    </div>
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>
        </MasterForm>
    )
}

export default PrefixForm
