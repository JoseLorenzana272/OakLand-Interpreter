
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Literal  {

    /**
    * @param {Object} options
    * @param {any} options.value Value of the literal
 * @param {string} options.type Type of the literal
    */
    constructor({ value, type }) {
        
        
        /**
         * Value of the literal
         * @type {any}
        */
        this.value = value;


        /**
         * Type of the literal
         * @type {string}
        */
        this.type = type;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLiteral(this);
    }
}
    
export class Print  {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expression to print
    */
    constructor({ exp }) {
        
        
        /**
         * Expression to print
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}
    
export class Arithmetic  {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitArithmetic(this);
    }
}
    
export class Grouping  {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        
        
        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitGrouping(this);
    }
}
    
export class Relational  {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitRelational(this);
    }
}
    
export class Igualation  {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIgualation(this);
    }
}
    
export class Logical  {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLogical(this);
    }
}
    
export class Unario  {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a la que se le aplica el operador unario
 * @param {string} options.op Operador unario
    */
    constructor({ exp, op }) {
        
        
        /**
         * Expresion a la que se le aplica el operador unario
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador unario
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitUnario(this);
    }
}
    
export class VariableValue  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the variable
    */
    constructor({ id }) {
        
        
        /**
         * Identifier of the variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitVariableValue(this);
    }
}
    
export class VariableDeclaration  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the variable
 * @param {string} options.type Type of the variable
 * @param {Expresion} options.value Value of the variable
    */
    constructor({ id, type, value }) {
        
        
        /**
         * Identifier of the variable
         * @type {string}
        */
        this.id = id;


        /**
         * Type of the variable
         * @type {string}
        */
        this.type = type;


        /**
         * Value of the variable
         * @type {Expresion}
        */
        this.value = value;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitVariableDeclaration(this);
    }
}
    
export class Block  {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.statements Statements/Sentences of the block
    */
    constructor({ statements }) {
        
        
        /**
         * Statements/Sentences of the block
         * @type {Expresion[]}
        */
        this.statements = statements;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBlock(this);
    }
}
    
export class OpSentence  {

    /**
    * @param {Object} options
    * @param {Expresion} options.o Operation to execute
    */
    constructor({ o }) {
        
        
        /**
         * Operation to execute
         * @type {Expresion}
        */
        this.o = o;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOpSentence(this);
    }
}
    
export class VariableAssign  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the variable
 * @param {string} options.op Operator of the assignment
 * @param {Expresion} options.assi Expression to assign
    */
    constructor({ id, op, assi }) {
        
        
        /**
         * Identifier of the variable
         * @type {string}
        */
        this.id = id;


        /**
         * Operator of the assignment
         * @type {string}
        */
        this.op = op;


        /**
         * Expression to assign
         * @type {Expresion}
        */
        this.assi = assi;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitVariableAssign(this);
    }
}
    
export class TernaryOp  {

    /**
    * @param {Object} options
    * @param {Expresion} options.condition Condition to evaluate
 * @param {Expresion} options.trueExp Expression to return if the condition is true
 * @param {Expresion} options.falseExp Expression to return if the condition is false
    */
    constructor({ condition, trueExp, falseExp }) {
        
        
        /**
         * Condition to evaluate
         * @type {Expresion}
        */
        this.condition = condition;


        /**
         * Expression to return if the condition is true
         * @type {Expresion}
        */
        this.trueExp = trueExp;


        /**
         * Expression to return if the condition is false
         * @type {Expresion}
        */
        this.falseExp = falseExp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTernaryOp(this);
    }
}
    
export class IfNode  {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del if
 * @param {Expresion} options.stmtTrue Cuerpo del if
 * @param {Expresion|undefined} options.stmtFalse Cuerpo del else
    */
    constructor({ cond, stmtTrue, stmtFalse }) {
        
        
        /**
         * Condicion del if
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del if
         * @type {Expresion}
        */
        this.stmtTrue = stmtTrue;


        /**
         * Cuerpo del else
         * @type {Expresion|undefined}
        */
        this.stmtFalse = stmtFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIfNode(this);
    }
}
    
export class WhileNode  {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del while
 * @param {Expresion} options.stmt Cuerpo del while
    */
    constructor({ cond, stmt }) {
        
        
        /**
         * Condicion del while
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del while
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhileNode(this);
    }
}
    
export default { Literal, Print, Arithmetic, Grouping, Relational, Igualation, Logical, Unario, VariableValue, VariableDeclaration, Block, OpSentence, VariableAssign, TernaryOp, IfNode, WhileNode }
