# slice2json

Parser for the Slice language.

## Usage

```ts
import {readFileSync} from 'fs';
import {parse} from 'slice2json';

const contents = readFileSync('MySlice.ice', 'utf-8');
const result = parse(contents);
/*
  {
    "pragmaOnce": true,
    "includes": [...],
    "modules": {
      "type": "module",
      "name": "MyModule",
      "content": [...]
    }
  }
*/
```

See [`types.ts`](/src/types.ts) for the schema of returned object.