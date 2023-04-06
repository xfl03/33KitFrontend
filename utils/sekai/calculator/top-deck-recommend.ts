import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {RecommendDeck} from "sekai-calculator";

interface TopDeck {
    challenge: RecommendDeck[],
    event: RecommendDeck[]
}

export function useTopDeck() {
    const [topDeck, setTopDeck] = useState<TopDeck>()
    useEffect(() => {
        axios.get("/top-deck").then((it: AxiosResponse<TopDeck>) => {
            const data = it.data
            setTopDeck(data)
        })
    }, [])
    return topDeck
}
