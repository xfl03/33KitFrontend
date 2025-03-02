import {GridValueFormatterParams} from "@mui/x-data-grid/models/params/gridCellParams";

export function formatPercent(value: number | undefined): string {
    if (value === undefined) {
        return "NaN";
    }
    const percent = value * 100
    return `${percent.toFixed(1)}%`
}
export function formatPercentForGrid(params: GridValueFormatterParams<number>): string {
    return formatPercent(params.value)
}

export function formatFixed1(params: GridValueFormatterParams<number>): string {
    return params.value.toFixed(1)
}
