 
import { memo, useMemo } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { components , ControlProps, OptionProps } from 'react-select'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import type { ProfileFormSchema } from '@/schemas/account.schema'
import { countryList } from '@/constants/countries.constant'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import { NumericInput } from '@/components/shared'

const { Control } = components

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const CustomSelectOption = (
    props: OptionProps<CountryOption> & { variant: 'country' | 'phone' },
) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    {props.variant === 'country' && <span>{label}</span>}
                    {props.variant === 'phone' && <span>{data.dialCode}</span>}
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

const ProfileOverview = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext<ProfileFormSchema>()

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const beforeUpload = (files: FileList | null) => {
        const allowedFileType = ['image/jpeg', 'image/png']
        if (files && !allowedFileType.includes(files[0].type)) {
            return 'Please upload a .jpeg or .png file!'
        }
        return true
    }

    return (
        <>
            <div className="mb-8">
                <Controller
                    name="profileImage"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center gap-4">
                            <Avatar
                                size={90}
                                className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                icon={<HiOutlineUser />}
                                src={field.value || ''}
                            />
                            <div className="flex items-center gap-2">
                                <Upload
                                    showList={false}
                                    uploadLimit={1}
                                    beforeUpload={beforeUpload}
                                    onChange={(files) => {
                                        if (files.length > 0) {
                                            field.onChange(
                                                URL.createObjectURL(files[0]),
                                            )
                                        }
                                    }}
                                >
                                    <Button
                                        variant="solid"
                                        size="sm"
                                        type="button"
                                        icon={<TbPlus />}
                                    >
                                        Upload Image
                                    </Button>
                                </Upload>
                                <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                        field.onChange('')
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <FormItem
                    label="First name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="First Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="User name"
                    invalid={Boolean(errors.username)}
                    errorMessage={errors.username?.message}
                >
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="username"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
            <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="email"
                            autoComplete="off"
                            placeholder="Email"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <div className="flex items-end gap-4 w-full mb-6">
                <FormItem
                    invalid={Boolean(errors.phone) || Boolean(errors.dialCode)}
                >
                    <label className="form-label mb-2">Phone number</label>
                    <Controller
                        name="dialCode"
                        control={control}
                        render={({ field }) => (
                            <Select<CountryOption>
                                options={dialCodeList}
                                {...field}
                                className="w-[150px]"
                                components={{
                                    Option: (props) => (
                                        <CustomSelectOption
                                            variant="phone"
                                            {...(props as OptionProps<CountryOption>)}
                                        />
                                    ),
                                    Control: CustomControl,
                                }}
                                placeholder=""
                                value={dialCodeList.filter(
                                    (option) => option.dialCode === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.dialCode)
                                }
                            />
                        )}
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
            <h4 className="mb-6">Address information</h4>
            <FormItem
                label="Address"
                invalid={Boolean(errors.address)}
                errorMessage={errors.address?.message}
            >
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            type="text"
                            autoComplete="off"
                            placeholder="Email"
                            {...field}
                            value={field.value ?? ''}
                        />
                    )}
                />
            </FormItem>
        </>
    )
}

export default memo(ProfileOverview)
