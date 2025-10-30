/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

import { Controller } from 'react-hook-form'

const StandardSection = ({ control, errors, readOnly }: any) => {
    return (
        <Card>
            <h4 className="mb-6 text-lg font-semibold">Standard</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <FormItem
                    label="Name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter Name"
                                readOnly={readOnly}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Unique Id"
                    invalid={Boolean(errors.uuid)}
                    errorMessage={errors.uuid?.message}
                >
                    <Controller
                        name="uuid"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Enter Unique Id"
                                readOnly={readOnly}
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default StandardSection
