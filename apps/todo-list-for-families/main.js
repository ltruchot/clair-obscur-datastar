import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/node';
import leoProfanity from 'leo-profanity';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { text } from 'node:stream/consumers';
import xss from 'xss';
import { TodoEventStore } from './todos-event-store.js';

leoProfanity.loadDictionary('en');
leoProfanity.add(leoProfanity.getDictionary('fr'));

const todoEventStore = new TodoEventStore();
const activeStreams = new Set();

let secondsLeft = 3600;
setInterval(() => {
  secondsLeft--;
  if (secondsLeft <= -1) {
    secondsLeft = 3600;
    todoEventStore.write('todos', []);

    for (const stream of activeStreams) {
      stream.patchSignals(`{ "secondsLeft": { "value": ${secondsLeft}, "timestamp": "${new Date().toISOString()}" } }`);
    }
  }
}, 1000);

createServer(async (req, res) => {
  // CONTINUOUS QUERY, will be triggered by commands
  if (req.url.startsWith('/subscribe-to-events')) {
    let currentStream = null;
    let unsubscribeStore = null;
    ServerSentEventGenerator.stream(
      req,
      res,
      (stream) => {
        currentStream = stream;
        activeStreams.add(currentStream);

        // INITIAL STATE
        const todos = todoEventStore.read().todos;
        currentStream.patchSignals(
          `{ "todos": ${JSON.stringify(todos)}, "secondsLeft": { "value": ${secondsLeft}, "timestamp": "${new Date().toISOString()}" } }`,
        );

        // SUBSCRIBE TO EVENTS
        todoEventStore.subscribe((state) => {
          currentStream.patchSignals(`{ "todos": ${JSON.stringify(state.todos)} }`);
        });
      },
      {
        keepalive: true,
        onClose: () => {
          if (currentStream) {
            activeStreams.delete(currentStream);
          }
          unsubscribeStore?.();
        },
        onError: () => {
          if (currentStream) {
            activeStreams.delete(currentStream);
          }
          unsubscribeStore?.();
        },
      },
    );

    // ONE SHOT ADD COMMAND, will trigger query update
  } else if (req.url.startsWith('/add-todo')) {
    const signals = JSON.parse(xss(await text(req)));
    const todo = signals.todo;
    const validatedTodo = todo.slice(0, 80);
    const sanitizedTodoItem = { id: randomUUID(), label: leoProfanity.clean(validatedTodo, '*', 1), checked: false };
    todoEventStore.write('todos', [sanitizedTodoItem, ...todoEventStore.read().todos]);
    res.writeHead(202);
    res.end();

    // ONE SHOT UPDATE COMMAND, will trigger query update
  } else if (req.url.startsWith('/update-todo')) {
    const signals = JSON.parse(xss(await text(req)));
    const updatedTodo = signals.updatedTodo;
    const sanitizedUpdatedTodo = {
      id: updatedTodo.id,
      label: leoProfanity.clean(updatedTodo.label, '*', 1),
      checked: updatedTodo.checked,
    };
    todoEventStore.write(
      'todos',
      todoEventStore.read().todos.map((todo) => (todo.id === sanitizedUpdatedTodo.id ? sanitizedUpdatedTodo : todo)),
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
      } else if (url.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (url.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end();
    }
  }
}).listen(669);
