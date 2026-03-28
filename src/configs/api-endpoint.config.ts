const apiEndpointConfig = {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    getCurrentProfile: '/profile',
    dashbord: '/home',
    categories: '/categories',
    subCategories: '/sub-categories',
    departments: '/departments',
    units: '/units',
    instruments: '/instruments',
    templates: '/templates',
    templatesVerions: '/templates/versions',
    zones: '/zones',
    clusters: '/clusters',
    locations: '/locations',
    labs: '/labs',
    labsAssignments: '/lab-assignments',
    standards: '/standards',
    clauses: '/clauses',

    roles: '/roles',
    users: '/users',

    dataEntry: '/documents/data-entry',
    documents: '/documents',
    documentsWorkflowAction: '/documents/workflow-action',
    generateDocumentNumber: '/documents/generate-number',

    navigationItems: '/navigation-items',
    accessModules: '/access-modules',
    roleLevels: '/roles/levels',
    syncMaster: '/sync-master',
    labTaskAssign: '/lab-task-assign',
}

export default apiEndpointConfig
