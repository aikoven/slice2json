import {stripDirectives} from './stripDirectives';

const source = `
prefix
#ifndef LOL
a
#ifdef _WTF_
b
#endif
c
#endif
suffix
`.trim();

const expected = `
prefix
a
c
suffix
`.trim();

test('stripDirectives', () => {
  expect(stripDirectives('')).toEqual('');

  expect(stripDirectives(source)).toEqual(expected);
});
