import 'dotenv/config';
import * as cheerio from 'cheerio';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { posts } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function scrape() {
  console.log('Scraping https://inpa.tistory.com/890 ...');
  try {
    // Adding headers to prevent blocking
    const res = await fetch('https://inpa.tistory.com/890', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('.title_post').text().trim() || $('title').text().replace(' - 인파_', '').trim() || '타입스크립트 Generic 타입 💯 총정리';
    
    const contentNode = $('.tt_article_useless_p_margin').length ? $('.tt_article_useless_p_margin') : $('.entry-content');
    
    // Clean up unnecessary scripts/iframes
    contentNode.find('script, iframe, .adsense, .revenue_unit_wrap').remove();
    
    const contentHtml = contentNode.html();
    
    if (!contentHtml) {
      console.error('Could not find content. Check selectors.');
      return;
    }

    const thumbnailUrl = $('meta[property="og:image"]').attr('content') || null;

    console.log(`Found post: ${title}`);
    console.log('Inserting into DB...');

    await db.insert(posts).values({
      title,
      content: contentHtml, // Store HTML
      category: 'TypeScript',
      thumbnailUrl,
      author: 'jk',
      commentCount: 7,
    });

    console.log('Successfully scraped and inserted!');
  } catch (error) {
    console.error('Scraping failed:', error);
  }
}

scrape();
