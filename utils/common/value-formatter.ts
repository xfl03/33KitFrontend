import {GridValueFormatterParams} from "@mui/x-data-grid/models/params/gridCellParams";

export function formatPercent(params: GridValueFormatterParams<number>): string {
    const percent = Math.round(params.value * 100)
    return `${percent}%`
}

export function formatFixed1(params: GridValueFormatterParams<number>): string {
    return params.value.toFixed(1)
}
