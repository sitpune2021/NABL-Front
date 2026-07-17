import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { apiGetCategoryList } from '@/services/CategoriesService'
import { useCategoryDetail } from '@/views/masters/category/List/hooks/useCategoryDetail'
import { initialTableData } from '@/views/masters/category/List/store/listStore'
import { mapToOptions } from '@/helpers/optionMappers'
import type { Category, GetCategoryListResponse } from '@/@types/category'
import type { TableQueries } from '@/@types/common'

const DOCUMENT_CATEGORY_OPTIONS_KEY = 'document-category-options'

const mergeById = <T extends { id?: string | number }>(items: T[]) =>
    Array.from(
        new Map(
            items
                .filter((item) => item.id !== undefined)
                .map((item) => [String(item.id), item]),
        ).values(),
    )

export const useDocumentCategoryOptions = (
    selectedCategoryId?: string | number,
) => {
    const [tableData, setTableData] = useState<TableQueries>({
        ...initialTableData,
        pageSize: 20,
        query: '',
    })
    const [record, setRecord] = useState<Category[]>([])

    const swr = useSWR(
        [DOCUMENT_CATEGORY_OPTIONS_KEY, tableData],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCategoryList<GetCategoryListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const { data: selectedCategory } = useCategoryDetail(
        selectedCategoryId ? String(selectedCategoryId) : undefined,
    )

    useEffect(() => {
        if (!swr.data?.data) return

        setRecord((prev) => {
            if (tableData.pageIndex === 1) {
                return mergeById(swr.data.data)
            }

            return mergeById([...prev, ...swr.data.data])
        })
    }, [swr.data, tableData.pageIndex])

    const categoryList = useMemo(() => {
        if (!selectedCategory?.id) return record

        return mergeById([selectedCategory as Category, ...record])
    }, [record, selectedCategory])

    const categoryOptions = useMemo(
        () =>
            mapToOptions(categoryList, {
                value: 'id',
                label: (category) =>
                    `${category.name.toUpperCase()} - ${category.identifier}`,
            }),
        [categoryList],
    )

    const loadMoreCategories = useCallback(() => {
        setTableData((prev) => ({
            ...prev,
            pageIndex: (prev.pageIndex ?? 1) + 1,
        }))
    }, [])

    return {
        categoryList,
        categoryOptions,
        hasMore: record.length < (swr.data?.total ?? 0),
        isLoading: swr.isLoading || swr.isValidating,
        loadMoreCategories,
    }
}
