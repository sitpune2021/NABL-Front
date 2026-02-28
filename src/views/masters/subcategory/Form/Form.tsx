import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import type { CommonProps } from '@/@types/common'
import {
    SubCategoryFormSchema,
    subCategorySchema,
} from '@/schemas/sub_category.schema'
import MasterForm from '@/components/form/MasterForm'
import FormSectionLayout from '@/components/layouts/FormSectionLayout'
import PrefixSelectField from '@/components/form/fields/PrefixSelectField'
import { useCategoryList } from '../../category/List/hooks/useList'
import { useCategoryDetail } from '../../category/List/hooks/useCategoryDetail'
import TextField from '@/components/form/fields/TextField'

type SubCategoryFormProps = {
    onFormSubmit: (values: SubCategoryFormSchema) => void
    defaultValues: SubCategoryFormSchema
    readOnly?: boolean
} & CommonProps

const SubCategoryForm = ({
    onFormSubmit,
    defaultValues,
    readOnly = false,
    children,
}: SubCategoryFormProps) => {
    return (
        <MasterForm
            schema={subCategorySchema}
            defaultValues={defaultValues}
            onSubmit={onFormSubmit}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <FormSectionLayout title="Sub Category">
                            <PrefixSelectField
                                fieldName="cat_id"
                                identifierField="identifier"
                                label="Category"
                                readOnly={readOnly}
                                useListHook={useCategoryList}
                                useDetailHook={useCategoryDetail}
                                mapOption={(item) => ({
                                    value: item.id,
                                    label: item.name.toUpperCase(),
                                    identifier: item.identifier,
                                })}
                            />

                            <TextField
                                name="name"
                                label="Sub Category"
                                placeholder="Enter Sub Category"
                                readOnly={readOnly}
                            />
                            <TextField
                                name="identifier"
                                label="Prefix"
                                placeholder="Enter Prefix"
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

export default SubCategoryForm
