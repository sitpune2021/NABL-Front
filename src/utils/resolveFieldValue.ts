/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiGenerateDocumentNumber } from '@/services/DocumentService'

export function formatDate(dateStr: string, format: string): string {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr // Invalid date, return as-is

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const year = String(date.getFullYear())

    return format
        .replace(/dd/g, day)
        .replace(/MM/g, month)
        .replace(/yyyy/g, year)
}

export function resolveFieldValue(
    key: string,
    data: any,
    options: { [key: string]: string } = {},
): string {
    if (!data) return ''

    switch (key) {
        case 'date': {
            const dateType = options.datetype || 'issuedDate'
            let dateValue: string
            switch (dateType) {
                case 'issuedDate':
                    dateValue = data?.workflow?.issuedBy?.issued || ''
                    break
                case 'amendmentDate':
                    dateValue = data?.amendmentDate || ''
                    break
                case 'effectiveDate':
                    dateValue = data?.workflow?.effectiveBY?.effective || ''
                    break
                default:
                    dateValue = data?.genericDate || ''
                    break
            }
            if (options.format && dateValue) {
                return formatDate(dateValue, options.format)
            }
            return dateValue
        }
        case 'preparedBy': {
            const nameType = options.preparedbyfield || 'name'
            switch (nameType) {
                case 'name':
                    return data.workflow?.preparedBy?.name || ''
                case 'designation':
                    return data.workflow?.preparedBy?.designation || ''
                case 'signature':
                    return data.workflow?.preparedBy?.signature || ''
                default:
                    return ''
            }
        }
        case 'reviewedBy': {
            const nameType = options.reviewedByfield || 'name'
            switch (nameType) {
                case 'name':
                    return data.workflow?.reviewedBy?.name || ''
                case 'designation':
                    return data.workflow?.reviewedBy?.designation || ''
                case 'signature':
                    return data.workflow?.reviewedBy?.signature || ''
                default:
                    return ''
            }
        }
        case 'approvedBy': {
            const nameType = options.approvedByfield || 'name'
            switch (nameType) {
                case 'name':
                    return data.workflow?.approvedBy?.name || ''
                case 'designation':
                    return data.workflow?.approvedBy?.designation || ''
                case 'signature':
                    return data.workflow?.approvedBy?.signature || ''
                default:
                    return ''
            }
        }
        case 'issuedBy': {
            const nameType = options.issuedByfield || 'name'
            switch (nameType) {
                case 'name':
                    return data.workflow?.issuedBy?.name || ''
                case 'designation':
                    return data.workflow?.issuedBy?.designation || ''
                case 'signature':
                    return data.workflow?.issuedBy?.signature || ''
                default:
                    return ''
            }
        }
        case 'effectiveBY': {
            const nameType = options.effectiveByfield || 'name'
            switch (nameType) {
                case 'name':
                    return data.workflow?.effectiveBy?.name || ''
                case 'designation':
                    return data.workflow?.effectiveBy?.designation || ''
                case 'signature':
                    return data.workflow?.effectiveBy?.signature || ''
                default:
                    return ''
            }
        }
        case 'document': {
            const nameType = options.documentfield || 'name'
            switch (nameType) {
                case 'name':
                    return data?.name || ''
                case 'number':
                    return data?.number || ''
                case 'status':
                    return data?.status || ''
                case 'major_version':
                    return data?.issue_no || ''
                case 'fullVersion':
                    return data?.full_version || ''
                default:
                    return ''
            }
        }
        case 'lab': {
            const nameType = options.labfield || 'name'
            switch (nameType) {
                case 'name':
                    return data?.labName || ''
                default:
                    return ''
            }
        }
        default:
            return data[key] || ''
    }
}

export const lockTree = (component: any) => {
    component.set({
        editable: false,
        selectable: false,
        draggable: false,
        droppable: false,
        removable: false,
        copyable: false,
        hoverable: false,
        highlightable: false,
    })

    component.components().forEach((child: any) => {
        lockTree(child)
    })
}

export function extractMediaQueryStyles(css: string, mediaQuery: string) {
    if (!css) return ''

    const regex = new RegExp(
        `@media\\s*\\(${mediaQuery}\\)\\s*{([\\s\\S]*?)}\\s*}`,
        'g',
    )

    let extractedStyles = ''
    let match

    while ((match = regex.exec(css)) !== null) {
        extractedStyles += match[1].trim() + '\n'
    }

    const cleanedCss = css.replace(regex, '').trim()

    return cleanedCss + '\n' + extractedStyles
}

export const generateDocumentNo = async (
    categoryOption: { value: string; label: string } | null,
    departmentOptions: { value: string; label: string }[],
    categoryList: any[],
) => {
    if (!categoryOption) return ''
    let categoryPrefix: string | undefined

    categoryList.forEach((cat) => {
        if (cat.id === categoryOption.value) {
            categoryPrefix = cat.identifier
        }
    })

    let docPrefix: string = categoryPrefix || ''

    if (departmentOptions.length === 1) {
        const parts = departmentOptions[0].label.split(' - ')
        const deptPrefix = parts.length > 1 ? parts[1] : parts[0]
        docPrefix = `${deptPrefix}-${categoryPrefix}`
    }

    try {
        const res = await apiGenerateDocumentNumber({
            departmentName: docPrefix,
        })
        return res.documentNumber // ✅ RETURN FROM BACKEND
    } catch (err) {
        console.log(err)
        return ''
    }
}
