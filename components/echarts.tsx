import {Grid} from "@mui/material";
import EChartsReact from "echarts-for-react";
import * as React from "react";

export default function Echarts({option}: { option: any }) {
    if (option === undefined) return <p>No Option</p>
    return (
        <EChartsReact style={{height: '700px', maxHeight: '75%', width: '100%'}} option={option}/>
    )
}
