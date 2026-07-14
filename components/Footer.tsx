export function Footer() {
  return (
    <footer className="bg-ink py-16 px-6">
      <div className="max-w-lg mx-auto text-center">
        {/* 브랜드 */}
        <p className="font-batang font-bold text-xl text-paper">이제남</p>
        <p className="text-seal text-xs mt-1.5">이제, 오늘 담갔습니다</p>

        {/* 구분선 */}
        <div className="w-8 h-px bg-paper/20 mx-auto my-8" />

        {/* 사업자 정보 */}
        <div className="font-plex text-xs text-paper/50 leading-loose space-y-1">
          <p>농업회사법인(주)제이엔 · 대표 이제남</p>
          <p>사업자등록번호 587-87-03728</p>
          <p>경상남도 창원시 마산합포구 구산면 옥곡1길 77</p>
          <p>업태: 도매 및 소매업, 서비스 · 종목: 농식품, 농식품개발</p>
        </div>

        {/* 개인정보처리방침 */}
        <div className="mt-8">
          <a
            href="/privacy"
            className="font-plex text-xs text-paper/40 underline underline-offset-2
                       hover:text-paper/70 transition-colors"
          >
            개인정보처리방침
          </a>
        </div>
      </div>
    </footer>
  );
}
