/* eslint-disable @typescript-eslint/no-explicit-any */
type EntityMutationsProps<T> = {
    apiCreate?: (payload: T) => Promise<any>
    apiUpdate?: (id: string, payload: T) => Promise<any>
}

export const useEntityMutations = <T>({
    apiCreate,
    apiUpdate,
}: EntityMutationsProps<T>) => {
    const save = async (entity: T & { id?: string }) => {
        if (entity.id && apiUpdate) {
            const { id, ...payload } = entity
            return apiUpdate(id, payload as T)
        }
        if (apiCreate) {
            return apiCreate(entity as T)
        }
    }

    return { save }
}
