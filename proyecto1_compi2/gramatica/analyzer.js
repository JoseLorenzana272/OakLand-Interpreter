// @generated by Peggy 4.0.3.
//
// https://peggyjs.org/

import nodos from "../JS_Analyzer_parts/nodos.js";


function peg$subclass(child, parent) {
  function C() { this.constructor = child; }
  C.prototype = parent.prototype;
  child.prototype = new C();
}

function peg$SyntaxError(message, expected, found, location) {
  var self = Error.call(this, message);
  // istanbul ignore next Check is a necessary evil to support older environments
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(self, peg$SyntaxError.prototype);
  }
  self.expected = expected;
  self.found = found;
  self.location = location;
  self.name = "SyntaxError";
  return self;
}

peg$subclass(peg$SyntaxError, Error);

function peg$padEnd(str, targetLength, padString) {
  padString = padString || " ";
  if (str.length > targetLength) { return str; }
  targetLength -= str.length;
  padString += padString.repeat(targetLength);
  return str + padString.slice(0, targetLength);
}

peg$SyntaxError.prototype.format = function(sources) {
  var str = "Error: " + this.message;
  if (this.location) {
    var src = null;
    var k;
    for (k = 0; k < sources.length; k++) {
      if (sources[k].source === this.location.source) {
        src = sources[k].text.split(/\r\n|\n|\r/g);
        break;
      }
    }
    var s = this.location.start;
    var offset_s = (this.location.source && (typeof this.location.source.offset === "function"))
      ? this.location.source.offset(s)
      : s;
    var loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
    if (src) {
      var e = this.location.end;
      var filler = peg$padEnd("", offset_s.line.toString().length, ' ');
      var line = src[s.line - 1];
      var last = s.line === e.line ? e.column : line.length + 1;
      var hatLen = (last - s.column) || 1;
      str += "\n --> " + loc + "\n"
          + filler + " |\n"
          + offset_s.line + " | " + line + "\n"
          + filler + " | " + peg$padEnd("", s.column - 1, ' ')
          + peg$padEnd("", hatLen, "^");
    } else {
      str += "\n at " + loc;
    }
  }
  return str;
};

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },

    class: function(expectation) {
      var escapedParts = expectation.parts.map(function(part) {
        return Array.isArray(part)
          ? classEscape(part[0]) + "-" + classEscape(part[1])
          : classEscape(part);
      });

      return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]";
    },

    any: function() {
      return "any character";
    },

    end: function() {
      return "end of input";
    },

    other: function(expectation) {
      return expectation.description;
    }
  };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/"/g,  "\\\"")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, "\\\\")
      .replace(/\]/g, "\\]")
      .replace(/\^/g, "\\^")
      .replace(/-/g,  "\\-")
      .replace(/\0/g, "\\0")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/[\x00-\x0F]/g,          function(ch) { return "\\x0" + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return "\\x"  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = expected.map(describeExpectation);
    var i, j;

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== undefined ? options : {};

  var peg$FAILED = {};
  var peg$source = options.grammarSource;

  var peg$startRuleFunctions = { Text: peg$parseText };
  var peg$startRuleFunction = peg$parseText;

  var peg$c0 = "<=";
  var peg$c1 = ">=";
  var peg$c2 = "%";
  var peg$c3 = "system.out.println";
  var peg$c4 = "(";
  var peg$c5 = ")";
  var peg$c6 = ";";
  var peg$c7 = ",";
  var peg$c8 = "[";
  var peg$c9 = "]";
  var peg$c10 = ".";
  var peg$c11 = "true";
  var peg$c12 = "false";
  var peg$c13 = "\"";
  var peg$c14 = "'";
  var peg$c15 = "null";

  var peg$r0 = /^[<>]/;
  var peg$r1 = /^[+\-]/;
  var peg$r2 = /^[*\/]/;
  var peg$r3 = /^[0-9]/;
  var peg$r4 = /^[^"]/;
  var peg$r5 = /^[^']/;
  var peg$r6 = /^[a-zA-Z_]/;
  var peg$r7 = /^[a-zA-Z0-9_]/;
  var peg$r8 = /^[ \t\n\r]/;

  var peg$e0 = peg$literalExpectation("<=", false);
  var peg$e1 = peg$literalExpectation(">=", false);
  var peg$e2 = peg$classExpectation(["<", ">"], false, false);
  var peg$e3 = peg$classExpectation(["+", "-"], false, false);
  var peg$e4 = peg$classExpectation(["*", "/"], false, false);
  var peg$e5 = peg$literalExpectation("%", false);
  var peg$e6 = peg$literalExpectation("system.out.println", false);
  var peg$e7 = peg$literalExpectation("(", false);
  var peg$e8 = peg$literalExpectation(")", false);
  var peg$e9 = peg$literalExpectation(";", false);
  var peg$e10 = peg$literalExpectation(",", false);
  var peg$e11 = peg$literalExpectation("[", false);
  var peg$e12 = peg$literalExpectation("]", false);
  var peg$e13 = peg$classExpectation([["0", "9"]], false, false);
  var peg$e14 = peg$literalExpectation(".", false);
  var peg$e15 = peg$literalExpectation("true", false);
  var peg$e16 = peg$literalExpectation("false", false);
  var peg$e17 = peg$literalExpectation("\"", false);
  var peg$e18 = peg$classExpectation(["\""], true, false);
  var peg$e19 = peg$literalExpectation("'", false);
  var peg$e20 = peg$classExpectation(["'"], true, false);
  var peg$e21 = peg$literalExpectation("null", false);
  var peg$e22 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false);
  var peg$e23 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false);
  var peg$e24 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false);

  var peg$f0 = function(izq, op, der) { return { tipo: op, der } };
  var peg$f1 = function(izq, expansion) { 
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return createNode('Relational', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
};
  var peg$f2 = function(izq, op, der) { return { tipo: op, der } };
  var peg$f3 = function(izq, expansion) {
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return createNode('Arithmetic', { op:tipo, izq: operacionAnterior, der })
    },
    izq
  )
};
  var peg$f4 = function(izq, op, der) { return { tipo: op, der } };
  var peg$f5 = function(izq, expansion) {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return createNode('Arithmetic', { op:tipo, izq: operacionAnterior, der })
      },
      izq
    )
};
  var peg$f6 = function(izq, op, der) { return { tipo: op, der } };
  var peg$f7 = function(izq, expansion) {
    return expansion.reduce(
      (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return createNode('Arithmetic', { op:tipo, izq: operacionAnterior, der })
      },
      izq
    )
};
  var peg$f8 = function(p) { return p; };
  var peg$f9 = function(expressions) { return createNode('Print', {exp: expressions}); };
  var peg$f10 = function(head, tail) { return [head, ...tail.map(t => t[3])]; };
  var peg$f11 = function(exp) {return createNode('Grouping', { exp })};
  var peg$f12 = function() { return createNode('Literal', {value: parseInt(text()), type: 'int'}); };
  var peg$f13 = function() { return createNode('Literal', {value: parseFloat(text(), 10), type: 'float'}); };
  var peg$f14 = function() { return createNode('Literal', {value: text() === "true" ? true : false, type: 'bool'}); };
  var peg$f15 = function() { return createNode('Literal', {value: text().slice(1,-1), type: 'string'}); };
  var peg$f16 = function() { return createNode('Literal', {value: text().slice(1,-1), type: 'char'}); };
  var peg$f17 = function() { return createNode('Literal', {value: null, type: 'null'}); };
  var peg$f18 = function() { return text(); };
  var peg$currPos = options.peg$currPos | 0;
  var peg$savedPos = peg$currPos;
  var peg$posDetailsCache = [{ line: 1, column: 1 }];
  var peg$maxFailPos = peg$currPos;
  var peg$maxFailExpected = options.peg$maxFailExpected || [];
  var peg$silentFails = options.peg$silentFails | 0;

  var peg$result;

  if (options.startRule) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function offset() {
    return peg$savedPos;
  }

  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos];
    var p;

    if (details) {
      return details;
    } else {
      if (pos >= peg$posDetailsCache.length) {
        p = peg$posDetailsCache.length - 1;
      } else {
        p = pos;
        while (!peg$posDetailsCache[--p]) {}
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos, endPos, offset) {
    var startPosDetails = peg$computePosDetails(startPos);
    var endPosDetails = peg$computePosDetails(endPos);

    var res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
    if (offset && peg$source && (typeof peg$source.offset === "function")) {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parseText() {
    var s0;

    s0 = peg$parseSentence();

    return s0;
  }

  function peg$parseOperations() {
    var s0;

    s0 = peg$parseRelationalOperations();
    if (s0 === peg$FAILED) {
      s0 = peg$parseArithmeticOperations();
    }

    return s0;
  }

  function peg$parseRelationalOperations() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseArithmeticOperations();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.substr(peg$currPos, 2) === peg$c0) {
        s5 = peg$c0;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e0); }
      }
      if (s5 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c1) {
          s5 = peg$c1;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e1); }
        }
        if (s5 === peg$FAILED) {
          s5 = input.charAt(peg$currPos);
          if (peg$r0.test(s5)) {
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e2); }
          }
        }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseArithmeticOperations();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f0(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.substr(peg$currPos, 2) === peg$c0) {
          s5 = peg$c0;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e0); }
        }
        if (s5 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c1) {
            s5 = peg$c1;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e1); }
          }
          if (s5 === peg$FAILED) {
            s5 = input.charAt(peg$currPos);
            if (peg$r0.test(s5)) {
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e2); }
            }
          }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseArithmeticOperations();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f0(s1, s5, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f1(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseArithmeticOperations() {
    var s0;

    s0 = peg$parseSum();
    if (s0 === peg$FAILED) {
      s0 = peg$parseMultiply();
      if (s0 === peg$FAILED) {
        s0 = peg$parseModulus();
        if (s0 === peg$FAILED) {
          s0 = peg$parseDataType();
        }
      }
    }

    return s0;
  }

  function peg$parseSum() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseMultiply();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      s5 = input.charAt(peg$currPos);
      if (peg$r1.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e3); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseMultiply();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f2(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        s5 = input.charAt(peg$currPos);
        if (peg$r1.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e3); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseMultiply();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f2(s1, s5, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f3(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMultiply() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseModulus();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      s5 = input.charAt(peg$currPos);
      if (peg$r2.test(s5)) {
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e4); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseModulus();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f4(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        s5 = input.charAt(peg$currPos);
        if (peg$r2.test(s5)) {
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e4); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseModulus();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f4(s1, s5, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f5(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseModulus() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseNumber();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 37) {
        s5 = peg$c2;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e5); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseNumber();
        if (s7 !== peg$FAILED) {
          peg$savedPos = s3;
          s3 = peg$f6(s1, s5, s7);
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 37) {
          s5 = peg$c2;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e5); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseNumber();
          if (s7 !== peg$FAILED) {
            peg$savedPos = s3;
            s3 = peg$f6(s1, s5, s7);
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f7(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSentence() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parsePrint();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f8(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsePrint() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 18) === peg$c3) {
      s1 = peg$c3;
      peg$currPos += 18;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 40) {
        s3 = peg$c4;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e7); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        s5 = peg$parseExpressionPrint();
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          if (input.charCodeAt(peg$currPos) === 41) {
            s7 = peg$c5;
            peg$currPos++;
          } else {
            s7 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e8); }
          }
          if (s7 !== peg$FAILED) {
            s8 = peg$parse_();
            if (input.charCodeAt(peg$currPos) === 59) {
              s9 = peg$c6;
              peg$currPos++;
            } else {
              s9 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e9); }
            }
            if (s9 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f9(s5);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExpressionPrint() {
    var s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseOperations();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse_();
      if (input.charCodeAt(peg$currPos) === 44) {
        s5 = peg$c7;
        peg$currPos++;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e10); }
      }
      if (s5 !== peg$FAILED) {
        s6 = peg$parse_();
        s7 = peg$parseOperations();
        if (s7 !== peg$FAILED) {
          s4 = [s4, s5, s6, s7];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 44) {
          s5 = peg$c7;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e10); }
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parse_();
          s7 = peg$parseOperations();
          if (s7 !== peg$FAILED) {
            s4 = [s4, s5, s6, s7];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f10(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDataType() {
    var s0;

    s0 = peg$parseNumber();
    if (s0 === peg$FAILED) {
      s0 = peg$parseBoolean();
      if (s0 === peg$FAILED) {
        s0 = peg$parseString();
        if (s0 === peg$FAILED) {
          s0 = peg$parseChar();
          if (s0 === peg$FAILED) {
            s0 = peg$parseNull();
            if (s0 === peg$FAILED) {
              s0 = peg$parseGrouping();
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseGrouping() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 91) {
      s1 = peg$c8;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e11); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parse_();
      s3 = peg$parseOperations();
      if (s3 !== peg$FAILED) {
        s4 = peg$parse_();
        if (input.charCodeAt(peg$currPos) === 93) {
          s5 = peg$c9;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e12); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f11(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseNumber() {
    var s0;

    s0 = peg$parseFloat();
    if (s0 === peg$FAILED) {
      s0 = peg$parseInteger();
    }

    return s0;
  }

  function peg$parseInteger() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r3.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e13); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = input.charAt(peg$currPos);
        if (peg$r3.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e13); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f12();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseFloat() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = input.charAt(peg$currPos);
    if (peg$r3.test(s2)) {
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e13); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = input.charAt(peg$currPos);
        if (peg$r3.test(s2)) {
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e13); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s2 = peg$c10;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e14); }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = input.charAt(peg$currPos);
        if (peg$r3.test(s4)) {
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e13); }
        }
        if (s4 !== peg$FAILED) {
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = input.charAt(peg$currPos);
            if (peg$r3.test(s4)) {
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e13); }
            }
          }
        } else {
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f13();
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseBoolean() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c11) {
      s1 = peg$c11;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e15); }
    }
    if (s1 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c12) {
        s1 = peg$c12;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e16); }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f14();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseString() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c13;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e17); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r4.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e18); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r4.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e18); }
        }
      }
      if (input.charCodeAt(peg$currPos) === 34) {
        s3 = peg$c13;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e17); }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f15();
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseChar() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 39) {
      s1 = peg$c14;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e19); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r5.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e20); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r5.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e20); }
        }
      }
      if (input.charCodeAt(peg$currPos) === 39) {
        s3 = peg$c14;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e19); }
      }
      if (s3 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f16();
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseNull() {
    var s0, s1;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c15) {
      s1 = peg$c15;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e21); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f17();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseId() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = input.charAt(peg$currPos);
    if (peg$r6.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e22); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r7.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e23); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r7.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e23); }
        }
      }
      peg$savedPos = s0;
      s0 = peg$f18();
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parse_() {
    var s0, s1;

    s0 = [];
    s1 = input.charAt(peg$currPos);
    if (peg$r8.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e24); }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = input.charAt(peg$currPos);
      if (peg$r8.test(s1)) {
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e24); }
      }
    }

    return s0;
  }


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

  peg$result = peg$startRuleFunction();

  if (options.peg$library) {
    return /** @type {any} */ ({
      peg$result,
      peg$currPos,
      peg$FAILED,
      peg$maxFailExpected,
      peg$maxFailPos
    });
  }
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

const peg$allowedStartRules = [
  "Text"
];

export {
  peg$allowedStartRules as StartRules,
  peg$SyntaxError as SyntaxError,
  peg$parse as parse
};
