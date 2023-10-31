import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {RecommendDeck} from "sekai-calculator";

export interface TopDeck {
    challenge: RecommendDeck[],
    event: RecommendDeck[]
}

const TOP_DECK_URL = process.env.NEXT_PUBLIC_SEKAI_DATA_BASE + "top-deck.json"

export function useTopDeck() {
    const [topDeck, setTopDeck] = useState<TopDeck>()
    useEffect(() => {
        axios.get(TOP_DECK_URL).then((it: AxiosResponse<TopDeck>) => {
            const data = it.data
            setTopDeck(data)
        })
    }, [])
    return topDeck
}

export async function getTopDeck(): Promise<TopDeck> {
    const res = await fetch(TOP_DECK_URL);
    return await res.json();
}
