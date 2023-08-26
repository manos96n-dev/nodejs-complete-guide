Deno.serve(
  { port: 3000, hostname: '0.0.0.0' },
  (_req) => new Response('Hello, world')
);
