import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import {
    InstrumentFormSchema,
    instrumentSchema,
} from '@/schemas/instrument.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import TextField from '@/components/form/fields/TextField'

type InstrumentFormProps = {
    onFormSubmit: (values: InstrumentFormSchema) => void
    defaultValues: InstrumentFormSchema
    readOnly: boolean
} & CommonProps

const InstrumentForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: InstrumentFormProps) => {
    return (
        <MasterForm
            schema={instrumentSchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-4 flex-auto">
                        <FormSectionLayout title="Instrument">
                            <TextField
                                name="name"
                                label="Full Name"
                                placeholder="Enter Instrument"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="short_name"
                                label="Short Name"
                                placeholder="Enter Short Name"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="manufacturer"
                                label="Make (Manufacturer)"
                                placeholder="Enter Short Name"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="serial_no"
                                label="Serial Number"
                                placeholder="Enter Serial No"
                                readOnly={readOnly}
                            />

                            <TextField
                                name="identifier"
                                label="Prefix"
                                placeholder="Enter Prefix"
                                readOnly={readOnly}
                            />
                            <TextField
                                name="vendor_name"
                                label="Vendor Name"
                                placeholder="Enter Vendor Name"
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

export default InstrumentForm
