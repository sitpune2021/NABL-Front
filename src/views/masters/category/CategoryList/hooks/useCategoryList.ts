import { apiCategory, apiGetCategoryList } from '@/services/TemplateListService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { CategoryAdd, GetCategoryListResponse } from '../types'
import type { TableQueries } from '@/@types/common'

export default function useCategoryList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/category', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) =>
            apiGetCategoryList<GetCategoryListResponse, TableQueries>(params),
        {
            revalidateOnFocus: false,
        },
    )
    const saveCategoryData = async (category: CategoryAdd) => {
        await apiCategory(category)
        await mutate() // refresh list
    }

    const customerList = data?.list || []

    const customerListTotal = data?.total || 0

    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
        saveCategoryData,
    }
}
