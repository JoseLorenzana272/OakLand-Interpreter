import { Entorno } from "../environments/environments.js";
import { Summonable } from "./summonable.js";
import { FuncDeclaration } from "../JS_Analyzer_parts/nodos.js";
import { ReturnException } from "./transference.js";


export class FuncionForanea extends Summonable {


    constructor(nodo, clousure) {
        super();
        /**
         * @type {FuncDeclaration}
         */
        this.nodo = nodo;

        /**
         * @type {Entorno}
         */
        this.clousure = clousure;
    }

    aridad() {
        return this.nodo.params.length;
    }


    /**
    * @type {Summonable['invocar']}
    */
    invocar(interprete, args) {
        const entornoNuevo = new Entorno(this.clousure);


        this.nodo.params.forEach((param, i) => {
            console.log(`parametro ${param.type} = ${args[i].value}`);
            entornoNuevo.setVariable(param.type, param.id, args[i]);
            
        });

        const entornoAntesDeLaLlamada = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;

        try {
            this.nodo.block.accept(interprete);
        } catch (error) {
            interprete.entornoActual = entornoAntesDeLaLlamada;

            if (error instanceof ReturnException) {

                if(this.nodo.type === 'void'){
                    if (error.value !== null) {
                        throw new Error(`La función ${this.nodo.type} no puede retornar valores`);
                    }
                    return;
                }

                if(error.value.type === this.nodo.type){
                    return error.value
                }else{
                    throw new Error(`El tipo de retorno no coincide con el tipo de la función ${this.nodo.type}`);
                }
                
            }

            // TODO: manejar el resto de sentencias de control
            throw error;
        }

        interprete.entornoActual = entornoAntesDeLaLlamada;
        return null
    }

    atar(instancia) {
        const entornoOculto = new Entorno(this.clousure);
        entornoOculto.setVariable(this.nodo.type, 'this', instancia);
        console.log("ATANDO FUNCION FORANEA");
        return new FuncionForanea(this.nodo, entornoOculto);
    }

}