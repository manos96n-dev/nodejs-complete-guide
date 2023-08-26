import { Router } from 'https://deno.land/x/oak@v12.6.0/mod.ts';

const router = new Router();

interface Todo {
  id: string;
  text: string;
}

type Response = {
  text: string;
};

let todos: Todo[] = [];

router.get('/todos', (ctx) => {
  ctx.response.body = { todos: todos }; // Transforms the data automatically in json format
});

router.post('/todos', async (ctx) => {
  const data = await ctx.request.body().value;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: data.text,
  };

  todos.push(newTodo);

  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
  const todoId = ctx.params.todoId;
  const data = await ctx.request.body().value;

  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  todos[todoIndex] = { id: todos[todoIndex].id, text: data.text };

  ctx.response.body = { message: 'Updated todo!' };
});

router.delete('/todos/:todoId', (ctx) => {
  const todoId = ctx.params.todoId;

  todos = todos.filter((todo) => todo.id !== todoId);

  ctx.response.body = { message: 'Deleted todo!' };
});

export default router;
