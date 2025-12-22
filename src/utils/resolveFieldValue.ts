/* eslint-disable @typescript-eslint/no-explicit-any */

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
            const dateType = options.datetype || 'issueDate'
            let dateValue: string
            switch (dateType) {
                case 'issueDate':
                    dateValue = data.issueDate || ''
                    break
                case 'amendmentDate':
                    dateValue = data.amendmentDate || ''
                    break
                case 'effectiveDate':
                    dateValue = data.effectiveDate || ''
                    break
                default:
                    dateValue = data.genericDate || ''
                    break
            }
            if (options.format && dateValue) {
                return formatDate(dateValue, options.format)
            }
            return dateValue
        }
        case 'number': {
            const numberType = options.numbertype || 'documentNo'
            switch (numberType) {
                case 'documentNo':
                    return data.documentNo || ''
                case 'issuedNo':
                    return data.issuedNo || ''
                case 'copyNo':
                    return data.copyNo || ''
                case 'amendmentNo':
                    return data.amendmentNo || ''
                default:
                    return ''
            }
        }
        case 'person':
        case 'designation':
        case 'signatory': {
            const personRole =
                options.personrole ||
                options.persondesignation ||
                options.personsignatory ||
                'preparedBy'

            switch (personRole) {
                case 'preparedBy':
                    return data.preparedBy || ''
                case 'approvedBy':
                    return data.approvedBy || ''
                case 'issuedBy':
                    return data.issuedBy || ''
                case 'user':
                    return data.user || ''
                default:
                    return ''
            }
        }
        case 'category': {
            const categoryLevel = options.categorylevel || 'category'
            return categoryLevel === 'subcategory'
                ? data.subcategory || ''
                : data.category || ''
        }
        case 'department':
            return Array.isArray(data.department)
                ? data.department.join(', ')
                : data.department || ''
        case 'userDetails': {
            const userDetailType = options.userdetailtype || 'name'
            switch (userDetailType) {
                case 'name':
                    return data.name || ''
                case 'role':
                    return data.role || ''
                case 'type':
                    return data.type || ''
                case 'location':
                    return data.location || ''
                case 'email':
                    return data.email || ''
                case 'phone':
                    return data.phone || ''
                default:
                    return ''
            }
        }
        case 'name': {
            const nameType = options.nametype || 'lab'
            switch (nameType) {
                case 'lab':
                    return data.labName || ''
                case 'document':
                    return data.documentName || ''
                case 'user':
                    return data.userName || ''
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

export const generateDocumentNo = (
    categoryOption: { value: string; label: string } | null,
    departmentOptions: { value: string; label: string }[],
    categoryList: any[],
    counter: number,
) => {
    if (!categoryOption) return ''
    let categoryPrefix

    categoryList.forEach((cat) => {
        if (cat.id === categoryOption.value) {
            categoryPrefix = cat.identifier
        }
    })

    let docPrefix: any = categoryPrefix

    if (departmentOptions.length === 1) {
        const deptPrefix = departmentOptions[0].label.split(' - ')[1]
        docPrefix = `${deptPrefix}-${categoryPrefix}`
    }

    return `${docPrefix}-${counter}`
}
// function resolveFieldValue(
//     key: string,
//     data: DocumentResolved,
//     options: { [key: string]: string } = {},
// ): string {
//     if (!data) return ''
//     switch (key) {
//         case 'date': {
//             const dateType = options.datetype || 'issueDate'
//             let dateValue: string
//             switch (dateType) {
//                 case 'issueDate':
//                     dateValue = data.issueDate || ''
//                     break
//                 case 'amendmentDate':
//                     dateValue = data.amendmentDate || ''
//                     break
//                 case 'effectiveDate':
//                     dateValue = data.effectiveDate || ''
//                     break
//                 default:
//                     dateValue = new Date().toISOString()
//                     break
//             }
//             if (options.format && dateValue) {
//                 return formatDate(dateValue, options.format)
//             }
//             return dateValue
//         }
//         case 'number': {
//             const numberType = options.numbertype || 'documentNo'
//             switch (numberType) {
//                 case 'documentNo':
//                     return data.documentNo || ''
//                 case 'issuedNo':
//                     return data.issuedNo || ''
//                 case 'copyNo':
//                     return data.copyNo || ''
//                 case 'amendmentNo':
//                     return data.amendmentNo || ''
//                 default:
//                     return ''
//             }
//         }
//         case 'person':
//         case 'designation':
//         case 'signatory': {
//             const personRole =
//                 options.personrole ||
//                 options.persondesignation ||
//                 options.personsignatory ||
//                 'preparedBy'
//             switch (personRole) {
//                 case 'preparedBy':
//                     return data.preparedBy || ''
//                 case 'approvedBy':
//                     return data.approvedBy || ''
//                 case 'issuedBy':
//                     return data.issuedBy || ''
//                 case 'user':
//                     return data.user || ''
//                 default:
//                     return ''
//             }
//         }
//         case 'category': {
//             const categoryLevel = options.categorylevel || 'category'
//             return categoryLevel === 'subcategory'
//                 ? data.subcategory || ''
//                 : data.category || ''
//         }
//         case 'department':
//             return Array.isArray(data.department)
//                 ? data.department.join(', ')
//                 : data.department || ''
//         case 'userDetails': {
//             const userDetailType = options.userdetailtype || 'name'
//             switch (userDetailType) {
//                 case 'name':
//                     return data.name || ''
//                 case 'role':
//                     return data.role || ''
//                 case 'type':
//                     return data.type || ''
//                 case 'location':
//                     return data.location || ''
//                 case 'email':
//                     return data.email || ''
//                 case 'phone':
//                     return data.phone || ''
//                 default:
//                     return ''
//             }
//         }
//         case 'name': {
//             const nameType = options.nametype || 'lab'
//             switch (nameType) {
//                 case 'lab':
//                     return data.labName || ''
//                 case 'document':
//                     return data.documentName || ''
//                 case 'user':
//                     return data.userName || ''
//                 default:
//                     return ''
//             }
//         }
//         default:
//             return ''
//     }
// }
