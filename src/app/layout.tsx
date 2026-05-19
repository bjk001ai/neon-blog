import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Link from 'next/link';
import { db } from "@/db";
import { posts, guestbook } from "@/db/schema";
import { sql } from "drizzle-orm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bong Dev - Tech Blog",
  description: "개발 블로그입니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoryCountsData = await db
    .select({
      category: posts.category,
      count: sql<number>`cast(count(${posts.id}) as integer)`,
    })
    .from(posts)
    .groupBy(posts.category);

  const counts = categoryCountsData.reduce((acc, curr) => {
    acc[curr.category] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  const [{ gbCount }] = await db
    .select({ gbCount: sql<number>`cast(count(${guestbook.id}) as integer)` })
    .from(guestbook);

  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8f9fb] flex min-h-screen text-gray-900`}>
        <Sidebar counts={counts} totalCount={totalCount} />
        
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Navigation Bar */}
          <header className="h-[72px] border-b border-gray-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 shrink-0 sticky top-0 z-20">
            <div className="flex gap-8 text-[13px] text-gray-500 font-semibold tracking-wide uppercase">
              <Link href="/category/Programming" className="hover:text-gray-900 transition-colors flex items-center">Programming <span className="text-[10px] ml-1 opacity-50">▼</span></Link>
              <Link href="/category/DevOps" className="hover:text-gray-900 transition-colors flex items-center">DevOps <span className="text-[10px] ml-1 opacity-50">▼</span></Link>
              <Link href="/category/DevKit" className="hover:text-gray-900 transition-colors flex items-center">DevKit <span className="text-[10px] ml-1 opacity-50">▼</span></Link>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-bold text-gray-800 tracking-tight flex items-center gap-2 border-r border-gray-200 pr-6 mr-2 hidden md:flex">
                Bong Dev 👨‍💻
              </span>
              
              {/* Notifications */}
              <Link href="/notifications" className="relative text-gray-400 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span className="absolute -top-1.5 -right-2 bg-[#ff6b6b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">1</span>
              </Link>
              
              {/* Guestbook/Messages */}
              <Link href="/guestbook" className="relative text-gray-400 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                {gbCount > 0 && <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">{gbCount}</span>}
              </Link>

              {/* Search */}
              <Link href="/search" className="text-gray-400 hover:text-gray-700 transition-colors ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </Link>
            </div>
          </header>
          
          <div className="p-8 pb-20 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
