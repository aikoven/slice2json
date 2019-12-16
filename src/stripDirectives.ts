import {readFileSync} from 'fs';
import * as path from 'path';
import {grammar, Node, Semantics, Grammar} from 'ohm-js';

/**
 * @internal
 */
export function stripDirectives(source: string): string {
  const {grammar, semantics} = getGrammarAndSemantics();

  const res = grammar.match(source);
  if (res.failed()) {
    throw new Error(`Failed to strip directives:\n${res.message}`);
  }

  const items = semantics(res).strip();

  let result = '';

  let lastIndex = 0;

  for (const item of items) {
    if (item == null) {
      continue;
    }
    result += fillWithWhitespace(source.slice(lastIndex, item.startIdx));
    result += item.result;
    lastIndex = item.endIdx;
  }

  result += fillWithWhitespace(source.slice(lastIndex));

  return result;
}

function fillWithWhitespace(str: string) {
  return str.replace(/[^\n]/g, ' ');
}

let grammarAndSemantics: {grammar: Grammar; semantics: Semantics} | undefined;

function getGrammarAndSemantics() {
  if (grammarAndSemantics != null) {
    return grammarAndSemantics;
  }

  const directivesGrammar = grammar(
    readFileSync(path.join(__dirname, 'directives.ohm'), 'utf-8'),
  );

  const stripSemantics = directivesGrammar
    .createSemantics()
    .addOperation('strip', {
      Source(t1) {
        const result = [];

        for (const item of t1.strip()) {
          if (item == null) {
            continue;
          }

          if (Array.isArray(item)) {
            result.push(...item);
          } else {
            result.push(item);
          }
        }

        return result;
      },
      Code(this: Node, t1) {
        const {startIdx, endIdx} = this.source;
        return {
          result: this.sourceString,
          startIdx,
          endIdx,
        };
      },
      Ifdef(t1, t2, t3, t4) {
        return null;
      },
      If(t1, condition, code, t4) {
        if (condition.sourceString.startsWith('!defined')) {
          return code.strip();
        }
        return null;
      },
      Ifndef(t1, t2, code, t4) {
        return code.strip();
      },
    });

  return (grammarAndSemantics = {
    grammar: directivesGrammar,
    semantics: stripSemantics,
  });
}
