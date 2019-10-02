import {readFileSync} from 'fs';
import {grammar, Node} from 'ohm-js';

const directivesGrammar = grammar(
  readFileSync(require.resolve('./directives.ohm'), 'utf-8'),
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

/**
 * @internal
 */
export function stripDirectives(source: string): string {
  const res = directivesGrammar.match(source);
  if (res.failed()) {
    throw new Error(`Failed to strip directives:\n${res.message}`);
  }

  const items = stripSemantics(res).strip();

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
