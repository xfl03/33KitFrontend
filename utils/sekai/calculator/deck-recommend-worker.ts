import { CachedDataProvider, ChallengeLiveDeckRecommend, EventDeckRecommend, LiveCalculator, LiveType } from "sekai-calculator";
import { KitDataProvider } from "./kit-data-provider";

function calcDuration() {
  const startAt = performance.now()

  return {
    startAt: startAt,
    done() {
      return performance.now() - startAt
    }
  }
}

async function deckRecommendRunner(args: any) {
  const { mode, server, userId, music, difficulty, gameCharacter, cardConfig, event0, liveType, userData, supportCharacter } = args

  const kitDataProvider = new KitDataProvider(server, userId)
  kitDataProvider.setUserDataAll(userData) // 预加载的用户数据
  const dataProvider = new CachedDataProvider(kitDataProvider)
  // 并行预加载所有数据，加快速度
  await Promise.all([
    dataProvider.getUserDataAll(),
    dataProvider.getMusicMeta(),
    dataProvider.preloadMasterData([
      "areaItemLevels", "cards", "cardMysekaiCanvasBonuses", "cardRarities", "characterRanks", "cardEpisodes",
      "events", "eventCards", "eventRarityBonusRates", "eventDeckBonuses", "gameCharacters", "gameCharacterUnits",
      "honors", "masterLessons", "mysekaiGates", "mysekaiGateLevels","skills",
      // "worldBloomDifferentAttributeBonuses",
      // "worldBloomSupportDeckBonuses", "worldBloomSupportDeckUnitEventLimitedBonuses",
    ])
  ])
  const liveCalculator = new LiveCalculator(dataProvider)
  const musicMeta = await liveCalculator.getMusicMeta(music.id, difficulty)
  if (mode === "1") {
    const userChallengeLiveSoloResults = await dataProvider.getUserData<any[]>("userChallengeLiveSoloResults")
    const userChallengeLiveSoloResult = userChallengeLiveSoloResults.find(it => it.characterId === gameCharacter.id)
    const challengeLiveRecommend = new ChallengeLiveDeckRecommend(dataProvider)
    const currentDuration = calcDuration()
    const result = await challengeLiveRecommend.recommendChallengeLiveDeck(gameCharacter.id, {
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
      result: result,
      duration: currentDuration.done()
    }
  }

  const newLiveType = (event0.eventType === "cheerful_carnival" && liveType === LiveType.MULTI) ? LiveType.CHEERFUL : liveType
  const eventDeckRecommend = new EventDeckRecommend(dataProvider)
  const currentDuration = calcDuration()
  const result = await eventDeckRecommend.recommendEventDeck(event0.id, newLiveType, {
    musicMeta,
    limit: 10,
    cardConfig,
    debugLog: (str: string) => {
      console.log(str)
    },
  }, supportCharacter?.id)
  console.log(result[0])
  return {
    result: result,
    duration: currentDuration.done()
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
