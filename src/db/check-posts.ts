import { config } from 'dotenv';
import { db } from './index';
import { posts } from './schema';
import { CATEGORIES, CategoryNode } from '../lib/categories';

config();

function getLeafCategoryNames(nodes: CategoryNode[]): string[] {
  const list: string[] = [];
  for (const node of nodes) {
    if (!node.children || node.children.length === 0) {
      list.push(node.name);
    } else {
      list.push(...getLeafCategoryNames(node.children));
    }
  }
  return list;
}

async function check() {
  const allPosts = await db.select().from(posts);
  const leafNames = getLeafCategoryNames(CATEGORIES);
  const leafSet = new Set(leafNames);
  
  console.log('--- DB Category Mismatch Check ---');
  let mismatchCount = 0;
  
  allPosts.forEach(p => {
    if (!leafSet.has(p.category)) {
      console.log(`⚠️ MISMATCH: Post ID ${p.id} ("${p.title}") has category "${p.category}" which is NOT in categories.ts leaf nodes!`);
      mismatchCount++;
      
      // Let's also check if it's a spacing/casing issue
      const matchedClose = leafNames.find(name => name.trim().toLowerCase() === p.category.trim().toLowerCase());
      if (matchedClose) {
        console.log(`   💡 Close match found in categories.ts: "${matchedClose}" (Casing/Spacing difference)`);
      }
    }
  });
  console.log(`Total mismatching categories: ${mismatchCount}\n`);

  console.log('--- Category Post Counts ---');
  const countsMap: Record<string, number> = {};
  leafNames.forEach(name => {
    countsMap[name] = 0;
  });
  allPosts.forEach(p => {
    if (leafSet.has(p.category)) {
      countsMap[p.category]++;
    }
  });

  const zeroPostCategories: string[] = [];
  leafNames.forEach(name => {
    console.log(`- ${name}: ${countsMap[name]} posts`);
    if (countsMap[name] === 0) {
      zeroPostCategories.push(name);
    }
  });

  console.log(`\nTotal Leaf Categories: ${leafNames.length}`);
  console.log(`Categories with 0 posts: ${zeroPostCategories.length}`);
  if (zeroPostCategories.length > 0) {
    console.log(`⚠️ 0-Post Categories: [${zeroPostCategories.join(', ')}]`);
  }

  console.log('\n--- Thumbnail Validation & Unique Domains ---');
  let brokenThumbnails = 0;
  const uniqueDomains = new Set<string>();
  const distinctUrls = new Set<string>();
  
  allPosts.forEach((p) => {
    const thumb = p.thumbnailUrl;
    if (thumb) {
      distinctUrls.add(thumb);
      try {
        const urlObj = new URL(thumb);
        uniqueDomains.add(urlObj.hostname);
      } catch (e) {
        uniqueDomains.add('INVALID_URL: ' + thumb);
      }
    } else {
      uniqueDomains.add('NULL_OR_EMPTY');
    }
  });
  
  console.log('\nUnique Thumbnail Domains in DB:');
  uniqueDomains.forEach(dom => {
    console.log(`- ${dom}`);
  });

  console.log(`\nValidating ${distinctUrls.size} distinct thumbnail URLs via HTTP fetch...`);
  const urlArray = Array.from(distinctUrls);
  const brokenUrls = new Set<string>();
  
  for (const url of urlArray) {
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.status >= 400) {
        console.log(`❌ FETCH FAILED: ${url} returned status ${res.status}`);
        brokenUrls.add(url);
      } else {
        console.log(`✅ FETCH SUCCESS: ${url} returned status ${res.status}`);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.log(`❌ FETCH ERROR: ${url} failed with error: ${errMsg}`);
      brokenUrls.add(url);
    }
  }

  allPosts.forEach((p) => {
    const thumb = p.thumbnailUrl;
    let isBroken = false;
    if (!thumb || brokenUrls.has(thumb)) {
      isBroken = true;
    } else {
      const isExternal = thumb.startsWith('http://') || thumb.startsWith('https://');
      const isHotlinkBlocked = thumb.includes('daumcdn.net') || thumb.includes('kakaocdn.net') || thumb.includes('tistory.com');
      if (!isExternal || isHotlinkBlocked) {
        isBroken = true;
      }
    }

    if (isBroken) {
      console.log(`❌ BROKEN THUMBNAIL: Post ID ${p.id} ("${p.title}") has thumbnail "${thumb}"`);
      brokenThumbnails++;
    }
  });

  console.log(`\nTotal posts with broken or missing thumbnails: ${brokenThumbnails}`);

  process.exit(0);
}

check().catch(console.error);
