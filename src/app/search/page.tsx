import { db } from "@/db";
import { posts } from "@/db/schema";
import { ilike } from "drizzle-orm";
import PostCard from "@/components/PostCard";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";

  let searchResults: (typeof posts.$inferSelect)[] = [];
  if (q.trim()) {
    searchResults = await db
      .select()
      .from(posts)
      .where(ilike(posts.title, `%${q.trim()}%`));
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto mt-4">
      <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100 text-center mb-10">
        <div className="text-5xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">검색</h1>
        <p className="text-gray-500 mb-8">찾으시는 글의 키워드를 입력해주세요.</p>
        <form method="GET" action="/search" className="flex max-w-md mx-auto">
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="검색어를 입력하세요..." 
            className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
          />
          <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-r-xl hover:bg-blue-600 transition-colors font-bold cursor-pointer">
            검색
          </button>
        </form>
      </div>

      {q.trim() && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-blue-500">&apos;{q}&apos;</span> 검색 결과 <span className="text-gray-400 font-normal text-sm ml-2">{searchResults.length}건</span>
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
               <div className="text-5xl mb-4">📭</div>
               <p className="text-gray-500 text-lg font-medium">검색 결과가 없습니다.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
