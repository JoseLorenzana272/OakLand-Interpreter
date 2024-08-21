{
  const createNode = (typeNode, props) => {
    const type = {
      'Literal': nodos.Literal,
      'Print': nodos.Print,
      'Arithmetic': nodos.Arithmetic,
      'Relational': nodos.Relational,
      'Grouping': nodos.Grouping,
      'Igualation': nodos.Igualation,
      'Logical': nodos.Logical,
      'Unario': nodos.Unario
    }

    const node = new type[typeNode](props);
    return node;
  }
}

Program = statements:Statements* _ { return statements; }
Statements = Statement
Statement = s:Sentence _ { return s; }
Operations = LogicalOperations/Igualation/RelationalOperations/ArithmeticOperations

/*---------------------Operaciones Logicas----------------------*/
LogicalOperations = And/Or

And = izq:Or expansion:(
  _ op:"&&" _ der:Or { return { tipo: op, der } }
)* {
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return createNode('Logical', { op: tipo, izq: operacionAnterior, der });
    },
    izq
  );
}

Or = izq:Igualation expansion:(
  _ op:"||" _ der:Igualation { return { tipo: op, der } }
)* {
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return createNode('Logical', { op: tipo, izq: operacionAnterior, der });
    },
    izq
  );
}



/*--------------------------------------------------------------------*/
/*--------------------Operaciones Relacionales------------------------*/
Igualation = izq:RelationalOperations expansion:(
  _ op:("==" / "!=") _ der:RelationalOperations { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return createNode('Igualation', { op: tipo, izq: operacionAnterior, der });
    },
    izq
  );
}

RelationalOperations = izq:ArithmeticOperations expansion:(
  _ op:("<=" / ">=" / "<" / ">" ) _ der:ArithmeticOperations { return { tipo: op, der } }
)* { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual;
      return createNode('Relational', { op: tipo, izq: operacionAnterior, der });
    },
    izq
  );
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

Modulus = izq:Unary expansion:(
  _ op:"%" _ der:Unary { return { tipo: op, der } }
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
Unary = "-" _ un:DataType { return createNode('Unario', { op: '-', exp: un }); }
      / "!" _ un:DataType { return createNode('Unario', { op: '!', exp: un }); }
      /DataType

/*----------- Tipos de datos ---------------------------- */

DataType = "(" _ exp:Operations _ ")" {return createNode('Grouping', { exp })}
            /dato:Number { return dato; }
            /dato:Boolean { return dato; }
            /dato:String { return dato; }
            /dato:Char { return dato; }
            /Null


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