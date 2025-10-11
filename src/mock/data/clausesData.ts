export interface AccordionItem {
    title: string
    note?: boolean
    message: string
    children?: AccordionItem[]
}

export const accordionData: AccordionItem[] = [
    {
        title: 'Foreword',
        note: true,
        message: `ISO (the International Organization for Standardization) is a worldwide federation of national standards 
bodies (ISO member bodies). The work of preparing International Standards is normally carried out 
through ISO technical committees. Each member body interested in a subject for which a technical `,
    },
    {
        title: 'Introduction',
        note: true,
        message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users 
through confidence in the quality and competence of medical laboratories.
This document contains requirements for the medical laboratory to plan and implement actions`,
        children: [
            {
                title: '1 Scope',
                note: true,
                message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
            },
            {
                title: '2 Normative references',
                note: true,
                message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
            },
            {
                title: '3 Terms and definitions',
                note: true,
                message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
            },
            {
                title: '4 General requirements',
                note: true,
                message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
                children: [
                    {
                        title: '4.1 Impartiality',
                        note: true,
                        message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
                    },
                    {
                        title: '4.2 Confidentiality',
                        note: true,
                        message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
                        children: [
                            {
                                title: '4.2.1 Management of information',
                                note: true,
                                message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
                            },
                            {
                                title: '4.2.2 Release of information',
                                note: true,
                                message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
                            },
                            {
                                title: '4.2.3 Personnel responsibility',
                                note: true,
                                message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
                            },
                        ],
                    },
                    {
                        title: '4.3 Requirements regarding patients',
                        note: true,
                        message: `The objective of this document is to promote the welfare of patients and satisfaction of laboratory users through confidence in the quality and competence of medical laboratories. This document contains requirements for the medical laboratory to plan and implement actions`,
                    },
                ],
            },
        ],
    },
]
