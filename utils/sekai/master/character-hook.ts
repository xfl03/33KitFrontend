import {GameCharacter} from "sekai-calculator";
import useMasterData from "./common";

export default function useGameCharacters() {
    return useMasterData<GameCharacter>("gameCharacters")
}

export function getCharacterName(character: GameCharacter) {
    return character.firstName ? `${character.firstName}${character.givenName}` : character.givenName
}
