import { db } from "@/db";
import { guestbook } from "@/db/schema";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const revalidate = 0; // Force dynamic fetching for the demo

export default async function GuestbookPage() {
  const entries = await db.select().from(guestbook).orderBy(desc(guestbook.createdAt));

  async function addEntry(formData: FormData) {
    "use server";
    const message = formData.get("message") as string;
    if (!message || message.trim() === "") return;

    await db.insert(guestbook).values({
      author: '방문자',
      message: message.trim(),
    });
    
    revalidatePath("/guestbook");
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto mt-4 space-y-6">
      <div className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100 text-center">
        <div className="text-5xl mb-6">📖</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">방명록</h1>
        <p className="text-gray-500 mb-8">자유롭게 발자취를 남겨주세요!</p>
        
        <form action={addEntry} className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100 relative">
          <textarea 
            name="message"
            placeholder="여기에 방명록을 남겨주세요..." 
            className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors resize-none"
            required
          ></textarea>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-yellow-400 text-white px-6 py-2 rounded-xl hover:bg-yellow-500 transition-colors font-bold shadow-sm cursor-pointer">
              남기기
            </button>
          </div>
        </form>
      </div>

      {entries.length > 0 && (
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-yellow-500">📝</span> 최근 남긴 글 <span className="text-gray-400 font-normal text-sm ml-2">{entries.length}개</span>
          </h2>
          <div className="space-y-6">
            {entries.map((entry) => (
              <div key={entry.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold shrink-0">
                  {entry.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800 text-sm">{entry.author}</span>
                    <span className="text-[11px] text-gray-400">
                      {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(entry.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">{entry.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
