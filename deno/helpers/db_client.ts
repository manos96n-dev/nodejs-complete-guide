import {
  Database,
  MongoClient,
} from 'https://deno.land/x/mongo@v0.31.2/mod.ts';

let db: Database;

export async function connect() {
  const client = new MongoClient();

  // Connect using srv url
  await client.connect(
    'mongodb+srv://manos96n:manol123@cluster0.sg2hi.mongodb.net/?authMechanism=SCRAM-SHA-1'
  );

  db = client.database('todos');
}

export function getDb() {
  return db;
}
