const fs = require('fs');
const {
  parseStackTrace,
  printStackTrace
} = require('superror');
const highlight = require('./highlight');

module.exports = async (req, res, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      const [stack] = parseStackTrace(err.stack);
      const { location, line, column } = stack;
      console.error(err.name, err.message, `at ${location}:${line}:${column}`);
      fs.readFile(location, 'utf8', (err, src) => {
        if (err) return err;
        console.error(highlight(printStackTrace(src, line, column)));
      });
    }
    if (res.statusCode / 100 | 0 != 5) {
      res.statusCode = 500;
    }
    res.writeHead(res.statusCode, {
      'Content-Type': 'text/html'
    });
    res.write('<h2>Server Internal Error</h2>');
    res.write(`<pre>${err.stack}</pre>`);
    res.write('<hr />');
    res.write(`Powered by <a href="https://github.com/song940/kelp-error" >kelp-error</a> &copy; ` + new Date().getFullYear());
    res.end();
  }
}