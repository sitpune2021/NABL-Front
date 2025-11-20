/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { DocumentFormSchema, EditorFormSchema } from '@/@types/document'
import GrapesEditor from './GrapesEditor'
import { useParams } from 'react-router'

export function findThDetails(components: any): any[] {
    const results: any[] = []
    const models = components?.models || components || []

    models.forEach((comp: any) => {
        const tagName = comp.get?.('tagName') || comp.tagName
        const compType = comp.get?.('type') || comp.type
        const innerComps = comp.components?.() || comp.components || []

        if (tagName === 'th') {
            // Get traits (name + value)
            const traits = comp.get?.('traits') || comp.traits || []
            const traitData = traits.map((t: any) => {
                const name = t.get?.('name') || t.name
                const value =
                    t.get?.('value') ||
                    t.attributes?.value ||
                    t.attributes?.default ||
                    ''
                return { name, value }
            })

            // ✅ Get header text from nested <span> dynamically
            let headerText = ''

            if (innerComps && innerComps.length > 0) {
                const spanChild = innerComps.find(
                    (child: any) =>
                        (child.get?.('tagName') || child.tagName) === 'span' ||
                        (child.get?.('type') || child.type) === 'text',
                )

                if (spanChild) {
                    // Force sync content from live model
                    headerText =
                        spanChild.get?.('content') ||
                        spanChild.view?.el?.innerText ||
                        spanChild.content ||
                        ''
                }
            }

            results.push({
                componentType: 'th', // To distinguish
                headerText: headerText.trim(),
                traits: traitData,
            })
        } else if (compType === 'text-block') {
            // Handle text-block components
            // Get traits (name + value)
            const traits = comp.get?.('traits') || comp.traits || []
            const traitData = traits.map((t: any) => {
                const name = t.get?.('name') || t.name
                const value =
                    t.get?.('value') ||
                    t.attributes?.value ||
                    t.attributes?.default ||
                    ''
                return { name, value }
            })

            // Check if 'mode' is 'dynamic' (only extract if true)
            const modeTrait = traitData.find((t: any) => t.name === 'mode')
            if (modeTrait && modeTrait.value === 'dynamic') {
                // Define defaults for text components
                const defaultTraits = {
                    tagName: 'p', // Default tagName
                    mode: 'static', // Default mode
                }

                // Convert traitData array to an object for easy merging
                const traitObj: { [key: string]: any } = {}
                traitData.forEach((t: any) => {
                    traitObj[t.name] = t.value
                })

                // Merge defaults into the trait object
                const mergedTraits = { ...defaultTraits, ...traitObj }

                // Convert back to array format
                const finalTraitData = Object.entries(mergedTraits).map(
                    ([name, value]) => ({
                        name,
                        value,
                    }),
                )

                // Get content for text components
                const content = comp.get?.('content') || comp.content || ''

                results.push({
                    componentType: 'text-block', // To distinguish
                    tagName,
                    content: content.trim(),
                    traits: finalTraitData,
                })
            }
        }

        // Recursive call
        if (innerComps?.length) {
            results.push(...findThDetails(innerComps))
        }
    })

    return results
}

type DocumentFormProps = {
    onFormSubmit: (values: DocumentFormSchema & EditorFormSchema) => void
    defaultValues?: Partial<DocumentFormSchema> & Partial<EditorFormSchema>
    newDocument?: boolean
    readOnly?: boolean
    isEditor?: boolean
    documentData?: DocumentFormSchema | null
    isEdit?: boolean
} & CommonProps
const validationSchema = z.object({
    labName: z.string().min(1, 'Lab Name is required'),
    location: z.string().optional(),
    department: z.array(z.string()).optional(),
    header: z.union([z.string(), z.number()]).optional(),
    footer: z.union([z.string(), z.number()]).optional(),
    category: z.string().optional(),
    documentName: z.string().min(1, 'Document Name is required'),
    documentNo: z.string().optional(),
    issuedNo: z.string().optional(),
    amendmentNo: z.string().optional(),
    copyNo: z.string().optional(),
    date: z.string().optional(),
    preparedByDate: z.string().optional(),
    time: z.string().optional(),
    preparedBy: z.string().min(1, 'Prepared By is required'),
    quantityPrepared: z
        .union([z.string(), z.number()])
        .optional()
        .refine((val) => !val || Number(val) >= 0, {
            message: 'Quantity must be a positive number',
        }),
    approvedBy: z.string().min(1, 'Approved By is required'),
    issuedBy: z.string().optional(),
    issueDate: z.string().min(1, 'Issue Date is required'),
    amendmentDate: z.string().optional(),
    effectiveDate: z.string().min(1, 'Effective Date is required'),
    frequency: z.string().optional(),
    duration: z.string().optional(),
    durationUnit: z.string().optional(),
    durationValue: z.string().optional(),
    prefix: z.string().optional(),
    status: z.enum(['Controlled', 'Uncontrolled']).optional(),
})

const editorSchema = z.object({
    documentId: z.string().min(1, 'Document ID is required'),
    document: z.any(),
})

const DocumentForm = ({
    onFormSubmit,
    defaultValues = {},
    readOnly = false,
    children,
    isEditor = false,
    isEdit = false,
    documentData,
}: DocumentFormProps) => {
    const { id: documentId } = useParams()

    const formMethods = useForm<DocumentFormSchema | EditorFormSchema>({
        defaultValues: isEditor
            ? isEdit
                ? ({
                      documentId: documentId ?? '',
                      document: defaultValues.document,
                  } as EditorFormSchema)
                : ({
                      documentId: documentId ?? '',
                      document: {
                          html: '',
                          css: '',
                          json: '',
                      },
                  } as EditorFormSchema)
            : (defaultValues as DocumentFormSchema),
        resolver: zodResolver(
            isEditor ? editorSchema : validationSchema,
        ) as any,
    })

    const { handleSubmit, reset, formState, control, setValue } = formMethods
    const { errors } = formState
    const memoizedDefaults = useMemo(() => defaultValues, [defaultValues])

    useEffect(() => {
        if (memoizedDefaults && Object.keys(memoizedDefaults).length > 0) {
            reset(memoizedDefaults)
        }
    }, [memoizedDefaults, reset])

    const onSubmit = (values: DocumentFormSchema | EditorFormSchema) => {
        // const docJson = values.document?.json
        // // console.log("TH Element docJson:", docJson);
        // const thTraits = findThDetails(docJson)
        // console.log('TH traits:', thTraits)
        onFormSubmit?.(values as DocumentFormSchema & EditorFormSchema)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div
                        className={`flex flex-col flex-auto gap-4 ${isEditor ? 'items-center' : ''}`}
                    >
                        {isEditor ? (
                            <GrapesEditor
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                setValue={setValue}
                                documentData={documentData}
                                isEdit={isEdit}
                            />
                        ) : (
                            <OverviewSection
                                control={control}
                                errors={errors}
                                readOnly={readOnly}
                                setValue={setValue}
                            />
                        )}
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default DocumentForm
