/* eslint-disable @typescript-eslint/no-explicit-any */
export function addCustomBlocks(editor: any) {
    const customBlocks = [
        {
            id: 'custom-table',
            label: 'Table',
            category: 'Custom',
            content: {
                type: 'default',
                components: [
                    {
                        tagName: 'div',
                        style: {
                            display: 'flex',
                            'justify-content': 'center',
                            'margin-top': '20px',
                        },
                        components: [
                            {
                                tagName: 'table',
                                classes: ['solution-table'],
                                stylable: false,
                                components: [
                                    {
                                        tagName: 'thead',
                                        components: [
                                            {
                                                tagName: 'tr',
                                                components: [
                                                    ...[
                                                        'Date',
                                                        'Quantity Prepared',
                                                        'Prepared By',
                                                        'Supervised By',
                                                        'Distributed to Departments',
                                                    ].map((header) => ({
                                                        tagName: 'th',
                                                        content: header,
                                                        classes: [
                                                            'solution-th',
                                                        ],
                                                        stylable: false,
                                                    })),
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        tagName: 'tbody',
                                        components: Array.from({
                                            length: 8,
                                        }).map(() => ({
                                            tagName: 'tr',
                                            components: Array.from({
                                                length: 5,
                                            }).map(() => ({
                                                tagName: 'td',
                                                classes: ['solution-td'],
                                                content: '',
                                                droppable: true,
                                                stylable: false,
                                            })),
                                        })),
                                    },
                                ],
                            },
                        ],
                    },
                ],
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
            selectors: ['.row'],
            style: {
                display: 'flex',
                gap: '10px',
            },
        },
        {
            selectors: ['.col'],
            style: {
                flex: '1',
                border: '1px dashed #ccc',
                padding: '10px',
                'min-height': '50px',
            },
        },
        {
            selectors: ['.solution-table'],
            style: {
                margin: '0 auto',
                width: '90%',
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
                padding: '6px',
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
            },
        },
    ])
}

export function addDynamicFields(editor: any) {
    const simpleFields = [
        'date',
        'issuedNo',
        'copyNo',
        'amendmentNo',
        'preparedBy',
        'approvedBy',
        'issuedBy',
        'issueDate',
        'amendmentDate',
        'effectiveDate',
        'username',
        'department',
        'category',
        'subcategory',
        'invoiceNo',
        'userDetails',
        'signatoryBy',
        'signatoryOn',
    ]
    simpleFields.forEach((key) => {
        editor.BlockManager.add(`field-${key}`, {
            label: key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (s) => s.toUpperCase()),
            category: 'Dynamic Fields',
            content: `{{${key}}}`,
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
