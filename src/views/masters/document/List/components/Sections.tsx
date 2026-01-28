/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from '@/components/ui'
import DynamicForm from './DynamicForm'
import { FormFieldConfig } from '@/@types/document'

const Section = ({
    title,
    fields,
    readOnly = false,
    editorExtras = {},
}: {
    title: string
    fields: FormFieldConfig[]
    readOnly: boolean | undefined
    editorExtras?: Record<string, any>
}) => (
    <Card>
        <h4 className="mb-6">{title}</h4>
        <div className="grid md:grid-cols-2 gap-4">
            <DynamicForm
                fields={fields}
                readOnly={readOnly}
                extraProps={editorExtras}
            />
        </div>
    </Card>
)
export default Section
