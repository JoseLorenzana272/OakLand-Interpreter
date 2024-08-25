import { Summonable } from "./summonable.js";


class NativeFunction extends Summonable {
    constructor(aridad, func) {
        super();
        this.aridad = aridad;
        this.invocar = func;
    }
}


export const embedded = {
    'time': new NativeFunction(() => 0, () => new Date().toISOString())
}