import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { posts } from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

async function seed() {
  console.log('Seeding data...');
  await db.insert(posts).values([
    {
      title: '웹문서에 최적화된 독특한 HTML 태그 10가지',
      content: 'figure & figcaption 태그 이 태그들은 이미지, 동영상 과 같은 멀티미디어 콘텐츠의 캡션 및 기타 메타데이터를 추가하는데 사용됩니다.',
      category: 'HTML',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop',
      author: '인파_',
      commentCount: 8,
    },
    {
      title: '스크립트 없이 구현 가능한 독특한 HTML 태그 9가지',
      content: '이번 포스팅은 HTML5를 배우는데 있어 접하지 못한 독특한 엘리먼트들을 소개해 보는 시간을 가져볼 것이다.',
      category: 'HTML',
      thumbnailUrl: 'https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?q=80&w=600&auto=format&fit=crop',
      author: '인파_',
      commentCount: 5,
    },
    {
      title: '에밋(Emmet) 문법 모음 - 한눈에 정리',
      content: 'Emmet (에밋) 에밋은 HTML, XML, XSL 문서 등을 편집할 때 빠른 코딩을 위해 사용하는 플러그인이다.',
      category: 'HTML',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop',
      author: '인파_',
      commentCount: 15,
    },
    {
      title: 'HTML META TAGS 정리',
      content: '메타 태그는 웹페이지의 보이지 않는 정보를 제공하는데 사용됩니다.',
      category: 'HTML',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=600&auto=format&fit=crop',
      author: '인파_',
      commentCount: 2,
    }
  ]);
  console.log('Seeding complete!');
}

seed().catch(console.error);
