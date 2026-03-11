/* eslint-disable @typescript-eslint/no-explicit-any */

export function addDynamicFields(editor: any) {
    const dateTraits: { [key: string]: any[] } = {
        date: [
            {
                type: 'select',
                name: 'dateType',
                label: 'Date Type',
                options: [
                    { value: 'issuedDate', name: 'Issued Date' },
                    { value: 'effectiveDate', name: 'Effective Date' },
                    { value: 'amendmentDate', name: 'Amendment Date' },
                    { value: 'preparedDate', name: 'Prepared Date' },
                    { value: 'approvedDate', name: 'Approved Date' },
                ],
                default: 'issuedDate',
            },
            {
                type: 'select',
                name: 'format',
                label: 'Date Format',
                options: [
                    { value: 'dd/MM/yyyy', name: 'dd/MM/yyyy' },
                    { value: 'MM/dd/yyyy', name: 'MM/dd/yyyy' },
                    { value: 'yyyy-MM-dd', name: 'yyyy-MM-dd' },
                ],
                default: 'dd/MM/yyyy',
            },
        ],
    }

    const tableFieldTraits: { [key: string]: any[] } = {
        lab: [
            {
                type: 'select',
                name: 'labField',
                label: 'Lab Field',
                options: [
                    { value: 'name', name: 'Lab Name' },
                    { value: 'lab_code', name: 'Lab Code' },
                    { value: 'lab_type', name: 'Lab Type' },
                    { value: 'address', name: 'Address' },
                ],
                default: 'name',
            },
        ],

        document: [
            {
                type: 'select',
                name: 'documentField',
                label: 'Document Field',
                options: [
                    { value: 'name', name: 'Document Name' },
                    { value: 'number', name: 'Document Number' },
                    { value: 'status', name: 'Document Status' },
                    { value: 'fullVersion', name: 'Version (Major.Minor)' },
                    { value: 'major_version', name: 'Major Version' },
                    { value: 'minor_version', name: 'Minor Version' },
                ],
                default: 'name',
            },
        ],

        category: [
            {
                type: 'select',
                name: 'categoryField',
                label: 'Category Field',
                options: [
                    { value: 'name', name: 'Category Name' },
                    { value: 'identifier', name: 'Identifier' },
                ],
                default: 'name',
            },
        ],

        subCategory: [
            {
                type: 'select',
                name: 'subCategoryField',
                label: 'Sub Category Field',
                options: [
                    { value: 'name', name: 'Sub Category Name' },
                    { value: 'identifier', name: 'Identifier' },
                ],
                default: 'name',
            },
        ],

        unit: [
            {
                type: 'select',
                name: 'unitField',
                label: 'Unit Field',
                options: [{ value: 'name', name: 'Unit Name' }],
                default: 'name',
            },
        ],

        labLocation: [
            {
                type: 'select',
                name: 'labLocationField',
                label: 'Lab Location Field',
                options: [
                    { value: 'prefix', name: 'Prefix' },
                    { value: 'address', name: 'Address' },
                    { value: 'name', name: 'Location Name' },
                ],
                default: 'prefix',
            },
        ],

        labLocationDepartment: [
            {
                type: 'select',
                name: 'labLocationDepartmentField',
                label: 'Lab Location Department Field',
                options: [
                    { value: 'department.name', name: 'Department Name' },
                ],
                default: 'department.name',
            },
        ],
    }

    const workflowUserTraits: { [key: string]: any[] } = {
        preparedBy: [
            {
                type: 'select',
                name: 'preparedByField',
                label: 'Prepared By Field',
                options: [
                    { value: 'name', name: 'Name' },
                    { value: 'designation', name: 'Designation' },
                    { value: 'signature', name: 'Signature' },
                ],
                default: 'name',
            },
        ],

        reviewedBy: [
            {
                type: 'select',
                name: 'reviewedByField',
                label: 'reviewed By Field',
                options: [
                    { value: 'name', name: 'Name' },
                    { value: 'designation', name: 'Designation' },
                    { value: 'signature', name: 'Signature' },
                ],
                default: 'name',
            },
        ],

        approvedBy: [
            {
                type: 'select',
                name: 'approvedByField',
                label: 'Approved By Field',
                options: [
                    { value: 'name', name: 'Name' },
                    { value: 'designation', name: 'Designation' },
                    { value: 'signature', name: 'Signature' },
                ],
                default: 'name',
            },
        ],

        issuedBy: [
            {
                type: 'select',
                name: 'issuedByField',
                label: 'Issued By Field',
                options: [
                    { value: 'name', name: 'Name' },
                    { value: 'designation', name: 'Designation' },
                ],
                default: 'name',
            },
        ],

        effectiveBY: [
            {
                type: 'select',
                name: 'effectiveBYField',
                label: 'effective By Field',
                options: [
                    { value: 'name', name: 'Name' },
                    { value: 'designation', name: 'Designation' },
                ],
                default: 'name',
            },
        ],
    }

    Object.keys(dateTraits).forEach((key) => {
        editor.BlockManager.add(`field-${key}`, {
            label: 'DATE',
            category: 'Dynamic Fields / Date',
            content: {
                type: `field-${key}`,
                tagName: 'span',
                attributes: { 'data-field': key },
                content: `{{${key}}}`,
            },
        })

        editor.DomComponents.addType(`field-${key}`, {
            model: {
                defaults: {
                    tagName: 'span',
                    attributes: { 'data-field': key },
                    traits: dateTraits[key],
                    content: `{{${key}}}`,
                },
            },
        })
    })

    Object.keys(tableFieldTraits).forEach((key) => {
        editor.BlockManager.add(`field-${key}`, {
            label: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
            category: 'Dynamic Fields / Tables',
            content: {
                type: `field-${key}`,
                tagName: 'span',
                attributes: { 'data-field': key },
                content: `{{${key}}}`,
            },
        })

        editor.DomComponents.addType(`field-${key}`, {
            model: {
                defaults: {
                    tagName: 'span',
                    attributes: { 'data-field': key },
                    traits: tableFieldTraits[key],
                    content: `{{${key}}}`,
                },
            },
        })
    })

    Object.keys(workflowUserTraits).forEach((key) => {
        editor.BlockManager.add(`field-${key}`, {
            label: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
            category: 'Dynamic Fields / Workflow',
            content: {
                type: `field-${key}`,
                tagName: 'span',
                attributes: { 'data-field': key },
                content: `{{${key}}}`,
            },
        })

        editor.DomComponents.addType(`field-${key}`, {
            model: {
                defaults: {
                    tagName: 'span',
                    attributes: { 'data-field': key },
                    traits: workflowUserTraits[key],
                    content: `{{${key}}}`,
                },
            },
        })
    })
}
