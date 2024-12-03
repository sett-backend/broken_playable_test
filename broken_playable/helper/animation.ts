import { lerp } from 'components/helper/math';

export function getPrc(prc: number, def: { [key: string]: number }) {
    const value = prc * 100;
    let fromValue = 0;
    let toValue = 0;

    let fromPrc = 0;
    let toPrc = 0;

    const keys = Object.keys(def);
    keys.forEach((key, index) => {
        if (value > parseFloat(key)) {
            fromValue = def[key];
            fromPrc = parseFloat(key);
            toValue = def[keys[index + 1]];
            toPrc = parseFloat(keys[index + 1]);
        }
    });
    const sectionPrc = (value - fromPrc) / (toPrc - fromPrc);

    return lerp(fromValue, toValue, sectionPrc);
}
