import { Summonable } from "./summonable.js";
import { Literal } from "../JS_Analyzer_parts/nodos.js";


class NativeFunction extends Summonable {
    constructor(aridad, func) {
        super();
        this.aridad = aridad;
        this.invocar = func;
    }
}


export const embedded = {
    'time': new NativeFunction(() => 0, () => new Literal({value:new Date().toISOString(), type: 'string'})),
}