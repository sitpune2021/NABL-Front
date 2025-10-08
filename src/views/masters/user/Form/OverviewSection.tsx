import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import useRoleList from '../../roles/List/hooks/useList'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'

import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import { FormSectionBaseProps } from '@/@types/user'
import { Checkbox, Select, Button } from '@/components/ui'
import { HiOutlineUser } from 'react-icons/hi'

type OverviewSectionProps = FormSectionBaseProps

const OverviewSection = ({
    control,
    errors,
    readOnly,
}: OverviewSectionProps) => {
    const { rolesList } = useRoleList()

    const options = rolesList.map((role) => ({
        value: role.name,
        label: role.name.toUpperCase(),
    }))

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
        <Card>
            <h4 className="mb-6">User Overview</h4>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <FormItem
                    label="Name"
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
                                readOnly={readOnly}
                                placeholder="Full Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Username */}
                <FormItem
                    label="Username"
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
                                readOnly={readOnly}
                                placeholder="Enter Username"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Email */}
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
                                readOnly={readOnly}
                                placeholder="Enter Email"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Phone */}
                <FormItem
                    label="Phone"
                    invalid={Boolean(errors.phone)}
                    errorMessage={errors.phone?.message}
                >
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="tel"
                                autoComplete="off"
                                readOnly={readOnly}
                                placeholder="Enter Phone Number"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Role"
                    invalid={Boolean(errors.role)}
                    errorMessage={errors.role?.message}
                >
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                value={options.filter(
                                    (option) => option.value === field.value,
                                )}
                                options={options}
                                placeholder="Select Role"
                                isDisabled={readOnly}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                {/* Address */}
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
                                readOnly={readOnly}
                                placeholder="Enter Address"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {/* Prepared By */}
                <FormItem
                    label="Prepared By"
                    invalid={Boolean(errors.preparedBy)}
                    errorMessage={errors.preparedBy?.message}
                >
                    <Controller
                        name="preparedBy"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={!!field.value}
                                defaultChecked={field.value}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Issued By */}
                <FormItem
                    label="Issued By"
                    invalid={Boolean(errors.issuedBy)}
                    errorMessage={errors.issuedBy?.message}
                >
                    <Controller
                        name="issuedBy"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={!!field.value}
                                defaultChecked={field.value}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Approved By */}
                <FormItem
                    label="Approved By"
                    invalid={Boolean(errors.approvedBy)}
                    errorMessage={errors.approvedBy?.message}
                >
                    <Controller
                        name="approvedBy"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                checked={!!field.value}
                                defaultChecked={field.value}
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                {/* Sign Upload */}
                <FormItem
                    label="Sign Upload"
                    invalid={Boolean(errors.signUpload)}
                    errorMessage={errors.signUpload?.message}
                >
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg text-center p-4">
                        <div className="text-center">
                            <Controller
                                name="signUpload"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <div className="flex items-center justify-center">
                                            {field.value ? (
                                                <Avatar
                                                    size={100}
                                                    className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                                    icon={<HiOutlineUser />}
                                                    src={field.value}
                                                />
                                            ) : (
                                                <DoubleSidedImage
                                                    src="/img/others/upload.png"
                                                    darkModeSrc="/img/others/upload-dark.png"
                                                    alt="Upload image"
                                                />
                                            )}
                                        </div>
                                        <Upload
                                            showList={false}
                                            uploadLimit={1}
                                            beforeUpload={beforeUpload}
                                            onChange={(files) => {
                                                if (files.length > 0) {
                                                    field.onChange(
                                                        URL.createObjectURL(
                                                            files[0],
                                                        ),
                                                    )
                                                }
                                            }}
                                        >
                                            <Button
                                                variant="solid"
                                                className="mt-4"
                                                type="button"
                                            >
                                                Upload Image
                                            </Button>
                                        </Upload>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </FormItem>
            </div>
        </Card>
    )
}

export default OverviewSection
