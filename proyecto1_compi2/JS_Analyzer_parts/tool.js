/**
 * DISCLAIMER:
 * Este código fue desarrollado con fines puramente didácticos.
 * Su objetivo principal es demostrar la implementación del patrón de diseño Visitor
 * utilizando peggy.js como generador de analizadores y agregando anotaciones JSDoc
 * para mejorar la comprensión y la documentación del código.
 *
 * La estructura y los conceptos presentados en este archivo tienen la intención de
 * facilitar el aprendizaje y la enseñanza de patrones de diseño y documentación en
 * JavaScript. No se recomienda su uso en entornos de producción.
 *
 * @autor: @damianpeaf
 *
 */


// import fs from 'fs';
const fs = require('fs')

const types = [
    `
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
    `
]

const configuracionNodos = [
    {
        name: 'Literal',
        extends: 'Expresion',
        props:[
            {
                name: 'value',
                type: 'any',
                description: 'Value of the literal'
            },
            {
                name: 'type',
                type: 'string',
                description: 'Type of the literal'
            }
        ]
    },
    {
        name: 'Print',
        extends: 'Expression',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expression to print'
            }
        ]
    },
    {
        name: 'Arithmetic',
        extends: 'Expression',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'Grouping',
        extends: 'Expression',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion agrupada'
            }
        ]
    },
    {
        name: 'Relational',
        extends: 'Expression',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    }
]

let code = ''

// Tipos base
types.forEach(type => {
    code += type + '\n'
})


// // Tipos de nodos
// configuracionNodos.forEach(nodo => {
//     code += `
// /**
//  * @typedef {Object} ${nodo.name}
//  * ${nodo.props.map(prop => `@property {${prop.type}} ${prop.name} ${prop.description}`).join('\n * ')}
// */
//     `
// })

// Tipos del visitor
code += `
/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */
`

const baseClass = configuracionNodos.find(nodo => nodo.base)

configuracionNodos.forEach(nodo => {


    code += `
export class ${nodo.name} ${baseClass && nodo.extends ? `extends ${nodo.extends}` : ''} {

    /**
    * @param {Object} options
    * ${nodo.props.map(prop => `@param {${prop.type}} options.${prop.name} ${prop.description}`).join('\n * ')}
    */
    constructor(${!nodo.base && `{ ${nodo.props.map(prop => `${prop.name}`).join(', ')} }` || ''}) {
        ${baseClass && nodo.extends ? `super();` : ''}
        ${nodo.props.map(prop => `
        /**
         * ${prop.description}
         * @type {${prop.type}}
        */
        this.${prop.name} = ${prop.default || `${prop.name}`};
`).join('\n')}
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visit${nodo.name}(this);
    }
}
    `
})

code += `
export default { ${configuracionNodos.map(nodo => nodo.name).join(', ')} }
`


fs.writeFileSync('./nodos.js', code)
console.log('Archivo de clases de nodo generado correctamente')


// Visitor
// @typedef {import('./nodos').Expresion} Expresion
code = `
/**
${configuracionNodos.map(nodo => `
 * @typedef {import('./nodos').${nodo.name}} ${nodo.name}
`).join('\n')}
 */
`

code += `

/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    ${configuracionNodos.map(nodo => `
    /**
     * @param {${nodo.name}} node
     * @returns {any}
     */
    visit${nodo.name}(node) {
        throw new Error('Metodo visit${nodo.name} no implementado');
    }
    `).join('\n')
}
}
`

fs.writeFileSync('./visitor.js', code)
console.log('Archivo de visitor generado correctamente')