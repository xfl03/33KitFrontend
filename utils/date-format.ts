import dateFormat from "dateformat";
export function formatDatetimeShort(timestamp:number){
    return dateFormat(new Date(timestamp), "yyyy/m/d H:MM");
}
export function formatDateShort(timestamp:number){
    return dateFormat(new Date(timestamp), "yyyy/m/d");
}