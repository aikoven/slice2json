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
#if !defined(kek)
d
#endif
suffix
`;

const expected =
  '\n' +
  'prefix\n' +
  '           \n' +
  'a\n' +
  '            \n' +
  ' \n' +
  '      \n' +
  'c\n' +
  '      \n' +
  '                 \n' +
  'd\n' +
  '      \n' +
  'suffix\n';

test('stripDirectives', () => {
  expect(stripDirectives('')).toEqual('');

  expect(stripDirectives(source)).toEqual(expected);
});
