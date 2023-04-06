import {useMusics} from "../../utils/sekai/master/music-hook";
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

const difficulties = ["easy", "normal", "hard", "expert", "master"]
export default function Page() {
    const [userId, setUserId] = useState<string>("")
    const [mode, setMode] = useState<string>("1")
    const gameCharacters = useGameCharacters()
    const [gameCharacter, setGameCharacter] = useState<GameCharacter | null>(null)
    const [member, setMember] = useState<number>(5)
    const events = useEvents()
    const [event0, setEvent0] = useState<Event | null>(null)
    const musics = useMusics()
    const [music, setMusic] = useState<Music | null>(null)
    const [difficulty, setDifficulty] = useState<string | null>("master")
    const [cardConfig, setCardConfig] = useState<CardConfig>({
        rankMax: false,
        episodeRead: false,
        skillMax: false,
        masterMax: false
    })
    const [recommend, setRecommend] = useState<RecommendDeck[]>([])
    const [calculating, setCalculating] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

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
        setMusic(musics.find(it => it.id === 62)!)
    }, [musics])

    useEffect(() => {
        if (events === undefined) return
        setEvent0(events[events.length - 1])
    }, [events])

    function handleCardConfig(key: "rankMax" | "episodeRead" | "skillMax" | "masterMax") {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            cardConfig[key] = event.target.checked
            setCardConfig(cardConfig);
        };
    }

    async function doCalculate() {
        if (!userId) throw new Error("请填写用户ID")
        localStorage.setItem("userId", userId);
        if (!music || !difficulty) throw new Error("请选择歌曲")
        const dataProvider = new CachedDataProvider(new KitDataProvider(userId))
        const musicMeta = await new LiveCalculator(dataProvider).getMusicMeta(music.id, difficulty)
        if (mode === "1") {
            if (!gameCharacter) throw new Error("请选择角色")
            return await new ChallengeLiveDeckRecommend(dataProvider).recommendChallengeLiveDeck(gameCharacter.id, {
                musicMeta,
                limit: 10,
                member,
                cardConfig
            })
        }

        if (!event0) throw new Error("请选择活动")
        return await new EventDeckRecommend(dataProvider).recommendEventDeck(event0.id, LiveType.CHEERFUL, {
            musicMeta,
            limit: 10,
            cardConfig
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
            setError(e.toString())
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
                        <ToggleButton value="1">挑战</ToggleButton>
                        <ToggleButton value="2">活动</ToggleButton>
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
                <FormGroup>
                    <Stack direction="row" spacing={3} style={{margin: "15px"}}>
                        <FormControlLabel
                            control={<Checkbox value={cardConfig.rankMax} onChange={handleCardConfig("rankMax")}/>}
                            label="满级"/>
                        <FormControlLabel
                            control={<Checkbox value={cardConfig.episodeRead}
                                               onChange={handleCardConfig("episodeRead")}/>}
                            label="前后篇"/>
                        <FormControlLabel
                            control={<Checkbox value={cardConfig.masterMax} onChange={handleCardConfig("masterMax")}/>}
                            label="满突破"/>
                        <FormControlLabel
                            control={<Checkbox value={cardConfig.skillMax} onChange={handleCardConfig("skillMax")}/>}
                            label="满技能"/>
                    </Stack>
                </FormGroup>
                <Button variant="outlined" onClick={() => handleButton()} disabled={calculating}
                        style={{width: "457px", marginBottom: "10px", height: "56px"}}>
                    {calculating ? "计算中..." : "自动组卡！"}
                </Button>
                {error !== "" &&
                    <Alert severity="error">
                        <AlertTitle>无法推荐卡组</AlertTitle>
                        如果你确信是33 Kit的问题，可以将本页面截图和拥有的卡牌发给33。
                        <br/>
                        {error}
                    </Alert>
                }
            </Grid>
            <Grid item xs={12}>
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
