import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { posts } from './schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function updateData() {
  console.log('Updating author names...');
  await db.update(posts)
    .set({ author: 'jk' })
    .where(eq(posts.author, '인파_'));
  
  console.log('Update complete!');
}

updateData().catch(console.error);
