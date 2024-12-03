import { Container } from 'pixi.js';

export function PixiDestroyer(container: Container) {
    if (container) {
        container.interactive = false;
        container.removeAllListeners();
        try {
            container.parent.removeChild(container);
        } catch (error) {
            //
        }
        container.destroy({ children: true, texture: false, baseTexture: false });
    }
}
