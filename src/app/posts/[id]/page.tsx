import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id, 10);
  if (isNaN(id)) return notFound();

  const [post] = await db.select().from(posts).where(eq(posts.id, id));

  if (!post) {
    return notFound();
  }

  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(post.createdAt).replace(/\. /g, '.').replace(/\.$/, '');

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100 mt-4">
      <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-500 transition-colors mb-8 text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        목록으로 돌아가기
      </Link>

      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-[#ff6b6b] text-white text-[12px] font-bold rounded-full tracking-wide mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=100&auto=format&fit=crop" alt="author" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-gray-800">{post.author}</span>
              <span className="text-[12px] text-gray-400">{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {post.thumbnailUrl && (
        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-pre:bg-gray-900 prose-pre:text-gray-100"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </div>
  );
}
