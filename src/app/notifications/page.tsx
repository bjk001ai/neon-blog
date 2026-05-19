export default function NotificationsPage() {
  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100 mt-4 text-center">
      <div className="text-5xl mb-6">🔔</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">알림</h1>
      <p className="text-gray-500 mb-8">새로운 소식과 알림을 확인하세요.</p>
      
      <div className="space-y-4 text-left">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-xl shrink-0">✨</div>
          <div>
            <p className="text-gray-800 font-bold mb-1">환영합니다!</p>
            <p className="text-gray-500 text-sm">블로그 고도화 작업이 거의 완료되었습니다. 새로운 기능들을 즐겨보세요.</p>
            <span className="text-[11px] text-gray-400 mt-2 block">방금 전</span>
          </div>
        </div>
      </div>
    </div>
  );
}
