import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { HiCheck } from 'react-icons/hi'
import { useSessionUser } from '@/store/authStore'
import useRandomBgColor from '@/utils/hooks/useRandomBgColor'
import acronym from '@/utils/acronym'

const LocationSelector = () => {
    const labs = useSessionUser((state) => state.roles)
    const activeLab = useSessionUser((state) => state.activeLab)
    const activeRole = useSessionUser((state) => state.activeRole)
    const setActiveLab = useSessionUser((state) => state.setActiveLab)
    const setActiveRole = useSessionUser((state) => state.setActiveRole)
    const isLabSelectable = labs && labs.length > 1
    const isRoleSelectable =
        activeLab && activeLab.roles && activeLab.roles.length > 1
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
        </div>
    )
}

export default LocationSelector
