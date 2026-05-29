import { PrefixConfigFormSchema } from '@/schemas/prefixConfig.schema'

export const EMPTY_VALUES: PrefixConfigFormSchema = {
    master_key: '',
    master_name: '',
    separator: '-',
    segment_count: 2,
    value_min_length: 1,
    value_max_length: 255,
    characters_min_length: 1,
    characters_max_length: 255,
    segments: [
        {
            type: 'letters',
            case: 'upper',
            min_length: 1,
            max_length: 4,
            starts_with: 'letter',
        },
        {
            type: 'numbers',
            case: 'any',
            min_length: 1,
            max_length: 2,
            starts_with: 'number',
        },
    ],
    is_active: true,
}
