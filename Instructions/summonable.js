import { InterpreterVisitor } from "../JS_Analyzer_parts/interpreter.js";
import { Entorno } from "../environments/environments.js";

export class Summonable {


    aridad() {
        throw new Error('No implementado');
    }

    /**
     * @param interprete {InterpreterVisitor}
     * @param args {any[]}
     */
    invocar(interprete, args) {
        throw new Error('No implementado');
    }

}