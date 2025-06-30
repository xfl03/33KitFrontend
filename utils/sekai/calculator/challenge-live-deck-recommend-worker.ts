import {CachedDataProvider, ChallengeLiveDeckRecommend, LiveCalculator} from "sekai-calculator";
import {KitDataProvider} from "./kit-data-provider";

addEventListener("message", async (event: MessageEvent<{ execId: string; args: any }>) => {
  const {execId, args} = event.data
  const {userId, music, difficulty, gameCharacter, cardConfig} = args

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
  const userChallengeLiveSoloResults = await dataProvider.getUserData("userChallengeLiveSoloResults") as any[]
  const userChallengeLiveSoloResult = userChallengeLiveSoloResults.find(it => it.characterId === gameCharacter.id)
  let challengeHighScore
  if (typeof userChallengeLiveSoloResult !== "undefined") {
    challengeHighScore = userChallengeLiveSoloResult
  }
  const result = await new ChallengeLiveDeckRecommend(dataProvider).recommendChallengeLiveDeck(gameCharacter.id, {
    musicMeta,
    limit: 10,
    member: 5,
    cardConfig,
    debugLog: (str: string) => {
      console.log(str)
    },
  })
  postMessage({
    execId: execId,
    challengeHighScore: challengeHighScore,
    result: result
  })
})
