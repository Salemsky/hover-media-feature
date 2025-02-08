import { strictEqual } from 'node:assert';
import { describe, test } from 'node:test';

import { hoverMediaFeature } from './index.mjs';

/**
 * @template {string} t1
 * @template {string} t2
 * @template {import('.').Fn<t1, t2>} Fn
 * @overload
 * @param {Parameters<typeof hoverMediaFeature.bind<t1, t2>>[0]} ctx
 * @param {Parameters<Fn>[0]} mod
 * @param {Parameters<Fn>[2]} obj
 * @returns {string}
 */
/**
 * @template {string} t1
 * @template {string} t2
 * @template {import('.').Fn<t1, t2>} Fn
 * @overload
 * @param {Parameters<typeof hoverMediaFeature.bind<t1, t2>>[0]} ctx
 * @param {Parameters<Fn>[0]} mod
 * @param {Parameters<Fn>[1]} sel
 * @param {Parameters<Fn>[2]} obj
 * @returns {string}
 */
/**
 * @template {string} hover
 * @template {string} none
 * @template {import('.').Fn<hover, none>} Fn
 * @param {Parameters<typeof hoverMediaFeature.bind<hover, none>>[0]} ctx
 * @param {[Parameters<Fn>[0], Parameters<Fn>[1], Parameters<Fn>[2]]} args
 * @returns {string}
 */
const hmf = (ctx, ...args) => hoverMediaFeature.bind(ctx)(...args);

describe('hoverMediaFeature', () => {
  test('single mode, default selector', () => {
    strictEqual(
      hmf({ hover: 'a', none: 'b' }, 'hover', {}),
      'a{&:hover{}}',
    );
  });
  test('single mode, selector', () => {
    strictEqual(
      hmf({ hover: 'a', none: 'b' }, 'hover', 's:hover,&:active', {}),
      'a{s:hover,&:active{}}',
    );
  });
  test('array of mode (hover), default selectors', () => {
    strictEqual(
      hmf({ hover: 'a', none: 'b' }, ['hover', 'none'], {}),
      'a{&:hover{}}b{&:active{}}',
    );
  });
  test('array of mode (none), default selectors', () => {
    strictEqual(
      hmf({ hover: 'a', none: 'b' }, ['none', 'hover'], {}),
      'b{&:active{}}a{&:hover{}}',
    );
  });
  test('array of mode (hover), selector', () => {
    strictEqual(
      hmf({ hover: 'a', none: 'b' }, ['hover', 'none'], 's:focus', {}),
      'a{s:focus{}}b{&:active{}}',
    );
  });
  test('array of mode (none), selector', () => {
    strictEqual(
      hmf({ hover: 'a', none: 'b' }, ['none', 'hover'], 's:focus', {}),
      'b{s:focus{}}a{&:hover{}}',
    );
  });
  test('array of mode, array of single selector', () => {
    strictEqual(
      hmf({ hover: 'a', none: 'b' }, ['hover', 'none'], ['s:focus'], {}),
      'a{s:focus{}}b{s:focus{}}',
    );
  });
  test('array of mode, array of multiple selectors', () => {
    strictEqual(
      hmf(
        { hover: 'a', none: 'b' },
        ['hover', 'none'],
        ['s:hover, s:active', 's:active, s:focus'],
        {},
      ),
    	'a{s:hover, s:active{}}b{s:active, s:focus{}}',
    );
  });
  test('object', () => {
    const obj = /** @type {const} */ ({
      a: false,
      b: null,
      c: undefined,
      d: '',
      eE: 0,
      f: 'f',
    });
    strictEqual(
      hmf({ hover: 'a', none: '' }, 'hover', { ...obj, s: { ...obj } }),
      'a{&:hover{e-e:0;f:f;s{e-e:0;f:f;}}}',
    );
  });
  test('not', () => {
    strictEqual(
      hmf(
        { hover: 'a', none: '', not: ':n' },
        'hover',
        '&:link,&:focus-within',
        {},
      ),
      'a{&:link,&:n:focus-within{}}',
    );
  });
});
