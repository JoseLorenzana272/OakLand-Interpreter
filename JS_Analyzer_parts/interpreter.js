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

        this.structlist = {};

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
    
        this.salida += resultados.trim() + '\n';
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
                    throw new Error(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`);
                }
                break;

            case 'float':
                if (typeof variableValue.value !== 'number') {
                    throw new Error(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`);
                }
                break;

            case 'bool':
                if (typeof variableValue.value !== 'boolean') {
                    throw new Error(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`);
                }
                break;

            case 'string':
                if (typeof variableValue.value !== 'string') {
                    throw new Error(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`);
                }
                break;

            case 'char':
                if (typeof variableValue.value !== 'string' || variableValue.value.length !== 1) {
                    throw new Error(`An ${variableType} was expected, but received:  ${typeof variableValue.value}`);
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

        //Verificar tipos

        if (currentValue.type !== value.type) {
            throw new Error(`El tipo de dato ${value.type} no coincide con el tipo de dato de la variable ${currentValue.type}`);
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
                    throw new Error(`An ${variableType} value was expected, but received another type`);
                }
                break;
            case 'float':
                if (variableValues.some(value => typeof value.value !== 'number')) {
                    throw new Error(`An ${variableType} value was expected, but received another type`);
                }
                break;
            case 'bool':
                if (variableValues.some(value => typeof value.value !== 'boolean')) {
                    throw new Error(`An ${variableType} value was expected, but received another type`);
                }
                break;
            case 'string':
                if (variableValues.some(value => typeof value.value !== 'string')) {
                    throw new Error(`An ${variableType} value was expected, but received another type`);
                }
                break;
            case 'char':
                if (variableValues.some(value => typeof value.value !== 'string' || value.value.length !== 1)) {
                    throw new Error(`An ${variableType} value was expected, but received another type`);
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
        console.log("FunciónAHHHHHHHHHHHHHHHh:", node.callee);
        const funcion = node.callee.accept(this);

        const argumentos = node.args.map(arg => arg.accept(this));

        console.log("FunciónCARAJOOOOOOO: ", funcion);
        if (!(funcion instanceof Summonable)) {
            throw new Error('No es invocable');
        }

        if (funcion.aridad() !== argumentos.length) {
            throw new Error('Aridad incorrecta');
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
            throw new Error(`Variable ${node.id} no definida`);
        }

        const index = node.index.accept(this);
        if (!(index instanceof Literal)) {
            throw new Error('El índice debe ser una literal');
        }

        if (!Array.isArray(variable.value.value)) {
            throw new Error(`Variable ${node.id} no es un vector`);
        }

        if (index.value < 0 || index.value >= variable.value.length) {
            throw new Error(`Índice fuera de rango: ${index.value}`);
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
            throw new Error(`Variable ${node.id} no definida`);
        }

        const value = node.exp.accept(this);
        if (!Array.isArray(variable.value.value)) {
            throw new Error(`Variable ${node.id} no es un vector`);
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
            throw new Error(`Variable ${node.id} no definida`);
        }

        if (!Array.isArray(variable.value.value)) {
            throw new Error(`Variable ${node.id} no es un vector`);
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
            throw new Error(`Variable ${node.id} no definida`);
        }

        if (!Array.isArray(variable.value.value)) {
            throw new Error(`Variable ${node.id} no es un vector`);
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
            throw new Error(`Variable ${node.id} no definida`);
        }

        if (!Array.isArray(variable.value.value)) {
            throw new Error(`Variable ${node.id} no es un vector`);
        }

        const index = node.index.accept(this);
        if (!(index instanceof Literal)) {
            throw new Error('El índice debe ser una literal');
        }

        if (index.value < 0 || index.value >= variable.value.length) {
            throw new Error(`Índice fuera de rango: ${index.value}`);
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
                    throw new Error(`La matriz ${variableName} tiene filas de diferentes longitudes. Se esperaba ${expectedDimensions[0]} filas, pero se encontró una fila con ${matrix.length} elementos.`);
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
                    throw new Error(`La matriz ${variableName} tiene filas de diferentes longitudes. Se esperaba ${numColumns} columnas, pero se encontró una fila con ${variableValues[i].length} columnas.`);
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
                    throw new Error(`Tipo de dato desconocido: ${expectedType}`);
            }
        };

        // Validar los tipos de la matriz
        const invalidValues = validateMatrixTypes(variableValues, variableType);

        if (invalidValues.length > 0) {
            throw new Error(`Se esperaba un tipo ${variableType}, pero se encontraron los siguientes valores inválidos: ${JSON.stringify(invalidValues)}`);
        }

            //en el else if, se verifica si es un nuevo vector con tamaño y se agregan valores por defecto
        }else if (node.newDimensions){
            const dimensions = node.newDimensions.map(dim => dim.accept(this).value);
            variableValues = crearMatriz(dimensions, typeMaps[variableType]);
        }

        //Verificar tipos para la matriz
        
    
        this.entornoActual.setVariable(variableType, variableName, new Literal({ value: variableValues, type: variableType }));
    }
    


    /**
     * @type [BaseVisitor['visitMatrixAccess']]
     */
    visitMatrixAccess(node) {
        const variable = this.entornoActual.getVariable(node.id);
        console.log(node);
        if (!variable) {
            throw new Error(`Variable ${node.id} no definida`);
        }

        const indexes = node.indexes.map(index => index.accept(this));
        console.log("Indices: ", indexes);
        if (!Array.isArray(variable.value.value)) {
            throw new Error(`Variable ${node.id} no es una matriz`);
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
            throw new Error(`Variable ${node.id} no definida`);
        }

        const indexes = node.indexes.map(index => index.accept(this));
        const value = node.assi.accept(this);
        console.log("Valor a asignar: ", value);
        if (!Array.isArray(variable.value.value)) {
            throw new Error(`Variable ${node.id} no es una matriz`);
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
        this.entornoActual.setVariable('int', node.id, funcion);
    }


    /**
     * @type [BaseVisitor['visitForEach']]
     */
    visitForEach(node) {
        //ForEach = "for" _ "(" _ type:Types _ id:Id _ ":" _ id2:Id _ ")" _ stmt:Sentence { return createNode('ForEach', { type, id, id2, stmt }) }

        const arrayVariable = this.entornoActual.getVariable(node.id2);

        if (!arrayVariable) {
            throw new Error(`Variable ${node.id2} no está definida`);
        }

        const variableValues = arrayVariable.value.value;

        const previousScope = this.entornoActual;

        variableValues.forEach(value => {
            this.entornoActual = new Entorno(previousScope);

            this.entornoActual.setVariable(node.type, node.id, value);

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
        
    }

    /**
     * @type [BaseVisitor['visitStructInstance']]
     */
    visitStructInstance(node) {
        console.log(node);
        const structValues = this.structlist[node.IdStruct];

        if (node.id !== "var"){
            const structVariable = this.structlist[node.id];
            if (!structVariable) {
                throw new Error(`Struct ${node.id} no definido`);
            }
        }
        
        const generalStruct = {};

        structValues.forEach(value => {
            const defaulValue = typeMaps[value.type];
            generalStruct[value.id] = new Literal({ value: defaulValue, type: value.type });
        });

        //Asignar valores a las variables del struct

        node.values.forEach(value => {
            const structVal = value.value.accept(this);
            if (generalStruct.hasOwnProperty(value.name)) {
                generalStruct[value.name] = structVal;
            }else{
                throw new Error(`No se encontró el atributo ${value.id} en el Struct ${node.id}`);
            }
            
        });

        this.entornoActual.setVariable(node.type, node.id2, new Literal({ value: generalStruct, type: node.id }));
        console.log(this.entornoActual.valores);
    }
    

    /**
     * @type [BaseVisitor['visitStructInstance']]
     */
    visitStructAccess(node) {
        console.log(node);
        const structVariable = this.entornoActual.getVariable(node.id);
        console.log("HOLA ", structVariable);
        if (!structVariable) {
            throw new Error(`Variable ${node.id} no definida`);
        }
        const atributeValue = structVariable.value.value[node.id2];
        if (!atributeValue) {
            throw new Error(`Atributo ${node.id2} no definido en el Struct ${node.id}`);
        }

        return atributeValue
    }

    /**
     * @type [BaseVisitor['visitStructAssign']]
     */
    visitStructAssign(node) {

        const structVariable = this.entornoActual.getVariable(node.id);
        if (!structVariable) {
            throw new Error(`Variable ${node.id} no definida`);
        }

        const atributeValue = structVariable.value.value[node.attribute];
        if (!atributeValue) {
            throw new Error(`Atributo ${node.attribute} no definido en el Struct ${node.id}`);
        }

        //verificar si el tipo asignado es el mismo que el del atributo
        if (atributeValue.type !== node.assi.type) {
            throw new Error(`El tipo de dato ${node.assi.type} no coincide con el tipo de dato del atributo ${atributeValue.type}`);
        }

        const value = node.assi.accept(this);
        atributeValue.value = value.value;
        return value;
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