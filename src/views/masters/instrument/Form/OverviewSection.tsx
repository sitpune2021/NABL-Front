import { memo } from 'react'
import Card from '@/components/ui/Card'
import TextField from '@/components/form/fields/TextField'

type OverviewSectionProps = {
    readOnly?: boolean
}
const OverviewSection = ({ readOnly }: OverviewSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Instrument</h4>

            <div className="grid md:grid-cols-2 gap-4">
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
            </div>
        </Card>
    )
}

export default memo(OverviewSection)
