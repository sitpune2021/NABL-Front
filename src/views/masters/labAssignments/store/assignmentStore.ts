/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'

export type AssignmentListState = {
    labList: any[]
    locationList: any[]
    userList: any[]
}

type AssignmentListAction = {
    setLabs: (payload: any[]) => void
    setLocations: (payload: any[]) => void
    setUsers: (payload: any[]) => void
}

const initialState: AssignmentListState = {
    labList: [],
    locationList: [],
    userList: [],
}

export const useAssignmentStore = create<
    AssignmentListState & AssignmentListAction
>((set) => ({
    ...initialState,
    setLabs: (payload) => set({ labList: payload }),
    setLocations: (payload) => set({ locationList: payload }),
    setUsers: (payload) => set({ userList: payload }),
}))
