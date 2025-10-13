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

export function addDynamicFields(editor: any, docMeta?: any) {
    const dynamicData = {
        date: '2025-09-12',
        username: [
            'Amit Sharma',
            'Nikita Nikam',
            'Ravi Patil',
            'Sneha Kulkarni',
            'Vishal Jadhav',
            'Priya Deshmukh',
            'Rahul Joshi',
            'Anjali Pawar',
            'Akash Shinde',
            'Meera Patankar',
            'Sagar More',
        ],
        department: [
            'Administration',
            'Sales',
            'Procurement',
            'Accounts',
            'HR',
            'Sales',
            'Maintenance',
            'Production',
            'IT',
            'Logistics',
            'Procurement',
        ],
        category: [
            'Purchase',
            'Sales',
            'Purchase',
            'Finance',
            'HR',
            'Sales',
            'Maintenance',
            'Production',
            'IT',
            'Logistics',
            'Purchase',
        ],
        subcategory: [
            'Office Supplies',
            'Retail',
            'Raw Material',
            'Audit',
            'Recruitment',
            'Wholesale',
            'Electrical',
            'Assembly',
            'Support',
            'Transport',
            'Spare Parts',
        ],
        invoiceNo: [
            'INV-1001',
            'INV-1002',
            'INV-1003',
            'INV-1004',
            'INV-1005',
            'INV-1006',
            'INV-1007',
            'INV-1008',
            'INV-1009',
            'INV-1010',
            'INV-1011',
        ],
        userDetails: [
            {
                email: 'amit.sharma@example.com',
                phone: '+91-9876543210',
                address: 'Pune, Maharashtra',
            },
            {
                email: 'nikita.nikam@example.com',
                phone: '+91-9876500000',
                address: 'Mumbai, Maharashtra',
            },
            {
                email: 'ravi.patil@example.com',
                phone: '+91-9123456789',
                address: 'Nashik, Maharashtra',
            },
            {
                email: 'sneha.kulkarni@example.com',
                phone: '+91-9988776655',
                address: 'Kolhapur, Maharashtra',
            },
            {
                email: 'vishal.jadhav@example.com',
                phone: '+91-9090909090',
                address: 'Aurangabad, Maharashtra',
            },
            {
                email: 'priya.deshmukh@example.com',
                phone: '+91-9012345678',
                address: 'Nagpur, Maharashtra',
            },
            {
                email: 'rahul.joshi@example.com',
                phone: '+91-9876123456',
                address: 'Satara, Maharashtra',
            },
            {
                email: 'anjali.pawar@example.com',
                phone: '+91-9898989898',
                address: 'Solapur, Maharashtra',
            },
            {
                email: 'akash.shinde@example.com',
                phone: '+91-9234567890',
                address: 'Latur, Maharashtra',
            },
            {
                email: 'meera.patankar@example.com',
                phone: '+91-9765432100',
                address: 'Beed, Maharashtra',
            },
            {
                email: 'sagar.more@example.com',
                phone: '+91-9345678901',
                address: 'Sangli, Maharashtra',
            },
        ],
        signatoryBy: {
            'Prepared By': 'Amit Sharma',
            'Approve By': 'Nikita Nikam',
            'Verified By': 'Ravi Patil',
            'Done By': 'Sneha Kulkarni',
            'Validated By': 'Vishal Jadhav',
            'Issued By': 'Priya Deshmukh',
        },
        signatoryOn: {
            'Prepared On': '2025-09-12 10:30 AM',
            'Approve On': '2025-09-12 11:15 AM',
            'Verified On': '2025-09-12 01:00 PM',
            'Done On': '2025-09-12 02:45 PM',
            'Validated On': '2025-09-12 03:30 PM',
            'Issued On': '2025-09-12 04:00 PM',
            'Effective On': '2025-09-13 09:00 AM',
        },
        issuedNo: docMeta?.issuedNo || 'N/A',
        copyNo: docMeta?.copyNo || 'N/A',
        amendmentNo: docMeta?.amendmentNo || 'N/A',
        preparedBy: docMeta?.preparedBy || 'N/A',
        approvedBy: docMeta?.approvedBy || 'N/A',
        issuedBy: docMeta?.issuedBy || 'N/A',
        issueDate: docMeta?.issueDate || 'N/A',
        amendmentDate: docMeta?.amendmentDate || 'N/A',
        effectiveDate: docMeta?.effectiveDate || 'N/A',
    }

    // Simple span fields
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
    ]

    simpleFields.forEach((key) => {
        editor.BlockManager.add(`field-${key}`, {
            label: key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (s) => s.toUpperCase()),
            category: 'Dynamic Fields',
            content: `<span class="dynamic-field" data-field="${key}">${(dynamicData as any)[key]}</span>`,
        })
    })

    // Selection box fields
    const fields = [
        'username',
        'department',
        'category',
        'subcategory',
        'invoiceNo',
        'userDetails',
        'signatoryBy',
        'signatoryOn',
    ] as const

    fields.forEach((fieldKey) => {
        let values: any[] = []

        if (fieldKey === 'signatoryBy' || fieldKey === 'signatoryOn') {
            values = Object.entries(dynamicData[fieldKey]).map(
                ([key, val]) => ({ key, value: val }),
            )
        } else {
            values = dynamicData[fieldKey] as any[]
        }

        editor.BlockManager.add(`field-${fieldKey}`, {
            label: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1),
            category: 'Dynamic Fields',
            content: `<div class="dynamic-field" data-field="${fieldKey}">
        <select onchange="window.handleDynamicSelect(this)">
          <option value="">Select ${fieldKey}</option>
          ${values
              .map((val: any) => {
                  if (fieldKey === 'userDetails') {
                      return `<option value='${JSON.stringify(val)}'>${val.email}</option>`
                  }
                  if (
                      fieldKey === 'signatoryBy' ||
                      fieldKey === 'signatoryOn'
                  ) {
                      return `<option value="${val.value}">${val.key} - ${val.value}</option>`
                  }
                  return `<option value="${val}">${val}</option>`
              })
              .join('')}
        </select>
        <div class="selected-value" style="margin-top:4px;"></div>
      </div>`,
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
