import {useEffect, useState} from "react";
import {KitDataProvider} from "../calculator/kit-data-provider";

export function getById<T extends { id: number }>(data: T[], id: number) {
    const ret = data.find(it => it.id === id)
    if (!ret) throw new Error(`Id ${id} not found`)
    return ret
}

export default function useMasterData<T>(key: string, server: string = "jp") {
    const [data, setData] = useState<T[]>()
    useEffect(() => {
        getMasterData<T>(key, server).then(data0 => {
            setData(data0)
        })
    }, [key, server])
    return data
}

export async function getMasterData<T>(key: string, server: string = "jp") {
    const dataProvider = KitDataProvider.getCachedInstance(server)
    return await dataProvider.getMasterData<T>(key)
}
