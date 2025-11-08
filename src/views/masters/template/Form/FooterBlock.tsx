const footerContent = {
    tagName: 'footer',
    style: {
        textAlign: 'center',
        padding: '20px',
        background: '#f0f0f0',
        borderTop: '1px solid #ccc',
    },
    components: [
        {
            tagName: 'table',
            classes: ['solution-table'],
            type: 'table',
            traits: [
                {
                    type: 'number',
                    name: 'num_rows',
                    label: 'Number of Rows',
                    min: 5,
                    max: 10,
                    default: 7, // Default to 7 rows (matching footer)
                    changeProp: true,
                },
                {
                    type: 'number',
                    name: 'numCols',
                    label: 'Number of Columns',
                    min: 6,
                    max: 6, // Fixed to 6 columns for footer
                    default: 6,
                    changeProp: true,
                },
            ],
            stylable: false,
            components: function (props) {
                const num_rows = props.num_rows || 7 // Use prop or default to 7
                const numCols = props.numCols || 6 // Fixed to 6 for footer

                const footerRows = [
                    {
                        cells: [
                            {
                                content: 'Document No.',
                                colSpan: 1,
                                style: { fontWeight: 'bold' },
                            },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                            {
                                content: 'Document Name',
                                colSpan: 1,
                                style: { fontWeight: 'bold' },
                            },
                            {
                                content: '',
                                colSpan: 3,
                                editable: true,
                            },
                        ],
                    },
                    {
                        cells: [
                            {
                                content: 'Prepared By',
                                colSpan: 1,
                                style: {
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                },
                            },
                            {
                                content: 'Name: ',
                                colSpan: 2,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                            {
                                content: 'Designation: ',
                                colSpan: 2,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                            {
                                content: 'Sign: ',
                                colSpan: 1,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                        ],
                    },
                    {
                        cells: [
                            {
                                content: 'Approved By',
                                colSpan: 1,
                                style: {
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                },
                            },
                            {
                                content: 'Name: ',
                                colSpan: 2,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                            {
                                content: 'Designation: ',
                                colSpan: 2,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                            {
                                content: 'Sign: ',
                                colSpan: 1,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                        ],
                    },
                    {
                        cells: [
                            {
                                content: 'Issued By',
                                colSpan: 1,
                                style: {
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                },
                            },
                            {
                                content: 'Name: ',
                                colSpan: 2,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                            {
                                content: 'Designation: ',
                                colSpan: 2,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                            {
                                content: 'Sign: ',
                                colSpan: 1,
                                style: { textAlign: 'left' },
                                editable: true,
                            },
                        ],
                    },
                    {
                        cells: [
                            {
                                content: 'Issue No.',
                                colSpan: 1,
                            },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                            {
                                content: 'Issue Date',
                                colSpan: 1,
                            },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                            { content: 'Status', colSpan: 1 },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                        ],
                    },
                    {
                        cells: [
                            {
                                content: 'Amendment No.',
                                colSpan: 1,
                            },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                            {
                                content: 'Amendment Date',
                                colSpan: 1,
                            },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                            {
                                content: 'Effective Date',
                                colSpan: 1,
                            },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                        ],
                    },
                    {
                        cells: [
                            { content: 'Copy No.', colSpan: 1 },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                            {
                                content: 'Copy Location',
                                colSpan: 1,
                            },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                            { content: 'Page No.', colSpan: 1 },
                            {
                                content: '',
                                colSpan: 1,
                                editable: true,
                            },
                        ],
                    },
                ]

                return [
                    {
                        tagName: 'tbody',
                        type: 'tbody',
                        components: footerRows
                            .slice(0, num_rows)
                            .map((row) => ({
                                tagName: 'tr',
                                type: 'tr',
                                components: row.cells.map((cell) => ({
                                    tagName: 'td',
                                    type: 'td',
                                    classes: ['solution-td'],
                                    style: cell.style
                                        ? Object.keys(cell.style)
                                              .map(
                                                  (key) =>
                                                      `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${cell.style[key]}`,
                                              )
                                              .join(';')
                                        : '',
                                    attributes: {
                                        colSpan: cell.colSpan,
                                    },
                                    traits: [
                                        // Traits with defaults
                                        {
                                            type: 'number',
                                            name: 'colspan',
                                            label: 'Colspan',
                                            min: 1,
                                            max: numCols,
                                            default: cell.colSpan, // Default to the cell's defined colSpan
                                        },
                                        {
                                            type: 'number',
                                            name: 'rowspan',
                                            label: 'Rowspan',
                                            min: 1,
                                            max: num_rows,
                                            default: 1, // Default to 1
                                        },
                                    ],
                                    components: [
                                        {
                                            tagName: 'div',
                                            type: 'text',
                                            content: cell.content,
                                            attributes: {
                                                contentEditable: cell.editable
                                                    ? 'true'
                                                    : 'false',
                                            },
                                        },
                                    ],
                                })),
                            })),
                    },
                ]
            },
        },
        {
            tagName: 'div',
            type: 'default', // Or 'div' if you have a custom type
            style: { marginTop: '20px' }, // Optional styling for the div
            components: [
                {
                    tagName: 'p',
                    style: {
                        'font-size': '13px',
                        color: '#333',
                        'text-align': 'center',
                    },
                    components: [
                        '© ',
                        {
                            tagName: 'span',
                            type: 'field-year',
                            attributes: {
                                'data-field': 'year',
                            },
                            content: '{{year}}',
                        },
                        ' ',
                        {
                            tagName: 'span',
                            type: 'field-name',
                            attributes: {
                                'data-field': 'name',
                            },
                            content: '{{name}}',
                        },
                        ' Pvt Ltd. All rights reserved.',
                    ],
                },
            ],
        },
    ],
}
export default footerContent
