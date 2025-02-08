# hover-media-feature

> CSS-in-JS utility (384b) for media queries based on device capabilities.

## Install

```
$ npm install --save hover-media-feature
```

## Usage

Default selectors:

* hover → '&:hover'
* none → '&:active'

```js
import { hoverMediaFeature } from 'hover-media-feature';

const hmf = hoverMediaFeature.bind({
  hover: '@media (hover:hover) and (pointer:fine)',
  none: '@media (hover:none) and (pointer:coarse)',
  not: ':not([disabled]):not([data-disabled])',
});

hmf('hover', { zIndex: 0, '.child': { color: 'red' } });
hmf('hover', '.selector:focus', {}),
hmf(['hover', 'none'], {}),
hmf(['hover', 'none'], '&:hover, &:active', {}),
hmf(['hover', 'none'], ['&:focus'], {}),
hmf(['hover', 'none'], ['&:hover', '&:focus'], {}),
```

To improve type safety, you can extend CSSObject in a declaration file.

```js
type CSSProperties = import('csstype').Properties;

declare module 'hover-media-feature' {
  export interface CSSObject extends CSSProperties {}
};
```
