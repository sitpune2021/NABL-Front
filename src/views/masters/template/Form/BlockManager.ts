/* eslint-disable @typescript-eslint/no-explicit-any */
export function addCustomBlocks(editor: any) {
    editor.DomComponents.addType('solution-th', {
        isComponent: (el: any) =>
            el.tagName === 'TH' && el.classList.contains('solution-th'),
        model: {
            defaults: {
                traits: [
                    {
                        type: 'select',
                        name: 'type',
                        label: 'Input Type',
                        default: 'text', // Default value added
                        options: [
                            { value: 'text', name: 'Text' },
                            { value: 'number', name: 'Number' },
                            { value: 'checkbox', name: 'Checkbox' },
                            { value: 'radio', name: 'Radio' },
                            { value: 'select', name: 'Select' },
                        ],
                    },
                ],
            },
            updated(prop: any, val: any) {
                if (prop === 'type') (this as any).addAttributes({ type: val })
            },
        },
    })

    editor.DomComponents.addType('solution-td', {
        isComponent: (el: any) =>
            el.tagName === 'TD' && el.classList.contains('solution-td'),
        model: {
            defaults: {
                traits: [
                    {
                        type: 'number',
                        name: 'colspan',
                        label: 'Colspan',
                        min: 1,
                    },
                    {
                        type: 'number',
                        name: 'rowspan',
                        label: 'Rowspan',
                        min: 1,
                    },
                ],
            },
            updated(prop: any, val: any) {
                if (prop === 'colspan')
                    (this as any).addAttributes({ colspan: val })
                if (prop === 'rowspan')
                    (this as any).addAttributes({ rowspan: val })
            },
        },
    })

    editor.DomComponents.addType('text-block', {
        isComponent(el: any) {
            return el.classList && el.classList.contains('text-block')
        },

        model: {
            defaults: {
                tagName: 'p',
                classes: ['text-block'],
                droppable: false,
                stylable: true,
                editable: false,
                selectable: true,
                hoverable: true,
                highlightable: true,
                components: [
                    {
                        type: 'text',
                        content: 'Editable text here',

                        editable: true,
                        selectable: true,
                        hoverable: true,
                        highlightable: true,
                        badgable: true,
                        layerable: true,
                        void: false,
                    },
                ],
                traits: [
                    {
                        type: 'select',
                        name: 'tagName',
                        label: 'Tag Name',
                        options: [
                            { value: 'p', name: 'Paragraph' },
                            { value: 'span', name: 'Span' },
                            { value: 'h1', name: 'Heading 1' },
                            { value: 'h2', name: 'Heading 2' },
                            { value: 'h3', name: 'Heading 3' },
                            { value: 'h4', name: 'Heading 4' },
                            { value: 'h5', name: 'Heading 5' },
                            { value: 'h6', name: 'Heading 6' },
                        ],
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        name: 'mode',
                        label: 'Field Mode',
                        options: [
                            { value: 'static', name: 'Static' },
                            { value: 'dynamic', name: 'Dynamic' },
                        ],
                        default: 'static',
                        changeProp: true,
                    },
                ],
            },
            init() {
                ;(this as any).updateDynamicTraits()
            },
            updated(prop: any, value: any) {
                if (prop === 'tagName') {
                    ;(this as any).set('tagName', value)
                }
                if (prop === 'mode') {
                    ;(this as any).updateDynamicTraits()
                }
                // Add other updates if needed
            },
            updateDynamicTraits() {
                const mode = (this as any).get('mode')
                const traits = (this as any).getTraits()
                const labelT = traits.getTrait('label')
                const inputT = traits.getTrait('inputType')

                if (mode === 'dynamic') {
                    if (!labelT) {
                        ;(this as any).addTrait({
                            type: 'text',
                            name: 'label',
                            label: 'Label',
                            placeholder: 'Enter label for the input',
                        })
                    }
                    if (!inputT) {
                        ;(this as any).addTrait({
                            type: 'select',
                            name: 'inputType',
                            label: 'Input Type',
                            options: [
                                { value: 'text', name: 'Text' },
                                { value: 'number', name: 'Number' },
                                { value: 'email', name: 'Email' },
                                { value: 'password', name: 'Password' },
                                { value: 'checkbox', name: 'Checkbox' },
                                { value: 'radio', name: 'Radio' },
                                { value: 'select', name: 'Select' },
                            ],
                            default: 'text',
                        })
                    }
                } else {
                    if (labelT) (this as any).removeTrait('label')
                    if (inputT) (this as any).removeTrait('inputType')
                }
            },
        },
    })

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
                        default: 8,
                        changeProp: true,
                    },
                    {
                        type: 'number',
                        name: 'numCols',
                        label: 'Number of Columns',
                        min: 1,
                        max: 10,
                        default: 4,
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

                    // Generate thead
                    const thead = {
                        tagName: 'thead',
                        type: 'thead',
                        components: headers.map((header) => ({
                            tagName: 'th',
                            type: 'solution-th',
                            classes: ['solution-th'],
                            traits: [
                                {
                                    type: 'select',
                                    name: 'type',
                                    label: 'Input Type',
                                    default: 'text', // Default added here too
                                    options: [
                                        { value: 'text', name: 'Text' },
                                        {
                                            value: 'number',
                                            name: 'Number',
                                        },
                                        {
                                            value: 'checkbox',
                                            name: 'Checkbox',
                                        },
                                        {
                                            value: 'radio',
                                            name: 'Radio',
                                        },
                                        {
                                            value: 'select',
                                            name: 'Select',
                                        },
                                    ],
                                    changeProp: true,
                                },
                            ],
                            components: [
                                {
                                    tagName: 'span',
                                    type: 'text',
                                    content: header,
                                    editable: true,
                                },
                            ],
                        })),
                    }

                    // Generate tbody
                    const tbody = {
                        tagName: 'tbody',
                        type: 'tbody',
                        components: Array.from({ length: num_rows }).map(
                            () => ({
                                tagName: 'tr',
                                type: 'tr',
                                components: Array.from({ length: numCols }).map(
                                    () => ({
                                        tagName: 'td',
                                        type: 'solution-td',
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
                                    }),
                                ),
                            }),
                        ),
                    }

                    return [thead, tbody]
                },
            },
        },
        {
            id: 'text-block',
            label: 'Text',
            category: 'Basic',
            content: {
                type: 'text-block',
                classes: ['text-block'],
                components: [
                    {
                        type: 'text',
                        content: 'Editable text here',
                        editable: true,
                    },
                ],
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
                border: '1px solid #ddd',
                'min-height': '50px',
            },
        },
        {
            selectors: ['.row'],
            style: {
                display: 'flex',
                'flex-wrap': 'wrap',
                gap: '10px',
                margin: '0 -15px',
                border: '1px solid #eee',
                padding: '10px',
                'min-height': '50px',
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
    console.log('Document Data:', documentData)

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
                default: 'issueDate',
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
                default: 'preparedBy',
            },
        ],
        designation: [
            {
                type: 'select',
                name: 'personDesignation',
                label: 'Person Designation',
                options: personOptions,
                default: 'preparedBy',
            },
        ],
        signatory: [
            {
                type: 'select',
                name: 'personSignatory',
                label: 'Person Signatory',
                options: personOptions,
                default: 'preparedBy',
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
                    { value: 'email', name: 'Email' },
                    { value: 'phone', name: 'Phone' },
                ],
                default: 'name',
            },
        ],
        name: [
            {
                type: 'select',
                name: 'nameType',
                label: 'Name Type',
                options: [
                    { value: 'lab', name: 'Lab Name' },
                    { value: 'document', name: 'Document Name' },
                    { value: 'user', name: 'User Name' },
                ],
                default: 'lab',
            },
        ],
    }

    // Utility to pick correct value based on type and documentData
    function resolveFieldValue(key: string, data: any): string {
        if (!data) return ''

        switch (key) {
            case 'date':
                // Prioritize issueDate → amendmentDate → effectiveDate
                return (
                    data.issueDate ||
                    data.amendmentDate ||
                    data.effectiveDate ||
                    ''
                )

            case 'number':
                return (
                    data.documentNo ||
                    data.issuedNo ||
                    data.copyNo ||
                    data.amendmentNo ||
                    ''
                )

            case 'person':
            case 'designation':
            case 'signatory':
                // If approvedBy, preparedBy, issuedBy exist, combine or pick one
                return data.preparedBy || data.approvedBy || data.issuedBy || ''

            case 'category':
                return data.category || ''

            case 'department':
                return Array.isArray(data.department)
                    ? data.department.join(', ')
                    : data.department || ''

            case 'name':
                return (
                    data.labName || data.documentName || data.preparedBy || ''
                )

            case 'userDetails':
                return data.location || data.email || data.phone || ''

            default:
                return data[key] || ''
        }
    }

    simpleFields.forEach((key) => {
        const traits = fieldTraits[key] || []
        const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())

        const fieldValue = resolveFieldValue(key, documentData)
        console.log(fieldValue, 'fieldValue')

        editor.BlockManager.add(`field-${key}`, {
            label,
            category: 'Dynamic Fields',
            content: {
                type: `field-${key}`,
                tagName: 'span',
                attributes: {
                    'data-field': key,
                    ...(fieldValue && { 'data-value': fieldValue }),
                },
                content: fieldValue ? `{{${fieldValue}}}` : `{{${key}}}`,
            },
        })

        editor.DomComponents.addType(`field-${key}`, {
            model: {
                defaults: {
                    tagName: 'span',
                    attributes: {
                        'data-field': key,
                        ...(fieldValue && { 'data-value': fieldValue }),
                    },
                    traits,
                    content: fieldValue ? `{{${fieldValue}}}` : `{{${key}}}`,
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
