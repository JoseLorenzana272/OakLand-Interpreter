import { Entorno } from "/environments/environments.js";
import { BaseVisitor } from "./visitor.js";
import { ArithmeticOp } from "../Expressions/ArithmeticOp.js";
import { Literal } from "./nodos.js";
import { RelationalOp } from "../Expressions/RelationalOp.js";
import { LogicalOp } from "../Expressions/LogicalOp.js";


export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();
        this.salida = '';
    }

    interpretar(nodo) {
        return nodo.accept(this);
    }

    /**
     * @type [BaseVisitor['visitLiteral']]
     */
    visitLiteral(nodo) {
        return nodo;
    }

    /**
     * @type [BaseVisitor['visitPrint']]
     */
    visitPrint(node){
        let resultados = '';

        for (let i = 0; i < node.exp.length; i++) {
            const valor = node.exp[i].accept(this);

            resultados += valor.value + '\n';
        }

        this.salida += resultados;
        console.log(resultados);
    }

    /**
     * @type [BaseVisitor['visitArithmetic']]
     */
    visitArithmetic(node) {
        const left = node.izq.accept(this);
        const right = node.der.accept(this);

        if (!(left instanceof Literal) || !(right instanceof Literal)) {
            throw new Error('Ambas expresiones deben ser literales');
        }

        return ArithmeticOp(node.op, left, right);

    }

    /**
     * @type [BaseVisitor['visitGrouping']]
     */
    visitGrouping(node) {
        return node.exp.accept(this);
    }
    
    /**
     * @type [BaseVisitor['visitRelational']]
     */
    visitRelational(node) {
        const left = node.izq.accept(this);
        const right = node.der.accept(this);

        if (!(left instanceof Literal) || !(right instanceof Literal)) {
            throw new Error('Ambas expresiones deben ser literales');
        }

        console.log(left, right, node.op);

        return RelationalOp(node.op, left, right)
    }


    /**
     * @type [BaseVisitor['visitIgualation']]
     */
    visitIgualation(node) {
        const left = node.izq.accept(this);
        const right = node.der.accept(this);

        if (!(left instanceof Literal) || !(right instanceof Literal)) {
            throw new Error('Ambas expresiones deben ser literales');
        }

        console.log(left, right, node.op);

        return RelationalOp(node.op, left, right)
    }

    /**
     * @type [BaseVisitor['visitLogical']]
     */
    visitLogical(node) {
        const left = node.izq.accept(this);
        const right = node.der.accept(this);

        if (!(left instanceof Literal) || !(right instanceof Literal)) {
            throw new Error('Ambas expresiones deben ser literales');
        }

        console.log(left, right, node.op);

        return LogicalOp(node.op, left, right)
    }
}