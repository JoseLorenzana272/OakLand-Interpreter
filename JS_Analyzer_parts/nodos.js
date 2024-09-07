
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
    
export class IncrementDecrement  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the variable
 * @param {string} options.op Operator of the increment/decrement
    */
    constructor({ id, op }) {
        
        
        /**
         * Identifier of the variable
         * @type {string}
        */
        this.id = id;


        /**
         * Operator of the increment/decrement
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIncrementDecrement(this);
    }
}
    
export class ForLoop  {

    /**
    * @param {Object} options
    * @param {Expresion} options.init Inicialization of the for
 * @param {Expresion} options.cond For condition
 * @param {Expresion} options.inc Update of the for (++,--)
 * @param {Expresion} options.stmt Body of the for
    */
    constructor({ init, cond, inc, stmt }) {
        
        
        /**
         * Inicialization of the for
         * @type {Expresion}
        */
        this.init = init;


        /**
         * For condition
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Update of the for (++,--)
         * @type {Expresion}
        */
        this.inc = inc;


        /**
         * Body of the for
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitForLoop(this);
    }
}
    
export class BreakNode  {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBreakNode(this);
    }
}
    
export class ContinueNode  {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContinueNode(this);
    }
}
    
export class ReturnNode  {

    /**
    * @param {Object} options
    * @param {Expresion|undefined} options.exp Expresion a retornar
    */
    constructor({ exp }) {
        
        
        /**
         * Expresion a retornar
         * @type {Expresion|undefined}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReturnNode(this);
    }
}
    
export class SwitchNode  {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
 * @param {CaseNode[]} options.cases Casos del switch
 * @param {Expresion} options.def Caso por defecto
    */
    constructor({ exp, cases, def }) {
        
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Casos del switch
         * @type {CaseNode[]}
        */
        this.cases = cases;


        /**
         * Caso por defecto
         * @type {Expresion}
        */
        this.def = def;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSwitchNode(this);
    }
}
    
export class VectorDeclaration  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the vector
 * @param {string} options.type Type of the vector
 * @param {Expresion} options.size Size of the vector
 * @param {Expresion[]} options.values Values of the vector
    */
    constructor({ id, type, size, values }) {
        
        
        /**
         * Identifier of the vector
         * @type {string}
        */
        this.id = id;


        /**
         * Type of the vector
         * @type {string}
        */
        this.type = type;


        /**
         * Size of the vector
         * @type {Expresion}
        */
        this.size = size;


        /**
         * Values of the vector
         * @type {Expresion[]}
        */
        this.values = values;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitVectorDeclaration(this);
    }
}
    
export class CallNode  {

    /**
    * @param {Object} options
    * @param {Expresion} options.callee Call to the function
 * @param {Expresion[]} options.args Arguments of the function
    */
    constructor({ callee, args }) {
        
        
        /**
         * Call to the function
         * @type {Expresion}
        */
        this.callee = callee;


        /**
         * Arguments of the function
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitCallNode(this);
    }
}
    
export class ArrayAccess  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the vector
 * @param {Expresion} options.index Index of the vector
    */
    constructor({ id, index }) {
        
        
        /**
         * Identifier of the vector
         * @type {string}
        */
        this.id = id;


        /**
         * Index of the vector
         * @type {Expresion}
        */
        this.index = index;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitArrayAccess(this);
    }
}
    
export class IndexOf  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the vector
 * @param {Expresion} options.exp Value to search
    */
    constructor({ id, exp }) {
        
        
        /**
         * Identifier of the vector
         * @type {string}
        */
        this.id = id;


        /**
         * Value to search
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIndexOf(this);
    }
}
    
export class Join  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the vector
    */
    constructor({ id }) {
        
        
        /**
         * Identifier of the vector
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitJoin(this);
    }
}
    
export class Length  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the vector
    */
    constructor({ id }) {
        
        
        /**
         * Identifier of the vector
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLength(this);
    }
}
    
export class VectorAssign  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the vector
 * @param {Expresion} options.index Index of the vector
 * @param {string} options.op Operator of the assignment
 * @param {Expresion} options.assi Expression to assign
    */
    constructor({ id, index, op, assi }) {
        
        
        /**
         * Identifier of the vector
         * @type {string}
        */
        this.id = id;


        /**
         * Index of the vector
         * @type {Expresion}
        */
        this.index = index;


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
        return visitor.visitVectorAssign(this);
    }
}
    
export class MatrixDeclaration  {

    /**
    * @param {Object} options
    * @param {string} options.type Type of the matrix
 * @param {number} options.dimensions Dimensions of the matrix
 * @param {string} options.id Identifier of the matrix
 * @param {Expresion[]} options.values Values of the matrix
 * @param {number} options.newDimensions New dimensions of the matrix
    */
    constructor({ type, dimensions, id, values, newDimensions }) {
        
        
        /**
         * Type of the matrix
         * @type {string}
        */
        this.type = type;


        /**
         * Dimensions of the matrix
         * @type {number}
        */
        this.dimensions = dimensions;


        /**
         * Identifier of the matrix
         * @type {string}
        */
        this.id = id;


        /**
         * Values of the matrix
         * @type {Expresion[]}
        */
        this.values = values;


        /**
         * New dimensions of the matrix
         * @type {number}
        */
        this.newDimensions = newDimensions;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitMatrixDeclaration(this);
    }
}
    
export class MatrixAccess  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the matrix
 * @param {Array<Expresion>} options.indexes List of indices for accessing the matrix
    */
    constructor({ id, indexes }) {
        
        
        /**
         * Identifier of the matrix
         * @type {string}
        */
        this.id = id;


        /**
         * List of indices for accessing the matrix
         * @type {Array<Expresion>}
        */
        this.indexes = indexes;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitMatrixAccess(this);
    }
}
    
export class MatrixAssign  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the matrix
 * @param {Array<Expresion>} options.indexes List of indices for accessing the matrix
 * @param {string} options.op Operator of the assignment
 * @param {Expresion} options.assi Expression to assign
    */
    constructor({ id, indexes, op, assi }) {
        
        
        /**
         * Identifier of the matrix
         * @type {string}
        */
        this.id = id;


        /**
         * List of indices for accessing the matrix
         * @type {Array<Expresion>}
        */
        this.indexes = indexes;


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
        return visitor.visitMatrixAssign(this);
    }
}
    
export class FuncDeclaration  {

    /**
    * @param {Object} options
    * @param {string} options.type Type of the function
 * @param {string} options.id Identifier of the function
 * @param {Expresion[]} options.params Parameters of the function
 * @param {Expresion} options.block Body of the function
    */
    constructor({ type, id, params, block }) {
        
        
        /**
         * Type of the function
         * @type {string}
        */
        this.type = type;


        /**
         * Identifier of the function
         * @type {string}
        */
        this.id = id;


        /**
         * Parameters of the function
         * @type {Expresion[]}
        */
        this.params = params;


        /**
         * Body of the function
         * @type {Expresion}
        */
        this.block = block;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncDeclaration(this);
    }
}
    
export class ForEach  {

    /**
    * @param {Object} options
    * @param {string} options.type Type of the for each
 * @param {string} options.id Identifier of the for each
 * @param {string} options.id2 Identifier of the for each
 * @param {Expresion} options.stmt Body of the for each
    */
    constructor({ type, id, id2, stmt }) {
        
        
        /**
         * Type of the for each
         * @type {string}
        */
        this.type = type;


        /**
         * Identifier of the for each
         * @type {string}
        */
        this.id = id;


        /**
         * Identifier of the for each
         * @type {string}
        */
        this.id2 = id2;


        /**
         * Body of the for each
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitForEach(this);
    }
}
    
export class StructNode  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the struct
 * @param {Expresion[]} options.fields Fields of the struct
    */
    constructor({ id, fields }) {
        
        
        /**
         * Identifier of the struct
         * @type {string}
        */
        this.id = id;


        /**
         * Fields of the struct
         * @type {Expresion[]}
        */
        this.fields = fields;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStructNode(this);
    }
}
    
export class StructInstance  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the struct
 * @param {string} options.id2 Identifier of the struct
 * @param {string} options.IdStruct Identifier of the struct
 * @param {Expresion[]} options.values Values of the struct
    */
    constructor({ id, id2, IdStruct, values }) {
        
        
        /**
         * Identifier of the struct
         * @type {string}
        */
        this.id = id;


        /**
         * Identifier of the struct
         * @type {string}
        */
        this.id2 = id2;


        /**
         * Identifier of the struct
         * @type {string}
        */
        this.IdStruct = IdStruct;


        /**
         * Values of the struct
         * @type {Expresion[]}
        */
        this.values = values;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStructInstance(this);
    }
}
    
export class StructAccess  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the struct
 * @param {string} options.id2 Identifier of the struct
    */
    constructor({ id, id2 }) {
        
        
        /**
         * Identifier of the struct
         * @type {string}
        */
        this.id = id;


        /**
         * Identifier of the struct
         * @type {string}
        */
        this.id2 = id2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStructAccess(this);
    }
}
    
export class StructAssign  {

    /**
    * @param {Object} options
    * @param {string} options.id Identifier of the struct
 * @param {string} options.attribute Attribute of the struct
 * @param {string} options.op Operator of the assignment
 * @param {Expresion} options.assi Expression to assign
    */
    constructor({ id, attribute, op, assi }) {
        
        
        /**
         * Identifier of the struct
         * @type {string}
        */
        this.id = id;


        /**
         * Attribute of the struct
         * @type {string}
        */
        this.attribute = attribute;


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
        return visitor.visitStructAssign(this);
    }
}
    
export default { Literal, Print, Arithmetic, Grouping, Relational, Igualation, Logical, Unario, VariableValue, VariableDeclaration, Block, OpSentence, VariableAssign, TernaryOp, IfNode, WhileNode, IncrementDecrement, ForLoop, BreakNode, ContinueNode, ReturnNode, SwitchNode, VectorDeclaration, CallNode, ArrayAccess, IndexOf, Join, Length, VectorAssign, MatrixDeclaration, MatrixAccess, MatrixAssign, FuncDeclaration, ForEach, StructNode, StructInstance, StructAccess, StructAssign }
