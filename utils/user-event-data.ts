export function getChangedData(data: any[]) {
    let ret = [data[0]] as any[];
    for (let i = 1; i < data.length; ++i) {
        let latestRet = ret[ret.length - 1];
        let currentData = data[i];
        //Score changed
        if (latestRet.s < currentData.s) {
            ret.push(currentData);
        }
    }
    return ret;
}