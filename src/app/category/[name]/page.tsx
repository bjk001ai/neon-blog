import { db } from "@/db";
import { posts } from "@/db/schema";
import { inArray, desc } from "drizzle-orm";
import PostCard from "@/components/PostCard";
import { getLeafCategories } from "@/lib/categories";

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.name);
  
  const targetCategories = getLeafCategories(categoryName);
  
  const categoryPosts = await db.select().from(posts).where(inArray(posts.category, targetCategories)).orderBy(desc(posts.createdAt));

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-14 text-center">
        <h1 className="text-[40px] font-bold text-gray-800 mb-3 tracking-tight">{categoryName}</h1>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-gray-300"></div>
          <p className="text-gray-500 text-[14px] font-medium tracking-wide">해당 카테고리의 글 목록입니다</p>
          <div className="h-[1px] w-12 bg-gray-300"></div>
        </div>
        <div className="mt-2 w-16 h-[3px] bg-[#ff6b6b] mx-auto rounded-full"></div>
      </div>
      
      {categoryPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categoryPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 text-lg font-medium">이 카테고리에는 아직 작성된 글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
