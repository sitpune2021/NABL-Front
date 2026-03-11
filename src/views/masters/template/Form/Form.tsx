import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import GrapesEditor from './GrapesEditor'
import SaveBoxSection from './SaveBoxSection'

import type { CommonProps } from '@/@types/common'
import { TemplateFormSchema, templateSchema } from '@/schemas/template.schema'
import MasterForm from '@/components/form/MasterForm'

type TemplateFormProps = {
    onFormSubmit: (values: TemplateFormSchema) => void
    defaultValues?: TemplateFormSchema
    readOnly?: boolean
    dialogIsOpen: boolean
    onDialogClose: () => void
    isSubmiting: boolean
    isEdit: boolean
    loading: boolean
} & CommonProps

const TemplateForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
    dialogIsOpen,
    onDialogClose,
    isSubmiting,
    isEdit,
    loading,
}: TemplateFormProps) => {
    return (
        <MasterForm
            schema={templateSchema}
            defaultValues={defaultValues}
            className="flex w-full h-full px-4 sm:px-8"
            containerClassName="flex flex-col justify-between w-full h-full"
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row">
                    <div className="flex flex-col flex-auto -mx-4 sm:-mx-8">
                        <GrapesEditor readOnly={readOnly} />
                    </div>
                </div>
            </Container>

            <BottomStickyBar>{children}</BottomStickyBar>

            {!readOnly && (
                <SaveBoxSection
                    readOnly={readOnly}
                    loading={loading}
                    isEdit={isEdit}
                    dialogIsOpen={dialogIsOpen}
                    isSubmiting={isSubmiting}
                    onDialogClose={onDialogClose}
                    onSubmit={onFormSubmit}
                />
            )}
        </MasterForm>
    )
}

export default TemplateForm
