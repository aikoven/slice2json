import {Node} from 'ohm-js';

/**
 * @internal
 */
declare module 'ohm-js' {
  interface Interval {
    sourceString: string;
  }
}

function reverseString(str: string) {
  return str.split('').reverse().join('');
}

/**
 * @internal
 */
export function findDocString(node: Node) {
  const {sourceString, startIdx} = node.source;

  const previous = sourceString.slice(0, startIdx);

  // reverse string to find last comment using non-greedy match
  const prevReversed = reverseString(previous);

  const match = prevReversed.match(/^\s*\/\*\*?\s*\n([^]*?)\n\s*\*\*\//);

  if (match == null) {
    return undefined;
  }

  const lines = reverseString(match[1]).split('\n');

  // find longest common prefix consisting of spaces and at most one asterisk
  let i = 0;
  let seenAsterisk = false;

  while (true) {
    const symbols = lines.map(line => line[i]);

    if (symbols.every(symbol => symbol == null)) {
      break;
    }
    if (symbols.every(symbol => symbol === ' ' || symbol == null)) {
      i += 1;
      continue;
    }

    if (!seenAsterisk && symbols.every(symbol => symbol === '*')) {
      seenAsterisk = true;
      i += 1;
      continue;
    }

    break;
  }

  const trimmedLines = lines.map(line => line.substring(i));

  return trimmedLines.join('\n').trim();
}
