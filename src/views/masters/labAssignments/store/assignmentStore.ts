import { create } from 'zustand'

export type AssignmentStats = {
    labCount: number
    locationCount: number
    userCount: number
}

type AssignmentStore = AssignmentStats & {
    setStats: (stats: Partial<AssignmentStats>) => void
    reset: () => void
}

const initialState: AssignmentStats = {
    labCount: 0,
    locationCount: 0,
    userCount: 0,
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
    ...initialState,

    setStats: (stats) =>
        set((state) => ({
            ...state,
            ...stats,
        })),

    reset: () => set(initialState),
}))
