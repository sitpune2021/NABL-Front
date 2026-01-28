/* eslint-disable @typescript-eslint/no-explicit-any */
import { categorizeThDetails } from '@/@types/document'
import { Card } from '@/components/ui'
import { TABLESLIST, TABLEWISELIST } from '@/constants/document.constant'
import { useFormContext, useWatch } from 'react-hook-form'

const FieldConfigurationSection = () => {
    const { control, setValue } = useFormContext<any>()
    const [editor_schema, form_fields] = useWatch({
        control,
        name: ['editor_schema', 'form_fields'],
    })
    const triates = categorizeThDetails(editor_schema?.json)
    if (!editor_schema?.json) return null
    return (
        <Card>
            <h4>Field Configuration </h4>
            {(['daily', 'oneTime'] as const).map((section) => (
                <div key={section} className="mb-8">
                    <div className="flex items-center mb-4">
                        <div
                            className={`w-4 h-4 rounded-full mr-3 ${
                                section === 'daily'
                                    ? 'bg-green-400'
                                    : 'bg-purple-400'
                            }`}
                        ></div>
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">
                            {section === 'daily'
                                ? 'Daily Fields'
                                : 'One-Time Fields'}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {triates[section].map((field, index) => {
                            const type = field.traits?.[0]?.value ?? 'text'
                            const saved = form_fields?.[field.headerText] || {}

                            return (
                                <div
                                    key={`${section}-${index}`}
                                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200"
                                >
                                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <span className="w-3 h-3 bg-blue-300 rounded-full mr-2"></span>
                                            {field.headerText}
                                        </span>
                                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border">
                                            {type}
                                        </span>
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {section === 'daily' && (
                                            <div className="flex items-center">
                                                <label className="flex items-center cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                saved.dynamic ||
                                                                false
                                                            }
                                                            className="sr-only"
                                                            onChange={(e) =>
                                                                setValue(
                                                                    'form_fields',
                                                                    {
                                                                        ...form_fields,
                                                                        [field.headerText]:
                                                                            {
                                                                                ...saved,
                                                                                type: type,
                                                                                dynamic:
                                                                                    e
                                                                                        .target
                                                                                        .checked,
                                                                            },
                                                                    },
                                                                )
                                                            }
                                                        />
                                                        <div
                                                            className={`block w-12 h-6 rounded-full transition-colors ${
                                                                saved.dynamic
                                                                    ? 'bg-green-500'
                                                                    : 'bg-gray-300'
                                                            }`}
                                                        ></div>
                                                        <div
                                                            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                                                saved.dynamic
                                                                    ? 'transform translate-x-6'
                                                                    : ''
                                                            }`}
                                                        ></div>
                                                    </div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                                        Dynamic Field
                                                    </span>
                                                </label>
                                            </div>
                                        )}

                                        {saved.dynamic && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Table
                                                    </label>
                                                    <select
                                                        value={
                                                            saved.table || ''
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        onChange={(e) =>
                                                            setValue(
                                                                'form_fields',
                                                                {
                                                                    ...form_fields,
                                                                    [field.headerText]:
                                                                        {
                                                                            ...saved,
                                                                            type: type,
                                                                            table: e
                                                                                .target
                                                                                .value,
                                                                            field: '',
                                                                        },
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Table
                                                        </option>
                                                        {TABLESLIST.map((t) => (
                                                            <option
                                                                key={t}
                                                                value={t}
                                                            >
                                                                {t}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {saved.table && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Field
                                                        </label>
                                                        <select
                                                            value={
                                                                saved.field ||
                                                                ''
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            onChange={(e) =>
                                                                setValue(
                                                                    'form_fields',
                                                                    {
                                                                        ...form_fields,
                                                                        [field.headerText]:
                                                                            {
                                                                                ...saved,
                                                                                type: type,
                                                                                field: e
                                                                                    .target
                                                                                    .value,
                                                                            },
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <option value="">
                                                                Select Field
                                                            </option>
                                                            {TABLEWISELIST[
                                                                saved.table
                                                            ]?.map((f) => (
                                                                <option
                                                                    key={f}
                                                                    value={f}
                                                                >
                                                                    {f}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {!saved.dynamic && (
                                            <>
                                                {type === 'text' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Validation
                                                        </label>
                                                        <select
                                                            value={
                                                                saved.validation ||
                                                                ''
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            onChange={(e) =>
                                                                setValue(
                                                                    'form_fields',
                                                                    {
                                                                        ...form_fields,
                                                                        [field.headerText]:
                                                                            {
                                                                                ...saved,
                                                                                type: type,
                                                                                validation:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <option value="">
                                                                Select
                                                                Validation
                                                            </option>
                                                            <option value="alphabet">
                                                                Alphabet Only
                                                            </option>
                                                            <option value="alphanumeric">
                                                                Alphanumeric
                                                            </option>
                                                            <option value="email">
                                                                Email
                                                            </option>
                                                            <option value="no-spaces">
                                                                No Spaces
                                                            </option>
                                                        </select>
                                                    </div>
                                                )}

                                                {type === 'textarea' && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Rows
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={
                                                                saved.rows || 3
                                                            }
                                                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            onChange={(e) =>
                                                                setValue(
                                                                    'form_fields',
                                                                    {
                                                                        ...form_fields,
                                                                        [field.headerText]:
                                                                            {
                                                                                ...saved,
                                                                                type: type,
                                                                                rows: Number(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ),
                                                                            },
                                                                    },
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                {type === 'number' && (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Minimum Value
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={
                                                                    saved.min ??
                                                                    ''
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                onChange={(e) =>
                                                                    setValue(
                                                                        'form_fields',
                                                                        {
                                                                            ...form_fields,
                                                                            [field.headerText]:
                                                                                {
                                                                                    ...saved,
                                                                                    type: type,
                                                                                    min: Number(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    ),
                                                                                },
                                                                        },
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Maximum Value
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={
                                                                    saved.max ??
                                                                    ''
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                onChange={(e) =>
                                                                    setValue(
                                                                        'form_fields',
                                                                        {
                                                                            ...form_fields,
                                                                            [field.headerText]:
                                                                                {
                                                                                    ...saved,
                                                                                    type: type,
                                                                                    max: Number(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    ),
                                                                                },
                                                                        },
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {(type === 'checkbox' ||
                                                    type === 'radio' ||
                                                    type === 'select' ||
                                                    type === 'multiselect') && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Options (comma
                                                            separated)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                saved.options ||
                                                                ''
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Option 1, Option 2, Option 3"
                                                            onChange={(e) =>
                                                                setValue(
                                                                    'form_fields',
                                                                    {
                                                                        ...form_fields,
                                                                        [field.headerText]:
                                                                            {
                                                                                ...saved,
                                                                                type: type,
                                                                                options:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                    },
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                {(type === 'date' ||
                                                    type === 'time' ||
                                                    type === 'datetime') && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            {type === 'date' &&
                                                                'Date Format'}
                                                            {type === 'time' &&
                                                                'Time Format'}
                                                            {type ===
                                                                'datetime' &&
                                                                'DateTime Format'}
                                                        </label>
                                                        <select
                                                            value={
                                                                saved.format ||
                                                                ''
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            onChange={(e) =>
                                                                setValue(
                                                                    'form_fields',
                                                                    {
                                                                        ...form_fields,
                                                                        [field.headerText]:
                                                                            {
                                                                                ...saved,
                                                                                type: type,

                                                                                format: e
                                                                                    .target
                                                                                    .value,
                                                                            },
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            {type ===
                                                                'date' && (
                                                                <>
                                                                    <option value="YYYY-MM-DD">
                                                                        YYYY-MM-DD
                                                                    </option>
                                                                    <option value="DD/MM/YYYY">
                                                                        DD/MM/YYYY
                                                                    </option>
                                                                </>
                                                            )}
                                                            {type ===
                                                                'time' && (
                                                                <>
                                                                    <option value="HH:mm">
                                                                        HH:mm
                                                                    </option>
                                                                    <option value="hh:mm A">
                                                                        hh:mm A
                                                                    </option>
                                                                </>
                                                            )}
                                                            {type ===
                                                                'datetime' && (
                                                                <>
                                                                    <option value="YYYY-MM-DD HH:mm">
                                                                        YYYY-MM-DD
                                                                        HH:mm
                                                                    </option>
                                                                    <option value="DD/MM/YYYY hh:mm A">
                                                                        DD/MM/YYYY
                                                                        hh:mm A
                                                                    </option>
                                                                </>
                                                            )}
                                                        </select>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </Card>
    )
}

export default FieldConfigurationSection
