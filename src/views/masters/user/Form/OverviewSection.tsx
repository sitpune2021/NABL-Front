import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { countryList } from '@/constants/countries.constant'
import Avatar from '@/components/ui/Avatar'
import { FormSectionBaseProps } from '@/@types/user'
import { useMemo } from 'react'
import { components, ControlProps, OptionProps } from 'react-select'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { NumericInput } from '@/components/shared'
import { UserSchemaType } from '@/schemas/user.schema'

type CountryOption = {
    label: string
    dialCode: string
    value: string
}
const { Control } = components

const CustomSelectOption = (props: OptionProps<CountryOption>) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    <span>{data.dialCode}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({ readOnly, loading }: OverviewSectionProps) => {
    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<UserSchemaType>()
    console.log(errors, 'errors')

    return (
        <Card>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="Name"
                    invalid={!!errors.name}
                    errorMessage={errors.name?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Name"
                        disabled={readOnly || loading}
                        {...register('name')}
                    />
                </FormItem>
                <FormItem
                    label="Username"
                    invalid={!!errors.username}
                    errorMessage={errors.username?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Username"
                        disabled={readOnly || loading}
                        {...register('username')}
                    />
                </FormItem>
                <FormItem
                    label="Email"
                    invalid={!!errors.email}
                    errorMessage={errors.email?.message}
                >
                    <Input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Email"
                        disabled={readOnly || loading}
                        {...register('email')}
                    />
                </FormItem>
            </div>
            <div className="flex items-end gap-4 w-full">
                <FormItem
                    invalid={Boolean(errors.phone) || Boolean(errors.dialCode)}
                    errorMessage={errors.dialCode?.message}
                >
                    <label className="form-label mb-2">Phone number</label>
                    <Controller
                        name="dialCode"
                        control={control}
                        render={({ field }) => {
                            const currentValue = field.value || '+91'
                            const selectedOption = dialCodeList.find(
                                (option) => option.dialCode === currentValue,
                            )

                            return (
                                <Select<CountryOption>
                                    options={dialCodeList}
                                    {...field}
                                    className="w-[150px]"
                                    components={{
                                        Option: CustomSelectOption,
                                        Control: CustomControl,
                                    }}
                                    placeholder=""
                                    value={selectedOption}
                                    isDisabled={readOnly || loading}
                                    onChange={(option) =>
                                        field.onChange(
                                            option?.dialCode || '+91',
                                        )
                                    }
                                />
                            )
                        }}
                    />
                </FormItem>
                <FormItem
                    className="w-full"
                    invalid={Boolean(errors.phone) || Boolean(errors.dialCode)}
                    errorMessage={errors.phone?.message}
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                autoComplete="off"
                                placeholder="Phone Number"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
