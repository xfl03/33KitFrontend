import {KitDataProvider} from "./kit-data-provider";

export interface MusicMetaDisplay {
    id: number// DataGrid需要id
    title: string
    musicDifficulty: string
    playLevel: number
    time: number
    totalNoteCount: number
    tapPerSecond: number
    eventRate: number
    scoreRate: number
}

function toMusicMetaDisplay(musics: any[], musicDifficulties: any[], musicMeta: any, isMulti: boolean, id: number): MusicMetaDisplay {
    const music = musics.find(it => it.id === musicMeta.music_id)
    const musicDifficulty = musicDifficulties.find(it =>
        it.musicId === musicMeta.music_id && it.musicDifficulty === musicMeta.difficulty)
    const skillScore: number[] = isMulti ? musicMeta.skill_score_multi : musicMeta.skill_score_solo
    // 技能按100%效果计算、多人按180%计算
    const skillSum = skillScore.reduce((v, it) => v + it, 0) * (isMulti ? 1.8 : 1)
    const scoreSum = musicMeta.base_score + skillSum + (isMulti ? musicMeta.fever_score : 0)
    return {
        id,
        title: music.title,
        musicDifficulty: musicDifficulty.musicDifficulty,
        playLevel: musicDifficulty.playLevel,
        time: musicMeta.music_time,
        totalNoteCount: musicDifficulty.totalNoteCount,
        tapPerSecond: musicMeta.tap_count / musicMeta.music_time,
        eventRate: musicMeta.event_rate,
        scoreRate: scoreSum,
    }
}

function toMusicMetaDisplays(musics: any[], musicDifficulties: any[], musicMetas: any[], isMulti: boolean) {
    let id = 0
    return musicMetas.map(it => toMusicMetaDisplay(musics, musicDifficulties, it, isMulti, ++id))
}

export async function getMusicMetaDisplays(isMulti: boolean) {
    const dataProvider = new KitDataProvider("1145141919810")
    const musics = await dataProvider.getMasterData("musics")
    const musicDifficulties = await dataProvider.getMasterData("musicDifficulties")
    const musicMetas = await dataProvider.getMusicMeta()
    return toMusicMetaDisplays(musics, musicDifficulties, musicMetas, isMulti)
}
