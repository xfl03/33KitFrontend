import useMasterData from "./common";
import {Music, MusicDifficulty} from "sekai-calculator";

export function useMusics() {
    return useMasterData<Music>("musics")
}

export function useMusicDifficulties() {
    return useMasterData<MusicDifficulty>("musicDifficulties")
}
