
/**

 * @typedef {import('./nodos').Literal} Literal


 * @typedef {import('./nodos').Print} Print


 * @typedef {import('./nodos').Arithmetic} Arithmetic


 * @typedef {import('./nodos').Grouping} Grouping


 * @typedef {import('./nodos').Relational} Relational


 * @typedef {import('./nodos').Igualation} Igualation


 * @typedef {import('./nodos').Logical} Logical

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Literal} node
     * @returns {any}
     */
    visitLiteral(node) {
        throw new Error('Metodo visitLiteral no implementado');
    }
    

    /**
     * @param {Print} node
     * @returns {any}
     */
    visitPrint(node) {
        throw new Error('Metodo visitPrint no implementado');
    }
    

    /**
     * @param {Arithmetic} node
     * @returns {any}
     */
    visitArithmetic(node) {
        throw new Error('Metodo visitArithmetic no implementado');
    }
    

    /**
     * @param {Grouping} node
     * @returns {any}
     */
    visitGrouping(node) {
        throw new Error('Metodo visitGrouping no implementado');
    }
    

    /**
     * @param {Relational} node
     * @returns {any}
     */
    visitRelational(node) {
        throw new Error('Metodo visitRelational no implementado');
    }
    

    /**
     * @param {Igualation} node
     * @returns {any}
     */
    visitIgualation(node) {
        throw new Error('Metodo visitIgualation no implementado');
    }
    

    /**
     * @param {Logical} node
     * @returns {any}
     */
    visitLogical(node) {
        throw new Error('Metodo visitLogical no implementado');
    }
    
}
