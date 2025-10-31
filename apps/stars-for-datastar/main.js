import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';

createServer(async (req, res) => {
  // GET HOME PAGE --> returns the HTML page
  if (req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(readFileSync('./index.html'));
    // GET ACTION PAGE --> returns the HTML page
  } else if (req.url === '/plugin') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(readFileSync('./plugin.html'));
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(665, () => {
  console.log('🚀 Stars for Datastar server running at http://localhost:665');
});
