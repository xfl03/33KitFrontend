import {DataProvider} from "sekai-calculator";
import axios from "axios";

export class KitDataProvider implements DataProvider {
    constructor(private userId?: string) {
    }

    private static CACHE = new Map<string, any>();

    async getMasterData(key: string): Promise<any> {
        if (KitDataProvider.CACHE.has(key)) return KitDataProvider.CACHE.get(key)
        const data = (await axios.get(`${process.env.NEXT_PUBLIC_MASTER_DATA_BASE}/${key}.json`)).data
        KitDataProvider.CACHE.set(key, data)
        return data
    }

    async getMusicMeta(): Promise<any> {
        const key = "musicMeta"
        if (KitDataProvider.CACHE.has(key)) return KitDataProvider.CACHE.get(key)
        const data = (await axios.get(process.env.NEXT_PUBLIC_MUSIC_META_URL!)).data
        KitDataProvider.CACHE.set(key, data)
        return data
    }

    async getUserData(key: string): Promise<any> {
        if (this.userId === undefined) throw new Error("User not specialized.")
        const key0 = "userData"
        if (KitDataProvider.CACHE.has(key0)) return KitDataProvider.CACHE.get(key0)[key]
        const data = (await axios.get(`${process.env.NEXT_PUBLIC_USER_DATA_BASE}/${this.userId}/profile`)).data
        KitDataProvider.CACHE.set(key0, data)
        return data[key];
    }

}
