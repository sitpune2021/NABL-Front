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
                if (prop === 'colspan') {
                    ;(this as any).setAttributes({ colspan: val })
                }

                if (prop === 'rowspan') {
                    ;(this as any).setAttributes({ rowspan: val })
                }
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

    editor.DomComponents.addType('dynamic-table', {
        model: {
            defaults: {
                tagName: 'table',
                classes: ['solution-table'],
                num_rows: 8,
                numCols: 4,

                traits: [
                    {
                        type: 'number',
                        name: 'num_rows',
                        label: 'Number of Rows',
                        min: 1,
                        max: 20,
                        changeProp: true,
                    },
                    {
                        type: 'number',
                        name: 'numCols',
                        label: 'Number of Columns',
                        min: 1,
                        max: 10,
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        name: 'headerType',
                        label: 'Header Layout',
                        options: [
                            { value: 'horizontal', name: 'Horizontal Header' },
                            { value: 'vertical', name: 'Vertical Header' },
                            { value: 'none', name: 'No Header' },
                        ],
                        default: 'horizontal',
                        changeProp: true,
                    },
                ],
            },

            init() {
                ;(this as any).on(
                    'change:num_rows change:numCols change:headerType',
                    () => this.updateTable(),
                )

                if (!(this as any).components().length) {
                    this.updateTable()
                }
            },

            updateTable() {
                const rows = (this as any).get('num_rows') || 8
                const cols = (this as any).get('numCols') || 4
                const headerType =
                    (this as any).get('headerType') || 'horizontal'

                const headers = Array.from(
                    { length: cols },
                    (_, i) => `Header ${i + 1}`,
                )

                let components: any[] = []

                // 1️⃣ Horizontal Header
                if (headerType === 'horizontal') {
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

                    const tbody = {
                        tagName: 'tbody',
                        type: 'tbody',
                        components: Array.from({ length: rows }).map(() => ({
                            tagName: 'tr',
                            type: 'tr',
                            components: Array.from({ length: cols }).map(
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
                                            max: cols,
                                        },
                                        {
                                            type: 'number',
                                            name: 'rowspan',
                                            label: 'Rowspan',
                                            min: 1,
                                            max: rows,
                                        },
                                    ],
                                }),
                            ),
                        })),
                    }

                    components = [thead, tbody]
                }

                // 2️⃣ Vertical Header
                if (headerType === 'vertical') {
                    const tbody = {
                        tagName: 'tbody',
                        type: 'tbody',
                        components: Array.from({ length: rows }).map(
                            (_, r) => ({
                                tagName: 'tr',
                                type: 'tr',
                                components: [
                                    {
                                        tagName: 'th',
                                        type: 'solution-th',
                                        classes: ['solution-th'],
                                        components: [
                                            {
                                                tagName: 'span',
                                                type: 'text',
                                                content: `Header ${r + 1}`,
                                                editable: true,
                                            },
                                        ],
                                    },
                                    ...Array.from({ length: cols - 1 }).map(
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
                                                    max: cols,
                                                },
                                                {
                                                    type: 'number',
                                                    name: 'rowspan',
                                                    label: 'Rowspan',
                                                    min: 1,
                                                    max: rows,
                                                },
                                            ],
                                        }),
                                    ),
                                ],
                            }),
                        ),
                    }

                    components = [tbody]
                }

                // 3️⃣ No Header
                if (headerType === 'none') {
                    const tbody = {
                        tagName: 'tbody',
                        type: 'tbody',
                        components: Array.from({ length: rows }).map(() => ({
                            tagName: 'tr',
                            type: 'tr',
                            components: Array.from({ length: cols }).map(
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
                                            max: cols,
                                        },
                                        {
                                            type: 'number',
                                            name: 'rowspan',
                                            label: 'Rowspan',
                                            min: 1,
                                            max: rows,
                                        },
                                    ],
                                }),
                            ),
                        })),
                    }

                    components = [tbody]
                }

                ;(this as any).components().reset(components)
            },
        },
    })

    const customBlocks = [
        {
            id: 'container',
            label: 'Container',
            category: 'Layout',
            content: {
                type: 'container',
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
                type: 'dynamic-table',
                num_rows: 8,
                numCols: 4,
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
                'table-layout': 'fixed',
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
            },
        },
        {
            selectors: ['.solution-td'],
            style: {
                border: '1px solid #000',
                height: '50px',
                'min-height': '30px',
                padding: '8px',
            },
        },
        {
            selectors: ['.footer'],
            style: {
                width: '100%',
                'font-size': '13px',
                'font-family': 'Arial, sans-serif',
            },
        },
        {
            selectors: ['.footer-table'],
            style: {
                width: '100%',
                'border-collapse': 'collapse',
                'font-size': '13px',
                'table-layout': 'fixed', // ⭐ important
            },
        },
        {
            selectors: ['.footer-td'],
            style: {
                border: '1px solid #000',
                padding: '2px 3px',
                'text-align': 'left',
                'vertical-align': 'middle',
                'font-size': '13px',
                'line-height': '1.4',
                height: '32px',
                'min-width': '40px',
            },
        },
    ])
}
