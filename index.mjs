const block = (s, o) => {
  let res = s + '{';
  for (let k in o) {
    const v = o[k];
    if (v === false || v === null || v === undefined || v === '') {
      continue;
    } else if (typeof v !== 'object') {
      k = k.replace(/[A-Z]/g, '-$&').toLowerCase();
      res += k + ':' + v + ';';
    } else {
      res += block(k, v);
    }
  }
  res += '}';
  return res;
};

const not = (s, p) => {
  if (!p) return s;
  return s.replace(/(:visited|:hover|:active|:focus)/g, p + '$1');
};

export const hoverMediaFeature = function (mod, sel, obj) {
  let res = '';
  const h = '&:hover',
    a = '&:active';
  mod = Array.isArray(mod) ? mod : [mod];
  if (typeof sel === 'string') {
    sel = mod[0] === 'hover' ? [sel, a] : [sel, h];
  } else {
    obj = Array.isArray(sel) ? obj : sel;
    sel = Array.isArray(sel) ? sel : mod[0] === 'hover' ? [h, a] : [a, h];
  }
  for (let i = 0; i < mod.length; i++) {
    res += this[mod[i]]
      ? this[mod[i]] + '{' + block(not(sel[i] || sel[0], this.not), obj) + '}'
      : '';
  }
  return res;
};
