import {KitDataProvider} from "./kit-data-provider";
import {Music, MusicDifficulty, MusicMeta} from "sekai-calculator";

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
    skillRate: number
    skillDetails: number[]
}

function getBaseScore(musicMeta: any, liveType: string): number {
    switch (liveType) {
        case "solo":
        default:
            return musicMeta.base_score
        case "auto":
            return musicMeta.base_score_auto
        case "multi":
            return musicMeta.base_score + musicMeta.fever_score + 5 * 0.015 / 4 // 算上Fever加成和活跃加分
    }
}

function getSkillScore(musicMeta: any, liveType: string): number[] {
    switch (liveType) {
        case "solo":
        default:
            return musicMeta.skill_score_solo
        case "auto":
            return musicMeta.skill_score_auto
        case "multi":
            return musicMeta.skill_score_multi
    }
}

function toMusicMetaDisplay(musics: Music[], musicDifficulties: MusicDifficulty[], musicMeta: MusicMeta, liveType: string, id: number): MusicMetaDisplay {
    const music = musics.find(it => it.id === musicMeta.music_id)!
    const musicDifficulty = musicDifficulties.find(it =>
        it.musicId === musicMeta.music_id && it.musicDifficulty === musicMeta.difficulty)!
    const skillScore = getSkillScore(musicMeta, liveType)
    // 技能按100%效果计算、多人按180%计算
    const skillSum = skillScore.reduce((v, it) => v + it, 0) * (liveType === "multi" ? 1.8 : 1)
    const scoreSum = skillSum + getBaseScore(musicMeta, liveType)
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
        skillRate: skillSum / scoreSum,
        skillDetails: skillScore,
    }
}

function toMusicMetaDisplays(musics: Music[], musicDifficulties: MusicDifficulty[], musicMetas: MusicMeta[], liveType: string) {
    let id = 0
    return musicMetas.map(it => toMusicMetaDisplay(musics, musicDifficulties, it, liveType, ++id))
}

export async function getMusicMetaDisplays(liveType: string) {
    const dataProvider = KitDataProvider.DEFAULT_INSTANCE
    const musics = await dataProvider.getMasterData("musics") as Music[]
    const musicDifficulties = await dataProvider.getMasterData("musicDifficulties") as MusicDifficulty[]
    const musicMetas = await dataProvider.getMusicMeta() as MusicMeta[]
    return toMusicMetaDisplays(musics, musicDifficulties, musicMetas, liveType)
}
