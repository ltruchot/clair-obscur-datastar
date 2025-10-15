import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/node';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { text } from 'node:stream/consumers';
import { TodoEventStore } from './todos-event-store.js';

const todoEventStore = new TodoEventStore();

createServer(async (req, res) => {
  // CONTINUOUS QUERY, will be triggered by commands
  if (req.url.startsWith('/subscribe-to-events')) {
    ServerSentEventGenerator.stream(
      req,
      res,
      (stream) => {
        const todos = todoEventStore.read().todos;
        stream.patchSignals(`{ "todos": ${JSON.stringify(todos)} }`);

        todoEventStore.subscribe((state) => {
          stream.patchSignals(`{ "todos": ${JSON.stringify(state.todos)} }`);
        });
      },
      { keepalive: true },
    );

    // ONE SHOT COMMAND, will trigger query update
  } else if (req.url.startsWith('/add-todo')) {
    const signals = JSON.parse(await text(req));
    const todo = signals.todo;
    todoEventStore.write('todos', [...todoEventStore.read().todos, { label: todo, checked: false, id: randomUUID() }]);
    res.writeHead(202);
    res.end();

    // THATS IT, LOL
  } else {
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
  }
}).listen(669);
