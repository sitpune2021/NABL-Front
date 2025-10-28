/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import useCategoryList from '../../category/List/hooks/useList'
import useDocumentList from '../../document/List/hooks/useList'
import StandardRecursiveSection from './StandardRecursiveSection'

const StandardSectionTwo = ({ control, errors, readOnly }: any) => {
    const { categoryList } = useCategoryList()
    const { documentList } = useDocumentList()

    const documentOptions = useMemo(
        () =>
            documentList.map((document: any) => ({
                value: document.documentName,
                label: document.documentName,
                category: document.category,
            })),
        [documentList],
    )

    const categoryOptions = categoryList.map(
        (category: { name: string; prefix: any }) => ({
            value: category.name,
            label: `${category.name.toUpperCase()} - ${category.prefix}`,
        }),
    )

    const getFilteredDocumentOptions = (selectedCategory: string) => {
        if (!selectedCategory) return documentOptions
        return documentOptions.filter(
            (doc: any) => doc.category === selectedCategory,
        )
    }

    const frequencyOptions = [
        { label: 'Daily', value: 'Daily' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Monthly', value: 'Monthly' },
    ]

    return (
        <StandardRecursiveSection
            control={control}
            name="standards"
            errors={errors}
            readOnly={readOnly}
            categoryOptions={categoryOptions}
            frequencyOptions={frequencyOptions}
            getFilteredDocumentOptions={getFilteredDocumentOptions}
            isRoot={true}
        />
    )
}

export default StandardSectionTwo
