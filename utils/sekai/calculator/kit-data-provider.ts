import {CachedDataProvider, DataProvider, MusicMeta} from "sekai-calculator";
import axios from "axios";

export class KitDataProvider implements DataProvider {
    constructor(private server: string = "jp", private userId?: string) {
    }

    public static getCachedInstance(server: string = "jp", userId?: string) {
        return new CachedDataProvider(new KitDataProvider(server, userId), server);
    }

    public static DEFAULT_INSTANCE = KitDataProvider.getCachedInstance("jp")

    private static profileCache = new Map<string, any>()

    private getMasterBase(): string {
        if (this.server === "jp") {
            return process.env.NEXT_PUBLIC_MASTER_DATA_BASE!;
        }
        return `${process.env.NEXT_PUBLIC_MASTER_DATA_EXTERNAL_BASE}/haruki-sekai-${this.server === "cn" ? "sc" : this.server}-master/master`;
    }

    async getMasterData<T>(key: string): Promise<T> {
        try {
            return (await axios.get(`${this.getMasterBase()}/${key}.json`)).data
        } catch (e: any) {
            console.warn(e);
            // 强行兼容不存在的Master
            return [] as T
        }
    }

    async getMusicMeta(): Promise<MusicMeta[]> {
        const fileName = this.server == "jp" ? "music_metas.json" : `music_metas-${this.server}.json`
        return (await axios.get(`${process.env.NEXT_PUBLIC_SEKAI_DATA_BASE}${fileName}`)).data
    }

    async getUserData<T>(key: string): Promise<T> {
        return (await this.getUserDataAll())[key];
    }

    async getUserDataAll(): Promise<Record<string, any>> {
        if (this.userId === undefined) throw new Error("User not specialized.")
        if (KitDataProvider.profileCache.has(this.userId)) return KitDataProvider.profileCache.get(this.userId)
        const data = (await axios.get(`${process.env.NEXT_PUBLIC_USER_DATA_BASE}/${this.server == "tc" ? "tw" : this.server}/suite/${this.userId}`)).data;
        KitDataProvider.profileCache.set(this.userId, data)
        return data
    }
}
