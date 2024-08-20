{
  const createNode = (typeNode, props) => {
    const type = {
      'Literal': nodos.Literal,
      'Print': nodos.Print,
      'Arithmetic': nodos.Arithmetic,
      'Relational': nodos.Relational,
      'Grouping': nodos.Grouping
    }

    const node = new type[typeNode](props);
    return node;
  }
}

Text = Sentence

Operations = RelationalOperations/ArithmeticOperations

/*--------------------Operaciones Relacionales------------------------*/
RelationalOperations = izq:ArithmeticOperations expansion:(
  _ op:("<="/">="/">" / "<") _ der:ArithmeticOperations { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return createNode('Relational', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}


/*--------------------Operaciones Arimeticas----------------------*/


ArithmeticOperations = Sum/Multiply/Modulus/DataType

Sum = izq:Multiply expansion:(
  _ op:("+" / "-") _ der:Multiply { return { tipo: op, der } }
)* {
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return createNode('Arithmetic', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
}

Multiply = izq:Modulus expansion:(
  _ op:("*" / "/") _ der:Modulus { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return createNode('Arithmetic', { op:tipo, izq: operacionAnterior, der })
      },
      izq
    )
}

Modulus = izq:Number expansion:(
  _ op:"%" _ der:Number { return { tipo: op, der } }
)* {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return createNode('Arithmetic', { op:tipo, izq: operacionAnterior, der })
      },
      izq
    )
}


/*---------------------- Print ---------------------------*/
Sentence = p:Print { return p; }

Print = "system.out.println" _ "(" _ expressions:ExpressionPrint  _ ")" _ ";"  { return createNode('Print', {exp: expressions}); }

ExpressionPrint = head:Operations tail:(_ "," _ Operations)* { return [head, ...tail.map(t => t[3])]; }

/*-------------------------------------------------------- */


/*----------- Tipos de datos ---------------------------- */

DataType = Number/Boolean/String/Char/Null/Grouping

Grouping = "[" _ exp:Operations _ "]" {return createNode('Grouping', { exp })}

Number = Float/Integer

Integer = [0-9]+ { return createNode('Literal', {value: parseInt(text()), type: 'int'}); }

Float = [0-9]+ "." [0-9]+ { return createNode('Literal', {value: parseFloat(text(), 10), type: 'float'}); }

Boolean = ("true"/"false") { return createNode('Literal', {value: text() === "true" ? true : false, type: 'bool'}); }

String = "\"" [^\"]* "\"" { return createNode('Literal', {value: text().slice(1,-1), type: 'string'}); }

Char = "'" [^']* "'" { return createNode('Literal', {value: text().slice(1,-1), type: 'char'}); }

Null = 'null' { return createNode('Literal', {value: null, type: 'null'}); }

/*----------------------------------------------------- */

Id = [a-zA-Z_][a-zA-Z0-9_]* { return text(); }

_ = [ \t\n\r]*