import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import { Button, FormItem } from '@/components/ui'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { Controller, useFormContext } from 'react-hook-form'
import { HiOutlineUser } from 'react-icons/hi'
import { FormSectionBaseProps } from '@/@types/user'
import { UserSchemaType } from '@/schemas/user.schema'

type ProfileImageSectionProps = FormSectionBaseProps

const ProfileImage = ({ readOnly, loading }: ProfileImageSectionProps) => {
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

    const {
        control,
        formState: { errors },
    } = useFormContext<UserSchemaType>()

    return (
        <Card>
            <h4 className="mb-2">Image Upload</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-4 text-center">
                <FormItem
                    className="text-center mb-0"
                    invalid={!!errors.profileImage}
                    errorMessage={errors.profileImage?.message}
                >
                    <Controller
                        name="profileImage"
                        control={control}
                        render={({ field }) => (
                            <>
                                <div className="flex items-center justify-center mb-3">
                                    {field.value ? (
                                        <Avatar
                                            size={60}
                                            className="border-2 border-white bg-gray-100 text-gray-300 shadow-md"
                                            icon={<HiOutlineUser />}
                                            src={field.value}
                                        />
                                    ) : (
                                        <DoubleSidedImage
                                            src="/img/others/upload.png"
                                            darkModeSrc="/img/others/upload-dark.png"
                                            alt="Upload image"
                                            className="w-14"
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
                                                URL.createObjectURL(files[0]),
                                            )
                                        }
                                    }}
                                >
                                    <Button
                                        variant="solid"
                                        type="button"
                                        size="sm"
                                        disabled={readOnly || loading}
                                    >
                                        Upload
                                    </Button>
                                </Upload>
                            </>
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default ProfileImage
