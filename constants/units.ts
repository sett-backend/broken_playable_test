export const SECOND = 1000;
export const MINUTE = 60*1000;

export function toJSTime(seconds:number){
    return seconds*SECOND;
}

export function toGSAPTime(seconds:number){
    return seconds/SECOND;
}