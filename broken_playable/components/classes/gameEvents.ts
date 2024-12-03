export enum EventsName {
    CTA = 'CTA',
    MOVE = "MOVE",
}
type EventsListener = { name: EventsName; cb: (data: any) => void };
class GameEventsClass {
    events = [] as EventsListener[];

    addListener(name: EventsName, cb: (data: any) => void) {
        this.events.push({ name, cb });
    }
    emit(eventName: EventsName, data?: any) {
        this.events.forEach((event) => {
            if (event.name === eventName && event.cb) {
                event.cb(data);
            }
        });
    }
}

export const GameEvent = new GameEventsClass();
