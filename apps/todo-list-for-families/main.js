import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/node';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { text } from 'node:stream/consumers';
import xss from 'xss';
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

    // ONE SHOT ADD COMMAND, will trigger query update
  } else if (req.url.startsWith('/add-todo')) {
    const signals = JSON.parse(xss(await text(req)));
    const todo = signals.todo;
    todoEventStore.write('todos', [...todoEventStore.read().todos, { id: randomUUID(), label: todo, checked: false }]);
    res.writeHead(202);
    res.end();

    // ONE SHOT UPDATE COMMAND, will trigger query update
  } else if (req.url.startsWith('/update-todo')) {
    const signals = JSON.parse(xss(await text(req)));
    const updatedTodo = signals.updatedTodo;
    todoEventStore.write(
      'todos',
      todoEventStore.read().todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    );
    res.writeHead(202);
    res.end();
  } else if (req.url.startsWith('/clear')) {
    const signals = JSON.parse(await text(req));
    const shouldClearDoneOnly = signals.shouldClearDoneOnly;
    todoEventStore.write(
      'todos',
      shouldClearDoneOnly ? todoEventStore.read().todos.filter((todo) => !todo.checked) : [],
    );
    res.writeHead(202);
    res.end();
  } else {
    try {
      const url = req.url === '/' ? '/index.html' : req.url;
      const filePath = join('./assets', url);
      const content = readFileSync(filePath);
      if (url.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
      } else if (url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (url.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
      }
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end();
    }
  }
}).listen(669);
