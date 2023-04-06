import {useEffect, useState} from "react";
import {KitDataProvider} from "../calculator/kit-data-provider";

export function getById<T extends { id: number }>(data: T[], id: number) {
    const ret = data.find(it => it.id === id)
    if (!ret) throw new Error(`Id ${id} not found`)
    return ret
}

const dataProvider = KitDataProvider.DEFAULT_INSTANCE
export default function useMasterData<T>(key: string) {
    const [data, setData] = useState<T[]>()
    useEffect(() => {
        if (data !== undefined) return
        dataProvider.getMasterData(key).then((data0: T[]) => {
            setData(data0)
        })
    }, [key, data])
    return data
}
