import { create } from 'zustand'
import { View } from '@/@types/account'

export type SettingsState = {
    currentView: View
}

type SettingsAction = {
    setCurrentView: (payload: View) => void
}

const initialState: SettingsState = {
    currentView: 'profile',
}

export const useSettingsStore = create<SettingsState & SettingsAction>(
    (set) => ({
        ...initialState,
        setCurrentView: (payload) => set(() => ({ currentView: payload })),
    }),
)
