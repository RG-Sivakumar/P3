import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class EventGlobalService {
  listeners: {};
  eventsSubject: Rx.Subject<any>;
  events: Rx.Observable<any>;

  constructor() { 
        this.listeners = {};
        this.eventsSubject = new Rx.Subject();  

        this.events = Rx.Observable.from(this.eventsSubject);

        this.events.subscribe(
            ({name, args,events}) => {
                if (this.listeners[name]) {
                    for (let listener of this.listeners[name]) {
                        listener(...args);
                    }
                }
            });
    }

    on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

    off(name, listener) {
        this.listeners[name] = this.listeners[name].filter(x => x != listener);
    }

    broadcast(name, ...args) {
        this.eventsSubject.next({
            name,
            args
        });
    }
}