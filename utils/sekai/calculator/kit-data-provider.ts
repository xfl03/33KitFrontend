import {CachedDataProvider, DataProvider, MusicMeta} from "sekai-calculator";
import axios from "axios";

export class KitDataProvider implements DataProvider {
    constructor(private userId?: string) {
    }

    public static getCachedInstance(userId?: string) {
        return new CachedDataProvider(new KitDataProvider(userId))
    }

    public static DEFAULT_INSTANCE = KitDataProvider.getCachedInstance()

    private static profileCache = new Map<string, any>()

    async getMasterData<T>(key: string): Promise<T> {
        return (await axios.get(`${process.env.NEXT_PUBLIC_MASTER_DATA_BASE}/${key}.json`)).data
    }

    async getMusicMeta(): Promise<MusicMeta[]> {
        return (await axios.get(process.env.NEXT_PUBLIC_MUSIC_META_URL!)).data
    }

    async getUserData<T>(key: string): Promise<T> {
        return (await this.getUserDataAll())[key];
    }

    async getUserDataAll(): Promise<Record<string, any>> {
        if (this.userId === undefined) throw new Error("User not specialized.")
        if (KitDataProvider.profileCache.has(this.userId)) return KitDataProvider.profileCache.get(this.userId)
        const data = (await axios.get(`${process.env.NEXT_PUBLIC_USER_DATA_BASE}/${this.userId}/get_data/suite`)).data;
        KitDataProvider.profileCache.set(this.userId, data)
        return data
    }
}
