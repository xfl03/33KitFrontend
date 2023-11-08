import useMasterData, {getMasterData} from "./common";
import {Event, GameCharacter} from "sekai-calculator";

export default function useEvents() {
    return useMasterData<Event>("events")
}

export async function getBloomEventCharacters(eventId: number) {
    const characters = await getMasterData<GameCharacter>("gameCharacters")
    const worldBlooms =
        await getMasterData<{ eventId: number, gameCharacterId: number }>("worldBlooms")
    return worldBlooms.filter(it => it.eventId === eventId).map(it => characters.find(a => a.id === it.gameCharacterId)!!)
}
