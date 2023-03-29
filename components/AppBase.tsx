import * as React from 'react';
import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
    Analytics,
    Download,
    EmojiEvents,
    GitHub,
    Groups,
    Home,
    Insights,
    LiveTv,
    MusicNote,
    Person
} from "@mui/icons-material";
import {useRouter} from 'next/router'
import Head from 'next/head'
import ReactGA from "react-ga4";
import {useEffect, useState} from "react";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {ListSubheader} from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

type AppBaseProps = {
    subtitle: string,
    children: JSX.Element,
}

const drawItems = [
    {
        "category": "33 Kit",
        "categoryShort": "33 Kit",
        "items": [
            {
                "name": "首页",
                "icon": <Home/>,
                "path": "/",
                "display": true,
            },
        ]
    },
    {
        "category": "Project SEKAI",
        "categoryShort": "SEKAI",
        "items": [
            {
                "name": "游戏下载",
                "icon": <Download/>,
                "path": "/pjsk-download",
                "display": true,
            },
            {
                "name": "活动预测",
                "icon": <Analytics/>,
                "path": "/pjsk-predict",
                "display": true,
            },
            {
                "name": "对战预测",
                "icon": <Groups/>,
                "path": "/pjsk-cheerful-predict",
                "display": true,
            },
            {
                "name": "活动最终数据",
                "icon": <Insights/>,
                "path": "/pjsk-final",
                "display": true,
            },
            {
                "name": "对战数据",
                "icon": <EmojiEvents/>,
                "path": "/pjsk-cheerful",
                "display": true,
            },
            {
                "name": "歌曲Meta",
                "icon": <MusicNote/>,
                "path": "/sekai/music-meta",
                "display": true,
            },
            {
                "name": "个人活动数据",
                "icon": <Person/>,
                "path": "/pjsk-user-event",
                "display": false,
            },
        ]
    },
    {
        "category": "Minecraft",
        "categoryShort": "MC",
        "items": [
            {
                "name": "CustomSkinLoader",
                "icon": <Download/>,
                "path": "/csl-download",
                "display": true,
            },
        ]
    },
]

export default function AppBase({subtitle, children}: AppBaseProps) {
    const router = useRouter()
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [displayItems, setDisplayItems] = useState<Array<any>>([])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        //@ts-ignore
        ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS);
        ReactGA.send("pageview");
    }, [])

    useEffect(() => {
        let category = drawItems.find((it) => it.category === "Project SEKAI");
        if (category && localStorage.getItem("userId") !== null) {
            let userData = category.items.find((it) => it.path === "/pjsk-user-event");
            if (userData) {
                userData.display = true;
            }
        }
        setDisplayItems(drawItems);
    }, [setDisplayItems])

    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    const fullTitle = `${subtitle} - 33 Kit`
    console.log(fullTitle);

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaSiteKey}
            language="zh-CN"
            useRecaptchaNet={true}
            scriptProps={{async: true, defer: true}}
        >
            <Head>
                <title>{fullTitle}</title>
            </Head>
            <Box sx={{display: 'flex'}}>
                <CssBaseline/>
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            33 Kit
                        </Typography>
                        <div>
                            <IconButton
                                size="large"
                                aria-label="bilibili"
                                href="https://space.bilibili.com/8919498"
                                color="inherit"
                            >
                                <LiveTv/>
                            </IconButton>
                            <IconButton
                                size="large"
                                aria-label="GitHub"
                                href="https://github.com/xfl03"
                                color="inherit"
                            >
                                <GitHub/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                        </IconButton>
                    </DrawerHeader>
                    {displayItems.map((category) => [
                        <Divider key={category.category + 0}/>,
                        <List
                            key={category.category + 1}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    {open ? category.category : category.categoryShort}
                                </ListSubheader>
                            }>
                            {category.items.filter((it: any) => it.display).map((item: any) =>
                                <ListItem key={item.path} disablePadding sx={{display: 'block'}}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                        onClick={() => router.push(item.path)}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.name} sx={{opacity: open ? 1 : 0}}/>
                                    </ListItemButton>
                                </ListItem>)}
                        </List>,
                    ])}
                </Drawer>
                <Box component="main" sx={{flexGrow: 1, p: 3}}>
                    <DrawerHeader/>
                    {children}
                </Box>
            </Box>
        </GoogleReCaptchaProvider>
    );
}
