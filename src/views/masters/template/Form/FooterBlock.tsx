/* eslint-disable @typescript-eslint/no-explicit-any */

const footerContent = {
    tagName: 'footer',
    classes: ['footer'],
    components: [
        {
            tagName: 'table',
            classes: ['footer-table', 'solution-table'],
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
            components: function (props: any) {
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
                            { content: '', colSpan: 1, editable: true },
                            {
                                content: 'Document Name',
                                colSpan: 1,
                                style: { fontWeight: 'bold' },
                            },
                            { content: '', colSpan: 3, editable: true },
                        ],
                    },
                    {
                        cells: [
                            {
                                content: 'Prepared By',
                                colSpan: 1,
                                style: { fontWeight: 'bold' },
                            },
                            { content: 'Name:', colSpan: 2, editable: true },
                            {
                                content: 'Designation:',
                                colSpan: 2,
                                editable: true,
                            },
                            { content: 'Sign:', colSpan: 1, editable: true },
                        ],
                    },
                    {
                        cells: [
                            {
                                content: 'Approved By',
                                colSpan: 1,
                                style: { fontWeight: 'bold' },
                            },
                            { content: 'Name:', colSpan: 2, editable: true },
                            {
                                content: 'Designation:',
                                colSpan: 2,
                                editable: true,
                            },
                            { content: 'Sign:', colSpan: 1, editable: true },
                        ],
                    },
                    {
                        cells: [
                            {
                                content: 'Issued By',
                                colSpan: 1,
                                style: { fontWeight: 'bold' },
                            },
                            { content: 'Name:', colSpan: 2, editable: true },
                            {
                                content: 'Designation:',
                                colSpan: 2,
                                editable: true,
                            },
                            { content: 'Sign:', colSpan: 1, editable: true },
                        ],
                    },

                    {
                        cells: [
                            { content: 'Issue No.', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                            { content: 'Issue Date', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                            { content: 'Status', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                        ],
                    },
                    {
                        cells: [
                            { content: 'Amendment No.', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                            { content: 'Amendment Date', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                            { content: 'Effective Date', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                        ],
                    },
                    {
                        cells: [
                            { content: 'Copy No.', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                            { content: 'Copy Location', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                            { content: 'Page No.', colSpan: 1 },
                            { content: '', colSpan: 1, editable: true },
                        ],
                    },
                ]

                return [
                    {
                        tagName: 'tbody',
                        components: footerRows
                            .slice(0, num_rows)
                            .map((row) => ({
                                tagName: 'tr',
                                type: 'tr',
                                components: row.cells.map((cell: any) => ({
                                    tagName: 'td',
                                    type: 'td',
                                    classes: ['footer-td', 'solution-td'],
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
                                            default: cell.colSpan,
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
    ],
}
export default footerContent
