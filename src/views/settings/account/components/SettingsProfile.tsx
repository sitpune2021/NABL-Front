 
import Button from '@/components/ui/Button'
import ProfileOverview from './ProfileOverview'
import { profileSchema, type ProfileFormSchema } from '@/schemas/account.schema'
import { EMPTY_VALUES } from '@/constants/account.constant'
import { useAccountDetail } from '../hooks/useAccountDetail'
import { useEntityMutations } from '@/utils/hooks/useEntityMutations'
import { useFormSubmit } from '@/utils/hoc/useFormSubmit'
import endpointConfig from '@/configs/endpoint.config'
import { FormSkeleton } from '@/components/form'
import MasterForm from '@/components/form/MasterForm'

const SettingsProfile = () => {
    const { account, isLoading } = useAccountDetail()
    console.log(account)

    const { save } = useEntityMutations<ProfileFormSchema>({
        // apiCreate: apiUpdateCategory,
    })

    const { handleSubmit, isSubmitting } = useFormSubmit<ProfileFormSchema>({
        apiCall: async (values) => {
            const res = await save({
                ...values,
            })
            return res
        },
        navigateTo: endpointConfig.setting.account.profile,
    })

    if (isLoading) {
        return <FormSkeleton count={2} title={'Account'} />
    }

    return (
        <>
            <h4 className="mb-8">Personal information</h4>
            <MasterForm
                schema={profileSchema}
                defaultValues={account || EMPTY_VALUES}
                onSubmit={handleSubmit}
            >
                <ProfileOverview />

                <div className="flex items-center justify-end gap-2 p-4">
                    <Button type="button">Reset</Button>
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Update
                    </Button>
                </div>
            </MasterForm>
        </>
    )
}

export default SettingsProfile
