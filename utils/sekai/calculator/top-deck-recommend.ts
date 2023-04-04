import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import useCharacters, {getCharacterName} from "../master/character-hook";
import {getById} from "../master/common";

interface TopDeck {
    challenge: Array<{
        character: string,
        score: number,
        power: number,
        cards: number[]
    }>,
    event: Array<{
        point: number,
        power: number,
        eventBonus: number,
        cards: number[]
    }>
}

interface TopDeckResponse {
    challenge: Array<{
        characterId: number,
        score: number,
        power: number,
        cards: number[]
    }>,
    event: Array<{
        point: number,
        power: number,
        eventBonus: number,
        cards: number[]
    }>
}

export function useTopDeck() {
    const [topDeck, setTopDeck] = useState<TopDeck>()
    const characters = useCharacters()
    useEffect(() => {
        if(!characters) return
        axios.get("/top-deck").then((it:AxiosResponse<TopDeckResponse>) => {
            const data = it.data
            const topDeck0 = {
                challenge:data.challenge.map(it=>{
                    return {
                        character:getCharacterName(getById(characters,it.characterId)),
                        score:it.score,
                        power:it.power,
                        cards:it.cards
                    }
                }),
                event:data.event
            }
            setTopDeck(topDeck0)
        })
    }, [characters])
    return topDeck
}
