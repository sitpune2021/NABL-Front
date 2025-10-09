import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import Menu from '@/components/ui/Menu'
import { HiPlus } from 'react-icons/hi'
import { TbTrash } from 'react-icons/tb'
import type { MouseEvent } from 'react'

type OverviewSectionProps = {
    readOnly?: boolean
}

const OverviewSection = ({ readOnly }: OverviewSectionProps) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    const categoryOptions = [
        { value: '', label: 'Select Category' },
        { value: 'personal', label: 'Personal Information' },
        { value: 'financial', label: 'Financial Data' },
        { value: 'technical', label: 'Technical Specifications' },
    ]

    const fieldOptions = [
        { value: '', label: 'Select Field' },
        { value: 'name', label: 'Full Name' },
        { value: 'email', label: 'Email Address' },
        { value: 'phone', label: 'Phone Number' },
        { value: 'balance', label: 'Account Balance' },
        { value: 'transaction', label: 'Transaction History' },
    ]

    const frequencyOptions = [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
    ]

    const handleToggle = (
        expanded: boolean,
        e: MouseEvent,
        eventKey: string,
    ) => {
        console.log('expanded', expanded, 'eventKey', eventKey)
        setExpandedItems((prev) => {
            const newSet = new Set(prev)
            if (expanded) {
                newSet.add(eventKey)
            } else {
                newSet.delete(eventKey)
            }
            return newSet
        })
    }

    const isExpanded = (eventKey: string) => expandedItems.has(eventKey)

    const renderRequiredSection = (eventKey: string) => (
        <Menu.MenuCollapse
            eventKey={eventKey}
            label="Required"
            expanded={isExpanded(eventKey)}
            onToggle={handleToggle}
        >
            <div className="p-4 space-y-4">
                {/* Note Section */}
                <div className="space-y-3">
                    <h4 className="text-md font-semibold text-gray-900">
                        Notes
                    </h4>
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <FormItem label="">
                                <Input
                                    textArea
                                    rows={3}
                                    placeholder="Write your notes here..."
                                    value=""
                                    readOnly={readOnly}
                                    className="resize-none"
                                />
                            </FormItem>
                        </div>
                        <div className="flex flex-col gap-2 mt-8">
                            <Button
                                size="sm"
                                icon={<HiPlus />}
                                variant="solid"
                                disabled={readOnly}
                                className="bg-green-500 hover:bg-green-600"
                            />
                            <Button
                                size="sm"
                                icon={<TbTrash />}
                                variant="solid"
                                disabled={readOnly}
                                className="bg-red-500 hover:bg-red-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Fields Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-md font-semibold text-gray-900">
                            Fields
                        </h4>
                    </div>

                    {/* Field Item */}
                    <div className="border border-gray-200 rounded-lg bg-white p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FormItem label="Category" className="mb-0">
                                <Select
                                    options={categoryOptions}
                                    placeholder="Select Category"
                                    value={categoryOptions[0]}
                                    isDisabled={readOnly}
                                />
                            </FormItem>

                            <FormItem label="Field Name" className="mb-0">
                                <Select
                                    options={fieldOptions}
                                    placeholder="Select Field"
                                    value={fieldOptions[0]}
                                    isDisabled={readOnly}
                                />
                            </FormItem>

                            <FormItem label="Frequency" className="mb-0">
                                <Select
                                    options={frequencyOptions}
                                    placeholder="Select Frequency"
                                    value={frequencyOptions[0]}
                                    isDisabled={readOnly}
                                />
                            </FormItem>

                            <div className="flex items-center gap-4">
                                <FormItem label="Required" className="mb-0">
                                    <Checkbox disabled checked={false} />
                                </FormItem>
                                <FormItem label="Timezone" className="mb-0">
                                    <Checkbox disabled checked={false} />
                                </FormItem>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                icon={<TbTrash />}
                                variant="plain"
                                disabled={readOnly}
                                className="text-red-600 hover:text-red-700"
                            ></Button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            icon={<HiPlus />}
                            disabled={readOnly}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        ></Button>
                    </div>
                </div>
            </div>
        </Menu.MenuCollapse>
    )

    return (
        <Card className="p-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <Menu>
                    {/* Foreword Section */}
                    <Menu.MenuCollapse
                        eventKey="foreword"
                        label="Foreword"
                        expanded={isExpanded('foreword')}
                        onToggle={handleToggle}
                    >
                        <div className="p-4 space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                    ISO (the International Organization for
                                    Standardization) is a worldwide federation
                                    of national standards bodies (ISO member
                                    bodies). The work of preparing International
                                    Standards is normally carried out through
                                    ISO technical committees. Each member body
                                    interested in a subject for which a
                                    technical
                                </p>
                            </div>
                            {renderRequiredSection('required')}
                        </div>
                    </Menu.MenuCollapse>

                    {/* Introduction Section */}
                    <Menu.MenuCollapse
                        eventKey="introduction"
                        label="Introduction"
                        expanded={isExpanded('introduction')}
                        onToggle={handleToggle}
                    >
                        <div className="p-4 space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                    The objective of this document is to promote
                                    the welfare of patients and satisfaction of
                                    laboratory users through confidence in the
                                    quality and competence of medical
                                    laboratories. This document contains
                                    requirements for the medical laboratory to
                                    plan and implement actions
                                </p>
                            </div>
                            {renderRequiredSection('introduction-required')}

                            {/* Child Sections */}
                            <div className="space-y-2">
                                {/* 1 Scope */}
                                <Menu.MenuCollapse
                                    eventKey="scope"
                                    label="1 Scope"
                                    expanded={isExpanded('scope')}
                                    onToggle={handleToggle}
                                >
                                    <div className="p-4 space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                The objective of this document
                                                is to promote the welfare of
                                                patients and satisfaction of
                                                laboratory users through
                                                confidence in the quality and
                                                competence of medical
                                                laboratories. This document
                                                contains requirements for the
                                                medical laboratory to plan and
                                                implement actions
                                            </p>
                                        </div>
                                        {renderRequiredSection(
                                            'scope-required',
                                        )}
                                    </div>
                                </Menu.MenuCollapse>

                                {/* 2 Normative references */}
                                <Menu.MenuCollapse
                                    eventKey="normative-references"
                                    label="2 Normative references"
                                    expanded={isExpanded(
                                        'normative-references',
                                    )}
                                    onToggle={handleToggle}
                                >
                                    <div className="p-4 space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                The objective of this document
                                                is to promote the welfare of
                                                patients and satisfaction of
                                                laboratory users through
                                                confidence in the quality and
                                                competence of medical
                                                laboratories. This document
                                                contains requirements for the
                                                medical laboratory to plan and
                                                implement actions
                                            </p>
                                        </div>
                                        {renderRequiredSection(
                                            'normative-required',
                                        )}
                                    </div>
                                </Menu.MenuCollapse>

                                {/* 3 Terms and definitions */}
                                <Menu.MenuCollapse
                                    eventKey="terms-definitions"
                                    label="3 Terms and definitions"
                                    expanded={isExpanded('terms-definitions')}
                                    onToggle={handleToggle}
                                >
                                    <div className="p-4 space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                The objective of this document
                                                is to promote the welfare of
                                                patients and satisfaction of
                                                laboratory users through
                                                confidence in the quality and
                                                competence of medical
                                                laboratories. This document
                                                contains requirements for the
                                                medical laboratory to plan and
                                                implement actions
                                            </p>
                                        </div>
                                        {renderRequiredSection(
                                            'terms-required',
                                        )}
                                    </div>
                                </Menu.MenuCollapse>

                                {/* 4 General requirements */}
                                <Menu.MenuCollapse
                                    eventKey="general-requirements"
                                    label="4 General requirements"
                                    expanded={isExpanded(
                                        'general-requirements',
                                    )}
                                    onToggle={handleToggle}
                                >
                                    <div className="p-4 space-y-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                The objective of this document
                                                is to promote the welfare of
                                                patients and satisfaction of
                                                laboratory users through
                                                confidence in the quality and
                                                competence of medical
                                                laboratories. This document
                                                contains requirements for the
                                                medical laboratory to plan and
                                                implement actions
                                            </p>
                                        </div>
                                        {renderRequiredSection(
                                            'general-required',
                                        )}

                                        {/* 4.1 Impartiality */}
                                        <Menu.MenuCollapse
                                            eventKey="impartiality"
                                            label="4.1 Impartiality"
                                            expanded={isExpanded(
                                                'impartiality',
                                            )}
                                            onToggle={handleToggle}
                                        >
                                            <div className="p-4 space-y-4">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                        The objective of this
                                                        document is to promote
                                                        the welfare of patients
                                                        and satisfaction of
                                                        laboratory users through
                                                        confidence in the
                                                        quality and competence
                                                        of medical laboratories.
                                                        This document contains
                                                        requirements for the
                                                        medical laboratory to
                                                        plan and implement
                                                        actions
                                                    </p>
                                                </div>
                                                {renderRequiredSection(
                                                    'impartiality-required',
                                                )}
                                            </div>
                                        </Menu.MenuCollapse>

                                        {/* 4.2 Confidentiality */}
                                        <Menu.MenuCollapse
                                            eventKey="confidentiality"
                                            label="4.2 Confidentiality"
                                            expanded={isExpanded(
                                                'confidentiality',
                                            )}
                                            onToggle={handleToggle}
                                        >
                                            <div className="p-4 space-y-4">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                        The objective of this
                                                        document is to promote
                                                        the welfare of patients
                                                        and satisfaction of
                                                        laboratory users through
                                                        confidence in the
                                                        quality and competence
                                                        of medical laboratories.
                                                        This document contains
                                                        requirements for the
                                                        medical laboratory to
                                                        plan and implement
                                                        actions
                                                    </p>
                                                </div>
                                                {renderRequiredSection(
                                                    'confidentiality-required',
                                                )}

                                                {/* 4.2.1 Management of information */}
                                                <Menu.MenuCollapse
                                                    eventKey="management-info"
                                                    label="4.2.1 Management of information"
                                                    expanded={isExpanded(
                                                        'management-info',
                                                    )}
                                                    onToggle={handleToggle}
                                                >
                                                    <div className="p-4 space-y-4">
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                                The objective of
                                                                this document is
                                                                to promote the
                                                                welfare of
                                                                patients and
                                                                satisfaction of
                                                                laboratory users
                                                                through
                                                                confidence in
                                                                the quality and
                                                                competence of
                                                                medical
                                                                laboratories.
                                                                This document
                                                                contains
                                                                requirements for
                                                                the medical
                                                                laboratory to
                                                                plan and
                                                                implement
                                                                actions
                                                            </p>
                                                        </div>
                                                        {renderRequiredSection(
                                                            'management-required',
                                                        )}
                                                    </div>
                                                </Menu.MenuCollapse>

                                                {/* 4.2.2 Release of information */}
                                                <Menu.MenuCollapse
                                                    eventKey="release-info"
                                                    label="4.2.2 Release of information"
                                                    expanded={isExpanded(
                                                        'release-info',
                                                    )}
                                                    onToggle={handleToggle}
                                                >
                                                    <div className="p-4 space-y-4">
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                                The objective of
                                                                this document is
                                                                to promote the
                                                                welfare of
                                                                patients and
                                                                satisfaction of
                                                                laboratory users
                                                                through
                                                                confidence in
                                                                the quality and
                                                                competence of
                                                                medical
                                                                laboratories.
                                                                This document
                                                                contains
                                                                requirements for
                                                                the medical
                                                                laboratory to
                                                                plan and
                                                                implement
                                                                actions
                                                            </p>
                                                        </div>
                                                        {renderRequiredSection(
                                                            'release-required',
                                                        )}
                                                    </div>
                                                </Menu.MenuCollapse>

                                                {/* 4.2.3 Personnel responsibility */}
                                                <Menu.MenuCollapse
                                                    eventKey="personnel-responsibility"
                                                    label="4.2.3 Personnel responsibility"
                                                    expanded={isExpanded(
                                                        'personnel-responsibility',
                                                    )}
                                                    onToggle={handleToggle}
                                                >
                                                    <div className="p-4 space-y-4">
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                                The objective of
                                                                this document is
                                                                to promote the
                                                                welfare of
                                                                patients and
                                                                satisfaction of
                                                                laboratory users
                                                                through
                                                                confidence in
                                                                the quality and
                                                                competence of
                                                                medical
                                                                laboratories.
                                                                This document
                                                                contains
                                                                requirements for
                                                                the medical
                                                                laboratory to
                                                                plan and
                                                                implement
                                                                actions
                                                            </p>
                                                        </div>
                                                        {renderRequiredSection(
                                                            'personnel-required',
                                                        )}
                                                    </div>
                                                </Menu.MenuCollapse>
                                            </div>
                                        </Menu.MenuCollapse>

                                        {/* 4.3 Requirements regarding patients */}
                                        <Menu.MenuCollapse
                                            eventKey="requirements-patients"
                                            label="4.3 Requirements regarding patients"
                                            expanded={isExpanded(
                                                'requirements-patients',
                                            )}
                                            onToggle={handleToggle}
                                        >
                                            <div className="p-4 space-y-4">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-line">
                                                        The objective of this
                                                        document is to promote
                                                        the welfare of patients
                                                        and satisfaction of
                                                        laboratory users through
                                                        confidence in the
                                                        quality and competence
                                                        of medical laboratories.
                                                        This document contains
                                                        requirements for the
                                                        medical laboratory to
                                                        plan and implement
                                                        actions
                                                    </p>
                                                </div>
                                                {renderRequiredSection(
                                                    'patients-required',
                                                )}
                                            </div>
                                        </Menu.MenuCollapse>
                                    </div>
                                </Menu.MenuCollapse>
                            </div>
                        </div>
                    </Menu.MenuCollapse>
                </Menu>
            </div>
        </Card>
    )
}

export default OverviewSection
