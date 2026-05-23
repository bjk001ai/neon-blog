import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Link from 'next/link';
import { db } from "@/db";
import { posts, guestbook } from "@/db/schema";
import { sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { Suspense } from "react";

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

// Cache category counts for 5 minutes (300 seconds)
const getCachedCategoryCounts = unstable_cache(
  async () => {
    return await db
      .select({
        category: posts.category,
        count: sql<number>`cast(count(${posts.id}) as integer)`,
      })
      .from(posts)
      .groupBy(posts.category);
  },
  ["category-counts"],
  { revalidate: 300, tags: ["posts"] }
);

// Cache guestbook entry count for 5 minutes, tag with "guestbook" so we can invalidate it instantly.
const getCachedGbCount = unstable_cache(
  async () => {
    const result = await db
      .select({ gbCount: sql<number>`cast(count(${guestbook.id}) as integer)` })
      .from(guestbook);
    return result[0]?.gbCount ?? 0;
  },
  ["guestbook-count"],
  { revalidate: 300, tags: ["guestbook"] }
);

// Server Wrapper for Sidebar to isolate database access and enable instant shell rendering
async function SidebarWrapper() {
  let categoryCountsData: { category: string; count: number }[] = [];
  try {
    categoryCountsData = await getCachedCategoryCounts();
  } catch (err) {
    console.error("Failed to fetch sidebar counts:", err);
  }

  const counts = categoryCountsData.reduce((acc, curr) => {
    acc[curr.category] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return <Sidebar counts={counts} totalCount={totalCount} />;
}

// Server Wrapper for Guestbook Link to isolate database access and enable instant shell rendering
async function GuestbookLinkWrapper() {
  let gbCount = 0;
  try {
    gbCount = await getCachedGbCount();
  } catch (err) {
    console.error("Failed to fetch guestbook count:", err);
  }

  return (
    <Link href="/guestbook" className="relative text-gray-400 hover:text-gray-700 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      {gbCount > 0 && <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">{gbCount}</span>}
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8f9fb] flex min-h-screen text-gray-900`}>
        <Suspense fallback={<Sidebar counts={{}} totalCount={0} />}>
          <SidebarWrapper />
        </Suspense>
        
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
          {/* Top Navigation Bar */}
          <header className="h-[72px] border-b border-gray-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 shrink-0 sticky top-0 z-20">
            <div className="flex gap-8 text-[13px] text-gray-500 font-semibold tracking-wide uppercase h-full items-center">
              
              {/* Brand Logo Link for Mobile & Desktop Home Navigation */}
              <Link href="/" className="font-extrabold text-gray-900 tracking-tight flex items-center gap-2 hover:text-[#ff6b6b] transition-colors mr-2 normal-case text-base shrink-0">
                Bong Dev <span className="text-lg">👾</span>
              </Link>

              {/* Programming Menu */}
              <div className="group h-full flex items-center">
                <Link href="/category/Programming" className="hover:text-gray-900 transition-colors flex items-center h-full">Programming <span className="text-[10px] ml-1 opacity-50 group-hover:rotate-180 transition-transform duration-300">▼</span></Link>
                <div className="absolute top-[72px] left-0 right-0 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 border-t border-gray-100">
                  <div className="max-w-7xl mx-auto p-10 grid grid-cols-4 gap-x-12 gap-y-10">
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">KNOWLEDGE</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('자료구조')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">⌘</span> 자료구조</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('알고리즘')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">⌘</span> 알고리즘</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('디자인 패턴')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">⌘</span> 디자인 패턴</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('WEB 지식')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">⌘</span> WEB 지식</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('CS 지식')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">⌘</span> CS 지식</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">LANGUAGE</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('C')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">📝</span> C</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Java')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">☕</span> Java</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('JavaScript')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🟨</span> JavaScript</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('TypeScript')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🟦</span> TypeScript</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Python')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🐍</span> Python</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">FRAMEWORK</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('React')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">⚛️</span> React</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Node.js')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🟢</span> Node.js</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Nest.js')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🐈</span> Nest.js</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Next.js')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">▲</span> Next.js</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Spring')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🌱</span> Spring</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">STYLE SHEET</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('CSS')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🎨</span> CSS</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Sass')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">💅</span> Sass</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Bootstrap')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🅱️</span> Bootstrap</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DevOps Menu */}
              <div className="group h-full flex items-center">
                <Link href="/category/DevOps" className="hover:text-gray-900 transition-colors flex items-center h-full">DevOps <span className="text-[10px] ml-1 opacity-50 group-hover:rotate-180 transition-transform duration-300">▼</span></Link>
                <div className="absolute top-[72px] left-0 right-0 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 border-t border-gray-100">
                  <div className="max-w-7xl mx-auto p-10 grid grid-cols-6 gap-x-8 gap-y-10">
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">OS</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('Window')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">❖</span> Window</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Linux')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🐧</span> Linux</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">SERVER</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('Apache')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">⚡</span> Apache</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Tomcat')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🐱</span> Tomcat</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Jetty')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🚢</span> Jetty</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">CONTAINER</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('Docker')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🐳</span> Docker</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">CLOUD</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('AWS')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">☁️</span> AWS</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('MLOps')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🤖</span> MLOps</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">MANAGEMENT</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('GIT')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">♦</span> GIT</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Github')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🐙</span> Github</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Jenkins')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">☕</span> Jenkins</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('CI/CD')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">♾️</span> CI/CD</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">DBMS</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('데이터베이스 이론')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🗄️</span> DB 이론</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('MySQL')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🐬</span> MySQL</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('MongoDB')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🍃</span> MongoDB</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Redis')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🟥</span> Redis</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DevKit Menu */}
              <div className="group h-full flex items-center">
                <Link href="/category/DevKit" className="hover:text-gray-900 transition-colors flex items-center h-full">DevKit <span className="text-[10px] ml-1 opacity-50 group-hover:rotate-180 transition-transform duration-300">▼</span></Link>
                <div className="absolute top-[72px] left-0 right-0 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 border-t border-gray-100">
                  <div className="max-w-7xl mx-auto p-10 grid grid-cols-4 gap-x-12 gap-y-10">
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">MARK UP</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('HTML')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🌐</span> HTML</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Markdown')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">⬇️</span> Markdown</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">FILES</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('CSV')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">📄</span> CSV</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('XML')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">📄</span> XML</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('JSON')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">📄</span> JSON</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('YAML')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">📄</span> YAML</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">TESTING</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('SW 테스팅 이론')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🧪</span> SW 테스팅 이론</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Cypress')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🌲</span> Cypress</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('JEST')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🃏</span> JEST</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Selenium')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">☑️</span> Selenium</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('Postman')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">📬</span> Postman</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-[#ff6b6b] text-[11px] font-bold tracking-widest mb-5">EDITOR</h3>
                        <ul className="flex flex-col gap-3.5 text-[13px] text-gray-600 font-medium">
                          <li><Link href={`/category/${encodeURIComponent('VSCode')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">💻</span> VSCode</Link></li>
                          <li><Link href={`/category/${encodeURIComponent('IntelliJ')}`} className="hover:text-gray-900 hover:translate-x-1 transition-transform inline-flex items-center gap-2.5"><span className="text-gray-400 text-xs">🛠️</span> IntelliJ</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-6 relative z-10">
              
              {/* Notifications */}
              <Link href="/notifications" className="relative text-gray-400 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <span className="absolute -top-1.5 -right-2 bg-[#ff6b6b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">1</span>
              </Link>
              
              {/* Guestbook/Messages */}
              <Suspense fallback={
                <Link href="/guestbook" className="relative text-gray-400 hover:text-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </Link>
              }>
                <GuestbookLinkWrapper />
              </Suspense>

              {/* Search */}
              <Link href="/search" className="text-gray-400 hover:text-gray-700 transition-colors ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </Link>
            </div>
          </header>
          
          <div className="p-8 pb-20 max-w-7xl mx-auto w-full">
            <Suspense fallback={
              <div className="animate-pulse space-y-6 mt-4 max-w-3xl mx-auto bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100">
                <div className="h-8 bg-gray-100 rounded-full w-2/5 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                </div>
                <div className="h-48 bg-gray-50 rounded-2xl w-full mt-8"></div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </body>
    </html>
  );
}
