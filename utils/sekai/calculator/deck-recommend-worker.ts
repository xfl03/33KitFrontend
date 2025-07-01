import {
  CachedDataProvider,
  ChallengeLiveDeckRecommend,
  EventDeckRecommend,
  LiveCalculator,
  LiveType
} from "sekai-calculator";
import {KitDataProvider} from "./kit-data-provider";

async function deckRecommendRunner(args: any) {
  const {mode, userId, music, difficulty, gameCharacter, cardConfig, event0, liveType, supportCharacter} = args

  const dataProvider = new CachedDataProvider(new KitDataProvider(userId))
  // 并行预加载所有数据，加快速度
  await Promise.all([
    dataProvider.getUserDataAll(),
    dataProvider.getMusicMeta(),
    dataProvider.preloadMasterData([
      "areaItemLevels", "cards", "cardRarities", "skills", "cardEpisodes", "masterLessons", "characterRanks",
      "events", "eventCards", "eventRarityBonusRates", "eventDeckBonuses", "gameCharacters",
      "gameCharacterUnits", "honors"
    ])
  ])
  const musicMeta = await new LiveCalculator(dataProvider).getMusicMeta(music.id, difficulty)
  if (mode === "1") {
    const userChallengeLiveSoloResults = await dataProvider.getUserData<any[]>("userChallengeLiveSoloResults")
    const userChallengeLiveSoloResult = userChallengeLiveSoloResults.find(it => it.characterId === gameCharacter.id)
    const result = await new ChallengeLiveDeckRecommend(dataProvider).recommendChallengeLiveDeck(gameCharacter.id, {
      musicMeta,
      limit: 10,
      member: 5,
      cardConfig,
      debugLog: (str: string) => {
        console.log(str)
      },
    })
    return {
      challengeHighScore: userChallengeLiveSoloResult,
      result: result
    }
  }

  const newLiveType = (event0.eventType === "cheerful_carnival" && liveType === LiveType.MULTI) ? LiveType.CHEERFUL : liveType
  const result = await new EventDeckRecommend(dataProvider).recommendEventDeck(event0.id, newLiveType, {
    musicMeta,
    limit: 10,
    cardConfig,
    debugLog: (str: string) => {
      console.log(str)
    },
  }, supportCharacter?.id)
  return {
    result: result
  }
}

addEventListener("message", (event: MessageEvent<{ args: any }>) => {
  deckRecommendRunner(event.data.args)
    .then((result) => {
      postMessage(result)
    })
    .catch((err) => {
      postMessage({
        error: err.message
      })
    })
})
