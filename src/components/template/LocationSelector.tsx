import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { HiCheck } from 'react-icons/hi'
import { useSessionUser } from '@/store/authStore'
import useRandomBgColor from '@/utils/hooks/useRandomBgColor'
import acronym from '@/utils/acronym'
import { apiGetNavigationItemsList } from '@/services/NavigationItemsService'

const LocationSelector = () => {
    const labs = useSessionUser((state) => state.roles)
    const activeLab = useSessionUser((state) => state.activeLab)
    const activeRole = useSessionUser((state) => state.activeRole)
    const activeLocation = useSessionUser((state) => state.activeLocation)
    const activeDepartment = useSessionUser((state) => state.activeDepartment)
    const setActiveLab = useSessionUser((state) => state.setActiveLab)
    const setActiveRole = useSessionUser((state) => state.setActiveRole)
    const isLabSelectable = labs && labs.length > 1
    const isRoleSelectable =
        activeLab && activeLab.roles && activeLab.roles.length > 1

    const isSuperAdmin = useSessionUser((state) => state.user.is_super_admin)
    const shouldShowExtra = activeLab?.lab_id !== 0 && !isSuperAdmin
    const isLocationSelectable =
        shouldShowExtra && activeLab && activeLab?.locations?.length > 1
    const isDeptSelectable =
        shouldShowExtra && activeLab && activeLab?.departments?.length > 1
    const bgColor = useRandomBgColor()

    return (
        <div className="flex gap-4">
            {/* LAB DROPDOWN */}
            <Dropdown
                disabled={!isLabSelectable}
                placement="bottom-end"
                renderTitle={
                    <span className="flex items-center">
                        <Avatar
                            size={22}
                            className={`cursor-pointer ${bgColor(activeLab?.lab_name || '')}`}
                        >
                            {acronym(activeLab?.lab_name || '')}
                        </Avatar>
                        <span className="ml-2">
                            {activeLab?.lab_name || 'Location'}
                        </span>
                    </span>
                }
            >
                {labs.map((lab) => (
                    <Dropdown.Item
                        key={lab?.lab_id}
                        onClick={() => {
                            setActiveLab(lab)
                            if (lab?.roles?.[0]) {
                                setActiveRole(lab.roles[0])
                                apiGetNavigationItemsList()
                            }
                        }}
                    >
                        <span className="flex items-center">
                            <Avatar size={18} />
                            <span className="ml-2">{lab?.lab_name}</span>
                        </span>

                        {activeLab?.lab_id === lab?.lab_id && (
                            <HiCheck className="text-emerald-500 text-lg" />
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown>

            {/* ROLE DROPDOWN */}
            <Dropdown
                disabled={!isRoleSelectable}
                placement="bottom-end"
                renderTitle={
                    <span className="flex items-center">
                        <Avatar
                            size={22}
                            className={`cursor-pointer ${bgColor(activeLab?.lab_name || '')}`}
                        >
                            {acronym(activeRole?.name || '')}
                        </Avatar>

                        <span className="ml-2">
                            {activeRole?.name || 'Role'}
                        </span>
                    </span>
                }
            >
                {activeLab?.roles.map((role) => (
                    <Dropdown.Item
                        key={role?.id}
                        className="justify-between"
                        onClick={() => setActiveRole(role)}
                    >
                        <span className="flex items-center">
                            <Avatar size={18} />
                            <span className="ml-2">{role?.name}</span>
                        </span>

                        {activeRole?.id === role?.id && (
                            <HiCheck className="text-emerald-500 text-lg" />
                        )}
                    </Dropdown.Item>
                ))}
            </Dropdown>

            {shouldShowExtra && (
                <Dropdown
                    disabled={!isLocationSelectable}
                    placement="bottom-end"
                    renderTitle={
                        <span className="flex items-center">
                            <Avatar size={22}>
                                {acronym(activeLocation?.name || '')}
                            </Avatar>
                            <span className="ml-2">
                                {activeLocation?.name || 'Location'}
                            </span>
                        </span>
                    }
                >
                    {activeLab?.locations?.map((loc) => (
                        <Dropdown.Item
                            key={loc?.id}
                            onClick={() =>
                                useSessionUser.getState().setActiveLocation(loc)
                            }
                        >
                            <span className="ml-2">{loc?.name}</span>
                            {activeLocation?.id === loc?.id && (
                                <HiCheck className="text-emerald-500 text-lg" />
                            )}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            )}

            {shouldShowExtra && (
                <Dropdown
                    disabled={!isDeptSelectable}
                    placement="bottom-end"
                    renderTitle={
                        <span className="flex items-center">
                            <Avatar size={22}>
                                {acronym(activeDepartment?.name || '')}
                            </Avatar>
                            <span className="ml-2">
                                {activeDepartment?.name || 'Department'}
                            </span>
                        </span>
                    }
                >
                    {activeLab?.departments?.map((dept) => (
                        <Dropdown.Item
                            key={dept?.id}
                            onClick={() =>
                                useSessionUser
                                    .getState()
                                    .setActiveDepartment(dept)
                            }
                        >
                            <span className="ml-2">{dept?.name}</span>
                            {activeDepartment?.id === dept?.id && (
                                <HiCheck className="text-emerald-500 text-lg" />
                            )}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            )}
        </div>
    )
}

export default LocationSelector
