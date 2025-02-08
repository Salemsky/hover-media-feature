interface CSSObject {
  [K: string]: CSSObject | string | number | false | null | undefined;
}

type Ctx<h extends string, n extends string> = {
  hover: h;
  none: n;
  not?: string | undefined;
} extends infer u
  ? u
  : never;

type Modes<h extends string, n extends string> = keyof Omit<
  h extends ''
    ? Omit<Ctx<h, n>, 'hover'>
    : n extends ''
      ? Omit<Ctx<h, n>, 'none'>
      : Ctx<h, n>,
  'not'
>;

type Mode<h extends string, n extends string> = '' extends h | n
  ? Modes<h, n>
  : Modes<h, n> | Array<Modes<h, n>>;

type Fn<hover extends string, none extends string> = {
  (mode: Mode<hover, none>, obj: CSSObject): string;
  (
    mode: Mode<hover, none>,
    selector: Mode<hover, none> extends string
      ? string
      : string | Array<string>,
    obj: CSSObject,
  ): string;
};

declare const hoverMediaFeature: {
  bind<hover extends string, none extends string>(
    ctx: Ctx<hover, none>,
  ): Fn<hover, none>;
};

export { CSSObject, Fn, hoverMediaFeature };

