import useMasterData from "./common";
import {Music, MusicDifficulty} from "sekai-calculator";

export function useMusics(server: string = "jp") {
    return useMasterData<Music>("musics", server)
}

export function useMusicDifficulties(server: string = "jp") {
    return useMasterData<MusicDifficulty>("musicDifficulties", server)
}
