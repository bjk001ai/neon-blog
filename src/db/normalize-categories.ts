import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { posts } from './schema';
import { eq } from 'drizzle-orm';
import { CATEGORIES, getLeafCategories } from '../lib/categories';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const leafNames: string[] = [];
CATEGORIES.forEach(c => leafNames.push(...getLeafCategories(c.name)));

async function normalize() {
  const allPosts = await db.select().from(posts);
  for (const post of allPosts) {
    const rawCat = post.category.toLowerCase();
    
    let matchedCat = '기타';
    
    if (rawCat.includes('javascript') || rawCat.includes('js')) matchedCat = 'JavaScript';
    else if (rawCat.includes('css')) matchedCat = 'CSS';
    else if (rawCat.includes('html')) matchedCat = 'HTML';
    else if (rawCat.includes('window') || rawCat.includes('os')) matchedCat = 'Linux';
    else if (rawCat.includes('cs') || rawCat.includes('thread') || rawCat.includes('동기')) matchedCat = 'Java';
    else if (rawCat.includes('purgecss')) matchedCat = 'CSS';
    else if (rawCat.includes('cypress')) matchedCat = 'JavaScript';
    else {
      for (const leaf of leafNames) {
        if (rawCat.includes(leaf.toLowerCase())) {
          matchedCat = leaf;
          break;
        }
      }
    }
    
    await db.update(posts)
      .set({ category: matchedCat })
      .where(eq(posts.id, post.id));
      
    console.log(`Updated [${post.title.slice(0,20)}] : ${post.category} -> ${matchedCat}`);
  }
  console.log('Normalization complete!');
}

normalize().catch(console.error);
