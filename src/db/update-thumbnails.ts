import { config } from 'dotenv';
import { db } from './index';
import { posts } from './schema';
import { eq } from 'drizzle-orm';

config();

const thumbnailMap: Record<string, string> = {
  '마크다운(Markdown) 문법 완벽 가이드': 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop', // code
  'Sass (SCSS) 핵심 문법 및 활용법': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop', // design/colors
  'TypeScript 기초부터 실전까지': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop', // coding
  'Docker 컨테이너와 Docker Compose': 'https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=800&auto=format&fit=crop', // shipping containers
  'Node.js 이벤트 루프와 비동기 처리': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop', // matrix code
  'React 훅(Hooks)과 최적화 기법': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop', // react logo
  'Nest.js 아키텍처와 의존성 주입(DI)': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop', // circuit
  'Next.js App Router 아키텍처 핵심': 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop', // architecture
  '협업을 위한 Git 브랜치 전략': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=800&auto=format&fit=crop', // team/github
  'Redis: 인메모리 캐시 시스템 완벽 이해': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop', // database/servers
  'CI/CD 기초와 GitHub Actions 파이프라인': 'https://images.unsplash.com/photo-1618335824172-8d7d967e88de?q=80&w=800&auto=format&fit=crop', // pipeline/automation
  'VSCode 200% 활용법 (플러그인 & 단축키)': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop', // editor/screen
};

async function updateThumbnails() {
  console.log('Updating thumbnails...');
  try {
    const allPosts = await db.select().from(posts);
    for (const post of allPosts) {
      if (thumbnailMap[post.title]) {
        await db.update(posts)
          .set({ thumbnailUrl: thumbnailMap[post.title] })
          .where(eq(posts.id, post.id));
        console.log("Updated: " + post.title);
      }
    }
    console.log('✅ Thumbnails updated successfully!');
  } catch (error) {
    console.error('❌ Error during updating:', error);
  } finally {
    process.exit(0);
  }
}

updateThumbnails();
