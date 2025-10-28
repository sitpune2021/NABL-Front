export const accessModules = [
    // Masters stack
    {
        id: 'category',
        key: 'masters.category',
        name: 'Category Management',
        description: 'Access control for category operations',
        linkedMenuKeys: ['masters.category.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'subcategory',
        key: 'masters.subcategory',
        name: 'Subcategory Management',
        description: 'Access control for subcategory operations',
        linkedMenuKeys: ['masters.subcategory.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'department',
        key: 'masters.department',
        name: 'Department Management',
        description: 'Access control for department operations',
        linkedMenuKeys: ['masters.department.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'template',
        key: 'masters.template',
        name: 'Template Management',
        description: 'Access control for template operations',
        linkedMenuKeys: ['masters.template.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'document',
        key: 'masters.document',
        name: 'Document Management',
        description: 'Access control for document operations',
        linkedMenuKeys: ['masters.document.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Data Entry', value: 'data-entry' },
            { label: 'Data Review', value: 'data-review' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'lab',
        key: 'masters.lab',
        name: 'Lab Management',
        description: 'Access control for lab operations',
        linkedMenuKeys: ['masters.lab.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },

    // Settings stack
    {
        id: 'unit',
        key: 'masters.unit',
        name: 'Unit Management',
        description: 'Access control for unit operations',
        linkedMenuKeys: ['masters.unit.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'rolesPermission',
        key: 'masters.rolesPermission',
        name: 'Roles & Permissions',
        description: 'Access control for managing roles and permissions',
        linkedMenuKeys: ['masters.rolesPermission.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'user',
        key: 'masters.user',
        name: 'User Management',
        description: 'Access control for user operations',
        linkedMenuKeys: ['masters.user.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'clauses',
        key: 'masters.clauses',
        name: 'Clauses Management',
        description: 'Access control for clause operations',
        linkedMenuKeys: ['masters.clauses.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },

    // Extra Settings stack
    {
        id: 'signatoryBy',
        key: 'masters.signatoryBy',
        name: 'Signatory By Management',
        description: 'Access control for signatory "By" operations',
        linkedMenuKeys: ['masters.signatoryBy.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
    {
        id: 'signatoryOn',
        key: 'masters.signatoryOn',
        name: 'Signatory On Management',
        description: 'Access control for signatory "On" operations',
        linkedMenuKeys: ['masters.signatoryOn.list'],
        accessor: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
        ],
    },
]
