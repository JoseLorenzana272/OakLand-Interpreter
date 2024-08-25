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
      'Unario': nodos.Unario,
      'VariableDeclaration': nodos.VariableDeclaration,
      'VariableValue': nodos.VariableValue,
      'Block': nodos.Block,
      'OpSentence': nodos.OpSentence,
      'VariableAssign': nodos.VariableAssign,
      'TernaryOp': nodos.TernaryOp,
      'IfNode': nodos.IfNode,
      'WhileNode': nodos.WhileNode,
      'ForLoop': nodos.ForLoop,
      'IncrementDecrement': nodos.IncrementDecrement,
      'BreakNode': nodos.BreakNode,
      'ContinueNode': nodos.ContinueNode,
      'ReturnNode': nodos.ReturnNode,
      'SwitchNode': nodos.SwitchNode,
      'VectorDeclaration': nodos.VectorDeclaration,
      'CallNode': nodos.CallNode
    }

    const node = new type[typeNode](props);
    return node;
  }
}

Program = _ statements:Statements* _ { return statements; }

Statements = Statement

Statement =  _ vard:VariableDeclaration _ { return vard; }
            /_ vecd:VectorDeclaration _ { return vecd; }
            /_ s:Sentence _ { return s; } 

/*---------------------Declaracion de variables----------------------*/
VariableDeclaration = type:(Types / "var") _ id:Id _ exp:("=" _ exp:Operations {return exp})? _ ";" 
                      { return createNode('VariableDeclaration', { type, id, value: exp || null }); }

VectorDeclaration 
  = type:Types _ "[]" _ id:Id _
      "=" _ "{" _ values:VectorValues _ "}" _ ";"{ 
        return createNode('VectorDeclaration', { type, id, values, size: values.length }); 
      }
    / type:Types _ "[]" _ id:Id _ "=" _ "new" _ newType:Types _ "[" _ size:Integer _ "]" _ ";" { 
        if (type !== newType) {
          throw new Error("Array type mismatch");
        }
        if (size < 0) {
          throw new Error("Array size cannot be negative");
        }
        return createNode('VectorDeclaration', { type, id, size });
      }
    / type:Types _ "[]" _ id:Id _ "=" _ values:Id ";" { return createNode('VectorDeclaration', { type, id, values }); }

VectorValues = head:Operations tail:(_ "," _ Operations)* { return [head, ...tail.map(t => t[3])]; }

/*-------------------------------------------------------------------*/

Operations = Assignment

Assignment = id:Id _ op:("="/"+="/"-=") _ assi:Assignment{ return createNode('VariableAssign', {id, op, assi})}
            /TernaryOp

TernaryOp = condition:LogicalOperations _ "?" _ trueExp:TernaryOp _ ":" _ falseExp:TernaryOp { return createNode('TernaryOp', { condition, trueExp, falseExp }); }
          /LogicalOperations

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


/*---------------------- Print & Block ---------------------------*/
Sentence = p:Print { return p; }
          /b:Block { return b; }
          /i: If { return i; }
          /w: While { return w; }
          /f: ForLoop { return f; }
          /sw: Switch { return sw; }
          /br: Break { return br; }
          /c: Continue { return c; }
          /rt: Return { return rt; }
          /o:Operations _ ";" { return createNode('OpSentence', {o}) }

Break = "break" _ ";" { return createNode('BreakNode', {}); }

Continue = "continue" _ ";" { return createNode('ContinueNode', {}); }

Return = "return" _ exp:Operations? _ ";" { return crearNodo('ReturnNode', { exp }) }

Switch = "switch" _ "(" _ exp:Operations _ ")" _ "{" _ 
             cases:SwitchCase* 
             def:DefaultCase? 
             _ "}" { return createNode('SwitchNode', { exp, cases, def }) }

SwitchCase = _ "case" _ value:Operations _ ":" _ inst:Statements* _ { return { value, inst } }

DefaultCase = _ "default" _ ":" _ stmts:Sentence* { return { stmts } }

If = "if" _ "(" _ cond:Operations _ ")" _ stmtTrue:Sentence 
      stmtFalse:(
        _ "else" _ stmtFalse:Sentence { return stmtFalse } 
      )? { return createNode('IfNode', { cond, stmtTrue, stmtFalse }) }

While = "while" _ "(" _ cond:Operations _ ")" _ stmt:Sentence { return createNode('WhileNode', { cond, stmt }) }

ForLoop = "for" _ "("_ init:Statement _ cond:TernaryOp _ ";" _ inc:(IncrementDecrement/Assignment) _ ")" _ stmt:Sentence { return createNode('ForLoop', { init, cond, inc, stmt }) }

IncrementDecrement = id:Id _ op:("++" / "--") { return createNode('IncrementDecrement', { id, op }); }

Print = "System.out.println" _ "(" _ expressions:ExpressionPrint  _ ")" _ ";"  { return createNode('Print', {exp: expressions}); }

ExpressionPrint = head:Operations tail:(_ "," _ Operations)* { return [head, ...tail.map(t => t[3])]; }

Block = "{" _ stmt:Statements* _ "}" { return createNode('Block', { statements: stmt }); }

/*-------------------------------------------------------- */
Unary = "-" _ un:FCall { return createNode('Unario', { op: '-', exp: un }); }
      / "!" _ un:FCall { return createNode('Unario', { op: '!', exp: un }); }
      /FCall

/*----------------------Llamadas a funciones----------------------*/

FCall = callee:DataType _ params:("(" args:Arguments? ")" { return args })* {
  return params.reduce(
    (callee, args) => {
      return createNode('CallNode', { callee, args: args || [] })
    },
    callee
  )
}

Arguments = arg:Operations _ args:("," _ exp:Operations { return exp })* { return [arg, ...args] }

/*----------- Tipos de datos ---------------------------- */

DataType = "(" _ exp:Operations _ ")" {return createNode('Grouping', { exp })}
            /dato:Number { return dato; }
            /dato:Boolean { return dato; }
            /dato:String { return dato; }
            /dato:Char { return dato; }
            /Null
            /id:Id { return createNode('VariableValue', { id }) }


Number = Float/Integer

Integer = [0-9]+ { return createNode('Literal', {value: parseInt(text()), type: 'int'}); }

Float = [0-9]+ "." [0-9]+ { return createNode('Literal', {value: parseFloat(text(), 10), type: 'float'}); }

Boolean = ("true"/"false") { return createNode('Literal', {value: text() === "true" ? true : false, type: 'bool'}); }

String = "\"" [^\"]* "\"" { return createNode('Literal', {value: text().slice(1,-1), type: 'string'}); }

Char = "'" [^']* "'" { return createNode('Literal', {value: text().slice(1,-1), type: 'char'}); }

Null = 'null' { return createNode('Literal', {value: null, type: 'null'}); }

/*----------------------------------------------------- */
/* ----------------- Comentarios ---------------------------- */
Comments = SimpleComment / MultilineComment

SimpleComment = "//" [^\r\n]*

MultilineComment = "/*" (!"*/" .)* "*/"
 /*-------------------------------------------------------------*/

Types = ("int" / "float" / "string" / "char" / "bool") { return text(); }

Id = [a-zA-Z_][a-zA-Z0-9_]* { return text(); }


_ = [ \t\n\r]* Comments* [ \t\n\r]*