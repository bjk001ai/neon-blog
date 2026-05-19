import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { posts } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function clear() {
  console.log('Clearing all posts...');
  await db.delete(posts);
  console.log('Cleared!');
}
clear();
