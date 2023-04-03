export function getById<T extends { id: number }>(data: T[], id: number) {
    const ret = data.find(it => it.id === id)
    if (!ret) throw new Error(`Id ${id} not found`)
    return ret
}
