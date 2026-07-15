import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-ink py-16 px-6">
      <div className="max-w-lg mx-auto text-center">
        {/* 브랜드 */}
        <p className="font-batang font-bold text-xl text-paper">이제남</p>
        <p className="text-gold text-xs mt-1.5">이제, 오늘 담갔습니다</p>

        {/* 네비게이션 */}
        <div className="flex items-center justify-center gap-6 my-8">
          <Link
            href="/story"
            className="font-plex text-xs text-paper/50 hover:text-paper/70 transition-colors"
          >
            회사소개
          </Link>
          <Link
            href="/terms"
            className="font-plex text-xs text-paper/50 hover:text-paper/70 transition-colors"
          >
            이용약관
          </Link>
          <Link
            href="/privacy"
            className="font-plex text-xs text-paper/50 hover:text-paper/70 transition-colors"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/#shop"
            className="font-plex text-xs text-paper/50 hover:text-paper/70 transition-colors"
          >
            이용안내
          </Link>
        </div>

        {/* 구분선 */}
        <div className="w-8 h-px bg-paper/20 mx-auto mb-8" />

        {/* 사업자 정보 */}
        <div className="font-plex text-xs text-paper/50 leading-loose space-y-1">
          <p>농업회사법인(주)제이엔 · 대표 이제남</p>
          <p>사업자등록번호 587-87-03728</p>
          <p>경상남도 창원시 마산합포구 구산면 옥곡1길 77</p>
          <p>전화번호: 010-8339-5585</p>
        </div>
      </div>
    </footer>
  );
}
