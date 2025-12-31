import { memo, useMemo } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import {
    HiOutlineUser,
    HiOutlineLocationMarker,
    HiOutlineOfficeBuilding,
} from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import type { ProfileFormSchema } from '@/schemas/account.schema'

const ProfileOverview = () => {
    const {
        control,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<ProfileFormSchema>()

    const userRoles = watch('userRoles')
    const dialCodeList = useMemo(
        () => countryList.map((c) => ({ ...c, label: c.dialCode })),
        [],
    )

    return (
        <div className="max-w-[800px] mx-auto p-4">
            <h4 className="mb-8 font-bold text-xl">Personal Information</h4>

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
                                    onChange={(files) => {
                                        if (files.length > 0) {
                                            setValue(
                                                'profileImage',
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
                                    onClick={() => setValue('profileImage', '')}
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
                    label="Full Name"
                    invalid={!!errors.name}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Full Name" />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Username"
                    invalid={!!errors.username}
                    errorMessage={errors.username?.message}
                >
                    <Controller
                        name="username"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} placeholder="Username" />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem
                label="Email"
                invalid={!!errors.email}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Email" />
                    )}
                />
            </FormItem>

            <div className="flex items-end gap-4 w-full mb-6">
                <FormItem label="Phone number" className="mb-0">
                    <Controller
                        name="dialCode"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className="w-[120px]"
                                options={dialCodeList}
                                value={dialCodeList.find(
                                    (opt) => opt.dialCode === field.value,
                                )}
                                onChange={(opt) =>
                                    field.onChange(opt?.dialCode)
                                }
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    className="w-full mb-0"
                    invalid={!!errors.phone}
                    errorMessage={errors.phone?.message}
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                {...field}
                                placeholder="Phone Number"
                            />
                        )}
                    />
                </FormItem>
            </div>

            <h4 className="mb-6 mt-10 font-bold text-xl">
                Address Information
            </h4>
            <FormItem
                label="Address"
                invalid={!!errors.address}
                errorMessage={errors.address?.message}
            >
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="Enter your full address"
                        />
                    )}
                />
            </FormItem>

            <h4 className="mb-6 mt-10 font-bold text-xl">Assignments</h4>
            {userRoles?.length ? (
                <div className="space-y-6">
                    {userRoles.map((roleBlock, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-5 bg-gray-50 dark:bg-gray-800 border border-gray-200"
                        >
                            <FormItem label={`Location ${index + 1}`}>
                                <Controller
                                    name={`userRoles.${index}.location_name`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            prefix={
                                                <HiOutlineLocationMarker className="text-indigo-600" />
                                            }
                                            placeholder="Location Name"
                                        />
                                    )}
                                />
                            </FormItem>

                            <div className="space-y-4 mt-4">
                                {roleBlock.department.map((dept, dIdx) => (
                                    <div
                                        key={dIdx}
                                        className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 shadow-sm"
                                    >
                                        <FormItem label="Department">
                                            <Controller
                                                name={`userRoles.${index}.department.${dIdx}.department_name`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        size="sm"
                                                        prefix={
                                                            <HiOutlineOfficeBuilding />
                                                        }
                                                        placeholder="Department Name"
                                                    />
                                                )}
                                            />
                                        </FormItem>

                                        <div className="space-y-4 mt-2">
                                            {dept.roles.map((role, rIdx) => (
                                                <div
                                                    key={rIdx}
                                                    className="pl-6 border-l-2 border-indigo-100 space-y-3"
                                                >
                                                    <FormItem
                                                        label="Role"
                                                        className="mb-2"
                                                    >
                                                        <Controller
                                                            name={`userRoles.${index}.department.${dIdx}.roles.${rIdx}.label`}
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <Input
                                                                    {...field}
                                                                    size="sm"
                                                                    placeholder="Role Label"
                                                                />
                                                            )}
                                                        />
                                                    </FormItem>

                                                    <FormItem label="Permissions">
                                                        <Controller
                                                            name={`userRoles.${index}.department.${dIdx}.roles.${rIdx}.permissions`}
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <div className="flex flex-wrap gap-2">
                                                                    <Input
                                                                        value={field.value?.join(
                                                                            ', ',
                                                                        )}
                                                                        size="sm"
                                                                        placeholder="Permissions (comma separated)"
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            const val =
                                                                                e.target.value
                                                                                    .split(
                                                                                        ',',
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            p,
                                                                                        ) =>
                                                                                            p.trim(),
                                                                                    )
                                                                            field.onChange(
                                                                                val,
                                                                            )
                                                                        }}
                                                                    />
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {field.value?.map(
                                                                            (
                                                                                p: string,
                                                                                pIdx: number,
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        pIdx
                                                                                    }
                                                                                    className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                                                                                >
                                                                                    {
                                                                                        p
                                                                                    }
                                                                                </span>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    </FormItem>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 italic">No assignments found.</p>
            )}
        </div>
    )
}

export default memo(ProfileOverview)
