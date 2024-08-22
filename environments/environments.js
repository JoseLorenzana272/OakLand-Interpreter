import { Literal } from "../JS_Analyzer_parts/nodos.js";

export class Entorno {

    /**
     * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        this.valores = {};
        this.padre = padre;
    }

    /**
     * @param {string} tipo
     * @param {string} nombre
     * @param {any} valor
     */
    setVariable(tipo, nombre, valor) {
        if (this.valores[nombre]) {
            throw new Error(`Variable ${nombre} ya definida`);
        }
        
        this.valores[nombre] = new Literal({ value: valor, type: tipo });
    }

    /**
     * @param {string} nombre
     * @returns {{ tipo: string, valor: any }}
     */
    getVariable(nombre) {
        const variable = this.valores[nombre];

        if (variable) return variable;

        if (this.padre) {
            return this.padre.getVariable(nombre);
        }

        throw new Error(`Variable ${nombre} no definida`);
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     */
    assignVariable(nombre, valor) {
        const variable = this.valores[nombre];

        if (variable) {
            this.valores[nombre].value = valor;
            return;
        }

        if (this.padre) {
            this.padre.assignVariable(nombre, valor);
            return;
        }

        throw new Error(`Variable ${nombre} no definida`);
    }
}
