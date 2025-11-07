/* eslint-disable @typescript-eslint/no-explicit-any */
export function addCustomBlocks(editor: any) {
    const customBlocks = [
        {
            id: 'container',
            label: 'Container',
            category: 'Layout',
            content: {
                type: 'default',
                components: [
                    {
                        tagName: 'div',
                        classes: ['container'],
                        droppable: true,
                        stylable: true,
                    },
                ],
            },
        },
        {
            id: 'row',
            label: 'Row',
            category: 'Layout',
            content: {
                type: 'default',
                components: [
                    {
                        tagName: 'div',
                        classes: ['row'],
                        droppable: true,
                        stylable: true,
                    },
                ],
            },
        },
        {
            id: 'col',
            label: 'Column',
            category: 'Layout',
            content: {
                type: 'default',
                components: [
                    {
                        tagName: 'div',
                        classes: ['col'],
                        droppable: true,
                        stylable: true,
                    },
                ],
            },
        },
        {
            id: 'custom-table',
            label: 'Table',
            category: 'Custom',
            content: {
                tagName: 'table',
                classes: ['solution-table'],
                type: 'table',
                traits: [
                    {
                        type: 'number',
                        name: 'num_rows',
                        label: 'Number of Rows',
                        min: 1,
                        max: 20,
                        default: 8, // Default to 8 rows as per your request
                        changeProp: true,
                    },
                    {
                        type: 'number',
                        name: 'numCols',
                        label: 'Number of Columns',
                        min: 1,
                        max: 10,
                        default: 4, // Default to 4 columns (headers) as per your request
                        changeProp: true,
                    },
                ],
                stylable: false,
                components: function (props: any) {
                    const num_rows = props.num_rows || 8
                    const numCols = props.numCols || 4
                    const headers = Array.from(
                        { length: numCols },
                        (_, i) => `Header ${i + 1}`,
                    )

                    return [
                        {
                            tagName: 'thead',
                            type: 'thead',
                            components: [
                                {
                                    tagName: 'tr',
                                    type: 'tr',
                                    components: headers.map((header) => ({
                                        tagName: 'th',
                                        type: 'th',
                                        content: header,
                                        classes: ['solution-th'],
                                    })),
                                },
                            ],
                        },
                        {
                            tagName: 'tbody',
                            type: 'tbody',
                            components: Array.from({ length: num_rows }).map(
                                () => ({
                                    tagName: 'tr',
                                    type: 'tr',
                                    components: Array.from({
                                        length: numCols,
                                    }).map(() => ({
                                        tagName: 'td',
                                        classes: ['solution-td'],
                                        content: '',
                                        droppable: true,
                                        traits: [
                                            {
                                                type: 'number',
                                                name: 'colspan',
                                                label: 'Colspan',
                                                min: 1,
                                                max: numCols,
                                            },
                                            {
                                                type: 'number',
                                                name: 'rowspan',
                                                label: 'Rowspan',
                                                min: 1,
                                                max: num_rows,
                                            },
                                        ],
                                    })),
                                }),
                            ),
                        },
                    ]
                },
            },
        },
        {
            id: 'text-block',
            label: 'Text',
            category: 'Basic',
            content: {
                type: 'text',
                content: 'Editable text here',
                stylable: true,
            },
        },
        {
            id: 'image-block',
            label: 'Image',
            category: 'Basic',
            content: {
                type: 'image',
                attributes: {
                    src: 'https://iconape.com/wp-content/files/ge/264650/png/NABL_India-logo.png',
                    alt: 'image',
                },
                stylable: ['width', 'height', 'border-radius', 'box-shadow'],
            },
        },
    ]
    customBlocks.forEach((block) => editor.BlockManager.add(block.id, block))

    editor.CssComposer.addRules([
        {
            selectors: ['.container'],
            style: {
                width: '100%',
                'max-width': '1200px',
                margin: '0 auto',
                padding: '0 15px',
                'box-sizing': 'border-box',
                border: '1px solid #ddd', // Added border for visibility
                'min-height': '50px', // Added min-height for better visibility
            },
        },
        {
            selectors: ['.row'],
            style: {
                display: 'flex',
                'flex-wrap': 'wrap',
                gap: '10px',
                margin: '0 -15px',
                border: '1px solid #eee', // Added border for visibility
                padding: '10px',
                'min-height': '50px', // Added min-height for better visibility
            },
        },
        {
            selectors: ['.col'],
            style: {
                flex: '1',
                border: '1px dashed #ccc',
                padding: '10px',
                'min-height': '50px',
                'box-sizing': 'border-box',
                margin: '0 15px',
            },
        },
        {
            selectors: ['.custom-button'],
            style: {
                padding: '10px 20px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                'border-radius': '6px',
                cursor: 'pointer',
            },
        },
        {
            selectors: ['.solution-table'],
            style: {
                margin: '0 auto',
                width: '100%',
                'border-collapse': 'collapse',
                'text-align': 'center',
                'font-family': 'Arial, sans-serif',
                'font-size': '14px',
            },
        },
        {
            selectors: ['.solution-th'],
            style: {
                border: '1px solid #000',
                padding: '8px',
                'font-weight': 'bold',
                'background-color': '#f5f5f5',
                height: '30px',
                width: '150px',
            },
        },
        {
            selectors: ['.solution-td'],
            style: {
                border: '1px solid #000',
                height: '50px',
                width: '150px',
                'min-height': '30px',
                padding: '8px',
            },
        },
    ])
}

