import { Literal } from "../JS_Analyzer_parts/nodos.js";
import { embedded } from "../Instructions/embedded.js";

export class Entorno {
    /**
     * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        this.valores = {};
        this.padre = padre;
        Object.entries(embedded).forEach(([nombre, funcion]) => {
            this.setOrUpdateVariable("string", nombre, funcion);
        });
    }

    /**
     * @param {string} tipo
     * @param {string} nombre
     * @param {any} valor
     */
    setVariable(tipo, nombre, valor) {
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
     * @returns {Literal}
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

    /**
     * @param {string} tipo
     * @param {string} nombre
     * @param {any} valor
     */
    setOrUpdateVariable(tipo, nombre, valor) {
        if (this.valores.hasOwnProperty(nombre)) {
            console.log(`Actualizando variable ${nombre} con valor: ${valor}`);
            if (this.valores[nombre] instanceof Literal) {
                this.valores[nombre].value = valor;
            } else {
                this.valores[nombre] = new Literal({ value: valor, type: tipo });
            }
        } else {
            console.log(`Guardando nueva variable ${nombre} con valor: ${valor}`);
            this.setVariable(tipo, nombre, valor);
        }
    }
}
