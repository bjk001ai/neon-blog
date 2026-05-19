import Link from 'next/link';

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  category: string;
  thumbnailUrl: string | null;
  author: string;
  commentCount: number;
  createdAt: Date;
}

export default function PostCard({ post }: { post: PostCardProps }) {
  // Format date to YYYY.MM.DD
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(post.createdAt).replace(/\. /g, '.').replace(/\.$/, '');

  return (
    <Link href={`/posts/${post.id}`} className="group block h-full">
      <article className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full relative">
        {/* Thumbnail Area */}
        <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
          {post.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={post.thumbnailUrl} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500" />
          )}
          
          {/* Share Button (Tistory style) */}
          <div className="absolute -bottom-5 right-6 bg-white rounded-full p-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-gray-400 hover:text-blue-500 transition-colors z-10 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 pt-8 flex flex-col flex-grow bg-white">
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-[#ff6b6b] text-white text-[11px] font-bold rounded-full tracking-wide">
              {post.category}
            </span>
          </div>
          
          <h2 className="text-[17px] font-bold text-gray-800 mb-2.5 line-clamp-2 leading-snug group-hover:text-[#ff6b6b] transition-colors">
            {post.title}
          </h2>
          
          <p className="text-[13px] text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-grow">
            {post.content}
          </p>

          {/* Footer Area */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=100&auto=format&fit=crop" alt="author" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[12px] font-bold text-gray-700 leading-none mb-1">{post.author}</span>
                <span className="text-[10px] text-gray-400 leading-none">{formattedDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff6b6b]"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span className="text-[12px] font-bold text-gray-500">{post.commentCount}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
