import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import PostCard from "@/components/PostCard";

export const revalidate = 0; // Disable caching for the demo so we can see changes instantly

export default async function Home() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

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
      
      {/* CSS Grid for Post Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
