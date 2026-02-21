import {GameCharacter} from "sekai-calculator";
import useMasterData from "./common";

export default function useGameCharacters(server: string = "jp") {
    return useMasterData<GameCharacter>("gameCharacters", server)
}

export function getCharacterName(character: GameCharacter) {
    return character.firstName ? `${character.firstName}${character.givenName}` : character.givenName
}
