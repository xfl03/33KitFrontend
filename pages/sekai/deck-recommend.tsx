import {useMusicDifficulties, useMusics} from "../../utils/sekai/master/music-hook";
import {MouseEvent, useEffect, useState, useRef} from "react";
import type {ChangeEvent} from "react";
import AppBase from "../../components/AppBase";
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid, Link,
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
import useEvents, {getBloomEventCharacters} from "../../utils/sekai/master/event-hook";

// const difficulties = ["easy", "normal", "hard", "expert", "master"]
export default function Page() {
    const worker1Ref = useRef<Worker>()
    const worker2Ref = useRef<Worker>()
    const resolvers = useRef<{ [key: string]: any }>({})
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
                masterMax: false,
                episodeRead: true,
                skillMax: false
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
    const [supportCharacters, setSupportCharacters] = useState<GameCharacter[]>([])
    const [supportCharacter, setSupportCharacter] = useState<GameCharacter | null>(null)

    useEffect(() => {
        const onWorkerMessage = (event: MessageEvent<{ execId: string; challengeHighScore: number; result: any }>) => {
            const {execId, challengeHighScore, result} = event.data
            resolvers.current[execId](result)
            if (typeof challengeHighScore !== "undefined") {
                setChallengeHighScore(challengeHighScore)
            }
        }
        worker1Ref.current = new Worker(new URL("./challenge-live-deck-recommend-worker.ts", import.meta.url))
        worker2Ref.current = new Worker(new URL("./event-deck-recommend-worker.ts", import.meta.url))
        worker1Ref.current.onmessage = onWorkerMessage
        worker2Ref.current.onmessage = onWorkerMessage
        const uid = localStorage.getItem("userId")
        if (uid) setUserId(uid);
        return () => {
            worker1Ref.current?.terminate()
            worker2Ref.current?.terminate()
        }
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

    useEffect(() => {
        if (event0 === null) return
        getBloomEventCharacters(event0.id).then(it => {
            setSupportCharacters(it)
            if (it.length > 0) setSupportCharacter(it[0])
        })

    }, [event0])

    function handleCardConfig(rarity: string, key: "rankMax" | "episodeRead" | "skillMax" | "masterMax" | "disable") {
        return (event: ChangeEvent<HTMLInputElement>) => {
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

        if (mode === "1") {
            if (!gameCharacter) throw new Error("请选择角色")
            return new Promise<RecommendDeck[]>((resolve, reject) => {
                const execId = crypto.randomUUID()
                resolvers.current[execId] = resolve
                worker1Ref.current?.postMessage({
                    execId: execId,
                    args: {
                        userId: userId,
                        music: music,
                        difficulty: difficulty,
                        gameCharacter: gameCharacter,
                        cardConfig: cardConfig
                    }
                })
            })
        }

        if (!event0) throw new Error("请选择活动")
        return new Promise<RecommendDeck[]>((resolve, reject) => {
            const execId = crypto.randomUUID()
            resolvers.current[execId] = resolve
            worker2Ref.current?.postMessage({
                execId: execId,
                args: {
                    userId: userId,
                    music: music,
                    difficulty: difficulty,
                    event0: event0,
                    liveType: liveType,
                    cardConfig: cardConfig,
                    supportCharacter: supportCharacter
                }
            })
        })
    }

    function handleButton() {
        if (calculating) return
        setCalculating(true)
        doCalculate().then(recommend0 => {
            // console.log(recommend0)
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

    function handleCancel() {
        worker1Ref.current?.terminate()
        worker2Ref.current?.terminate()
        setError("")
        setRecommend([])
        setCalculating(false)
    }

    return (<AppBase subtitle={"自动组队"}>
        <Grid container>
            <Grid item xs={12}>
                <Alert severity="info">
                    <AlertTitle>关于自动组队</AlertTitle>
                    使用自动组队前，请先将用户数据传到<Link href="https://haruki.seiunx.com/upload_suite">Haruki工具箱</Link> 。
                    <br/>
                    33 Kit不会记录任何用户数据，计算过程全部在您的本地浏览器中进行。
                    <br/>
                    手机性能有限，自动组卡可能极慢，建议使用iPad或电脑组卡。
                    <br/>
                    自动组卡不能保证100%是最优解，如果还有更好的方案，欢迎向33反馈。
                    <br/>
                    「世界连接」活动只会组出完全同组合的卡组。
                    <br/>
                    「新FES」目前只能算觉醒后技能，觉醒前技能还在研究。
                    <br/>
                    「My SEKAI」的Canvas、家具、Gate加成均已支持。
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    style={{width: "457px", marginTop: "10px"}}
                    label="用户ID"
                    value={userId}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
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
                            sx={{width: 344}}
                            getOptionLabel={(option) => `${option.id} - ${option.name}`}
                            renderInput={(params) => <TextField {...params} label="活动"/>}
                        />}

                </Stack>
                {supportCharacters && supportCharacters.length > 0 && mode === "2" && event0 && event0.eventType === "world_bloom" &&
                    <Stack><Autocomplete
                        value={supportCharacter}
                        onChange={(event: any, newValue: GameCharacter | null) => {
                            setSupportCharacter(newValue)
                        }}
                        id="combo-box-demo"
                        options={supportCharacters}
                        sx={{width: 457, marginTop: '10px'}}
                        getOptionLabel={(option) => getCharacterName(option)}
                        renderInput={(params) => <TextField {...params} label="支援角色"/>}
                    /></Stack>}
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
                    <strong>适当禁用一些稀有度有利于加速计算</strong>
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
                {calculating ?
                  <Button variant="outlined" onClick={() => handleCancel()} style={{width: "457px", marginBottom: "10px", height: "56px"}}>取消（计算中...可能要等30秒）</Button> :
                  <Button variant="outlined" onClick={() => handleButton()} style={{width: "457px", marginBottom: "10px", height: "56px"}}>自动组卡！</Button>
                }
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
