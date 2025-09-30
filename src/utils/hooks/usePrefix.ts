import useSWR from 'swr'

type EntityService<
    TForm,
    TResponse,
    TCreateResult = TResponse,
    TUpdateResult = TResponse,
> = {
    fetchList: () => Promise<TResponse[]>
    fetchById: (id: string) => Promise<TResponse>
    create: (data: TForm) => Promise<TCreateResult>
    update: (id: string, data: TForm) => Promise<TUpdateResult>
}

export default function createUsePrefixEntityHook<
    TForm,
    TResponse extends { id?: string },
    TCreateResult = TResponse,
    TUpdateResult = TResponse,
>(
    service: EntityService<TForm, TResponse, TCreateResult, TUpdateResult>,
    cacheKey: string,
) {
    return function usePrefixEntity() {
        const { data, error, isLoading, mutate } = useSWR<TResponse | null>(
            [cacheKey],
            async () => {
                const list = await service.fetchList()
                const first = list?.[0]
                if (first?.id) {
                    return await service.fetchById(first.id)
                }
                return null
            },
            { revalidateOnFocus: false },
        )

        const entity = data ?? null

        const saveEntity = async (
            entityData: TForm,
        ): Promise<TCreateResult | TUpdateResult> => {
            let result: TCreateResult | TUpdateResult
            if (entity?.id) {
                result = await service.update(entity.id, entityData)
            } else {
                result = await service.create(entityData)
            }

            await mutate()
            return result
        }

        return {
            entity,
            isLoading,
            error,
            saveEntity,
            mutate,
        }
    }
}
