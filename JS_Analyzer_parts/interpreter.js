import { Entorno } from "../environments/environments.js";
import { BaseVisitor } from "./visitor.js";
import { ArithmeticOp } from "../Expressions/ArithmeticOp.js";
import nodos, { Literal, Logical, Relational, VariableAssign, VariableDeclaration } from "./nodos.js";
import { RelationalOp } from "../Expressions/RelationalOp.js";
import { LogicalOp } from "../Expressions/LogicalOp.js";
import { BreakException, ContinueException, ReturnException } from "../Instructions/transference.js";
import { Summonable } from "../Instructions/summonable.js";
import { embedded } from "../Instructions/embedded.js";
import { FuncionForanea } from "../Instructions/foreign.js";
import { Errors } from "../Errors/Errors.js";

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


        this.salida = '';

        this.structlist = {};

        //Lista para reporte de Tabla de Simbolos
        this.listaSimbolos = [];

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
    visitPrint(node) {
        let resultados = '';
    
        console.log("Imprimiendo: ", node);
    
        for (let i = 0; i < node.exp.length; i++) {
            const valor = node.exp[i].accept(this);
            resultados += this.formatValue(valor) + ' ';
        }
    
        this.salida += resultados + '\n';
        console.log(resultados);
    }
    
    formatValue(valor) {
        if (Array.isArray(valor)) {
            // Si es un array (matriz), manejarlo recursivamente
            return '[' + valor.map(v => this.formatValue(v)).join(', ') + ']';
        } else if (valor && typeof valor === 'object' && 'value' in valor) {
            // Si es un objeto con la propiedad 'value', acceder a ella
            return this.formatValue(valor.value);
        } else {
            // En caso de ser un valor literal directo
            return valor;
        }
    }
    

    /**
     * @type [BaseVisitor['visitArithmetic']]
     */
    visitArithmetic(node) {
        const left = node.izq.accept(this);
        const right = node.der.accept(this);

        if (!(left instanceof Literal) || !(right instanceof Literal)) {
            throw new Errors('Both expressions must be literals', node.location);
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
            throw new Errors('Both expressions must be literals', node.location);
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
            throw new Errors('Both expressions must be literals', node.location);
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
            throw new Errors('Both expressions must be literals', node.location);
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
            throw new Errors('The expression must be a literal', node.location);
        }

        switch (node.op) {
            case '-':
                return new Literal({ value: -valor.value, type: valor.type });
            case '!':
                return new Literal({ value: !valor.value, type: valor.type });
            default:
                throw new Errors(`Not supported operator: ${node.op}`, node.location);
        }

    }

    /**
     * @type [BaseVisitor['visitVariableValue']]
     */
    visitVariableValue(node) {
        const variableName = node.id;
        const variable = this.entornoActual.getVariable(variableName);
        if (!variable) {
            throw new Errors(`Variable ${variableName} not defined`, node.location);
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
            this.entornoActual.setVariable(node.type, variableName, new Literal({ value: null, type: node.type }));
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
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`, node.location);
                }
                break;

            case 'float':
                if (typeof variableValue.value !== 'number') {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`, node.location);
                }
                break;

            case 'bool':
                if (typeof variableValue.value !== 'boolean') {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`, node.location);
                }
                break;

            case 'string':
                if (typeof variableValue.value !== 'string') {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`, node.location);
                }
                break;

            case 'char':
                if (typeof variableValue.value !== 'string' || variableValue.value.length !== 1) {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`, node.location);
                }
                break;
            case 'var':

                const typeMapping = {
                    'int': 'number',
                    'float': 'number',
                    'string': 'string',
                    'char': 'string',
                    'bool': 'boolean'
                };

                const expectedType = typeMapping[variableValue.type];
                const actualType = typeof variableValue.value;

                if (actualType !== expectedType) {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw Errors(`An ${variableValue.type} was expected, but received: ${actualType}`, node.location);
                }

                // Validación específica para int y float
                if (variableValue.type === 'int' && !Number.isInteger(variableValue.value)) {
                    throw new Errors(`An int was expected, but received a float: ${variableValue.value}`, node.location);
                }

                if (variableValue.type === 'float' && Number.isInteger(variableValue.value)) {
                    throw new Errors(`A float was expected, but received an int: ${variableValue.value}`, node.location);
                }

                break;

            default:
                throw new Errors(`Unknown data type: ${variableType}`, node.location);
        }

        if (variableType === 'float' && typeof variableValue.value === 'number' && Number.isInteger(variableValue.value)) {
            variableValue.value = parseFloat(variableValue.value);
        } else if (variableType !== 'float' && variableValue.value.type === 'int' && variableType === 'float') {
            variableValue.value = parseFloat(variableValue.value);
        }


        this.entornoActual.setVariable(variableType, variableName, variableValue);
        //Agregar a la lista de simbolos, ID, Tipo símbolo, Tipo dato
        this.listaSimbolos.push({ID: variableName, Tipo: 'Variable', TipoDato: variableType, Row: node.location.end.line, Column: node.location.end.column});
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
            throw new Errors('The expression must be a literal', node.location);
        }
    
        const currentValue = this.entornoActual.getVariable(node.id).value;

        //Verificar tipos

        if (currentValue.type !== value.type) {
            this.entornoActual.assignVariable(node.id, 'null');
            throw new Errors(`An ${currentValue.type} was expected, but received: ${value.type}`, node.location);
        }
    
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
            throw new Errors('The condition must be a literal', node.location);
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
        throw new Errors('The condition must be a literal', node.location);
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
                console.log("While HAJGHAHKJBKJSBKJAJ");
                //verificar si es Literal
                
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
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        if (!(variable.value instanceof Literal)) {
            throw new Errors('The variable must be a literal', node.location);
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
                throw new Errors(`Not supported operator: ${node.op}`, node.location);
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
                            node.stmt,
                            node.inc
                            
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
    visitReturnNode(node) {
        let valor = null
        if (node.exp) {
            if (Array.isArray(node.exp)){
                valor = node.exp.map(exp => exp.accept(this));
            }else{
                valor = node.exp.accept(this);
            }
            
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

            if (match && node.def) {
                console.log("Default case: ", node.def);
                node.def.stmts.forEach(stmt => stmt.accept(this));
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
        console.log("Tipo de vector: ", node.type);
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
        } else if (typeof node.values === 'string') {
            const vector = this.entornoActual.getVariable(node.values);
            if (!vector) {
                throw new Errors(`Variable ${node.values} not defined`, node.location);
            }
            const acceptedVector = vector.value.accept(this);
            if (!Array.isArray(acceptedVector.value)) {
                throw new Errors(`Variable ${node.values} is not an array`, node.location);
            }
            
            // Crear una copia profunda del vector
            variableValues = acceptedVector.value.map(item => 
                new Literal({ value: item.value, type: item.type })
            );
            this.entornoActual.setVariable(variableType, variableName, new Literal({ value: variableValues, type: variableType }));
        }
        
        //Verificar tipos para el vector
        switch(variableType){
            case 'int':
                if (variableValues.some(value => typeof value.value !== 'number' || !Number.isInteger(value.value))) {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} value was expected, but received another type`, node.location);
                }
                break;
            case 'float':
                if (variableValues.some(value => typeof value.value !== 'number')) {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} value was expected, but received another type`, node.location);
                }
                break;
            case 'bool':
                if (variableValues.some(value => typeof value.value !== 'boolean')) {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} value was expected, but received another type`, node.location);
                }
                break;
            case 'string':
                if (variableValues.some(value => typeof value.value !== 'string')) {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} value was expected, but received another type`, node.location);
                }
                break;
            case 'char':
                if (variableValues.some(value => typeof value.value !== 'string' || value.value.length !== 1)) {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`An ${variableType} value was expected, but received another type`, node.location);
                }
                break;
            default:
                if (!(variableType in this.structlist)) {
                    this.entornoActual.setVariable('null', variableName, new Literal({ value: null, type: 'null' }));
                    throw new Errors(`Unknow Datatype: ${variableType}`, node.location);
                }
                
                


        }

        //Esto seria de ver si es para acá o para el join
        const valueString = variableValues.map(value => value.value).join(', ');
        console.log(`[${valueString}]`);
        //this.entornoActual.setVariable(variableType, variableName, new Literal({ value: variableValues, type: variableType }));

        //Agregar a la lista de simbolos, ID, Tipo símbolo, Tipo dato
        this.listaSimbolos.push({ID: variableName, Tipo: 'Array', TipoDato: variableType, Row: node.location.end.line, Column: node.location.end.column});
        
    }
    

    /**
     * @type [BaseVisitor['visitCallNode']]
     */
    visitCallNode(node) {
        console.log("Llamada a función: ", node);
        console.log("FunciónAHHHHHHHHHHHHHHHh:", node.callee);
        const funcion = node.callee.accept(this);

        const argumentos = node.args.map(arg => arg.accept(this));

        console.log("FunciónCARAJOOOOOOO: ", funcion);
        if (!(funcion instanceof Summonable)) {
            throw new Errors('Not an invocable function', node.location);
        }

        if (funcion.aridad() !== argumentos.length) {
            throw new Errors('Incorrect number of arguments', node.location);
        }
        return funcion.invocar(this, argumentos);
    }


    /**
     * @type [BaseVisitor['visitArrayAccess']]
     */
    visitArrayAccess(node) {
        const variable = this.entornoActual.getVariable(node.id);
        console.log("Variable: ", variable.value.value);
        if (!variable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        const index = node.index.accept(this);
        if (!(index instanceof Literal)) {
            throw new Errors('The index must be a literal', node.location);
        }

        if (!Array.isArray(variable.value.value)) {
            throw new Errors(`Variable ${node.id} is not an array`, node.location);
        }

        if (index.value < 0 || index.value >= variable.value.length) {
            throw new Errors(`Index out of bounds: ${index.value}`, node.location);
        }
        console.log("Valor del índice: ", index.value);
        console.log("Nombre de la variable: ", node.id);
        console.log("Valor del vector: ", variable.value.value[index.value]);
        return variable.value.value[index.value];
    }

    /**
     * @type [BaseVisitor['visitIndexOf']]
     */
    visitIndexOf(node) {
        const variable = this.entornoActual.getVariable(node.id);
        if (!variable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        const value = node.exp.accept(this);
        if (!Array.isArray(variable.value.value)) {
            throw new Errors(`Variable ${node.id} is not an array`, node.location);
        }

        const index = variable.value.value.findIndex(val => val.value === value.value);
        return new Literal({ value: index, type: 'int' });
    }

    /**
     * @type [BaseVisitor['visitJoin']]
     */
    visitJoin(node) {
        const variable = this.entornoActual.getVariable(node.id);
        if (!variable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        if (!Array.isArray(variable.value.value)) {
            throw new Errors(`Variable ${node.id} is not an array`, node.location);
        }

        const valueString = variable.value.value.map(value => value.value).join();
        return new Literal({ value: valueString, type: 'string' });
    }

    /**
     * @type [BaseVisitor['visitLength']]
     */
    visitLength(node) {
        const variable = this.entornoActual.getVariable(node.id);
        if (!variable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        if (!Array.isArray(variable.value.value)) {
            throw new Errors(`Variable ${node.id} is not an array`, node.location);
        }

        console.log("Length: ", variable.value.value);
        return new Literal({ value: variable.value.value.length, type: 'int' });
    }

    /**
     * @type [BaseVisitor['visitVectorAssign']]
     */
    visitVectorAssign(node) {
        const variable = this.entornoActual.getVariable(node.id);
        if (!variable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        if (!Array.isArray(variable.value.value)) {
            throw new Errors(`Variable ${node.id} is not an array`, node.location);
        }

        const index = node.index.accept(this);
        if (!(index instanceof Literal)) {
            throw new Errors('The index must be a literal', node.location);
        }

        if (index.value < 0 || index.value >= variable.value.length) {
            throw new Errors(`Index out of bounds: ${index.value}`, node.location);
        }

        const value = node.assi.accept(this);
        variable.value.value[index.value] = value;
        return value;
    }

     /**
     * @type [BaseVisitor['visitMatrixDeclaration']]
     */
     visitMatrixDeclaration(node) {
        console.log(node);
        const variableName = node.id;
        const variableType = node.type;
        let variableValues = [];
    
        // Verificar si es un vector con valores
        if (Array.isArray(node.values)) {
            // Función recursiva para las dimensiones
            const getDimensions = (matrix) => {
                let dimensions = [];
                let current = matrix;
                while (Array.isArray(current)) {
                    dimensions.push(current.length);
                    current = current[0];
                }
                return dimensions;
            };
    
            // Verificar que las dimensiones sean correctas :o
            const checkDimensions = (matrix, expectedDimensions) => {
                if (!Array.isArray(matrix)) {
                    return;
                }
                if (matrix.length !== expectedDimensions[0]) {
                    throw new Errors(`The matrix ${variableName} has ${matrix.length} rows, but ${expectedDimensions[0]} were expected`, node.location);
                }
                matrix.forEach(row => {
                    if (expectedDimensions.length > 1) {
                        checkDimensions(row, expectedDimensions.slice(1));
                    }
                });
            };
    
            variableValues = node.values.map(value => {
                if (typeof value.accept === 'function') {
                    return value.accept(this);
                } else {
                    return value;
                }
            });
    
            const dimensions = getDimensions(variableValues);
            console.log("Dimensiones de la matriz: ", dimensions);
    
            // Verificar que las dimensiones sean las esperadas
            checkDimensions(variableValues, dimensions);
    

    
            // Verificar que todas las filas tengan el mismo número de columnas
            const numColumns = variableValues[0].length;
            for (let i = 1; i < variableValues.length; i++) {
                if (variableValues[i].length !== numColumns) {
                    throw new Errors(`The matrix ${variableName} has rows of different lengths. ${numColumns} columns were expected, but a row with ${variableValues[i].length} columns was found.`, node.location);
                }
            }

            // Función recursiva para verificar tipos
        const validateMatrixTypes = (matrix, expectedType, invalidValues = []) => {
            if (Array.isArray(matrix)) {
                matrix.forEach(element => validateMatrixTypes(element, expectedType, invalidValues));
            } else {
                if (!checkTypeCompatibility(matrix, expectedType)) {
                    invalidValues.push(matrix);
                }
            }
            return invalidValues;
        };

        // Función para verificar la compatibilidad de tipos
        const checkTypeCompatibility = (element, expectedType) => {
            const value = element.value;
            switch (expectedType) {
                case 'int':
                    return typeof value === 'number' && Number.isInteger(value);
                case 'float':
                    return typeof value === 'number';
                case 'bool':
                    return typeof value === 'boolean';
                case 'string':
                    return typeof value === 'string';
                case 'char':
                    return typeof value === 'string' && value.length === 1;
                default:
                    throw new Errors(`Unknown data type: ${expectedType}`, node.location);
            }
        };

        // Validar los tipos de la matriz
        const invalidValues = validateMatrixTypes(variableValues, variableType);

        if (invalidValues.length > 0) {
            throw new Errors(`An ${variableType} value was expected, but the following invalid values were found: ${JSON.stringify(invalidValues)}`, node.location);
        }

            //en el else if, se verifica si es un nuevo vector con tamaño y se agregan valores por defecto
        }else if (node.newDimensions){
            const dimensions = node.newDimensions.map(dim => dim.accept(this).value);
            variableValues = crearMatriz(dimensions, typeMaps[variableType]);
        }

        //Verificar tipos para la matriz
        
    
        this.entornoActual.setVariable(variableType, variableName, new Literal({ value: variableValues, type: variableType }));
        //Agregar a la lista de simbolos, ID, Tipo símbolo, Tipo dato
        this.listaSimbolos.push({ID: variableName, Tipo: 'Array', TipoDato: variableType, Row: node.location.end.line, Column: node.location.end.column});
    }
    


    /**
     * @type [BaseVisitor['visitMatrixAccess']]
     */
    visitMatrixAccess(node) {
        const variable = this.entornoActual.getVariable(node.id);
        console.log(node);
        if (!variable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        const indexes = node.indexes.map(index => index.accept(this));
        console.log("Indices: ", indexes);
        if (!Array.isArray(variable.value.value)) {
            throw new Errors(`Variable ${node.id} is not a matrix`, node.location);
        }

        let current = variable.value.value;
        indexes.forEach(index => {
            current = current[index.value];
        });

        //si se acceso a una posición fuera de rango, se devuelve null y se lanza un error
        if(current === undefined){
            console.error("Posición fuera de rango");
            return new Literal({ value: null, type: null });
        }

        return current;
    }

    /**
     * @type [BaseVisitor['visitMatrixAccess']]
    */
    visitMatrixAssign(node) {
        console.log(node);
        const variable = this.entornoActual.getVariable(node.id);
        if (!variable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        const indexes = node.indexes.map(index => index.accept(this));
        const value = node.assi.accept(this);
        console.log("Valor a asignar: ", value);
        if (!Array.isArray(variable.value.value)) {
            throw new Errors(`Variable ${node.id} is not a matrix`, node.location);
        }

        let current = variable.value.value;
        indexes.slice(0, -1).forEach(index => {
            current = current[index.value];
        });

        current[indexes[indexes.length - 1].value] = value;
        return value;
    }


    /**
     * @type [BaseVisitor['visitFuncDeclaration']]
    */
    visitFuncDeclaration(node) {
        console.log(node);
        const funcion = new FuncionForanea(node, this.entornoActual);
        console.log("Función: ", funcion);
        this.entornoActual.setVariable(node.type, node.id, funcion);
        //Agregar a la lista de simbolos, ID, Tipo símbolo, Tipo dato
        this.listaSimbolos.push({ID: node.id, Tipo: 'Function', TipoDato: node.type, Row: node.location.end.line, Column: node.location.end.column});
    }


    /**
     * @type [BaseVisitor['visitForEach']]
     */
    visitForEach(node) {
        //ForEach = "for" _ "(" _ type:Types _ id:Id _ ":" _ id2:Id _ ")" _ stmt:Sentence { return createNode('ForEach', { type, id, id2, stmt }) }

        const arrayVariable = this.entornoActual.getVariable(node.id2);

        if (!arrayVariable) {
            throw new Errors(`Variable ${node.id2} not defined`, node.location);
        }

        const variableValues = arrayVariable.value.value;

        const previousScope = this.entornoActual;

        //Verificación de que si el tipo de id es igual al tipo de dato del array
        if (node.type !== arrayVariable.type) {
            throw new Errors(`The data type of the array ${node.id2} does not match the data type of the variable ${node.id}`, node.location);
        }

        variableValues.forEach(value => {
            this.entornoActual = new Entorno(previousScope);
            console.log("NODO ID: ", node.id);
            this.entornoActual.setOrUpdateVariable(node.type, node.id, value);

            node.stmt.accept(this);
        });

        this.entornoActual = previousScope;
    }

    /**
     * @type [BaseVisitor['visitStructNode']]
     */
    visitStructNode(node) {
        console.log(node);
        const structName = node.id;
        const structFields = node.fields;
        this.structlist[structName] = structFields;

        //Agregar a la lista de simbolos, ID, Tipo símbolo, Tipo dato
        this.listaSimbolos.push({ID: structName, Tipo: 'Struct', TipoDato: 'Struct', Row: node.location.end.line, Column: node.location.end.column});
        
    }

    /**
     * @type [BaseVisitor['visitStructInstance']]
     */
    visitStructInstance(node) {
        console.log(node);
        const structValues = this.structlist[node.IdStruct];
        const generalStruct = {};
        
        // Crear el struct con valores por defecto
        structValues.forEach(value => {
            const defaulValue = typeMaps[value.type];
            generalStruct[value.id] = new Literal({ value: defaulValue, type: value.type });
        });
    
        // Asignar los valores proporcionados en la instancia del struct
        node.values.forEach(value => {
            const structVal = value.value.accept(this);
            
            if (generalStruct.hasOwnProperty(value.name)) {
                if (structVal.type in this.structlist) {
                    // Si el valor es otro struct, necesitamos copiar sus valores
                    generalStruct[value.name] = structVal;
                } else {
                    generalStruct[value.name] = structVal;
                }
            } else {
                throw new Errors(`Attribute ${value.name} not defined in struct ${node.IdStruct}`, node.location);
            }
        });
    
        if (node.id !== null) {
            this.entornoActual.setVariable(node.type, node.id2, new Literal({ value: generalStruct, type: node.IdStruct }));
            this.listaSimbolos.push({ID: node.id2, Tipo: 'Struct', TipoDato: node.IdStruct, Row: node.location.end.line, Column: node.location.end.column});
        } else {
            return new Literal({ value: generalStruct, type: node.IdStruct });
        }
    }
    


    /**
     * @type [BaseVisitor['visitStructInstance']]
     */
    visitStructAccess(node) {
        console.log(node);
        const structVariable = this.entornoActual.getVariable(node.id);

        console.log("HOLA ", structVariable);

        if (!structVariable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        let current;
        let currentType;

        if (node.index){
            const index = node.index.accept(this);
            if (!(index instanceof Literal)) {
                throw new Errors('The index must be a literal', node.location);
            }
            current = current[index.value];
            currentType = current.type;
        }else{
            current = structVariable.value.value;
            currentType = structVariable.value.type; // Inicialmente, el tipo del struct
        }

        node.id2.forEach(id => {
            if (!current.hasOwnProperty(id)) {
                throw new Errors(`Attribute ${id} not defined in struct ${node.id}`, node.location);
            }
            // Actualiza el valor actual y su tipo en cada iteración
            currentType = current[id].type; // Aquí suponemos que cada atributo tiene un campo `type`
            current = current[id].value;
        });

        console.log("TIPO FINAL: ", currentType);

        // Devuelve un nuevo Literal con el valor y el tipo primitivo encontrado
        return new Literal({ value: current, type: currentType });
    }


    /**
     * @type [BaseVisitor['visitStructAssign']]
     */
    visitStructAssign(node) {
        console.log(node);
        
        const structVariable = this.entornoActual.getVariable(node.id);
        if (!structVariable) {
            throw new Errors(`Variable ${node.id} not defined`, node.location);
        }

        let attributeValue = structVariable.value.value;
        const attributesLength = node.attribute.length;

        node.attribute.forEach((attr, index) => {
            if (!attributeValue.hasOwnProperty(attr)) {
                throw new Errors(`Attribute ${attr} not defined in struct ${node.id}`, node.location);
            }

            if (index === attributesLength - 1) {
                // Si es la última iteración, se realiza la asignación.
                attributeValue[attr].value = node.assi.accept(this);
                console.log("Valor del atributo asignado: ", attributeValue[attr].value);
            } else {
                // Si no es la última iteración, se sigue navegando por los atributos.
                attributeValue = attributeValue[attr].value;
            }
        });

        return structVariable.value;
    }

    /**
     * @type [BaseVisitor['visitObjectKeys']]
     */
    visitObjectKeys(node) {
        console.log(node);
        const object = node.exp.accept(this);

        if (typeof object.value !== 'object') {
            throw new Errors('An object was expected', node.location);
        }

        return new Literal({ value: Object.keys(object.value), type: 'string' });


    }


}

function crearMatriz(dimensions, valorInicial) {
    // Si solo hay una dimensión, crear y devolver un array de esa longitud
    if (dimensions.length === 1) {
        return new Array(dimensions[0]).fill(valorInicial);
    }

    // Extraer la primera dimensión
    let size = dimensions[0];

    // Crear un array de la longitud especificada por la primera dimensión
    let matriz = [];

    // Para cada posición en la primera dimensión, generar recursivamente
    // una submatriz de las dimensiones restantes
    for (let i = 0; i < size; i++) {
        matriz.push(crearMatriz(dimensions.slice(1), valorInicial));
    }

    return matriz;
}
