import { Literal } from "../JS_Analyzer_parts/nodos.js";

/**
   * @param {string} op
   * @param {Literal} izq
   * @param {Literal} der
   * @returns {Literal}
   * @throws {Error}
 */

export function ArithmeticOp(op, izq, der){
    let resultado;

    // Convertir los operandos a números
    const leftValue = parseFloat(izq.value);
    const rightValue = parseFloat(der.value);

    switch (op) {
        case '+':
            resultado = leftValue + rightValue;
            break;
        case '-':
            resultado = leftValue - rightValue;
            break;
        case '*':
            resultado = leftValue * rightValue;
            break;
        case '/':
            if (rightValue === 0) {
                throw new Error('División por cero no permitida');
            }
            resultado = leftValue / rightValue;
            break;
        default:
            throw new Error(`Operador no soportado: ${op}`);
    }

    // Determinar el tipo de resultado
    const resultType = comprobarTipo(izq.type, der.type);

    console.log(resultType);
    
    return new Literal({ value: resultado, type: resultType });
    
}

function comprobarTipo(tipo1, tipo2) {
    if (tipo1 === 'int' && tipo2 === 'int') {
        return 'int';
    }
    if (tipo1 === 'int' || tipo2 === 'float') {
        return 'float';
    }
    if (tipo1 === 'float' || tipo2 === 'int') {
        return 'float';
    }
    return false;
}