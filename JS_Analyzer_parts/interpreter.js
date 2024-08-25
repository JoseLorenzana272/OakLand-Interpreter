import { Entorno } from "../environments/environments.js";
import { BaseVisitor } from "./visitor.js";
import { ArithmeticOp } from "../Expressions/ArithmeticOp.js";
import nodos, { Literal, Logical, Relational, VariableAssign, VariableDeclaration } from "./nodos.js";
import { RelationalOp } from "../Expressions/RelationalOp.js";
import { LogicalOp } from "../Expressions/LogicalOp.js";
import { BreakException, ContinueException, ReturnException } from "../Instructions/transference.js";
import { Summonable } from "../Instructions/summonable.js";
import { embedded } from "../Instructions/embedded.js";

const typeMaps = {
    "string": "",
    "int": 0,
    "bool": true,
    "char": '',
    "float": 0.0,
};

function procesarCadena(cadena) {
    return cadena
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t') 
        .replace(/\\"/g, '"')   
        .replace(/\\\\/g, '\\');
}

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();

        Object.entries(embedded).forEach(([nombre, funcion]) => {
            this.entornoActual.setVariable("string", nombre, funcion);
        });

        this.salida = '';


        /**
         * @type {Expresion | null}
        */
        this.prevContinue = null;
    }

    interpretar(nodo) {
        return nodo.accept(this);
    }

    /**
     * @type [BaseVisitor['visitLiteral']]
     */
    visitLiteral(nodo) {
        //procesar si es string
        if (nodo.type === 'string') {
            return new Literal({ value: procesarCadena(nodo.value), type: nodo.type });
        }
        return nodo;
    }

    /**
     * @type [BaseVisitor['visitPrint']]
     */
    visitPrint(node){
        let resultados = '';

        console.log("Imprimiendo: ", node);

        for (let i = 0; i < node.exp.length; i++) {
            const valor = node.exp[i].accept(this);

            resultados += valor.value;
        }

        this.salida += resultados + '\n' ;
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

    /**
     * @type [BaseVisitor['visitUnario']]
     */
    visitUnario(node) {
        const valor = node.exp.accept(this);

        if (!(valor instanceof Literal)) {
            throw new Error('La expresión debe ser una literal');
        }

        switch (node.op) {
            case '-':
                return new Literal({ value: -valor.value, type: valor.type });
            case '!':
                return new Literal({ value: !valor.value, type: valor.type });
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }

    }

    /**
     * @type [BaseVisitor['visitVariableValue']]
     */
    visitVariableValue(node) {
        const variableName = node.id;
        const variable = this.entornoActual.getVariable(variableName);
        if (!variable) {
            throw new Error(`Variable ${variableName} no definida`);
        }
        
        console.log(variable);
        return variable.value; // Retorna solo el valor
    }    

    /**
     * @type [BaseVisitor['visitVariableDeclaration']]
     */
    visitVariableDeclaration(node) {
        const variableName = node.id;
        // Asignacion de valor por defecto
        if (node.value === null) {
            this.entornoActual.setVariable(node.type, variableName, new Literal({ value: typeMaps[node.type], type: node.type }));
            return;
        }
        const variableValue = node.value.accept(this);
        const variableType = node.type;

        console.log("Nombre de la variable: ", variableName);
        console.log("Valor de la variable: ", variableValue.value);
        console.log("Tipo de la variable: ", variableType);
        console.log("-----------------------------------");

        //verificar tipos
        switch (variableType) {
            case 'int':
                if (typeof variableValue.value !== 'number' || !Number.isInteger(variableValue.value)) {
                    console.error(`An ${variableType} was expected, but received: `, typeof variableValue.value);
                    return new Literal({ value: variableValue.value, type: null });
                }
                break;

            case 'float':
                if (typeof variableValue.value !== 'number') {
                    console.error(`An ${variableType} was expected, but received: `, typeof variableValue.value);
                    return new Literal({ value: variableValue.value, type: null });
                }
                break;

            case 'bool':
                if (typeof variableValue.value !== 'boolean') {
                    console.error(`An ${variableType} was expected, but received: `, typeof variableValue.value);
                    return new Literal({ value: variableValue.value, type: null });
                }
                break;

            case 'string':
                if (typeof variableValue.value !== 'string') {
                    console.error(`An ${variableType} was expected, but received: `, typeof variableValue.value);
                    return new Literal({ value: variableValue.value, type: null });
                }
                break;

            case 'char':
                if (typeof variableValue.value !== 'string' || variableValue.value.length !== 1) {
                    console.error(`An ${variableType} was expected, but received: `, typeof variableValue.value);
                    return new Literal({ value: variableValue.value, type: null });
                }
                break;
            case 'var':
                break;

            default:
                throw new Error(`Tipo de dato desconocido: ${variableType}`);
        }

        if (variableType === 'float' && typeof variableValue.value === 'number' && Number.isInteger(variableValue.value)) {
            variableValue.value = parseFloat(variableValue.value);
        } else if (variableType !== 'float' && variableValue.value.type === 'int' && variableType === 'float') {
            variableValue.value = parseFloat(variableValue.value);
        }


        this.entornoActual.setVariable(variableType, variableName, variableValue);
    }


    /**
     * @type [BaseVisitor['visitBlock']]
     */
    visitBlock(node) {
        console.log(node);
        const previousScope = this.entornoActual;
        this.entornoActual = new Entorno(previousScope);

        console.log("Bloque de código: ", node);

        node.statements.forEach(stm => stm.accept(this));

        this.entornoActual = previousScope;

    }


    /**
     * @type [BaseVisitor['visitOpSentence']]
     */
    visitOpSentence(node) {
        node.o.accept(this);
    }

    /**
     * @type [BaseVisitor['visitOpSentence']]
     */
    visitVariableAssign(node) {
        const value = node.assi.accept(this);
        if (!(value instanceof Literal)) {
            throw new Error('La expresión debe ser una literal');
        }
    
        const currentValue = this.entornoActual.getVariable(node.id).value;
    
        const asignments = {
            '=': () => {
                this.entornoActual.assignVariable(node.id, value);
                return value;
            },
            '+=': () => {
                const newValue = new Literal({
                    value: ArithmeticOp('+', currentValue, value).value,
                    type: value.type
                });
                this.entornoActual.assignVariable(node.id, newValue);
                return newValue;
            },
            '-=': () => {
                const newValue = new Literal({
                    value: ArithmeticOp('-', currentValue, value).value,
                    type: value.type
                });
                this.entornoActual.assignVariable(node.id, newValue);
                return newValue;
            },
        }
    
        return asignments[node.op]();
    }

    /**
     * @type [BaseVisitor['visitTernaryOp']]
     */
    visitTernaryOp(node) {
        const condition = node.condition.accept(this);
        if (!(condition instanceof Literal)) {
            throw new Error('La condición debe ser una literal');
        }
    
        if (condition.value) {
            return node.trueExp.accept(this);
        }
    
        return node.falseExp.accept(this);
    }

    /**
     * @type [BaseVisitor['visitIfNode']]
     */
    visitIfNode(node) {
        const cond = node.cond.accept(this);

    if (!(cond instanceof Literal)) {
        throw new Error('La condición debe ser una literal');
    }

    // Evalúa el valor de la condición almacenado en el Literal
    if (cond.value) {
        node.stmtTrue.accept(this);
    } else if (node.stmtFalse) {
        node.stmtFalse.accept(this);
    }

    console.log("Condición: ", cond);
    console.log("Resultado: ", cond.value);
    }

    /**
     * @type [BaseVisitor['visitWhileNode']]
     */
    visitWhileNode(node){
        const firstScope = this.entornoActual;
        try {
            while (node.cond.accept(this).value) {
                node.stmt.accept(this);

                //verificar si es Literal
                if (!(node.cond.accept(this) instanceof Literal)) {
                    throw new Error('La condición debe ser una literal');
                }
            }
        } catch (error) {
            this.actualScope = firstScope;

            if (error instanceof BreakException) {
                console.log('break');
                return
            }

            if (error instanceof ContinueException) {
                return this.visitWhileNode(node);
            }

            throw error;
        }
    }
    /**
     * @type [BaseVisitor['visitIncrementDecrement']]
     */
    visitIncrementDecrement(node) {
        const variable = this.entornoActual.getVariable(node.id);
        if (!variable) {
            throw new Error(`Variable ${node.id} no definida`);
        }

        if (!(variable.value instanceof Literal)) {
            throw new Error('La variable debe ser una literal');
        }

        switch (node.op) {
            case '++':
                variable.value = new Literal({
                    value: variable.value.value + 1,
                    type: variable.value.type
                });
                break;
            case '--':
                variable.value = new Literal({
                    value: variable.value.value - 1,
                    type: variable.value.type
                });
                break;
            default:
                throw new Error(`Operador no soportado: ${node.op}`);
        }

        this.entornoActual.assignVariable(node.id, variable.value);
        return variable.value;
    }


    /**
     * @type [BaseVisitor['visitForLoop']]
     */
    visitForLoop(node) {

        /*if(!(node.init instanceof VariableDeclaration) && !(node.init instanceof VariableAssign)){
            throw new Error('La inicialización debe ser una declaración o asignación de variable, se recibió: ', node.init);
        }*/
        const previousIncrement = this.prevContinue;
        this.prevContinue = node.inc;

        const forScope = new nodos.Block({
            statements:[
                node.init,
                new nodos.WhileNode({
                    cond: node.cond,
                    stmt: new nodos.Block({
                        statements: [
                            node.inc,
                            node.stmt
                        ]
                    })
                })
            ]
        })

        forScope.accept(this);

        this.prevContinue = previousIncrement;
    }

    /**
     * @type [BaseVisitor['visitBreakNode']]
     */
    visitBreakNode(node) {
        console.log(node);
        throw new BreakException();       

    }

    /**
     * @type [BaseVisitor['visitContinueNode']]
     */
    visitContinueNode(node) {
        if (this.prevContinue) {
            this.prevContinue.accept(this);
        }

        throw new ContinueException();
    }

    /**
     * @type [BaseVisitor['visitreturnNode']]
     */
    visitreturnNode(node) {
        let valor = null
        if (node.exp) {
            valor = node.exp.accept(this);
        }
        throw new ReturnException(valor);

    }

    /**
     * @type [BaseVisitor['visitreturnNode']]
     */
    visitSwitchNode(node) {
        console.log(node);
        const firstScope = this.entornoActual;
        const value = node.exp.accept(this);
        let match = false;
        try {
            for (let i = 0; i < node.cases.length; i++) {
                console.log("Current case: ", node.cases[i]);
                const currentCase = node.cases[i];
                const caseValue = currentCase.value.accept(this);
                if (value.value === caseValue.value || match) {
                    match = true;
                    currentCase.inst.forEach(inst => inst.accept(this));
                    
                }
            }

            if (!match && node.default) {
                node.default.accept(this);
            }
        } catch (error) {
            this.entornoActual = firstScope;
            if (error instanceof BreakException) {
                return;
            }

            throw error;
        }

    }


    /**
     * @type [BaseVisitor['visitVectorDeclaration']]
     */
    visitVectorDeclaration(node) {
        console.log(node);
        const variableName = node.id;
        const variableType = node.type;
        //const size = node.size.accept(this);
        let variableValues = [];

        //Verificar si es un vector con valores
        if (Array.isArray(node.values)){
            variableValues = node.values.map(value => value.accept(this));
            this.entornoActual.setVariable(variableType, variableName, new Literal({ value: variableValues, type: variableType }));
            //en el else if, se verifica si es un nuevo vector con tamaño y se agregan valores por defecto
        }else if (node.size){
            const size = node.size.accept(this);
            variableValues = new Array(size.value).fill(new Literal({ value: typeMaps[variableType], type: variableType }));
            this.entornoActual.setVariable(variableType, variableName, new Literal({ value: variableValues, type: variableType }));
            // En el otro else if, copiar copiar los valores de otro vector
        }else if (typeof node.values === 'string'){
            const vector = this.entornoActual.getVariable(node.values);
            const acceptedVector = vector.value.accept(this);
            console.log("Vector Aceptado: ", acceptedVector.value);
            if (!vector) {
                throw new Error(`Variable ${node.values} no definida`);
            }
            if (!Array.isArray(acceptedVector.value)) {
                throw new Error(`Variable ${node.values} no es un vector`);
            }
            variableValues = acceptedVector.value;
            this.entornoActual.setVariable(variableType, variableName, new Literal({ value: variableValues, type: variableType }));
        }
        
        //Verificar tipos para el vector
        switch(variableType){
            case 'int':
                if (variableValues.some(value => typeof value.value !== 'number' || !Number.isInteger(value.value))) {
                    throw new Error(`An ${variableType} was expected, but received: `, variableValues);
                }
                break;
            case 'float':
                if (variableValues.some(value => typeof value.value !== 'number')) {
                    throw new Error(`An ${variableType} was expected, but received: `, variableValues);
                }
                break;
            case 'bool':
                if (variableValues.some(value => typeof value.value !== 'boolean')) {
                    throw new Error(`An ${variableType} was expected, but received: `, variableValues);
                }
                break;
            case 'string':
                if (variableValues.some(value => typeof value.value !== 'string')) {
                    throw new Error(`An ${variableType} was expected, but received: `, variableValues);
                }
                break;
            case 'char':
                if (variableValues.some(value => typeof value.value !== 'string' || value.value.length !== 1)) {
                    throw new Error(`An ${variableType} was expected, but received: `, variableValues);
                }
                break;
            default:
                throw new Error(`Tipo de dato desconocido: ${variableType}`);


        }

        //Esto seria de ver si es para acá o para el join
        const valueString = variableValues.map(value => value.value).join(', ');
        console.log(`[${valueString}]`);
        this.entornoActual.setVariable(variableType, variableName, new Literal({ value: variableValues, type: variableType }));


        
    }
    

    /**
     * @type [BaseVisitor['visitCallNode']]
     */
    visitCallNode(node) {
        console.log("Llamada a función: ", node);
        const funcion = node.callee.accept(this);

        const argumentos = node.args.map(arg => arg.accept(this));

        console.log("Función: ", funcion);
        if (!(funcion instanceof Summonable)) {
            throw new Error('No es invocable');
        }

        if (funcion.aridad() !== argumentos.length) {
            throw new Error('Aridad incorrecta');
        }
        console.log("calabacin", funcion.invocar(this, argumentos))
        return funcion.invocar(this, argumentos);
    }

}