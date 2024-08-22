import { Literal } from "../JS_Analyzer_parts/nodos.js";

/**
   * @param {string} op
   * @param {Literal} izq
   * @param {Literal} der
   * @returns {Literal}
   * @throws {Error}
 */

export function RelationalOp(op, izq, der){
    let resultado;

    if (typeof izq.value === 'string' && typeof der.value === 'string') {
        // Comparaciones para cadenas
        switch (op) {
            case '==':
                resultado = izq.value === der.value;
                break;
            case '!=':
                resultado = izq.value !== der.value;
                break;
            default:
                throw new Error(`Operador relacional no soportado para strings: ${op}`);
        }
    } else {
        // Comparaciones para números
        const leftValue = parseFloat(izq.value);
        const rightValue = parseFloat(der.value);

        if (isNaN(leftValue) || isNaN(rightValue)) {
            throw new Error('Operaciones relacionales solo soportan comparaciones entre números o strings.');
        }

        switch (op) {
            case '<':
                resultado = leftValue < rightValue;
                break;
            case '>':
                resultado = leftValue > rightValue;
                break;
            case '<=':
                resultado = leftValue <= rightValue;
                break;
            case '>=':
                resultado = leftValue >= rightValue;
                break;
            case '==':
                resultado = leftValue === rightValue;
                break;
            case '!=':
                resultado = leftValue !== rightValue;
                break;
            default:
                throw new Error(`Operador relacional desconocido: ${op}`);
        }
    }

    // El tipo de resultado siempre será booleano
    return new Literal({ value: resultado, type: 'bool' });
}