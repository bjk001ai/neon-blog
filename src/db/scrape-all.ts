import 'dotenv/config';
import * as cheerio from 'cheerio';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { posts } from './schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

async function scrapePost(url: string, category: string) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('.title_post').text().trim() || $('title').text().replace(' - 인파_', '').trim();
    if (!title) return null;
    
    const contentNode = $('.tt_article_useless_p_margin').length ? $('.tt_article_useless_p_margin') : $('.entry-content');
    contentNode.find('script, iframe, .adsense, .revenue_unit_wrap').remove();
    
    const contentHtml = contentNode.html();
    if (!contentHtml) return null;

    const thumbnailUrl = $('meta[property="og:image"]').attr('content') || 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop';
    
    return {
      title,
      content: contentHtml,
      category: category,
      thumbnailUrl,
      author: 'jk',
      commentCount: Math.floor(Math.random() * 50),
    };
  } catch (error) {
    console.error(`Failed to scrape ${url}`, error);
    return null;
  }
}

async function run() {
  console.log('Fetching RSS feed...');
  const res = await fetch('https://inpa.tistory.com/rss', { headers: HEADERS });
  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const postData: {url: string, category: string}[] = [];
  $('item').each((i, el) => {
    const link = $(el).find('link').text();
    const cat = $(el).find('category').text() || 'Develop';
    if (link) {
        postData.push({url: link, category: cat});
    }
  });

  const uniquePosts = postData.slice(0, 10); 
  console.log(`Found ${uniquePosts.length} posts to scrape.`);

  for (const item of uniquePosts) {
    console.log(`Scraping ${item.url} ...`);
    const data = await scrapePost(item.url, item.category);
    if (data) {
        const existing = await db.select().from(posts).where(eq(posts.title, data.title));
        if (existing.length === 0) {
            await db.insert(posts).values(data);
            console.log(`Inserted: ${data.title} (${data.category})`);
        } else {
            console.log(`Skipped existing: ${data.title}`);
        }
    }
  }
  console.log('Mass scraping complete!');
}

run().catch(console.error);
