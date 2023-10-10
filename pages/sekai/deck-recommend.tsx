import {useMusicDifficulties, useMusics} from "../../utils/sekai/master/music-hook";
import * as React from "react";
import {MouseEvent, useEffect, useState} from "react";
import AppBase from "../../components/AppBase";
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import {
    CachedDataProvider,
    CardConfig,
    ChallengeLiveDeckRecommend,
    Event,
    EventDeckRecommend,
    GameCharacter,
    LiveCalculator,
    LiveType,
    Music,
    RecommendDeck
} from "sekai-calculator";
import useGameCharacters, {getCharacterName} from "../../utils/sekai/master/character-hook";
import {KitDataProvider} from "../../utils/sekai/calculator/kit-data-provider";
import Button from "@mui/material/Button";
import DeckRecommendTable from "../../components/sekai/deck-recommend-table";
import useEvents from "../../utils/sekai/master/event-hook";

// const difficulties = ["easy", "normal", "hard", "expert", "master"]
export default function Page() {
    const [userId, setUserId] = useState<string>("")
    const [mode, setMode] = useState<string>("2")
    const gameCharacters = useGameCharacters()
    const [gameCharacter, setGameCharacter] = useState<GameCharacter | null>(null)
    const events = useEvents()
    const [event0, setEvent0] = useState<Event | null>(null)
    const [liveType, setLiveType] = useState<LiveType>(LiveType.MULTI)
    const musics = useMusics()
    const [music, setMusic] = useState<Music | null>(null)
    const musicDifficulties = useMusicDifficulties();
    const [difficulties, setDifficulties] = useState<Array<string>>([])
    const [difficulty, setDifficulty] = useState<string | null>("master")
    const [cardConfig, setCardConfig] =
        useState<Record<string, CardConfig>>({
            rarity_1: {
                disable: true,
                rankMax: true,
                masterMax: true,
                episodeRead: true,
                skillMax: true
            },
            rarity_2: {
                disable: true,
                rankMax: true,
                masterMax: true,
                episodeRead: true,
                skillMax: true
            },
            rarity_3: {
                disable: false,
                rankMax: true,
                masterMax: true,
                episodeRead: true,
                skillMax: true
            },
            rarity_birthday: {
                disable: false,
                rankMax: true,
                masterMax: false,
                episodeRead: true,
                skillMax: false
            },
            rarity_4: {
                disable: false,
                rankMax: true,
                masterMax: false,
                episodeRead: true,
                skillMax: false
            }
        })
    const [recommend, setRecommend] = useState<RecommendDeck[]>([])
    const [calculating, setCalculating] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [challengeHighScore, setChallengeHighScore] = useState<number>(0)

    useEffect(() => {
        const uid = localStorage.getItem("userId")
        if (uid) setUserId(uid);
    }, [])

    useEffect(() => {
        if (gameCharacters === undefined) return
        setGameCharacter(gameCharacters.find(it => it.id === 21)!)
    }, [gameCharacters])

    useEffect(() => {
        if (musics === undefined) return
        setMusic(musics.find(it => it.id === 74)!)
    }, [musics])

    useEffect(() => {
        if (events === undefined) return
        const event = events[events.length - 1]
        setEvent0(event)
    }, [events])

    useEffect(() => {
        if (music === undefined || music === null || musicDifficulties === undefined) return
        setDifficulties(musicDifficulties.filter(it => it.musicId === music.id).map(it => it.musicDifficulty))
    }, [music, musicDifficulties])

    function handleCardConfig(rarity: string, key: "rankMax" | "episodeRead" | "skillMax" | "masterMax" | "disable") {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const newCardConfig = JSON.parse(JSON.stringify(cardConfig));
            newCardConfig[rarity][key] = event.target.checked
            setCardConfig(newCardConfig);
        };
    }

    async function doCalculate() {
        setChallengeHighScore(0)
        if (!userId) throw new Error("请填写用户ID")
        localStorage.setItem("userId", userId);
        if (!music || !difficulty) throw new Error("请选择歌曲")
        const dataProvider = new CachedDataProvider(new KitDataProvider(userId))
        // 并行预加载所有数据，加快速度
        await Promise.all([
            dataProvider.getUserDataAll(),
            dataProvider.getMusicMeta(),
            dataProvider.preloadMasterData([
                "areaItemLevels", "cards", "cardRarities", "skills", "cardEpisodes", "masterLessons", "characterRanks",
                "eventCards", "eventRarityBonusRates", "eventDeckBonuses", "gameCharacterUnits", "honors"
            ])
        ])
        const musicMeta = await new LiveCalculator(dataProvider).getMusicMeta(music.id, difficulty)
        if (mode === "1") {
            if (!gameCharacter) throw new Error("请选择角色")
            const userChallengeLiveSoloResults = await dataProvider.getUserData("userChallengeLiveSoloResults") as any[]
            const userChallengeLiveSoloResult = userChallengeLiveSoloResults.find(it => it.characterId === gameCharacter.id)
            if (userChallengeLiveSoloResult !== undefined) {
                setChallengeHighScore(userChallengeLiveSoloResult.highScore)
            }
            return await new ChallengeLiveDeckRecommend(dataProvider).recommendChallengeLiveDeck(gameCharacter.id, {
                musicMeta,
                limit: 10,
                member: 5,
                cardConfig,
                debugLog: (str: string) => {
                    console.log(str)
                },
            })
        }

        if (!event0) throw new Error("请选择活动")
        const newLiveType =
            (event0.eventType !== "marathon" && liveType === LiveType.MULTI) ? LiveType.CHEERFUL : liveType
        return await new EventDeckRecommend(dataProvider).recommendEventDeck(event0.id, newLiveType, {
            musicMeta,
            limit: 10,
            cardConfig,
            debugLog: (str: string) => {
                console.log(str)
            },
        })
    }

    function handleButton() {
        if (calculating) return
        setCalculating(true)
        doCalculate().then(recommend0 => {
            setError("")
            setRecommend(recommend0)
            setCalculating(false)
        }).catch(e => {
            console.warn(e)
            let errorStr = e.toString()
            if (errorStr.includes("404")) {
                setError("玩家数据未上传到指定地点")
            } else if (errorStr.includes("403")) {
                setError("玩家数据上传时未选择「公开API读取」")
            } else {
                setError(errorStr)
            }
            setRecommend([])
            setCalculating(false)
        })
    }

    return (<AppBase subtitle={"自动组队"}>
        <Grid container>
            <Grid item xs={12}>
                <Alert severity="info">
                    <AlertTitle>关于自动组队</AlertTitle>
                    33 Kit不会记录任何用户数据，计算过程全部在您的本地浏览器中进行。
                    <br/>
                    自动组卡不能保证100%是最优解，如果还有更好的方案，欢迎向33反馈。
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    style={{width: "457px", marginTop: "10px"}}
                    label="用户ID"
                    value={userId}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setUserId(event.target.value);
                    }}
                />
                <Stack direction="row" spacing={1} style={{marginTop: "10px"}}>
                    <ToggleButtonGroup
                        color="primary"
                        value={mode}
                        exclusive
                        onChange={(event: MouseEvent<HTMLElement>, value: any) => {
                            setMode(value)
                        }}
                        aria-label="Platform"
                    >
                        <ToggleButton value="2">活动</ToggleButton>
                        <ToggleButton value="1">挑战</ToggleButton>
                    </ToggleButtonGroup>
                    {gameCharacters && mode === "1" &&
                        <Autocomplete
                            value={gameCharacter}
                            onChange={(event: any, newValue: GameCharacter | null) => {
                                setGameCharacter(newValue)
                            }}
                            id="combo-box-demo"
                            options={gameCharacters}
                            sx={{width: 347}}
                            getOptionLabel={(option) => getCharacterName(option)}
                            renderInput={(params) => <TextField {...params} label="角色"/>}
                        />}
                    {events && mode === "2" &&
                        <Autocomplete
                            value={event0}
                            disabled={true}
                            onChange={(event: any, newValue: Event | null) => {
                                setEvent0(newValue)
                            }}
                            id="combo-box-demo"
                            options={events}
                            sx={{width: 347}}
                            getOptionLabel={(option) => `${option.id} - ${option.name}`}
                            renderInput={(params) => <TextField {...params} label="活动"/>}
                        />}
                </Stack>
                {mode === "2" &&
                    <ToggleButtonGroup
                        style={{margin: "15px 0 5px 100px"}}
                        color="primary"
                        value={liveType}
                        exclusive
                        onChange={(event: MouseEvent<HTMLElement>, value: LiveType) => {
                            setLiveType(value);
                        }}
                        aria-label="Platform"
                    >
                        <ToggleButton value={LiveType.MULTI}>多人Live</ToggleButton>
                        <ToggleButton value={LiveType.SOLO}>单人Live</ToggleButton>
                        <ToggleButton value={LiveType.AUTO}>自动Live</ToggleButton>
                    </ToggleButtonGroup>
                }
                <Stack direction="row" spacing={1} style={{marginTop: "10px"}}>
                    {musics &&
                        <Autocomplete
                            value={music}
                            onChange={(event: any, newValue: Music | null) => {
                                setMusic(newValue)
                            }}
                            id="combo-box-demo"
                            options={musics}
                            sx={{width: 300}}
                            getOptionLabel={(option) => `${option.id} - ${option.title}`}
                            renderInput={(params) => <TextField {...params} label="歌曲"/>}
                        />}
                    <Autocomplete
                        value={difficulty}
                        onChange={(event: any, newValue: string | null) => {
                            setDifficulty(newValue)
                        }}
                        id="combo-box-demo"
                        options={difficulties}
                        sx={{width: 150}}
                        renderInput={(params) => <TextField {...params} label="难度"/>}/>
                </Stack>
                <div style={{width: "457px", textAlign: "center", marginTop: "15px", fontSize: "1.3rem"}}>
                    <strong>可以覆盖卡牌当前养成情况用于计算</strong>
                    <br/>
                    <strong>适当关闭一些稀有度有利于加速计算</strong>
                </div>
                <FormGroup>
                    {cardConfig && [{
                        type: "rarity_4",
                        name: "四星"
                    }, {
                        type: "rarity_birthday",
                        name: "生日"
                    }, {
                        type: "rarity_3",
                        name: "三星"
                    }, {
                        type: "rarity_2",
                        name: "二星"
                    }, {
                        type: "rarity_1",
                        name: "一星"
                    }].map(rarity =>
                        <Stack key={rarity.type} direction="row" spacing={2} style={{marginLeft: "6px"}}>
                            <p><strong>{rarity.name}</strong></p>
                            <FormControlLabel
                                control={<Checkbox checked={cardConfig[rarity.type].disable}
                                                   onChange={handleCardConfig(rarity.type, "disable")}/>}
                                label="禁用"/>
                            <FormControlLabel
                                control={<Checkbox checked={cardConfig[rarity.type].rankMax}
                                                   onChange={handleCardConfig(rarity.type, "rankMax")}/>}
                                label="满级"/>
                            <FormControlLabel
                                control={<Checkbox checked={cardConfig[rarity.type].episodeRead}
                                                   onChange={handleCardConfig(rarity.type, "episodeRead")}/>}
                                label="前后篇"/>
                            <FormControlLabel
                                control={<Checkbox checked={cardConfig[rarity.type].masterMax}
                                                   onChange={handleCardConfig(rarity.type, "masterMax")}/>}
                                label="满突破"/>
                            <FormControlLabel
                                control={<Checkbox checked={cardConfig[rarity.type].skillMax}
                                                   onChange={handleCardConfig(rarity.type, "skillMax")}/>}
                                label="满技能"/>
                        </Stack>
                    )}
                </FormGroup>
                <Button variant="outlined" onClick={() => handleButton()} disabled={calculating}
                        style={{width: "457px", marginBottom: "10px", height: "56px"}}>
                    {calculating ? "计算中...可能要等30秒" : "自动组卡！"}
                </Button>
                {error !== "" &&
                    <Alert severity="error">
                        <AlertTitle>无法推荐卡组</AlertTitle>
                        如果你确信是33 Kit的问题，可以将本页面截图和拥有的卡牌发给33。
                        <br/>
                        错误信息：<strong>{error}</strong>
                    </Alert>
                }
                {mode === "1" && gameCharacter && challengeHighScore > 0 &&
                    <Alert severity="info">
                        <AlertTitle>{getCharacterName(gameCharacter)}</AlertTitle>
                        当前最高分：<strong>{challengeHighScore}</strong>
                    </Alert>
                }
            </Grid>
            <Grid item xs={12} style={{marginTop: "5px"}}>
                {recommend &&
                    <DeckRecommendTable firstTitle="排名"
                                        first={(_, i) => i + 1}
                                        scoreTitle="分数" score={(it) => it.score}
                                        recommend={recommend}/>
                }
            </Grid>
        </Grid>
    </AppBase>)
}
