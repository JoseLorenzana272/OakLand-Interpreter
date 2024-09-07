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
    'parseInt': new NativeFunction(() => 1, (interprete, args) => {
        const parsedValue = parseInt(args[0].value);
        if (isNaN(parsedValue)) {
            throw new Error(`No se pudo parsear el valor a int: ${args[0].value}`);
        }
        return new Literal({
            value: parsedValue,
            type: 'int'
        });
    }),
    'parsefloat': new NativeFunction(() => 1, (interprete, args) => {
        const parsedValue = parseFloat(args[0].value);
        if (isNaN(parsedValue)) {
            throw new Error(`No se pudo parsear el valor a float: ${args[0].value}`);
        }
        return new Literal({
            value: parsedValue,
            type: 'float'
        });
    }),
    'toString': new NativeFunction(() => 1, (interprete, args) => {
        if (args[0] === undefined || args[0].value === null) {
            throw new Error(`No se puede convertir a string el valor: ${args[0].value}`);
        }
        return new Literal({
            value: args[0].value.toString(),
            type: 'string'
        });
    }),
    'toLowerCase': new NativeFunction(() => 1, (interprete, args) => {
        if (typeof args[0].value !== 'string') {
            throw new Error(`El valor ${args[0].value} no es un string, no se puede convertir a minúsculas`);
        }
        return new Literal({
            value: args[0].value.toLowerCase(),
            type: 'string'
        });
    }),
    'toUpperCase': new NativeFunction(() => 1, (interprete, args) => {
        if (typeof args[0].value !== 'string') {
            throw new Error(`El valor ${args[0].value} no es un string, no se puede convertir a mayúsculas`);
        }
        return new Literal({
            value: args[0].value.toUpperCase(),
            type: 'string'
        });
    }),
    'typeof': new NativeFunction(() => 1, (interprete, args) => {
        return new Literal({
            value: args[0].type,
            type: 'string'
        });
    }),
}
