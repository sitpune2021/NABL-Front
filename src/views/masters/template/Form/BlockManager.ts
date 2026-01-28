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
                            { value: 'text', name: 'Text' }, // Single-line text input
                            { value: 'textarea', name: 'Textarea' }, // Multi-line text input
                            { value: 'number', name: 'Number' }, // Numeric input
                            { value: 'checkbox', name: 'Checkbox' }, // Boolean / multiple choice
                            { value: 'radio', name: 'Radio' }, // Single choice from options
                            { value: 'select', name: 'Select' }, // Dropdown
                            { value: 'multiselect', name: 'Multi Select' }, // Select multiple options
                            { value: 'date', name: 'Date' }, // Date picker
                            { value: 'time', name: 'Time' }, // Time picker
                            { value: 'datetime', name: 'Date & Time' }, // Date + time picker
                            { value: 'url', name: 'URL' }, // Link input
                            { value: 'email', name: 'Email' }, // Email input
                            { value: 'range', name: 'Range' },
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
                ;(this as any).on(
                    'change:mode',
                    (this as any).updateDynamicTraits,
                )
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
                const traits = (this as any).get('traits')
                const labelT =
                    traits && traits.find((t: any) => t.get('name') === 'label')
                const inputT =
                    traits &&
                    traits.find((t: any) => t.get('name') === 'inputType')

                if (mode === 'dynamic') {
                    if (!labelT) {
                        ;(this as any).addTrait({
                            type: 'text',
                            name: 'label',
                            label: 'Label',
                            placeholder: 'Enter label for the input',
                            value: (this as any).get('label') || '',
                        })
                    } else {
                        labelT.set('value', (this as any).get('label') || '')
                    }
                    if (!inputT) {
                        ;(this as any).addTrait({
                            type: 'select',
                            name: 'inputType',
                            label: 'Input Type',
                            options: [
                                { value: 'text', name: 'Text' },
                                { value: 'number', name: 'Number' },
                            ],
                            default: (this as any).get('inputType') || 'text',
                        })
                    } else {
                        inputT.set(
                            'value',
                            (this as any).get('inputType') || 'text',
                        )
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

                    const thead = {
                        tagName: 'thead',
                        type: 'thead',
                        components: [
                            {
                                tagName: 'tr',
                                type: 'tr',
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
                                                { value: 'text', name: 'Text' }, // Single-line text input
                                                {
                                                    value: 'textarea',
                                                    name: 'Textarea',
                                                }, // Multi-line text input
                                                {
                                                    value: 'number',
                                                    name: 'Number',
                                                }, // Numeric input
                                                {
                                                    value: 'checkbox',
                                                    name: 'Checkbox',
                                                }, // Boolean / multiple choice
                                                {
                                                    value: 'radio',
                                                    name: 'Radio',
                                                }, // Single choice from options
                                                {
                                                    value: 'select',
                                                    name: 'Select',
                                                }, // Dropdown
                                                {
                                                    value: 'multiselect',
                                                    name: 'Multi Select',
                                                }, // Select multiple options
                                                { value: 'date', name: 'Date' }, // Date picker
                                                { value: 'time', name: 'Time' }, // Time picker
                                                {
                                                    value: 'datetime',
                                                    name: 'Date & Time',
                                                }, // Date + time picker
                                                { value: 'url', name: 'URL' }, // Link input
                                                {
                                                    value: 'email',
                                                    name: 'Email',
                                                }, // Email input
                                                {
                                                    value: 'range',
                                                    name: 'Range',
                                                },
                                            ],
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
                            },
                        ],
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
