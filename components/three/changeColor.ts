import { Color } from 'three';
import gsap from 'gsap';
import { colorRGB } from './materials/helper';

export function changeMaterialColor(materialColor: Color, colorStart: string, colorEnd: string) {
    gsap.to(materialColor, {
        ...colorRGB(colorEnd),
        duration: 0.2,
    });
    gsap.to(materialColor, {
        ...colorRGB(colorStart),
        delay: 0.4,
        duration: 0.3,
    });
}
