import {Card, DeckCardDetail} from "sekai-calculator";
import {getById} from "../../utils/sekai/master/common";
import {shortSkills} from "../../utils/sekai/master/skill";
import useCards from "../../utils/sekai/master/card-hook";

type CardThumbnailProps = {
    cardId: number,
    deckCard?: DeckCardDetail,
    size?: number
}

function getIsNormal(card: Card) {
    switch (card.cardRarityType) {
        case "rarity_1":
        case "rarity_2":
        case "rarity_birthday":
            return true;
        default:
            return false;
    }
}

function getRarity(card: Card) {
    switch (card.cardRarityType) {
        case "rarity_1":
            return 1;
        case "rarity_2":
            return 2;
        case "rarity_3":
            return 3;
        case "rarity_birthday":
            return "bd";
        case "rarity_4":
        default:
            return 4;
    }
}

export default function CardThumbnail({cardId, deckCard, size = 156}: CardThumbnailProps) {
    const cards = useCards()
    if (cards === undefined) return (<div>卡牌{cardId}</div>)
    const card = getById(cards, cardId)
    if (card === undefined) return (<div>卡牌{cardId}</div>)
    const normal = getIsNormal(card)
    const rarity = getRarity(card)
    return (<div style={{height: `${size}px`, width: `${size}px`}}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 156 156">
            <title>
                {`ID${cardId}`}
                <br/>
                {deckCard ?
                    `综合${deckCard.power} ${deckCard.skill ? `加分${deckCard.skill.scoreUp}` : ""}${deckCard.eventBonus ? ` 活动${deckCard.eventBonus}` : ""}` :
                    shortSkills[card.skillId]
                }
            </title>
            <image
                href={`${process.env.NEXT_PUBLIC_ASSET_BASE}startapp/thumbnail/chara/${card.assetbundleName}_${normal ? "normal" : "after_training"}.png`}
                x="8"
                y="8" height="140" width="140"/>
            <image href={`/assets/frame/cardFrame_S_${rarity}.png`} x="0" y="0" height="156"
                   width="156"/>
            <image href={`/assets/icon_attribute_${card.attr}.png`} x="0" y="0" height="35"
                   width="35"/>
            {rarity === "bd" ?
                <image key="114514" href={`/assets/rarity_birthday.png`}
                       x="8"
                       y="125" width="22"
                       height="22"/> :
                Array.from(Array(rarity).keys()).map(i => (
                    <image key={i} href={`/assets/rarity_star_${normal ? "normal" : "afterTraining"}.png`}
                           x={8 + i * 22}
                           y="125" width="22"
                           height="22"/>
                ))}
        </svg>
    </div>)
}
