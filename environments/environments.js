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
        /*if (this.valores[nombre]) {
            throw new Error(`Variable ${nombre} ya definida`);
        }*/
        
        if (Array.isArray(valor)) {
            // Si es un array, se crea un nuevo Literal almacenando una copia del array
            this.valores[nombre] = new Literal({ value: [...valor], type: tipo });
        } else {
            // Para otros tipos de datos, se almacena directamente
            this.valores[nombre] = new Literal({ value: valor, type: tipo });
        }

    }

    /**
     * @param {string} nombre
     * @returns {{ tipo: string, valor: any }}
     */
    getVariable(nombre) {
        const valorActual = this.valores[nombre];
        if (valorActual !== undefined) return valorActual;

        if (!valorActual && this.padre) {
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
