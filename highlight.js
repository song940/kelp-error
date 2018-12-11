const highlight = (src, theme) => {
  theme = theme || {
    'const'   : 35,
    'throw'   : 35,
    'return'  : 35,
    'var'     : 35,
    'new'     : 35,
    'if'      : 35,
    'else'    : 35,
    '='       : 33,
    'true'    : 32,
    'false'   : 31,
    'console' : 36,
    'function': 36,
    'Object'  : 32,
    'Number'  : 32,
    'String'  : 32,
    'Array'   : 32,
    'Error'   : 32,
  };
  const color = (str, c) => "\x1b[" + c + "m" + str + "\x1b[0m";
  Object.keys(theme).forEach((keyword, i) => {
    src = src.replace(new RegExp(keyword, 'g'), m => {
      return color(m, theme[keyword]);
    });
  });
  return src;
}

module.exports = highlight;