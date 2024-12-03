import { Game } from 'components/classes/game';
import 'core/public/index.css';
import { init, setLinks } from 'helper/adProtocols';
import { PlayableLevel } from './playableLevel';

import { loadAllAssets } from './assetsList';
import { assetsLoader } from 'root/class/three/levelAssetsLoader';
//DESCRIPTION: links to the app
setLinks({
    ios: 'https://apps.apple.com/il/app/backgammon-lord-of-the-board/id1128669274',
    android: 'https://play.google.com/store/apps/details?id=air.com.beachbumgammon&hl=en',
});

init(() => {
    assetsLoader.onLoadComplete(() => {
        Game.start();
        new PlayableLevel();
    });
    loadAllAssets();

    const canvases = document.getElementsByName('canvas');
    canvases.forEach((c) => {
        c.ontouchstart = preventEvent;
    });
});
window.oncontextmenu = function (event) {
    preventEvent(event);
    return false;
};

function preventEvent(e: PointerEvent | TouchEvent | MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
}
