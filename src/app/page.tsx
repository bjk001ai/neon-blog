import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import PostCard from "@/components/PostCard";

import { unstable_cache } from "next/cache";
import { Suspense } from "react";

// Enable static prefetching of the shell for instant loading and client navigation
export const unstable_instant = {
  prefetch: 'static',
};

// Cache the posts query for 5 minutes (300 seconds)
const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts).orderBy(desc(posts.createdAt));
  },
  ["all-posts"],
  { revalidate: 300, tags: ["posts"] }
);

export default async function Home() {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-14 text-center">
        <h1 className="text-[40px] font-bold text-gray-800 mb-3 tracking-tight">Latest Posts</h1>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-gray-300"></div>
          <p className="text-gray-500 text-[14px] font-medium tracking-wide">최신 스터디 기록 및 블로그 포스트</p>
          <div className="h-[1px] w-12 bg-gray-300"></div>
        </div>
        <div className="mt-2 w-16 h-[3px] bg-[#ff6b6b] mx-auto rounded-full"></div>
      </div>
      
      {/* CSS Grid for Post Cards wrapped in Suspense with gorgeous skeleton loaders */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
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
        <PostsSection />
      </Suspense>
    </div>
  );
}

async function PostsSection() {
  const allPosts = await getCachedPosts().catch((err) => {
    console.error("Failed to fetch posts from database:", err);
    return [];
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {allPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