export function addDynamicFields(editor: any, documentData?: any) {
    console.log(documentData)

    const personOptions = [
        { value: 'user', name: 'User' },
        { value: 'preparedBy', name: 'Prepared By' },
        { value: 'approvedBy', name: 'Approved By' },
        { value: 'issuedBy', name: 'Issued By' },
    ]

    const simpleFields = [
        'date',
        'number',
        'person',
        'designation',
        'signatory',
        'category',
        'department',
        'userDetails',
        'name',
    ]

    // Define traits for each field in a structured way for better readability and extensibility
    const fieldTraits: { [key: string]: any[] } = {
        date: [
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
            {
                type: 'select',
                name: 'dateType',
                label: 'Date Type',
                options: [
                    { value: 'genericDate', name: 'Generic Date' },
                    { value: 'issueDate', name: 'Issue Date' },
                    { value: 'amendmentDate', name: 'Amendment Date' },
                    { value: 'effectiveDate', name: 'Effective Date' },
                ],
                default: 'genericDate',
            },
        ],
        number: [
            {
                type: 'select',
                name: 'numberType',
                label: 'Number Type',
                options: [
                    { value: 'documentNo', name: 'Document Number' },
                    { value: 'issuedNo', name: 'Issued Number' },
                    { value: 'copyNo', name: 'Copy Number' },
                    { value: 'amendmentNo', name: 'Amendment Number' },
                    { value: 'invoiceNo', name: 'Invoice Number' },
                ],
                default: 'documentNo',
            },
        ],
        person: [
            {
                type: 'select',
                name: 'personRole',
                label: 'Person Role',
                options: personOptions,
                default: 'user',
            },
        ],
        designation: [
            {
                type: 'select',
                name: 'personDesignation',
                label: 'Person Designation',
                options: personOptions,
                default: 'user',
            },
        ],
        signatory: [
            {
                type: 'select',
                name: 'personSignatory',
                label: 'Person Signatory',
                options: personOptions,
                default: 'user',
            },
            {
                type: 'select',
                name: 'signatoryType',
                label: 'Signatory Type',
                options: [
                    { value: 'on', name: 'Signatory On' },
                    { value: 'by', name: 'Signatory By' },
                ],
                default: 'on',
            },
        ],
        category: [
            {
                type: 'select',
                name: 'categoryLevel',
                label: 'Category Level',
                options: [
                    { value: 'category', name: 'Main Category' },
                    { value: 'subcategory', name: 'Subcategory' },
                ],
                default: 'category',
            },
        ],
        userDetails: [
            {
                type: 'select',
                name: 'userDetailType',
                label: 'User Detail Type',
                options: [
                    { value: 'name', name: 'Name' },
                    { value: 'role', name: 'Role' },
                    { value: 'type', name: 'Type' },
                    { value: 'location', name: 'Location' },
                    { value: 'email', name: 'Email' }, // Added common ones; customize as needed
                    { value: 'phone', name: 'Phone' },
                ],
                default: 'name',
            },
        ],
        name: [
            {
                type: 'select',
                name: 'name-type',
                label: 'Name Type',
                options: [
                    { value: 'user', name: 'User Name' },
                    { value: 'document', name: 'document Name' },
                    { value: 'lab', name: 'Lab Name' },
                ],
                default: 'lab',
            },
        ],
        // Other fields (department, lab_name) have no extra traits, so they default to an empty array
    }

    simpleFields.forEach((key) => {
        const traits = fieldTraits[key] || [] // Use defined traits or empty array for fields without extras

        // Generate a human-readable label from the key
        const label = key
            .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
            .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter

        editor.BlockManager.add(`field-${key}`, {
            label,
            category: 'Dynamic Fields',
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
                    traits,
                },
            },
            view: {},
        })
    })
}
;(window as any).handleDynamicSelect = function (selectEl: HTMLSelectElement) {
    const container = selectEl.nextElementSibling as HTMLElement
    const rawValue = selectEl.value

    if (!rawValue) {
        container.innerHTML = ''
        return
    }

    try {
        const parsed = JSON.parse(rawValue)
        container.innerHTML = `
      <div><b>Email:</b> ${parsed.email}</div>
      <div><b>Phone:</b> ${parsed.phone}</div>
      <div><b>Address:</b> ${parsed.address}</div>
    `
    } catch {
        container.innerHTML = `<span>${rawValue}</span>`
    }
}
