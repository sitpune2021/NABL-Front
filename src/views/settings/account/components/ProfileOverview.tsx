/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import {
    HiOutlineUser,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineLockClosed,
    HiOutlineLocationMarker,
    HiOutlineBadgeCheck,
} from 'react-icons/hi'
import { TbCameraPlus, TbWriting } from 'react-icons/tb'
import type { ProfileFormSchema } from '@/schemas/account.schema'

const InfoBadge = ({
    label,
    value,
    icon: Icon,
}: {
    label: string
    value: string
    icon: any
}) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm text-gray-400">
                <Icon size={18} />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 leading-none mb-1">
                    {label}
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {value || '—'}
                </p>
            </div>
        </div>
        <HiOutlineLockClosed
            className="text-gray-300 dark:text-gray-600"
            size={14}
        />
    </div>
)

const ProfileOverview = () => {
    const {
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<ProfileFormSchema>()

    const beforeUpload = (files: FileList | null) => {
        const allowedFileType = ['image/jpeg', 'image/png']
        if (files && !allowedFileType.includes(files[0].type)) {
            return 'Please upload a .jpeg or .png file!'
        }
        return true
    }

    return (
        <div className="max-w-[900px] mx-auto space-y-8">
            <div className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <Controller
                        name="profileImage"
                        control={control}
                        render={({ field }) => (
                            <div className="relative group">
                                <Avatar
                                    size={100}
                                    className="ring-4 ring-blue-50 dark:ring-grey-900/30 shadow-lg"
                                    shape="circle"
                                    src={field.value || ''}
                                    icon={<HiOutlineUser />}
                                />
                                <Upload
                                    showList={false}
                                    className="absolute bottom-0 right-0"
                                    beforeUpload={beforeUpload}
                                    onChange={(files) => {
                                        if (files.length > 0)
                                            setValue(
                                                'profileImage',
                                                URL.createObjectURL(files[0]),
                                            )
                                    }}
                                >
                                    <Button
                                        type="button"
                                        variant="solid"
                                        size="sm"
                                        shape="circle"
                                        className="!p-2.5 !rounded-full border-2  dark:border-gray-800 shadow-lg transition-all active:scale-90"
                                    >
                                        <TbCameraPlus
                                            size={16}
                                            className="text-white"
                                        />
                                    </Button>
                                </Upload>
                            </div>
                        )}
                    />
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {getValues('name') || 'Your Name'}
                            </h3>
                            <HiOutlineBadgeCheck
                                className="text-blue-500"
                                size={20}
                            />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1">
                            <HiOutlineMail /> {getValues('email')}
                        </p>
                    </div>
                    <div className="hidden md:block h-12 w-[1px] bg-gray-100 dark:bg-gray-700 mx-4" />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="default"
                            type="button"
                            onClick={() => setValue('profileImage', '')}
                        >
                            Remove Photo
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                    <h5 className="font-bold text-xs text-gray-400 uppercase tracking-widest px-1">
                        Identity & Security
                    </h5>
                    <InfoBadge
                        label="Username"
                        value={getValues('username')}
                        icon={HiOutlineUser}
                    />
                    <InfoBadge
                        label="Email Address"
                        value={getValues('email')}
                        icon={HiOutlineMail}
                    />
                    <InfoBadge
                        label="Contact Number"
                        value={`${getValues('dialCode')} ${getValues('phone')}`}
                        icon={HiOutlinePhone}
                    />

                    <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 mt-6">
                        <div className="flex gap-2 text-amber-700 dark:text-amber-400 mb-1">
                            <HiOutlineLockClosed size={16} />
                            <span className="text-xs font-bold uppercase">
                                Locked Fields
                            </span>
                        </div>
                        <p className="text-[11px] text-amber-600/80 dark:text-amber-500/80 leading-relaxed">
                            To ensure account security, system-level identifiers
                            cannot be modified directly. Contact support for
                            updates.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-6">
                    <h5 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <TbWriting className="text-blue-500" /> General
                        Information
                    </h5>

                    <FormItem
                        label="Full Name"
                        invalid={!!errors.name}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    prefix={
                                        <HiOutlineUser className="text-lg" />
                                    }
                                    placeholder="Enter full name"
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Primary Address"
                        invalid={!!errors.address}
                        errorMessage={errors.address?.message}
                    >
                        <Controller
                            name="address"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    textArea
                                    value={field.value ?? ''}
                                    prefix={
                                        <HiOutlineLocationMarker className="text-lg mt-1" />
                                    }
                                    placeholder="Enter your home or office address"
                                />
                            )}
                        />
                    </FormItem>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    <div>
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-3">
                            Authorized Signature
                        </label>
                        <div className="bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center group transition-all hover:border-blue-300">
                            <Controller
                                name="signature"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        {field.value ? (
                                            <img
                                                src={field.value}
                                                className="h-24 mb-4 object-contain mix-blend-multiply dark:mix-blend-normal bg-white dark:bg-gray-200 p-2 rounded shadow-inner"
                                                alt="Sign"
                                            />
                                        ) : (
                                            <DoubleSidedImage
                                                className="h-16 mb-4 opacity-20 group-hover:opacity-40 transition-opacity"
                                                src="/img/others/upload.png"
                                                darkModeSrc="/img/others/upload-dark.png"
                                            />
                                        )}
                                        <div className="flex gap-2">
                                            <Upload
                                                showList={false}
                                                beforeUpload={beforeUpload}
                                                onChange={(files) => {
                                                    if (files.length > 0)
                                                        field.onChange(
                                                            URL.createObjectURL(
                                                                files[0],
                                                            ),
                                                        )
                                                }}
                                            >
                                                <Button
                                                    size="sm"
                                                    type="button"
                                                    variant="solid"
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
                                                    onClick={() =>
                                                        field.onChange('')
                                                    }
                                                >
                                                    Clear
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(ProfileOverview)
