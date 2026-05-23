import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import PostCard from "@/components/PostCard";

import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import Link from "next/link";

// Cache the latest 3 posts query for 5 minutes (300 seconds)
const getCachedLatestPosts = unstable_cache(
  async () => {
    return await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(3);
  },
  ["latest-posts"],
  { revalidate: 300, tags: ["posts"] }
);

export default async function Home() {
  return (
    <div className="animate-in fade-in duration-700 space-y-16">
      {/* Premium Galactic Dark Hero Card */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c051f] via-[#0b0c22] to-[#14062f] rounded-[2.5rem] p-10 md:p-16 border border-purple-500/10 shadow-[0_20px_50px_rgba(139,92,246,0.08)] flex flex-col justify-center min-h-[460px] group">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-600/15 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-600/15 transition-all duration-700"></div>
        
        <div className="relative z-10 space-y-6 max-w-4xl">
          {/* Tech Stack Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-[11px] font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(168,85,247,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
            Tech Stack of 2026
          </div>

          {/* Majestic Hero Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Designing for <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(168,85,247,0.15)]">Performance</span> <br className="hidden md:inline" />
            and <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(236,72,153,0.15)]">Aesthetics</span>.
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-sm md:text-base leading-relaxed font-medium max-w-2xl">
            안녕하세요! 2026년 최신 기술 스택인{" "}
            <span className="text-white font-semibold">Next.js (PPR)</span>,{" "}
            <span className="text-white font-semibold">Drizzle ORM</span>,{" "}
            <span className="text-white font-semibold">Tailwind CSS v4</span>, 그리고{" "}
            <span className="text-white font-semibold">Neon Serverless Postgres</span>로 구성된 고성능 개발 블로그입니다. 깊이 있는 아키텍처 글과 세련된 디자인 가이드를 만나보세요.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/blog" 
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(139,92,246,0.55)] transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 cursor-pointer shadow-md"
            >
              Explore Articles
            </Link>
            <Link 
              href="/guestbook" 
              className="px-8 py-3.5 rounded-2xl border border-gray-700/60 bg-transparent text-gray-300 hover:text-white hover:bg-white/5 font-bold text-sm hover:border-gray-500/80 transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 cursor-pointer"
            >
              Sign Guestbook
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Latest Articles</h2>
            <p className="text-sm text-gray-400 font-medium">최근에 기록된 최신 포스트 3개</p>
          </div>
          <Link 
            href="/blog" 
            className="group flex items-center gap-1 text-sm font-bold text-purple-500 hover:text-purple-600 transition-colors"
          >
            전체 포스트 보기{" "}
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">➔</span>
          </Link>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-6 h-80 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="h-40 bg-gray-50 rounded-2xl w-full mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <LatestPostsSection />
        </Suspense>
      </section>
    </div>
  );
}

async function LatestPostsSection() {
  const latestPosts = await getCachedLatestPosts().catch((err) => {
    console.error("Failed to fetch latest posts:", err);
    return [];
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {latestPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
