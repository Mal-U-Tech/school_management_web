import { Injectable, signal } from '@angular/core';

@Injectable()
export class ToolbarService {
    // we define a subject that will allow components to connect to
    private _toolbar = signal<{ title: string; icon: string; route: string[] } | null>(null);

    constructor() {}

    // we define a getter for the subject
    get toolbar() {
        return this._toolbar;
    }
    // we define a function next that will add a value to the subject
    public next(value: { title: string; icon: string; route: string[] }) {
        this._toolbar.apply(() => value);
    }
}
