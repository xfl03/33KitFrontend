import {CachedDataProvider, EventDeckRecommend, LiveCalculator, LiveType} from "sekai-calculator";
import {KitDataProvider} from "./kit-data-provider";

addEventListener("message", async (event: MessageEvent<{ execId: string; args: any }>) => {
  const {execId, args} = event.data
  const {userId, music, difficulty, event0, liveType, cardConfig, supportCharacter} = args

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
  const newLiveType =
    (event0.eventType === "cheerful_carnival" && liveType === LiveType.MULTI) ? LiveType.CHEERFUL : liveType
  const result = await new EventDeckRecommend(dataProvider).recommendEventDeck(event0.id, newLiveType, {
    musicMeta,
    limit: 10,
    cardConfig,
    debugLog: (str: string) => {
      console.log(str)
    },
  }, supportCharacter?.id)
  postMessage({
    execId: execId,
    result: result
  })
})
