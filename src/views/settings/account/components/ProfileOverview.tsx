import { memo, useMemo } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { countryList } from '@/constants/countries.constant'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import type { ProfileFormSchema } from '@/schemas/account.schema'

const ProfileOverview = () => {
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext<ProfileFormSchema>()

    const dialCodeList = useMemo(
        () => countryList.map((c) => ({ ...c, label: c.dialCode })),
        [],
    )

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true
        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }
        return valid
    }

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
                                    beforeUpload={beforeUpload}
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
                            value={field.value ?? ''}
                            placeholder="Enter your full address"
                        />
                    )}
                />
            </FormItem>

            <h4 className="mb-6 mt-10 font-bold text-xl">Signature</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg text-center p-6">
                <Controller
                    name="signature"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center mb-4">
                                {field.value ? (
                                    <Avatar
                                        size={120}
                                        className="border-4 border-white bg-white shadow-lg"
                                        src={field.value}
                                    />
                                ) : (
                                    <DoubleSidedImage
                                        src="/img/others/upload.png"
                                        darkModeSrc="/img/others/upload-dark.png"
                                        alt="Upload signature"
                                    />
                                )}
                            </div>
                            <div className="flex gap-2">
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
                                        {field.value
                                            ? 'Change Signature'
                                            : 'Upload Signature'}
                                    </Button>
                                </Upload>
                                {field.value && (
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={() => field.onChange('')}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    )
}

export default memo(ProfileOverview)
