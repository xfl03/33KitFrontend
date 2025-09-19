import useMasterData, {getMasterData} from "./common";
import {Event, GameCharacter, WorldBloom} from "sekai-calculator";

export default function useEvents() {
    return useMasterData<Event>("events")
}

export async function getBloomEventCharacters(eventId: number) {
    const characters = await getMasterData<GameCharacter>("gameCharacters")
    const worldBlooms =
        await getMasterData<WorldBloom>("worldBlooms")
    const currentWorldBlooms = worldBlooms.filter(it => it.eventId === eventId);
    // World Link Final
    if (currentWorldBlooms.length === 1 && currentWorldBlooms[0].worldBloomChapterType === "finale") {
        return characters
    }
    return currentWorldBlooms.map(it => characters.find(a => a.id === it.gameCharacterId)!!)
}
