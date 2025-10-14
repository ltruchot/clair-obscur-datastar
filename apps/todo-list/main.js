import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';

createServer(async (req, res) => {
  try {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = join('./assets', url);
    const content = readFileSync(filePath);
    if (url.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end();
  }
}).listen(668);
