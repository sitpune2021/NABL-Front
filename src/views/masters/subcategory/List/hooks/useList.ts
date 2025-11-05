import {
    apiSubCategory,
    apiGetSubCategoryList,
    apiGetSubCategoryById,
    apiUpdateSubCategory,
} from '@/services/SubCategoryService'
import useSWR from 'swr'
import { useSubCategoryListStore } from '../store/listStore'
import type { TableQueries } from '@/@types/common'
import { Fields, GetSubCategoryListResponse } from '@/@types/subcategory'

export default function useSubCategoryList() {
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
    const saveSubCategoryData = async (subcategory: Fields) => {
        if (subcategory.id) {
            await apiUpdateSubCategory(subcategory.id, subcategory)
        } else {
            await apiSubCategory(subcategory)
        }
        await mutate() // refresh list
    }

    const getSubCategoryById = async (id: string) => {
        const subcategory = await apiGetSubCategoryById(id)
        return subcategory
    }

    const subcategoryList = data?.data || []

    const subcategoryListTotal = data?.total || 0

    return {
        subcategoryList,
        subcategoryListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedSubCategory,
        setSelectedSubCategory,
        setSelectAllSubCategory,
        setFilterData,
        saveSubCategoryData,
        getSubCategoryById, // ✅ Now defined properly
    }
}
