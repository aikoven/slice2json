import {readFileSync} from 'fs';
import {grammar, Node} from 'ohm-js';

const directivesGrammar = grammar(
  readFileSync(require.resolve('./directives.ohm'), 'utf-8'),
);

const stripSemantics = directivesGrammar
  .createSemantics()
  .addOperation('strip', {
    Source(t1) {
      return t1
        .strip()
        .filter((t: string) => t)
        .join('\n');
    },
    Code(this: Node, t1) {
      return this.sourceString;
    },
    Ifdef(t1, t2, t3, t4) {
      return '';
    },
    If(t1, condition, code, t4) {
      if (condition.sourceString.startsWith('!defined')) {
        return code.strip();
      }
      return '';
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

  return stripSemantics(res).strip();
}
