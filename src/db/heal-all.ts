import { config } from 'dotenv';
import { db } from './index';
import { posts } from './schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

config();

const replacements = [
  {
    oldId: '1580927751497-88d87aa6f95d',
    newId: '1517694712202-14dd9538aa97'
  },
  {
    oldId: '1516116211223-5c359a36298a',
    newId: '1504639725590-34d0984388bd'
  },
  {
    oldId: '1607799279861-4dddf96574f8',
    newId: '1555066931-4365d14bab8c'
  },
  {
    oldId: '1677442136019-21780efad99a',
    newId: '1526374965328-7f61d4dc18c5'
  }
];

async function healCodebase() {
  console.log('--- 1. Healing Codebase Seed Files ---');
  const dbDir = __dirname;
  const files = fs.readdirSync(dbDir);
  
  for (const file of files) {
    if (file.endsWith('.ts') && file !== 'heal-all.ts') {
      const filePath = path.join(dbDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let replaced = false;
      
      for (const rep of replacements) {
        if (content.includes(rep.oldId)) {
          // Replace all occurrences of oldId with newId
          content = content.split(rep.oldId).join(rep.newId);
          replaced = true;
          console.log(`  -> Replaced ${rep.oldId} with ${rep.newId} in ${file}`);
        }
      }
      
      if (replaced) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Wrote healed content to ${file}`);
      }
    }
  }
}

async function healDatabase() {
  console.log('--- 2. Healing Database Records ---');
  try {
    const allPosts = await db.select().from(posts);
    let healedCount = 0;
    
    for (const post of allPosts) {
      if (!post.thumbnailUrl) continue;
      
      let currentUrl = post.thumbnailUrl;
      let needsUpdate = false;
      
      for (const rep of replacements) {
        if (currentUrl.includes(rep.oldId)) {
          currentUrl = currentUrl.split(rep.oldId).join(rep.newId);
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        await db.update(posts)
          .set({ thumbnailUrl: currentUrl })
          .where(eq(posts.id, post.id));
        
        console.log(`  ✅ Healed DB Post ID ${post.id} ("${post.title}") -> ${currentUrl}`);
        healedCount++;
      }
    }
    
    console.log(`\n🎉 Completed Database Healing: ${healedCount} records successfully updated!`);
  } catch (error) {
    console.error('❌ Error during database healing:', error);
  }
}

async function main() {
  await healCodebase();
  await healDatabase();
  process.exit(0);
}

main().catch(console.error);
