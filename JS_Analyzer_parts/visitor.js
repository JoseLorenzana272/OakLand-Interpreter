
/**

 * @typedef {import('./nodos').Literal} Literal


 * @typedef {import('./nodos').Print} Print


 * @typedef {import('./nodos').Arithmetic} Arithmetic


 * @typedef {import('./nodos').Grouping} Grouping


 * @typedef {import('./nodos').Relational} Relational


 * @typedef {import('./nodos').Igualation} Igualation


 * @typedef {import('./nodos').Logical} Logical


 * @typedef {import('./nodos').Unario} Unario


 * @typedef {import('./nodos').VariableValue} VariableValue


 * @typedef {import('./nodos').VariableDeclaration} VariableDeclaration


 * @typedef {import('./nodos').Block} Block


 * @typedef {import('./nodos').OpSentence} OpSentence


 * @typedef {import('./nodos').VariableAssign} VariableAssign

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
    

    /**
     * @param {Unario} node
     * @returns {any}
     */
    visitUnario(node) {
        throw new Error('Metodo visitUnario no implementado');
    }
    

    /**
     * @param {VariableValue} node
     * @returns {any}
     */
    visitVariableValue(node) {
        throw new Error('Metodo visitVariableValue no implementado');
    }
    

    /**
     * @param {VariableDeclaration} node
     * @returns {any}
     */
    visitVariableDeclaration(node) {
        throw new Error('Metodo visitVariableDeclaration no implementado');
    }
    

    /**
     * @param {Block} node
     * @returns {any}
     */
    visitBlock(node) {
        throw new Error('Metodo visitBlock no implementado');
    }
    

    /**
     * @param {OpSentence} node
     * @returns {any}
     */
    visitOpSentence(node) {
        throw new Error('Metodo visitOpSentence no implementado');
    }
    

    /**
     * @param {VariableAssign} node
     * @returns {any}
     */
    visitVariableAssign(node) {
        throw new Error('Metodo visitVariableAssign no implementado');
    }
    
}
