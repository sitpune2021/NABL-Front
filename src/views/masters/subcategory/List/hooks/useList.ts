/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    apiSubCategory,
    apiGetSubCategoryList,
    apiGetSubCategoryById,
    apiUpdateSubCategory,
} from '@/services/SubCategoryService'
import useSWR from 'swr'
import { useSubCategoryListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import {
    Fields,
    GetSubCategoryListResponse,
    GetSubCategoryDetailResponse,
} from '@/@types/subcategory'

export default function useSubCategoryList(subCategoryId?: string) {
    const {
        tableData,
        filterData,
        setTableData,
        selectedSubCategory,
        setSelectedSubCategory,
        setSelectAllSubCategory,
        setFilterData,
    } = useSubCategoryListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/subcategory', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetSubCategoryList<GetSubCategoryListResponse, TableQueries>(
                params,
            ),
        {
            revalidateOnFocus: false,
        },
    )

    const {
        data: detailData,
        error: detailError,
        isLoading: isDetailLoading,
        mutate: mutateDetail,
    } = useSWR<GetSubCategoryDetailResponse>(
        subCategoryId ? `/api/subcategory/${subCategoryId}` : null,
        () => apiGetSubCategoryById(subCategoryId!),
        { revalidateOnFocus: false },
    )

    const saveSubCategoryData = async (subcategory: Fields) => {
        let savedData: any
        if (subcategory.id) {
            /* eslint-disable @typescript-eslint/no-unused-vars */
            const { id, ...subcategoryWithoutId } = subcategory
            savedData = await apiUpdateSubCategory(
                subcategory.id,
                subcategoryWithoutId,
            )
        } else {
            savedData = await apiSubCategory(subcategory)
        }
        await mutate()
        if (subcategory.id && mutateDetail) {
            mutateDetail({ data: savedData }, false)
        }
        return savedData
    }

    const subcategoryList = data?.data || []

    const subcategoryListTotal = data?.total || 0

    const subCategoryDetail = detailData?.data || {
        name: '',
        cat_id: '',
        identifier: '',
    }

    return {
        subcategoryList,
        subcategoryListTotal,
        error,
        isLoading,
        subCategoryDetail,
        isDetailLoading,
        detailError,
        mutateDetail,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedSubCategory,
        setSelectedSubCategory,
        setSelectAllSubCategory,
        setFilterData,
        saveSubCategoryData,
    }
}
