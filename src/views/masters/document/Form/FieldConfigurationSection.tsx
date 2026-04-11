/* eslint-disable @typescript-eslint/no-explicit-any */
import { categorizeThDetails } from '@/@types/document'
import { Card } from '@/components/ui'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
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
            <h4 className="text-lg font-semibold mb-6">Field Configuration</h4>
            {(['daily', 'oneTime'] as const).map((section) => (
                <div key={section} className="mb-10">
                    <h3 className="text-base font-semibold mb-4 capitalize">
                        {section === 'daily'
                            ? 'Daily Fields'
                            : 'One-Time Fields'}
                    </h3>

                    <div className="space-y-5">
                        {triates[section].map((field, index) => {
                            const type = field.traits?.[0]?.value ?? 'text'
                            const saved = {
                                validation: 'alphanumeric',
                                ...form_fields?.[field.headerText],
                            }

                            return (
                                <Card
                                    key={`${section}-${index}`}
                                    className="p-5 border"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium">
                                            {field.headerText}
                                        </h4>
                                        <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                                            {type}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-5">
                                        {section === 'daily' && (
                                            <Checkbox
                                                checked={saved.dynamic || false}
                                                onChange={(checked) =>
                                                    setValue('form_fields', {
                                                        ...form_fields,
                                                        [field.headerText]: {
                                                            ...saved,
                                                            type,
                                                            dynamic: checked,
                                                        },
                                                    })
                                                }
                                            >
                                                Dynamic Field
                                            </Checkbox>
                                        )}

                                        {saved.dynamic && (
                                            <>
                                                <Select
                                                    placeholder="Select Table"
                                                    value={
                                                        saved.table
                                                            ? {
                                                                  label: saved.table,
                                                                  value: saved.table,
                                                              }
                                                            : null
                                                    }
                                                    options={TABLESLIST.map(
                                                        (t) => ({
                                                            label: t,
                                                            value: t,
                                                        }),
                                                    )}
                                                    onChange={(option: any) =>
                                                        setValue(
                                                            'form_fields',
                                                            {
                                                                ...form_fields,
                                                                [field.headerText]:
                                                                    {
                                                                        ...saved,
                                                                        type,
                                                                        table: option?.value,
                                                                        field: '',
                                                                    },
                                                            },
                                                        )
                                                    }
                                                />

                                                {saved.table && (
                                                    <Select
                                                        placeholder="Select Field"
                                                        value={
                                                            saved.field
                                                                ? {
                                                                      label: saved.field,
                                                                      value: saved.field,
                                                                  }
                                                                : null
                                                        }
                                                        options={(
                                                            TABLEWISELIST[
                                                                saved.table
                                                            ] || []
                                                        ).map((f: string) => ({
                                                            label: f,
                                                            value: f,
                                                        }))}
                                                        onChange={(
                                                            option: any,
                                                        ) =>
                                                            setValue(
                                                                'form_fields',
                                                                {
                                                                    ...form_fields,
                                                                    [field.headerText]:
                                                                        {
                                                                            ...saved,
                                                                            type,
                                                                            field: option?.value,
                                                                        },
                                                                },
                                                            )
                                                        }
                                                    />
                                                )}
                                            </>
                                        )}

                                        {!saved.dynamic && (
                                            <>
                                                {type === 'text' && (
                                                    <Select
                                                        placeholder="Select Validation"
                                                        value={{
                                                            label:
                                                                saved.validation ===
                                                                'alphabet'
                                                                    ? 'Alphabet Only'
                                                                    : saved.validation ===
                                                                        'email'
                                                                      ? 'Email'
                                                                      : saved.validation ===
                                                                          'no-spaces'
                                                                        ? 'No Spaces'
                                                                        : 'Alphanumeric',
                                                            value: saved.validation,
                                                        }}
                                                        options={[
                                                            {
                                                                label: 'Alphabet Only',
                                                                value: 'alphabet',
                                                            },
                                                            {
                                                                label: 'Alphanumeric',
                                                                value: 'alphanumeric',
                                                            },
                                                            {
                                                                label: 'Email',
                                                                value: 'email',
                                                            },
                                                            {
                                                                label: 'No Spaces',
                                                                value: 'no-spaces',
                                                            },
                                                        ]}
                                                        onChange={(
                                                            option: any,
                                                        ) =>
                                                            setValue(
                                                                'form_fields',
                                                                {
                                                                    ...form_fields,
                                                                    [field.headerText]:
                                                                        {
                                                                            ...saved,
                                                                            type,
                                                                            validation:
                                                                                option?.value ||
                                                                                'alphanumeric',
                                                                        },
                                                                },
                                                            )
                                                        }
                                                    />
                                                )}

                                                {type === 'textarea' && (
                                                    <Input
                                                        type="number"
                                                        placeholder="Rows"
                                                        value={saved.rows || 3}
                                                        onChange={(e) =>
                                                            setValue(
                                                                'form_fields',
                                                                {
                                                                    ...form_fields,
                                                                    [field.headerText]:
                                                                        {
                                                                            ...saved,
                                                                            type,
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
                                                )}

                                                {type === 'number' && (
                                                    <>
                                                        <Input
                                                            type="number"
                                                            placeholder="Minimum Value"
                                                            value={
                                                                saved.min ?? ''
                                                            }
                                                            onChange={(e) =>
                                                                setValue(
                                                                    'form_fields',
                                                                    {
                                                                        ...form_fields,
                                                                        [field.headerText]:
                                                                            {
                                                                                ...saved,
                                                                                type,
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
                                                        <Input
                                                            type="number"
                                                            placeholder="Maximum Value"
                                                            value={
                                                                saved.max ?? ''
                                                            }
                                                            onChange={(e) =>
                                                                setValue(
                                                                    'form_fields',
                                                                    {
                                                                        ...form_fields,
                                                                        [field.headerText]:
                                                                            {
                                                                                ...saved,
                                                                                type,
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
                                                    </>
                                                )}
                                                {(type === 'checkbox' ||
                                                    type === 'radio' ||
                                                    type === 'select' ||
                                                    type === 'multiselect') && (
                                                    <Input
                                                        placeholder="Option 1, Option 2"
                                                        value={
                                                            saved.options || ''
                                                        }
                                                        onChange={(e) =>
                                                            setValue(
                                                                'form_fields',
                                                                {
                                                                    ...form_fields,
                                                                    [field.headerText]:
                                                                        {
                                                                            ...saved,
                                                                            type,
                                                                            options:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        },
                                                                },
                                                            )
                                                        }
                                                    />
                                                )}

                                                {(type === 'date' ||
                                                    type === 'time' ||
                                                    type === 'datetime') && (
                                                    <Select
                                                        value={
                                                            saved.format
                                                                ? {
                                                                      label: saved.format,
                                                                      value: saved.format,
                                                                  }
                                                                : null
                                                        }
                                                        options={[
                                                            {
                                                                label: 'YYYY-MM-DD',
                                                                value: 'YYYY-MM-DD',
                                                            },
                                                            {
                                                                label: 'DD/MM/YYYY',
                                                                value: 'DD/MM/YYYY',
                                                            },
                                                            {
                                                                label: 'HH:mm',
                                                                value: 'HH:mm',
                                                            },
                                                            {
                                                                label: 'hh:mm A',
                                                                value: 'hh:mm A',
                                                            },
                                                        ]}
                                                        onChange={(
                                                            option: any,
                                                        ) =>
                                                            setValue(
                                                                'form_fields',
                                                                {
                                                                    ...form_fields,
                                                                    [field.headerText]:
                                                                        {
                                                                            ...saved,
                                                                            type,
                                                                            format: option?.value,
                                                                        },
                                                                },
                                                            )
                                                        }
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            ))}
        </Card>
    )
}

export default FieldConfigurationSection
