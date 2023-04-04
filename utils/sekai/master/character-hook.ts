import {useEffect, useState} from "react";
import {GameCharacter} from "sekai-calculator";
import {KitDataProvider} from "../calculator/kit-data-provider";

const dataProvider = new KitDataProvider("1145141919810");
export default function useCharacters() {
    const [characters, setCharacters] = useState<GameCharacter[]>()
    useEffect(() => {
        dataProvider.getMasterData("gameCharacters").then((data: GameCharacter[]) => {
            setCharacters(data)
        })
    }, [])
    return characters
}

export function getCharacterName(character: GameCharacter) {
    return character.firstName ? `${character.firstName}${character.givenName}` : character.givenName
}