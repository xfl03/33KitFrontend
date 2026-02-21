import useMasterData, {getMasterData} from "./common";
import {Event, GameCharacter, WorldBloom} from "sekai-calculator";

export default function useEvents(server: string = "jp") {
    return useMasterData<Event>("events", server)
}

export async function getBloomEventCharacters(eventId: number, server: string = "jp") {
    const characters = await getMasterData<GameCharacter>("gameCharacters", server)
    const worldBlooms =
        await getMasterData<WorldBloom>("worldBlooms", server)
    const currentWorldBlooms = worldBlooms.filter(it => it.eventId === eventId);
    // World Link Final
    if (currentWorldBlooms.length === 1 && currentWorldBlooms[0].worldBloomChapterType === "finale") {
        return characters
    }
    return currentWorldBlooms.map(it => characters.find(a => a.id === it.gameCharacterId)!!)
}
