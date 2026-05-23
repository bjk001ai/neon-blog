"use client";

import Link from 'next/link';
import { useState } from 'react';

import { CATEGORIES as categories, CategoryNode } from "@/lib/categories";

export default function Sidebar({ counts = {}, totalCount = 0 }: { counts?: Record<string, number>, totalCount?: number }) {
  const getCumulativeCount = (category: CategoryNode): number => {
    let sum = counts[category.name] || 0;
    if (category.children && category.children.length > 0) {
      category.children.forEach((child: CategoryNode) => {
        sum += getCumulativeCount(child);
      });
    }
    return sum;
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Programming': true, 
    'DevOps': false,
    'DevKit': false,
  });

  const toggleExpand = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside className="w-[280px] flex-shrink-0 border-r border-gray-200 bg-white hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto shadow-[2px_0_10px_rgba(0,0,0,0.03)] z-10 custom-scrollbar">
      {/* Profile Section */}
      <div className="p-10 flex flex-col items-center border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <Link href="/" className="flex flex-col items-center group">
          <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-tr from-[#00f2fe] via-[#4facfe] to-[#8b5cf6] mb-5 shadow-[0_8px_30px_rgba(79,172,254,0.4)] flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500 ease-out select-none">
            <span className="text-[52px] group-hover:scale-110 transition-transform duration-500 ease-out">👾</span>
          </div>
          <h2 className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-[#ff6b6b] transition-colors">Bong Dev 👾</h2>
        </Link>
        <p className="text-sm text-gray-500 mt-1 font-medium">jk</p>
        
        {/* Top Icons */}
        <div className="flex gap-4 mt-6 w-full justify-center">
          <Link href="/" className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-500 hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-center text-lg">
            🏠
          </Link>
          <Link href="/search" className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-500 hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-center text-lg">
            🔍
          </Link>
          <Link href="/guestbook" className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-blue-500 hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-center text-lg">
            👤
          </Link>
        </div>
      </div>

      {/* Category Section */}
      <div className="p-8 flex-1 pb-20">
        <h3 className="text-[11px] font-black text-gray-400 mb-6 tracking-wider uppercase flex items-center gap-2">
          <Link href="/" className="hover:text-gray-600 transition-colors">ROOT</Link>
          <span className="text-gray-300 font-medium">({totalCount})</span>
        </h3>
        
        <ul className="space-y-4 text-[13px] font-medium text-gray-600">
          {categories.map((cat) => (
            <li key={cat.name}>
              <div 
                className="flex justify-between items-center group text-gray-400 font-bold mb-2 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={(e) => toggleExpand(cat.name, e)}
              >
                <span className="text-[11px] tracking-widest uppercase flex items-center gap-2">
                  <span className="w-4 text-center">{cat.icon}</span>
                  <span>{cat.name}</span>
                </span>
                <span className={`text-[10px] transform transition-transform duration-300 ${expanded[cat.name] ? 'rotate-180' : ''}`}>▼</span>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ${expanded[cat.name] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="space-y-2 mt-2">
                  {cat.children.map((sub) => (
                    <li key={sub.name} className="pl-1">
                      <div 
                        className="flex justify-between items-center group mb-1.5 cursor-pointer"
                        onClick={(e) => toggleExpand(sub.name, e)}
                      >
                        <span className="flex items-center gap-2 text-gray-500 group-hover:text-[#ff6b6b] transition-colors font-semibold">
                          <span className="text-gray-400 text-[10px] w-4 text-center">{sub.icon}</span> 
                          <Link href={`/category/${encodeURIComponent(sub.name)}`} onClick={(e) => e.stopPropagation()} className="hover:underline">{sub.name}</Link>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#ff6b6b] bg-red-50 px-2 py-0.5 rounded-full">{getCumulativeCount(sub)}</span>
                          {sub.children.length > 0 && (
                            <span className={`text-[10px] text-gray-300 transform transition-transform duration-300 ${expanded[sub.name] ? 'rotate-180' : ''}`}>▼</span>
                          )}
                        </div>
                      </div>

                      {/* 3Depth Items */}
                      {sub.children.length > 0 && (
                        <div className={`overflow-hidden transition-all duration-300 ${expanded[sub.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <ul className="space-y-1.5 mt-2 pl-6 border-l border-gray-100 ml-3 mb-3">
                            {sub.children.map((leaf) => (
                              <li key={leaf.name}>
                                <Link href={`/category/${encodeURIComponent(leaf.name)}`} className="flex justify-between items-center group text-gray-400 hover:text-gray-700 transition-colors">
                                  <span className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-300">└</span> {leaf.name}
                                  </span>
                                  <span className="text-[10px] text-red-300">{getCumulativeCount(leaf)}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
