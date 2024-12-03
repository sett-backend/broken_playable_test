import { isAndroid } from 'helper/adProtocols';
import { v1 as uui } from 'uuid';
import playableSettings from '../playable/build-settings.json';

const api_secret = '';
const measurementId = '';
const gaHost = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${api_secret}`;

export enum GAEventsName {
    GAME_INIT = 'PlayableStarts',
    FIRST_INTERACTION = 'Deal',
    CONFIRM = 'BidConfirm',
    BOOK = 'BookSlider',
    POSSIBLES = 'PossiblesSlider',
    CTA_CLICK = 'PopupConfirm',
    YES = 'YesClick',
    NO = 'NoClick',
}
let analyticsBid = 0;
let analyticsPoss = 0;
const triggeredEvents = [] as string[];

export function updateAnalyticsBid(bid: number, poss: number) {
    analyticsBid = bid;
    analyticsPoss = poss;
}

export function GAEvent(eventName: GAEventsName, eventLabel: string | number) {
    if (blockAnalytics()) return;
    if (!triggeredEvents.includes(eventName)) {
        const eventTime = Math.floor(performance.now() / 1000);
        const eventSec = eventTime % 60;
        const eventMinutes = Math.floor(eventTime / 60);

        const gameTime = `${eventMinutes}m ${eventSec}s`;
        const params = {
            value: eventLabel,
            game: playableSettings.prefix,
            playableName: playableSettings.name,
            environment: GA_ENVIRONMENT,
            platform: isAndroid() ? 'ANDROID' : 'IOS',
            eventTime: gameTime,
            measurementId: measurementId,
        };

        // debugEvent(eventName, eventLabel, params);
        // triggeredEvents.push(eventAction);
        try {
            const payloadGTagBase = {
                // app_instance_id: projectId,
                client_id: uui(),
                events: [
                    {
                        name: eventName,
                        params,
                    },
                ],
            };
            const xhrgtag = new XMLHttpRequest();
            xhrgtag.open('POST', gaHost, true);
            xhrgtag.send(JSON.stringify(payloadGTagBase));
        } catch (error) {
            console.error('error in analytics', error);
        }
        // }
    }

    function debugEvent(event: string, value: string | number, params: any) {
        console.log('GA:', event, value);
    }

    function blockAnalytics() {
        switch (GA_ENVIRONMENT) {
            case 'GOOGLE':
            case 'MINDWORKS':
            case 'MOLOCO':
            case 'TT':
            case 'VUNGLE':
                return true;
            default:
                return false;
        }
    }
}
