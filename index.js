const {
  parseStackTrace,
  printStackTrace
} = require('superror');
const highlight = require('./highlight');
const { readFile } = require('fs').promises;

const call = p =>
  p.then(r => [null, r], e => [e]);

const { NODE_ENV = 'development' } = process.env;

module.exports = async (req, res, next) => {
  const year = new Date().getFullYear();
  const handleError = async err => {
    if (err instanceof Error) {
      const [stack] = parseStackTrace(err.stack);
      const { location, line, column } = stack;
      console.error(err.name, err.message, `at ${location}:${line}:${column}`);
      const [ferr, code] = await call(readFile(location, 'utf8'));
      if (!ferr) {
        const output = printStackTrace(code, line, column);
        console.error(highlight(output));
      }
    }
    if (res.statusCode / 100 | 0 != 5) {
      res.statusCode = 500;
    }
    res.writeHead(res.statusCode, {
      'Content-Type': 'text/html'
    });
    res.write('<h2>Server Internal Error</h2>');
    if (NODE_ENV === 'development')
      res.write(`<pre>${err.stack}</pre>`);
    res.write('<hr />');
    res.write(`Powered by <a href="https://github.com/kelpjs/kelp-error" >kelp-error</a> &copy; ` + year);
    res.end();
  };
  try {
    await next();
  } catch (err) {
    handleError(err);
  }
}