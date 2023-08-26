import { Router } from 'https://deno.land/x/oak@v12.6.0/mod.ts';
import { ObjectId } from 'https://deno.land/x/mongo@v0.31.2/mod.ts';

import { getDb } from '../helpers/db_client.ts';

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

interface TodoSchema {
  _id: ObjectId;
  text: string;
}

type Response = {
  text: string;
};

let todos: Todo[] = [];

router.get('/todos', async (ctx) => {
  const todos = getDb().collection<TodoSchema>('todos');

  const allTodos = await todos.find().toArray();

  const transformedTodos = allTodos.map((todo) => {
    return { id: todo._id.toString(), text: todo.text };
  });

  ctx.response.body = { todos: transformedTodos }; // Transforms the data automatically in json format
});

router.post('/todos', async (ctx) => {
  const data = await ctx.request.body().value;

  const newTodo: Todo = {
    text: data.text,
  };

  const id = await getDb().collection<TodoSchema>('todos').insertOne(newTodo);

  newTodo.id = id.toString();

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
