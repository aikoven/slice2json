import * as fs from 'fs';
import {sync} from 'glob';
import {parse} from './slice';

const sliceDir = 'node_modules/slice2js/ice/slice';

describe('Built-in slices', () => {
  const slices = sync('**/*.ice', {
    cwd: sliceDir,
  });

  for (const slicePath of slices) {
    test(slicePath, () => {
      const slice = fs.readFileSync(`${sliceDir}/${slicePath}`, 'utf-8');
      expect(parse(slice)).toMatchSnapshot();
    });
  }
});
