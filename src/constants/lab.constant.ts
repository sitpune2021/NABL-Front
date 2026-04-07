import { LabFormSchema } from '@/schemas/lab.schema'

export const getEmptyValues = (labCount: number): LabFormSchema => ({
    name: '',
    lab_type: '',
    lab_code: `LAB-${labCount + 1}`,
    location_limit: '',
    user_limit: '',
    emails: [
        {
            id: null,
            user_id: null,
            type: 'email',
            value: '',
            label: 'primary',
            is_primary: true,
        },
    ],
    phones: [
        {
            id: null,
            user_id: null,
            type: 'phone',
            value: '',
            label: 'primary',
            is_primary: true,
        },
    ],
    location: [
        {
            id: null,
            zone_id: '',
            cluster_id: '',
            location_id: '',
            departments: [{ id: null, name: '', instruments: [] }],
            prefix: '',
            shortName: '',
            emails: [
                {
                    id: null,
                    user_id: null,
                    type: 'email',
                    value: '',
                    label: 'primary',
                    is_primary: true,
                },
            ],
            phones: [
                {
                    id: null,
                    user_id: null,
                    type: 'phone',
                    value: '',
                    label: 'primary',
                    is_primary: true,
                },
            ],
            instruments: [],
        },
    ],
    documents: [],
    standard: {
        standard_id: null,
        selectedClauses: [],
    },
})
