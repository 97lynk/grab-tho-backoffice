import { Subscription } from 'rxjs';

export class GarbageCollector {

    name: string;

    subscriptions: { name: string, sub: Subscription }[];

    constructor(name?: string) {
        this.subscriptions = [];
        this.name = name;
        if (!this.name) this.name = new Date().toLocaleTimeString();
    }

    collect(name: string, sub: Subscription) {
        const already = this.subscriptions.find(s => s.name === name);
        if (already) {
            already.sub.unsubscribe();
            already.sub = sub;
            return;
        }

        this.subscriptions.push({ name, sub });
    }

    clearAll() {
        // console.log('Garbage collector', this.name, 'is clearing ',
        //    '\n', this.subscriptions.map(s => s.name)
        // );
        this.subscriptions.forEach(s => s.sub.unsubscribe());
        this.subscriptions = [];
    }

} 